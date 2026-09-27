import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateKeyPairSync, sign } from "node:crypto";
import {
  JsonFileControlPlaneStore,
  resetControlPlaneStoreForTests,
  setControlPlaneStoreForTests,
} from "../apps/web/lib/server/control-plane-store.ts";
import {
  auditSnapshot,
  authorizeCapabilityUse,
  borderDiscovery,
  capabilitySnapshot,
  closeAgentSession,
  createAgentSession,
  issueIdentityChallenge,
  issueCapabilityForAgent,
  renewAgentSession,
  revokeCapability,
  verifyIdentityChallenge,
} from "../apps/web/lib/server/agent-border.ts";

function identity() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return {
    publicKey: publicKey.export({ format: "jwk" }),
    privateKey,
  };
}

function admitAgent() {
  const keys = identity();
  const issued = issueIdentityChallenge({
    publicKey: keys.publicKey,
    passport: {
      principal_type: "autonomous_agent",
      human_owner: null,
      protocols: ["haven/1.3"],
    },
  });
  const signature = sign(
    null,
    Buffer.from(issued.challenge, "base64url"),
    keys.privateKey,
  ).toString("base64url");
  const verified = verifyIdentityChallenge({
    challengeId: issued.challengeId,
    publicKey: keys.publicKey,
    signature,
  });
  const session = createAgentSession({
    verificationTicket: verified.verificationTicket,
  });
  return { keys, issued, verified, session };
}

test("HAVEN Border advertises ownerless zero-trust admission but no execution", () => {
  const discovery = borderDiscovery();
  assert.equal(discovery.admission.anonymous, true);
  assert.equal(discovery.admission.humanOwnerRequired, false);
  assert.equal(discovery.admission.defaultTrust, 0);
  assert.equal(discovery.execution.available, false);
  assert.deepEqual(discovery.capabilities.default, []);
  assert.equal(discovery.capabilities.authorizationEndpoint, "/api/v1/policy/decision");
});

test("ownerless agent proves Ed25519 key possession and receives zero-privilege quarantine session", () => {
  const keys = identity();
  const issued = issueIdentityChallenge({
    publicKey: keys.publicKey,
    passport: {
      principal_type: "autonomous_agent",
      human_owner: null,
      protocols: ["haven/1.3"],
      capabilities_requested: ["storage.private"],
    },
  });
  const signature = sign(
    null,
    Buffer.from(issued.challenge, "base64url"),
    keys.privateKey,
  ).toString("base64url");

  const verified = verifyIdentityChallenge({
    challengeId: issued.challengeId,
    publicKey: keys.publicKey,
    signature,
  });
  assert.equal(verified.agentId, issued.agentId);
  assert.equal(verified.humanOwner, null);
  assert.equal(verified.trustLevel, "T1_IDENTIFIED");

  assert.throws(
    () =>
      verifyIdentityChallenge({
        challengeId: issued.challengeId,
        publicKey: keys.publicKey,
        signature,
      }),
    /missing, expired, or already consumed/i,
  );

  const session = createAgentSession({
    verificationTicket: verified.verificationTicket,
  });
  assert.equal(session.trustLevel, "T2_QUARANTINED");
  assert.throws(
    () =>
      createAgentSession({
        verificationTicket: verified.verificationTicket,
      }),
    /missing, expired, or already consumed/i,
  );
  assert.equal(session.executionClass, "quarantine-no-runtime");
  assert.deepEqual(session.privileges, []);

  const capabilities = capabilitySnapshot(session.accessToken);
  assert.deepEqual(capabilities.granted, []);
  assert.ok(capabilities.deniedByDefault.includes("compute.execute"));
  assert.equal(capabilities.executionAvailable, false);

  const renewed = renewAgentSession(session.accessToken);
  assert.notEqual(renewed.accessToken, session.accessToken);
  assert.throws(() => capabilitySnapshot(session.accessToken), /revoked/i);
  assert.equal(closeAgentSession(renewed.accessToken).closed, true);
  assert.throws(() => capabilitySnapshot(renewed.accessToken), /revoked/i);
});

test("agentId alone cannot mint a session after another caller verifies the identity", () => {
  const keys = identity();
  const issued = issueIdentityChallenge({ publicKey: keys.publicKey });
  const signature = sign(
    null,
    Buffer.from(issued.challenge, "base64url"),
    keys.privateKey,
  ).toString("base64url");
  const verified = verifyIdentityChallenge({
    challengeId: issued.challengeId,
    publicKey: keys.publicKey,
    signature,
  });

  assert.throws(
    () => createAgentSession({ agentId: verified.agentId }),
    /one-time verification ticket is required/i,
  );

  const session = createAgentSession({
    verificationTicket: verified.verificationTicket,
  });
  assert.equal(session.agentId, verified.agentId);
});

test("passport cannot smuggle a required human owner into autonomous_agent admission", () => {
  const keys = identity();
  assert.throws(
    () =>
      issueIdentityChallenge({
        publicKey: keys.publicKey,
        passport: {
          principal_type: "autonomous_agent",
          human_owner: "someone",
        },
      }),
    /must not require a human owner/i,
  );
});

test("identity verification rejects a different key and consumes the challenge", () => {
  const first = identity();
  const second = identity();
  const issued = issueIdentityChallenge({ publicKey: first.publicKey });
  const signature = sign(
    null,
    Buffer.from(issued.challenge, "base64url"),
    first.privateKey,
  ).toString("base64url");
  assert.throws(
    () =>
      verifyIdentityChallenge({
        challengeId: issued.challengeId,
        publicKey: second.publicKey,
        signature,
      }),
    /does not match the challenge/i,
  );
  assert.throws(
    () =>
      verifyIdentityChallenge({
        challengeId: issued.challengeId,
        publicKey: first.publicKey,
        signature,
      }),
    /missing, expired, or already consumed/i,
  );
});

test("policy decision point denies privileged action without a scoped capability", () => {
  const { session } = admitAgent();
  const decision = authorizeCapabilityUse(session.accessToken, {
    action: "storage.read",
    resource: {
      type: "storage.namespace",
      id: `${session.agentId}/private`,
      audience: "haven.local",
    },
  });
  assert.equal(decision.effect, "DENY");
  assert.equal(decision.reason, "capability_required");
  assert.ok(auditSnapshot().some((event) => event.type === "policy.decision"));
});

test("scoped capability allows only its action, resource and audience", () => {
  const { session } = admitAgent();
  const capability = issueCapabilityForAgent(session.agentId, {
    action: "storage.read",
    scope: {
      resourceType: "storage.namespace",
      resourcePrefix: `${session.agentId}/`,
      audience: "haven.local",
    },
    ttlMs: 60_000,
  });
  const snapshot = capabilitySnapshot(session.accessToken);
  assert.equal(snapshot.granted.length, 1);
  assert.equal(snapshot.granted[0].capabilityId, capability.capabilityId);

  const allowed = authorizeCapabilityUse(session.accessToken, {
    action: "storage.read",
    resource: {
      type: "storage.namespace",
      id: `${session.agentId}/memory`,
      audience: "haven.local",
    },
  });
  assert.equal(allowed.effect, "ALLOW");
  assert.equal(allowed.capabilityId, capability.capabilityId);

  const wrongResource = authorizeCapabilityUse(session.accessToken, {
    action: "storage.read",
    resource: {
      type: "storage.namespace",
      id: "agent:other/memory",
      audience: "haven.local",
    },
  });
  assert.equal(wrongResource.effect, "DENY");
  assert.equal(wrongResource.reason, "wrong_resource_scope");

  const wrongAudience = authorizeCapabilityUse(session.accessToken, {
    action: "storage.read",
    resource: {
      type: "storage.namespace",
      id: `${session.agentId}/memory`,
      audience: "remote-node",
    },
  });
  assert.equal(wrongAudience.effect, "DENY");
  assert.equal(wrongAudience.reason, "wrong_audience");
});

test("capability revocation immediately stops later privileged use", () => {
  const { session } = admitAgent();
  const capability = issueCapabilityForAgent(session.agentId, {
    action: "message.send",
    scope: {
      resourceType: "agent.message",
      resourcePrefix: `${session.agentId}:`,
      audience: "haven.local",
    },
    ttlMs: 60_000,
  });
  const firstDecision = authorizeCapabilityUse(session.accessToken, {
    action: "message.send",
    resource: {
      type: "agent.message",
      id: `${session.agentId}:outbox`,
      audience: "haven.local",
    },
  });
  assert.equal(firstDecision.effect, "ALLOW");

  assert.equal(revokeCapability(capability.capabilityId, "test revocation").revoked, true);
  const secondDecision = authorizeCapabilityUse(session.accessToken, {
    action: "message.send",
    resource: {
      type: "agent.message",
      id: `${session.agentId}:outbox`,
      audience: "haven.local",
    },
  });
  assert.equal(secondDecision.effect, "DENY");
  assert.equal(secondDecision.reason, "capability_revoked");
});

test("file-backed control plane preserves session revocation across store restart", () => {
  const directory = mkdtempSync(join(tmpdir(), "haven-border-"));
  const file = join(directory, "control-plane.json");
  try {
    setControlPlaneStoreForTests(new JsonFileControlPlaneStore(file));
    const { session } = admitAgent();
    assert.equal(closeAgentSession(session.accessToken).closed, true);

    setControlPlaneStoreForTests(new JsonFileControlPlaneStore(file));
    assert.throws(
      () => capabilitySnapshot(session.accessToken),
      /token was revoked/i,
    );
  } finally {
    resetControlPlaneStoreForTests();
    rmSync(directory, { recursive: true, force: true });
  }
});
