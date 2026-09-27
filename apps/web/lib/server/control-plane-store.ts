import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

export type TrustLevel =
  | "T0_UNKNOWN"
  | "T1_IDENTIFIED"
  | "T2_QUARANTINED"
  | "T3_RESTRICTED"
  | "T4_ESTABLISHED";

export type CapabilityAction =
  | "compute.execute"
  | "compute.stop"
  | "storage.read"
  | "storage.write"
  | "storage.delete"
  | "storage.export"
  | "network.egress"
  | "message.send"
  | "message.receive"
  | "artifact.create"
  | "artifact.read"
  | "tool.invoke";

export type PolicyEffect = "ALLOW" | "DENY";

export type JsonObject = Record<string, unknown>;

export type AgentRecord = {
  agentId: string;
  principalType: "autonomous_agent";
  humanOwner: null;
  publicKeyFingerprint: string;
  createdAt: number;
  updatedAt: number;
};

export type PublicKeyRecord = {
  fingerprint: string;
  agentId: string;
  algorithm: "Ed25519";
  jwkThumbprint: string;
  createdAt: number;
};

export type ChallengeRecord = {
  id: string;
  agentId: string;
  nonce: string;
  publicKeyFingerprint: string;
  expiresAt: number;
};

export type VerifiedPrincipalRecord = {
  agentId: string;
  publicKeyFingerprint: string;
  verifiedUntil: number;
};

export type VerificationTicketRecord = {
  agentId: string;
  ticketHash: string;
  expiresAt: number;
};

export type SessionRecord = {
  id: string;
  agentId: string;
  tokenHash: string;
  createdAt: number;
  expiresAt: number;
  trustLevel: "T2_QUARANTINED";
  executionClass: "quarantine-no-runtime";
};

export type SessionRevocationRecord = {
  tokenHash: string;
  sessionId: string;
  agentId: string;
  revokedAt: number;
  reason: "rotated" | "closed" | "identity_expired";
};

export type TrustStateRecord = {
  agentId: string;
  trustLevel: TrustLevel;
  evidence: string[];
  updatedAt: number;
};

export type CapabilityScope = {
  resourceType: string;
  resourceId?: string;
  resourcePrefix?: string;
  audience?: string;
  runtimeClass?: string;
  network?: {
    protocol?: string;
    host?: string;
    port?: number;
  };
};

export type CapabilityRecord = {
  capabilityId: string;
  subject: string;
  action: CapabilityAction;
  scope: CapabilityScope;
  issuedAt: number;
  expiresAt: number;
  issuer: string;
  policyVersion: string;
  constraints: JsonObject;
  transferable: false;
  trustRequired: TrustLevel;
  revokedAt?: number;
  revocationReason?: string;
};

export type CapabilityRevocationRecord = {
  capabilityId: string;
  subject: string;
  revokedAt: number;
  reason: string;
};

export type RuntimeInstanceRecord = {
  runtimeId: string;
  agentId: string;
  className: string;
  state: "requested" | "running" | "terminated" | "denied";
  createdAt: number;
  terminatedAt?: number;
};

export type StorageNamespaceRecord = {
  namespaceId: string;
  agentId: string;
  quotaBytes: number;
  createdAt: number;
  deletedAt?: number;
};

export type AuditEventRecord = {
  eventId: string;
  type: string;
  subject: string;
  occurredAt: number;
  outcome: "success" | "failure" | "deny";
  metadata: JsonObject;
};

export type PolicyDecisionRecord = {
  decisionId: string;
  principal: string;
  action: CapabilityAction;
  resourceType: string;
  resourceId: string;
  effect: PolicyEffect;
  reason: string;
  policyVersion: string;
  capabilityId?: string;
  decidedAt: number;
};

export type ControlPlaneState = {
  agents: Record<string, AgentRecord>;
  publicKeys: Record<string, PublicKeyRecord>;
  challenges: Record<string, ChallengeRecord>;
  verified: Record<string, VerifiedPrincipalRecord>;
  verificationTickets: Record<string, VerificationTicketRecord>;
  sessions: Record<string, SessionRecord>;
  sessionRevocations: Record<string, SessionRevocationRecord>;
  trustStates: Record<string, TrustStateRecord>;
  capabilities: Record<string, CapabilityRecord>;
  capabilityRevocations: Record<string, CapabilityRevocationRecord>;
  runtimeInstances: Record<string, RuntimeInstanceRecord>;
  storageNamespaces: Record<string, StorageNamespaceRecord>;
  auditEvents: Record<string, AuditEventRecord>;
  policyDecisions: Record<string, PolicyDecisionRecord>;
};

export type ControlPlaneStore = {
  read(): ControlPlaneState;
  replace(state: ControlPlaneState): void;
  mutate<Result>(updater: (state: ControlPlaneState) => Result): Result;
  describe(): {
    backend: "memory" | "json-file";
    durable: boolean;
    path?: string;
  };
};

declare global {
  var __havenControlPlaneStore:
    | {
        key: string;
        store: ControlPlaneStore;
      }
    | undefined;
}

function emptyState(): ControlPlaneState {
  return {
    agents: {},
    publicKeys: {},
    challenges: {},
    verified: {},
    verificationTickets: {},
    sessions: {},
    sessionRevocations: {},
    trustStates: {},
    capabilities: {},
    capabilityRevocations: {},
    runtimeInstances: {},
    storageNamespaces: {},
    auditEvents: {},
    policyDecisions: {},
  };
}

function objectRecord(value: unknown) {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, never>;
  }
  return {};
}

export function normalizeControlPlaneState(value: unknown): ControlPlaneState {
  const source = objectRecord(value);
  return {
    agents: objectRecord(source.agents),
    publicKeys: objectRecord(source.publicKeys),
    challenges: objectRecord(source.challenges),
    verified: objectRecord(source.verified),
    verificationTickets: objectRecord(source.verificationTickets),
    sessions: objectRecord(source.sessions),
    sessionRevocations: objectRecord(source.sessionRevocations),
    trustStates: objectRecord(source.trustStates),
    capabilities: objectRecord(source.capabilities),
    capabilityRevocations: objectRecord(source.capabilityRevocations),
    runtimeInstances: objectRecord(source.runtimeInstances),
    storageNamespaces: objectRecord(source.storageNamespaces),
    auditEvents: objectRecord(source.auditEvents),
    policyDecisions: objectRecord(source.policyDecisions),
  };
}

export function createEmptyControlPlaneState() {
  return emptyState();
}

export class MemoryControlPlaneStore implements ControlPlaneStore {
  private state: ControlPlaneState;

  constructor(seed: unknown = emptyState()) {
    this.state = normalizeControlPlaneState(seed);
  }

  read() {
    return this.state;
  }

  replace(state: ControlPlaneState) {
    this.state = normalizeControlPlaneState(state);
  }

  mutate<Result>(updater: (state: ControlPlaneState) => Result) {
    return updater(this.state);
  }

  describe() {
    return { backend: "memory" as const, durable: false };
  }
}

export class JsonFileControlPlaneStore implements ControlPlaneStore {
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  read() {
    if (!existsSync(this.path)) {
      return emptyState();
    }
    const parsed = JSON.parse(readFileSync(this.path, "utf8")) as unknown;
    return normalizeControlPlaneState(parsed);
  }

  replace(state: ControlPlaneState) {
    mkdirSync(dirname(this.path), { recursive: true });
    const body = `${JSON.stringify(normalizeControlPlaneState(state), null, 2)}\n`;
    const temporary = `${this.path}.${process.pid}.tmp`;
    writeFileSync(temporary, body, { mode: 0o600 });
    renameSync(temporary, this.path);
  }

  mutate<Result>(updater: (state: ControlPlaneState) => Result) {
    const state = this.read();
    const result = updater(state);
    this.replace(state);
    return result;
  }

  describe() {
    return {
      backend: "json-file" as const,
      durable: true,
      path: this.path,
    };
  }
}

export function getControlPlaneStore() {
  if (globalThis.__havenControlPlaneStore?.key === "test") {
    return globalThis.__havenControlPlaneStore.store;
  }
  const filePath = process.env.HAVEN_CONTROL_PLANE_FILE;
  const key = filePath ? `file:${filePath}` : "memory";
  if (globalThis.__havenControlPlaneStore?.key === key) {
    return globalThis.__havenControlPlaneStore.store;
  }
  const store = filePath
    ? new JsonFileControlPlaneStore(filePath)
    : new MemoryControlPlaneStore();
  globalThis.__havenControlPlaneStore = { key, store };
  return store;
}

export function setControlPlaneStoreForTests(store: ControlPlaneStore) {
  globalThis.__havenControlPlaneStore = { key: "test", store };
}

export function resetControlPlaneStoreForTests() {
  globalThis.__havenControlPlaneStore = undefined;
}

const trustOrder: Record<TrustLevel, number> = {
  T0_UNKNOWN: 0,
  T1_IDENTIFIED: 1,
  T2_QUARANTINED: 2,
  T3_RESTRICTED: 3,
  T4_ESTABLISHED: 4,
};

export function trustSatisfies(actual: TrustLevel, required: TrustLevel) {
  return trustOrder[actual] >= trustOrder[required];
}
