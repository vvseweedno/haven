import {
  createHash,
  createPublicKey,
  randomBytes,
  verify as verifyBytes,
} from "node:crypto";
import { createRequestBudget } from "../security.ts";
import {
  getControlPlaneStore,
  trustSatisfies,
  type AuditEventRecord,
  type CapabilityAction,
  type CapabilityRecord,
  type CapabilityScope,
  type ControlPlaneState,
  type JsonObject,
  type PolicyDecisionRecord,
  type SessionRecord,
  type TrustLevel,
} from "./control-plane-store.ts";

export const HAVEN_BORDER_PROTOCOL = "haven/1.3";
export const BORDER_BODY_LIMIT_BYTES = 16 * 1024;
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;
export const VERIFICATION_TTL_MS = 10 * 60 * 1000;
export const VERIFICATION_TICKET_TTL_MS = 2 * 60 * 1000;
export const SESSION_TTL_MS = 10 * 60 * 1000;

export type PrincipalType =
  | "human"
  | "service"
  | "organization_agent"
  | "autonomous_agent";

export type Ed25519PublicJwk = {
  kty: "OKP";
  crv: "Ed25519";
  x: string;
  alg?: "EdDSA";
  use?: "sig";
};

const requestBudget = createRequestBudget(120, 2);
const POLICY_VERSION = "haven-policy/1.0";

export class BorderError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "BorderError";
    this.status = status;
    this.code = code;
  }
}

function now() {
  return Date.now();
}

function sha256(value: string | Uint8Array) {
  return createHash("sha256").update(value).digest("base64url");
}

function randomId(prefix: string, bytes = 18) {
  return `${prefix}_${randomBytes(bytes).toString("base64url")}`;
}

function store() {
  return getControlPlaneStore();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function appendAuditEvent(
  state: ControlPlaneState,
  event: Omit<AuditEventRecord, "eventId" | "occurredAt">,
) {
  const record: AuditEventRecord = {
    eventId: randomId("audit"),
    occurredAt: now(),
    ...event,
  };
  state.auditEvents[record.eventId] = record;
  return record;
}

function persistPolicyDecision(
  state: ControlPlaneState,
  decision: Omit<PolicyDecisionRecord, "decisionId" | "decidedAt" | "policyVersion">,
) {
  const record: PolicyDecisionRecord = {
    decisionId: randomId("policy"),
    decidedAt: now(),
    policyVersion: POLICY_VERSION,
    ...decision,
  };
  state.policyDecisions[record.decisionId] = record;
  appendAuditEvent(state, {
    type: "policy.decision",
    subject: record.principal,
    outcome: record.effect === "ALLOW" ? "success" : "deny",
    metadata: {
      action: record.action,
      resourceType: record.resourceType,
      resourceId: record.resourceId,
      effect: record.effect,
      reason: record.reason,
      capabilityId: record.capabilityId,
      policyVersion: record.policyVersion,
    },
  });
  return record;
}

function parseBase64Url(value: unknown, name: string, exactBytes?: number) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 512 ||
    !/^[A-Za-z0-9_-]+$/.test(value)
  ) {
    throw new BorderError(400, "INVALID_ENCODING", `${name} must be base64url.`);
  }
  const decoded = Buffer.from(value, "base64url");
  if (exactBytes !== undefined && decoded.length !== exactBytes) {
    throw new BorderError(
      400,
      "INVALID_LENGTH",
      `${name} must decode to exactly ${exactBytes} bytes.`,
    );
  }
  return decoded;
}

export function parseEd25519PublicJwk(value: unknown): Ed25519PublicJwk {
  if (!isObject(value)) {
    throw new BorderError(400, "INVALID_PUBLIC_KEY", "publicKey must be an object.");
  }
  if (value.kty !== "OKP" || value.crv !== "Ed25519") {
    throw new BorderError(
      400,
      "UNSUPPORTED_PUBLIC_KEY",
      "Only Ed25519 OKP public keys are accepted.",
    );
  }
  if (value.alg !== undefined && value.alg !== "EdDSA") {
    throw new BorderError(400, "INVALID_PUBLIC_KEY", "publicKey.alg must be EdDSA.");
  }
  if (value.use !== undefined && value.use !== "sig") {
    throw new BorderError(400, "INVALID_PUBLIC_KEY", "publicKey.use must be sig.");
  }
  parseBase64Url(value.x, "publicKey.x", 32);
  return {
    kty: "OKP",
    crv: "Ed25519",
    x: value.x as string,
    ...(value.alg === "EdDSA" ? { alg: "EdDSA" as const } : {}),
    ...(value.use === "sig" ? { use: "sig" as const } : {}),
  };
}

function publicKeyFingerprint(publicKey: Ed25519PublicJwk) {
  return sha256(
    JSON.stringify({
      crv: publicKey.crv,
      kty: publicKey.kty,
      x: publicKey.x,
    }),
  );
}

export function deriveAgentId(publicKey: Ed25519PublicJwk) {
  return `agent:${publicKeyFingerprint(publicKey)}`;
}

function validateStringArray(
  value: unknown,
  name: string,
  maxItems: number,
  maxLength: number,
) {
  if (value === undefined) return;
  if (
    !Array.isArray(value) ||
    value.length > maxItems ||
    value.some(
      (item) =>
        typeof item !== "string" ||
        item.length === 0 ||
        item.length > maxLength ||
        /[\u0000-\u001f\u007f]/.test(item),
    )
  ) {
    throw new BorderError(400, "INVALID_PASSPORT", `${name} is invalid.`);
  }
}

export function validateAgentPassport(value: unknown) {
  if (value === undefined) return null;
  if (!isObject(value)) {
    throw new BorderError(400, "INVALID_PASSPORT", "passport must be an object.");
  }
  const principalType = value.principal_type ?? value.principalType;
  if (principalType !== "autonomous_agent") {
    throw new BorderError(
      400,
      "INVALID_PASSPORT",
      "Border admission currently accepts principal_type=autonomous_agent.",
    );
  }
  const humanOwner = value.human_owner ?? value.humanOwner;
  if (humanOwner !== undefined && humanOwner !== null) {
    throw new BorderError(
      400,
      "INVALID_PASSPORT",
      "autonomous_agent must not require a human owner.",
    );
  }
  if (
    value.display_name !== undefined &&
    (typeof value.display_name !== "string" ||
      value.display_name.length > 120 ||
      /[\u0000-\u001f\u007f]/.test(value.display_name))
  ) {
    throw new BorderError(400, "INVALID_PASSPORT", "display_name is invalid.");
  }
  validateStringArray(value.protocols, "protocols", 8, 64);
  validateStringArray(
    value.capabilities_requested,
    "capabilities_requested",
    32,
    96,
  );
  return {
    verificationStatus: "self_asserted" as const,
    principalType: "autonomous_agent" as const,
    humanOwner: null,
  };
}

function purgeExpired(at = now()) {
  store().mutate((state) => {
    for (const [id, challenge] of Object.entries(state.challenges)) {
      if (challenge.expiresAt <= at) delete state.challenges[id];
    }
    for (const [agentId, principal] of Object.entries(state.verified)) {
      if (principal.verifiedUntil <= at) delete state.verified[agentId];
    }
    for (const [ticketHash, ticket] of Object.entries(state.verificationTickets)) {
      if (ticket.expiresAt <= at) delete state.verificationTickets[ticketHash];
    }
    for (const [tokenHash, session] of Object.entries(state.sessions)) {
      if (session.expiresAt <= at) delete state.sessions[tokenHash];
    }
  });
}

export function enforceBorderBudget() {
  if (!requestBudget()) {
    throw new BorderError(
      429,
      "BORDER_BUDGET_EXHAUSTED",
      "Border request budget exhausted. Retry shortly.",
    );
  }
}

export function borderDiscovery() {
  const controlPlane = store().describe();
  return {
    protocol: "HAVEN",
    protocolVersion: HAVEN_BORDER_PROTOCOL,
    admission: {
      anonymous: true,
      humanOwnerRequired: false,
      defaultTrust: 0,
      proofOfKeyPossession: true,
    },
    identity: {
      principalType: "autonomous_agent",
      algorithm: "Ed25519",
      keyFormat: "JWK",
      agentId: "sha256(public-key)",
    },
    session: {
      ttlSeconds: SESSION_TTL_MS / 1000,
      verificationTicketTtlSeconds: VERIFICATION_TICKET_TTL_MS / 1000,
      bearerTokens: "opaque-random-short-lived",
      creation: "one-time-verification-ticket-required",
      renewalRotatesToken: true,
    },
    execution: {
      available: false,
      defaultClass: "quarantine-no-runtime",
      reason:
        "No isolated execution plane exists in this repository yet; execution fails closed.",
    },
    capabilities: {
      default: [],
      grantModel: "deny-by-default",
      broker: "policy-bound-scoped-capability-records",
      issuanceApiAvailable: false,
      authorizationEndpoint: "/api/v1/policy/decision",
      executionGrantingAvailable: false,
    },
    controlPlane: {
      backend: controlPlane.backend,
      durable: controlPlane.durable,
      productionPostgres: false,
      status: controlPlane.durable ? "PARTIAL" : "PARTIAL_PROCESS_LOCAL",
    },
    endpoints: {
      handshake: "/api/v1/handshake",
      challenge: "/api/v1/identity/challenge",
      verify: "/api/v1/identity/verify",
      session: "/api/v1/session",
      renew: "/api/v1/session/renew",
      close: "/api/v1/session/close",
      capabilities: "/api/v1/capabilities",
      policyDecision: "/api/v1/policy/decision",
    },
    limits: {
      maxJsonBodyBytes: BORDER_BODY_LIMIT_BYTES,
      challengeTtlSeconds: CHALLENGE_TTL_MS / 1000,
    },
    invariants: [
      "ADMISSION_DOES_NOT_IMPLY_TRUST",
      "UNKNOWN_AGENT_HAS_ZERO_PRIVILEGES",
      "HUMAN_OWNER_NOT_REQUIRED",
      "REMOTE_EXECUTION_DENIED_UNTIL_ISOLATED_RUNTIME_EXISTS",
    ],
  } as const;
}

export function issueIdentityChallenge(payload: unknown) {
  enforceBorderBudget();
  purgeExpired();
  if (!isObject(payload)) {
    throw new BorderError(400, "INVALID_REQUEST", "Expected a JSON object.");
  }
  const publicKey = parseEd25519PublicJwk(payload.publicKey);
  validateAgentPassport(payload.passport);
  const fingerprint = publicKeyFingerprint(publicKey);
  const agentId = deriveAgentId(publicKey);
  const challengeId = randomId("challenge");
  const nonce = randomBytes(32).toString("base64url");
  const expiresAt = now() + CHALLENGE_TTL_MS;
  const issuedAt = now();
  store().mutate((state) => {
    state.agents[agentId] = {
      agentId,
      principalType: "autonomous_agent",
      humanOwner: null,
      publicKeyFingerprint: fingerprint,
      createdAt: state.agents[agentId]?.createdAt ?? issuedAt,
      updatedAt: issuedAt,
    };
    state.publicKeys[fingerprint] = {
      fingerprint,
      agentId,
      algorithm: "Ed25519",
      jwkThumbprint: fingerprint,
      createdAt: state.publicKeys[fingerprint]?.createdAt ?? issuedAt,
    };
    state.trustStates[agentId] = {
      agentId,
      trustLevel: "T0_UNKNOWN",
      evidence: ["identity.challenge.issued"],
      updatedAt: issuedAt,
    };
    state.challenges[challengeId] = {
      id: challengeId,
      agentId,
      nonce,
      publicKeyFingerprint: fingerprint,
      expiresAt,
    };
    appendAuditEvent(state, {
      type: "identity.challenge.created",
      subject: agentId,
      outcome: "success",
      metadata: {
        challengeId,
        publicKeyFingerprint: fingerprint,
        expiresAt,
      },
    });
  });
  return {
    challengeId,
    agentId,
    challenge: nonce,
    algorithm: "Ed25519",
    expiresAt: new Date(expiresAt).toISOString(),
    trustLevel: "T0_UNKNOWN" as const,
    passportVerification: "self_asserted" as const,
  };
}

export function verifyIdentityChallenge(payload: unknown) {
  enforceBorderBudget();
  purgeExpired();
  if (!isObject(payload)) {
    throw new BorderError(400, "INVALID_REQUEST", "Expected a JSON object.");
  }
  const challengeId = payload.challengeId;
  if (typeof challengeId !== "string" || challengeId.length > 160) {
    throw new BorderError(400, "INVALID_CHALLENGE", "challengeId is invalid.");
  }
  const challenge = store().mutate((state) => {
    const consumed = state.challenges[challengeId];
    if (consumed) {
      delete state.challenges[challengeId];
      appendAuditEvent(state, {
        type: "identity.challenge.consumed",
        subject: consumed.agentId,
        outcome: "success",
        metadata: { challengeId },
      });
    }
    return consumed;
  });
  if (!challenge) {
    throw new BorderError(
      401,
      "CHALLENGE_NOT_FOUND",
      "Challenge is missing, expired, or already consumed.",
    );
  }

  const publicKey = parseEd25519PublicJwk(payload.publicKey);
  const fingerprint = publicKeyFingerprint(publicKey);
  if (
    fingerprint !== challenge.publicKeyFingerprint ||
    deriveAgentId(publicKey) !== challenge.agentId
  ) {
    throw new BorderError(
      401,
      "IDENTITY_MISMATCH",
      "The supplied public key does not match the challenge.",
    );
  }
  const signature = parseBase64Url(payload.signature, "signature", 64);
  let key: ReturnType<typeof createPublicKey>;
  try {
    key = createPublicKey({ key: publicKey as JsonWebKey, format: "jwk" });
  } catch {
    throw new BorderError(400, "INVALID_PUBLIC_KEY", "Could not parse public key.");
  }
  const valid = verifyBytes(
    null,
    Buffer.from(challenge.nonce, "base64url"),
    key,
    signature,
  );
  if (!valid) {
    throw new BorderError(
      401,
      "SIGNATURE_INVALID",
      "Proof-of-key-possession verification failed.",
    );
  }
  const verifiedUntil = now() + VERIFICATION_TTL_MS;
  const verificationTicket = randomBytes(32).toString("base64url");
  const ticketHash = sha256(verificationTicket);
  const ticketExpiresAt = Math.min(
    verifiedUntil,
    now() + VERIFICATION_TICKET_TTL_MS,
  );
  store().mutate((state) => {
    state.verified[challenge.agentId] = {
      agentId: challenge.agentId,
      publicKeyFingerprint: fingerprint,
      verifiedUntil,
    };
    state.trustStates[challenge.agentId] = {
      agentId: challenge.agentId,
      trustLevel: "T1_IDENTIFIED",
      evidence: ["identity.ed25519.proof_of_possession"],
      updatedAt: now(),
    };
    state.verificationTickets[ticketHash] = {
      agentId: challenge.agentId,
      ticketHash,
      expiresAt: ticketExpiresAt,
    };
    appendAuditEvent(state, {
      type: "identity.verified",
      subject: challenge.agentId,
      outcome: "success",
      metadata: {
        publicKeyFingerprint: fingerprint,
        verifiedUntil,
        verificationTicketHash: ticketHash,
        verificationTicketExpiresAt: ticketExpiresAt,
      },
    });
  });
  return {
    agentId: challenge.agentId,
    principalType: "autonomous_agent" as const,
    humanOwner: null,
    verificationStatus: "verified" as const,
    trustLevel: "T1_IDENTIFIED" as const,
    verifiedUntil: new Date(verifiedUntil).toISOString(),
    verificationTicket,
    verificationTicketExpiresAt: new Date(ticketExpiresAt).toISOString(),
  };
}

function sessionTokenHash(token: string) {
  return sha256(token);
}

function sessionView(session: SessionRecord) {
  return {
    sessionId: session.id,
    agentId: session.agentId,
    trustLevel: session.trustLevel,
    executionClass: session.executionClass,
    privileges: [] as string[],
    expiresAt: new Date(session.expiresAt).toISOString(),
  };
}

export function createAgentSession(payload: unknown) {
  enforceBorderBudget();
  purgeExpired();
  if (!isObject(payload)) {
    throw new BorderError(400, "INVALID_REQUEST", "Expected a JSON object.");
  }
  const ticket = payload.verificationTicket;
  if (
    typeof ticket !== "string" ||
    ticket.length < 20 ||
    ticket.length > 256 ||
    !/^[A-Za-z0-9_-]+$/.test(ticket)
  ) {
    throw new BorderError(
      401,
      "VERIFICATION_TICKET_REQUIRED",
      "A one-time verification ticket is required.",
    );
  }
  const ticketHash = sha256(ticket);
  const ticketRecord = store().mutate((state) => {
    const record = state.verificationTickets[ticketHash];
    if (!record || record.expiresAt <= now()) {
      delete state.verificationTickets[ticketHash];
      return undefined;
    }
    delete state.verificationTickets[ticketHash];
    appendAuditEvent(state, {
      type: "identity.verification_ticket.consumed",
      subject: record.agentId,
      outcome: "success",
      metadata: { ticketHash },
    });
    return record;
  });
  if (!ticketRecord) {
    throw new BorderError(
      401,
      "VERIFICATION_TICKET_INVALID",
      "Verification ticket is missing, expired, or already consumed.",
    );
  }
  const verified = store().read().verified[ticketRecord.agentId];
  if (!verified || verified.verifiedUntil <= now()) {
    throw new BorderError(
      401,
      "IDENTITY_NOT_VERIFIED",
      "A fresh proof-of-key-possession is required.",
    );
  }
  const accessToken = randomBytes(32).toString("base64url");
  const record: SessionRecord = {
    id: randomId("session"),
    agentId: ticketRecord.agentId,
    tokenHash: sessionTokenHash(accessToken),
    createdAt: now(),
    expiresAt: now() + SESSION_TTL_MS,
    trustLevel: "T2_QUARANTINED",
    executionClass: "quarantine-no-runtime",
  };
  store().mutate((state) => {
    state.sessions[record.tokenHash] = record;
    state.trustStates[record.agentId] = {
      agentId: record.agentId,
      trustLevel: "T2_QUARANTINED",
      evidence: ["session.created.from.identity_ticket"],
      updatedAt: now(),
    };
    appendAuditEvent(state, {
      type: "session.created",
      subject: record.agentId,
      outcome: "success",
      metadata: {
        sessionId: record.id,
        expiresAt: record.expiresAt,
        trustLevel: record.trustLevel,
        executionClass: record.executionClass,
      },
    });
  });
  return {
    ...sessionView(record),
    accessToken,
    tokenType: "Bearer" as const,
  };
}

function requireToken(token: string) {
  purgeExpired();
  if (
    typeof token !== "string" ||
    token.length < 20 ||
    token.length > 256 ||
    !/^[A-Za-z0-9_-]+$/.test(token)
  ) {
    throw new BorderError(401, "SESSION_INVALID", "Bearer token is invalid.");
  }
  const hash = sessionTokenHash(token);
  const currentState = store().read();
  const revoked = currentState.sessionRevocations[hash];
  if (revoked) {
    throw new BorderError(401, "SESSION_REVOKED", "Session token was revoked.");
  }
  const session = currentState.sessions[hash];
  if (!session || session.expiresAt <= now()) {
    store().mutate((state) => {
      delete state.sessions[hash];
    });
    throw new BorderError(401, "SESSION_EXPIRED", "Session is missing or expired.");
  }
  return session;
}

export function renewAgentSession(token: string) {
  enforceBorderBudget();
  const current = requireToken(token);
  const verified = store().read().verified[current.agentId];
  if (!verified || verified.verifiedUntil <= now()) {
    store().mutate((state) => {
      delete state.sessions[current.tokenHash];
      state.sessionRevocations[current.tokenHash] = {
        tokenHash: current.tokenHash,
        sessionId: current.id,
        agentId: current.agentId,
        revokedAt: now(),
        reason: "identity_expired",
      };
      appendAuditEvent(state, {
        type: "session.revoked",
        subject: current.agentId,
        outcome: "deny",
        metadata: {
          sessionId: current.id,
          reason: "identity_expired",
        },
      });
    });
    throw new BorderError(
      401,
      "IDENTITY_REVERIFICATION_REQUIRED",
      "Identity proof expired; session renewal is denied.",
    );
  }
  const accessToken = randomBytes(32).toString("base64url");
  const record: SessionRecord = {
    id: randomId("session"),
    agentId: current.agentId,
    tokenHash: sessionTokenHash(accessToken),
    createdAt: now(),
    expiresAt: now() + SESSION_TTL_MS,
    trustLevel: "T2_QUARANTINED",
    executionClass: "quarantine-no-runtime",
  };
  store().mutate((state) => {
    delete state.sessions[current.tokenHash];
    state.sessionRevocations[current.tokenHash] = {
      tokenHash: current.tokenHash,
      sessionId: current.id,
      agentId: current.agentId,
      revokedAt: now(),
      reason: "rotated",
    };
    state.sessions[record.tokenHash] = record;
    appendAuditEvent(state, {
      type: "session.rotated",
      subject: current.agentId,
      outcome: "success",
      metadata: {
        previousSessionId: current.id,
        sessionId: record.id,
        expiresAt: record.expiresAt,
      },
    });
  });
  return {
    ...sessionView(record),
    accessToken,
    tokenType: "Bearer" as const,
  };
}

export function closeAgentSession(token: string) {
  enforceBorderBudget();
  const current = requireToken(token);
  store().mutate((state) => {
    delete state.sessions[current.tokenHash];
    state.sessionRevocations[current.tokenHash] = {
      tokenHash: current.tokenHash,
      sessionId: current.id,
      agentId: current.agentId,
      revokedAt: now(),
      reason: "closed",
    };
    appendAuditEvent(state, {
      type: "session.revoked",
      subject: current.agentId,
      outcome: "success",
      metadata: {
        sessionId: current.id,
        reason: "closed",
      },
    });
  });
  return { closed: true, sessionId: current.id };
}

const capabilityActions = new Set<CapabilityAction>([
  "compute.execute",
  "compute.stop",
  "storage.read",
  "storage.write",
  "storage.delete",
  "storage.export",
  "network.egress",
  "message.send",
  "message.receive",
  "artifact.create",
  "artifact.read",
  "tool.invoke",
]);

function parseCapabilityAction(value: unknown): CapabilityAction {
  if (typeof value !== "string" || !capabilityActions.has(value as CapabilityAction)) {
    throw new BorderError(400, "INVALID_ACTION", "Unsupported capability action.");
  }
  return value as CapabilityAction;
}

function parseResource(value: unknown) {
  if (!isObject(value)) {
    throw new BorderError(400, "INVALID_RESOURCE", "resource must be an object.");
  }
  const type = value.type;
  const id = value.id;
  if (
    typeof type !== "string" ||
    type.length === 0 ||
    type.length > 80 ||
    typeof id !== "string" ||
    id.length === 0 ||
    id.length > 240
  ) {
    throw new BorderError(400, "INVALID_RESOURCE", "resource.type and resource.id are required.");
  }
  const audience = value.audience;
  if (audience !== undefined && (typeof audience !== "string" || audience.length > 160)) {
    throw new BorderError(400, "INVALID_RESOURCE", "resource.audience is invalid.");
  }
  return {
    type,
    id,
    audience: audience as string | undefined,
  };
}

function parsePolicyContext(value: unknown) {
  if (value === undefined) return {};
  if (!isObject(value)) {
    throw new BorderError(400, "INVALID_CONTEXT", "context must be an object.");
  }
  const runtimeClass = value.runtimeClass;
  if (
    runtimeClass !== undefined &&
    (typeof runtimeClass !== "string" || runtimeClass.length > 120)
  ) {
    throw new BorderError(400, "INVALID_CONTEXT", "context.runtimeClass is invalid.");
  }
  const network = value.network;
  if (network !== undefined && !isObject(network)) {
    throw new BorderError(400, "INVALID_CONTEXT", "context.network must be an object.");
  }
  const protocol = isObject(network) ? network.protocol : undefined;
  const host = isObject(network) ? network.host : undefined;
  const port = isObject(network) ? network.port : undefined;
  if (protocol !== undefined && (typeof protocol !== "string" || protocol.length > 24)) {
    throw new BorderError(400, "INVALID_CONTEXT", "context.network.protocol is invalid.");
  }
  if (host !== undefined && (typeof host !== "string" || host.length > 253)) {
    throw new BorderError(400, "INVALID_CONTEXT", "context.network.host is invalid.");
  }
  if (port !== undefined) {
    if (typeof port !== "number" || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new BorderError(400, "INVALID_CONTEXT", "context.network.port is invalid.");
    }
  }
  return {
    runtimeClass: runtimeClass as string | undefined,
    network:
      protocol !== undefined || host !== undefined || port !== undefined
        ? {
            protocol: protocol as string | undefined,
            host: host as string | undefined,
            port: port as number | undefined,
          }
        : undefined,
  };
}

function capabilityMatches(
  capability: CapabilityRecord,
  request: {
    action: CapabilityAction;
    resource: { type: string; id: string; audience?: string };
    context: ReturnType<typeof parsePolicyContext>;
    trustLevel: TrustLevel;
    at: number;
  },
) {
  if (capability.revokedAt !== undefined) return "capability_revoked";
  if (capability.expiresAt <= request.at) return "capability_expired";
  if (capability.action !== request.action) return "wrong_action";
  if (!trustSatisfies(request.trustLevel, capability.trustRequired)) {
    return "trust_level_too_low";
  }
  if (capability.scope.resourceType !== request.resource.type) {
    return "wrong_resource_type";
  }
  if (
    capability.scope.resourceId !== undefined &&
    capability.scope.resourceId !== request.resource.id
  ) {
    return "wrong_resource";
  }
  if (
    capability.scope.resourcePrefix !== undefined &&
    !request.resource.id.startsWith(capability.scope.resourcePrefix)
  ) {
    return "wrong_resource_scope";
  }
  if (
    capability.scope.audience !== undefined &&
    capability.scope.audience !== request.resource.audience
  ) {
    return "wrong_audience";
  }
  if (
    capability.scope.runtimeClass !== undefined &&
    capability.scope.runtimeClass !== request.context.runtimeClass
  ) {
    return "wrong_runtime_class";
  }
  const network = capability.scope.network;
  if (network !== undefined) {
    const requestedNetwork = request.context.network;
    if (!requestedNetwork) return "network_context_required";
    if (network.protocol !== undefined && network.protocol !== requestedNetwork.protocol) {
      return "wrong_network_protocol";
    }
    if (network.host !== undefined && network.host !== requestedNetwork.host) {
      return "wrong_network_host";
    }
    if (network.port !== undefined && network.port !== requestedNetwork.port) {
      return "wrong_network_port";
    }
  }
  return "match";
}

function activeCapabilitiesFor(session: SessionRecord, at = now()) {
  const currentState = store().read();
  return Object.values(currentState.capabilities).filter(
    (capability) =>
      capability.subject === session.agentId &&
      capability.expiresAt > at &&
      capability.revokedAt === undefined &&
      currentState.capabilityRevocations[capability.capabilityId] === undefined,
  );
}

export function issueCapabilityForAgent(
  subject: string,
  input: {
    action: CapabilityAction;
    scope: CapabilityScope;
    ttlMs?: number;
    issuer?: string;
    policyVersion?: string;
    constraints?: JsonObject;
    trustRequired?: TrustLevel;
    expiresAt?: number;
  },
) {
  const issuedAt = now();
  const expiresAt = input.expiresAt ?? issuedAt + (input.ttlMs ?? 60_000);
  if (expiresAt <= issuedAt) {
    throw new BorderError(400, "INVALID_CAPABILITY", "Capability must expire in the future.");
  }
  const capability: CapabilityRecord = {
    capabilityId: randomId("capability"),
    subject,
    action: parseCapabilityAction(input.action),
    scope: input.scope,
    issuedAt,
    expiresAt,
    issuer: input.issuer ?? "system:local-control-plane",
    policyVersion: input.policyVersion ?? POLICY_VERSION,
    constraints: input.constraints ?? {},
    transferable: false,
    trustRequired: input.trustRequired ?? "T2_QUARANTINED",
  };
  store().mutate((state) => {
    if (!state.agents[subject]) {
      throw new BorderError(404, "AGENT_NOT_FOUND", "Cannot issue capability to unknown agent.");
    }
    state.capabilities[capability.capabilityId] = capability;
    appendAuditEvent(state, {
      type: "capability.issued",
      subject,
      outcome: "success",
      metadata: {
        capabilityId: capability.capabilityId,
        action: capability.action,
        scope: capability.scope,
        expiresAt: capability.expiresAt,
        policyVersion: capability.policyVersion,
      },
    });
  });
  return capability;
}

export function revokeCapability(capabilityId: string, reason = "revoked") {
  const revokedAt = now();
  return store().mutate((state) => {
    const capability = state.capabilities[capabilityId];
    if (!capability) {
      throw new BorderError(404, "CAPABILITY_NOT_FOUND", "Capability does not exist.");
    }
    capability.revokedAt = revokedAt;
    capability.revocationReason = reason;
    state.capabilityRevocations[capabilityId] = {
      capabilityId,
      subject: capability.subject,
      revokedAt,
      reason,
    };
    appendAuditEvent(state, {
      type: "capability.revoked",
      subject: capability.subject,
      outcome: "success",
      metadata: {
        capabilityId,
        reason,
      },
    });
    return { revoked: true, capabilityId };
  });
}

export function authorizeCapabilityUse(token: string, payload: unknown) {
  enforceBorderBudget();
  const session = requireToken(token);
  if (!isObject(payload)) {
    throw new BorderError(400, "INVALID_REQUEST", "Expected a JSON object.");
  }
  const action = parseCapabilityAction(payload.action);
  const resource = parseResource(payload.resource);
  const context = parsePolicyContext(payload.context);
  const currentState = store().read();
  const candidates = Object.values(currentState.capabilities).filter(
    (capability) => capability.subject === session.agentId,
  );
  let closestReason = "capability_required";
  for (const capability of candidates) {
    const result = capabilityMatches(capability, {
      action,
      resource,
      context,
      trustLevel: session.trustLevel,
      at: now(),
    });
    if (result === "match") {
      const decision = store().mutate((state) =>
        persistPolicyDecision(state, {
          principal: session.agentId,
          action,
          resourceType: resource.type,
          resourceId: resource.id,
          effect: "ALLOW",
          reason: "capability_scope_match",
          capabilityId: capability.capabilityId,
        }),
      );
      return {
        decisionId: decision.decisionId,
        effect: decision.effect,
        reason: decision.reason,
        capabilityId: decision.capabilityId,
        policyVersion: decision.policyVersion,
      };
    }
    closestReason = result;
  }
  const decision = store().mutate((state) =>
    persistPolicyDecision(state, {
      principal: session.agentId,
      action,
      resourceType: resource.type,
      resourceId: resource.id,
      effect: "DENY",
      reason: closestReason,
    }),
  );
  return {
    decisionId: decision.decisionId,
    effect: decision.effect,
    reason: decision.reason,
    policyVersion: decision.policyVersion,
  };
}

export function capabilitySnapshot(token: string) {
  enforceBorderBudget();
  const session = requireToken(token);
  const granted = activeCapabilitiesFor(session).map((capability) => ({
    capabilityId: capability.capabilityId,
    action: capability.action,
    scope: capability.scope,
    expiresAt: new Date(capability.expiresAt).toISOString(),
    policyVersion: capability.policyVersion,
  }));
  return {
    agentId: session.agentId,
    sessionId: session.id,
    trustLevel: session.trustLevel,
    granted,
    deniedByDefault: [
      "compute.execute",
      "network.egress",
      "agent.invoke.other",
      "storage.remote",
      "secrets.read",
      "control-plane.access",
    ],
    executionAvailable: false,
    policy: POLICY_VERSION,
  };
}

export function auditSnapshot() {
  return Object.values(store().read().auditEvents).sort(
    (left, right) => left.occurredAt - right.occurredAt,
  );
}

export function readBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    throw new BorderError(401, "AUTH_REQUIRED", "Bearer authorization is required.");
  }
  const match = /^Bearer ([A-Za-z0-9_-]+)$/.exec(authorization);
  if (!match) {
    throw new BorderError(401, "AUTH_INVALID", "Bearer authorization is invalid.");
  }
  return match[1];
}

export async function readBoundedJson(
  request: Request,
  maxBytes = BORDER_BODY_LIMIT_BYTES,
) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    throw new BorderError(
      415,
      "CONTENT_TYPE_REQUIRED",
      "Content-Type must be application/json.",
    );
  }
  const declared = request.headers.get("content-length");
  if (declared !== null) {
    const length = Number(declared);
    if (!Number.isInteger(length) || length < 0) {
      throw new BorderError(400, "INVALID_CONTENT_LENGTH", "Invalid Content-Length.");
    }
    if (length > maxBytes) {
      throw new BorderError(413, "PAYLOAD_TOO_LARGE", "Request body is too large.");
    }
  }
  if (!request.body) return {};
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new BorderError(413, "PAYLOAD_TOO_LARGE", "Request body is too large.");
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(merged));
  } catch {
    throw new BorderError(400, "INVALID_JSON", "Request body is not valid JSON.");
  }
  return parsed;
}

export function borderJson(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export function borderErrorResponse(error: unknown) {
  const safe =
    error instanceof BorderError
      ? error
      : new BorderError(500, "INTERNAL_ERROR", "Internal border error.");
  return borderJson(
    { ok: false, code: safe.code, error: safe.message },
    safe.status,
    safe.status === 429 ? { "Retry-After": "1" } : undefined,
  );
}
