import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import {
  borderDiscovery,
  capabilitySnapshot,
  closeAgentSession,
  createAgentSession,
  issueIdentityChallenge,
  renewAgentSession,
  verifyIdentityChallenge,
} from "../apps/web/lib/server/agent-border.ts";

function identity() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return {
    publicKey: publicKey.export({ format: "jwk" }),
    privateKey,
  };
}

test("HAVEN Border advertises ownerless zero-trust admission but no execution", () => {
  const discovery = borderDiscovery();
  assert.equal(discovery.admission.anonymous, true);
  assert.equal(discovery.admission.humanOwnerRequired, false);
  assert.equal(discovery.admission.defaultTrust, 0);
  assert.equal(discovery.execution.available, false);
  assert.deepEqual(discovery.capabilities.default, []);
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
  assert.throws(() => capabilitySnapshot(session.accessToken), /missing or expired/i);
  assert.equal(closeAgentSession(renewed.accessToken).closed, true);
  assert.throws(() => capabilitySnapshot(renewed.accessToken), /missing or expired/i);
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
