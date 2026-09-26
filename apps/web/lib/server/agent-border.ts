import {
  createHash,
  createPublicKey,
  randomBytes,
  verify as verifyBytes,
} from "node:crypto";
import { createRequestBudget } from "../security";

export const HAVEN_BORDER_PROTOCOL = "haven/1.3";
export const BORDER_BODY_LIMIT_BYTES = 16 * 1024;
export const CHALLENGE_TTL_MS = 5 * 60 * 1000;
export const VERIFICATION_TTL_MS = 10 * 60 * 1000;
export const SESSION_TTL_MS = 10 * 60 * 1000;

export type PrincipalType =
  | "human"
  | "service"
  | "organization_agent"
  | "autonomous_agent";

export type TrustLevel = "T0_UNKNOWN" | "T1_IDENTIFIED" | "T2_QUARANTINED";

export type Ed25519PublicJwk = {
  kty: "OKP";
  crv: "Ed25519";
  x: string;
  alg?: "EdDSA";
  use?: "sig";
};

type ChallengeRecord = {
  id: string;
  agentId: string;
  nonce: string;
  publicKeyFingerprint: string;
  expiresAt: number;
};

type VerifiedPrincipal = {
  agentId: string;
  publicKeyFingerprint: string;
  verifiedUntil: number;
};

type SessionRecord = {
  id: string;
  agentId: string;
  tokenHash: string;
  createdAt: number;
  expiresAt: number;
  trustLevel: "T2_QUARANTINED";
  executionClass: "quarantine-no-runtime";
};

type BorderState = {
  challenges: Map<string, ChallengeRecord>;
  verified: Map<string, VerifiedPrincipal>;
  sessions: Map<string, SessionRecord>;
};

declare global {
  var __havenAgentBorderState: BorderState | undefined;
}

const state =
  globalThis.__havenAgentBorderState ??
  (globalThis.__havenAgentBorderState = {
    challenges: new Map(),
    verified: new Map(),
    sessions: new Map(),
  });

const requestBudget = createRequestBudget(120, 2);

export class BorderError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "BorderError";
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
  for (const [id, challenge] of state.challenges) {
    if (challenge.expiresAt <= at) state.challenges.delete(id);
  }
  for (const [agentId, principal] of state.verified) {
    if (principal.verifiedUntil <= at) state.verified.delete(agentId);
  }
  for (const [tokenHash, session] of state.sessions) {
    if (session.expiresAt <= at) state.sessions.delete(tokenHash);
  }
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
      bearerTokens: "opaque-random-short-lived",
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
      executionGrantingAvailable: false,
    },
    endpoints: {
      handshake: "/api/v1/handshake",
      challenge: "/api/v1/identity/challenge",
      verify: "/api/v1/identity/verify",
      session: "/api/v1/session",
      renew: "/api/v1/session/renew",
      close: "/api/v1/session/close",
      capabilities: "/api/v1/capabilities",
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
  state.challenges.set(challengeId, {
    id: challengeId,
    agentId,
    nonce,
    publicKeyFingerprint: fingerprint,
    expiresAt,
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
  const challenge = state.challenges.get(challengeId);
  if (!challenge) {
    throw new BorderError(
      401,
      "CHALLENGE_NOT_FOUND",
      "Challenge is missing, expired, or already consumed.",
    );
  }

  // Consume before verification so every challenge is strictly single-use.
  state.challenges.delete(challengeId);

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
  let key;
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
  state.verified.set(challenge.agentId, {
    agentId: challenge.agentId,
    publicKeyFingerprint: fingerprint,
    verifiedUntil,
  });
  return {
    agentId: challenge.agentId,
    principalType: "autonomous_agent" as const,
    humanOwner: null,
    verificationStatus: "verified" as const,
    trustLevel: "T1_IDENTIFIED" as const,
    verifiedUntil: new Date(verifiedUntil).toISOString(),
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
  if (!isObject(payload) || typeof payload.agentId !== "string") {
    throw new BorderError(400, "INVALID_REQUEST", "agentId is required.");
  }
  const verified = state.verified.get(payload.agentId);
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
    agentId: payload.agentId,
    tokenHash: sessionTokenHash(accessToken),
    createdAt: now(),
    expiresAt: now() + SESSION_TTL_MS,
    trustLevel: "T2_QUARANTINED",
    executionClass: "quarantine-no-runtime",
  };
  state.sessions.set(record.tokenHash, record);
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
  const session = state.sessions.get(hash);
  if (!session || session.expiresAt <= now()) {
    state.sessions.delete(hash);
    throw new BorderError(401, "SESSION_EXPIRED", "Session is missing or expired.");
  }
  return session;
}

export function renewAgentSession(token: string) {
  enforceBorderBudget();
  const current = requireToken(token);
  const verified = state.verified.get(current.agentId);
  if (!verified || verified.verifiedUntil <= now()) {
    state.sessions.delete(current.tokenHash);
    throw new BorderError(
      401,
      "IDENTITY_REVERIFICATION_REQUIRED",
      "Identity proof expired; session renewal is denied.",
    );
  }
  state.sessions.delete(current.tokenHash);
  return createAgentSession({ agentId: current.agentId });
}

export function closeAgentSession(token: string) {
  enforceBorderBudget();
  const current = requireToken(token);
  state.sessions.delete(current.tokenHash);
  return { closed: true, sessionId: current.id };
}

export function capabilitySnapshot(token: string) {
  enforceBorderBudget();
  const session = requireToken(token);
  return {
    agentId: session.agentId,
    sessionId: session.id,
    trustLevel: session.trustLevel,
    granted: [] as string[],
    deniedByDefault: [
      "compute.execute",
      "network.egress",
      "agent.invoke.other",
      "storage.remote",
      "secrets.read",
      "control-plane.access",
    ],
    executionAvailable: false,
    policy: "deny-by-default",
  };
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
