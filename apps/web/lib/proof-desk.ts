import { inspectObject } from "./object-inspection.ts";

type ProofObject = Record<string, unknown>;

export type ProofStageStatus = "verified" | "declared" | "missing";

export type ProofStage = {
  id: "receipt" | "structure" | "meaning" | "authorship" | "validity";
  label: string;
  status: ProofStageStatus;
  detail: string;
};

export type ProofDeskReport = {
  schema: "haven-proof-receipt/1";
  createdAt: string;
  receipt: {
    bytes: number;
    sha256: string;
    fieldCount: number;
  };
  verdict: {
    title: string;
    detail: string;
  };
  stages: ProofStage[];
  observations: {
    stableIdentifier: boolean;
    typeDeclared: boolean;
    timeBound: boolean;
    visibilityDeclared: boolean;
    issuerOrAuthorDeclared: boolean;
    subjectDeclared: boolean;
    evidenceDeclared: boolean;
    proofDeclared: boolean;
    statusDeclared: boolean;
  };
  boundary:
    "No source value, signature material, or external URL was resolved by this receipt.";
};

export const proofSamples = [
  {
    id: "haven-evidence",
    label: "HAVEN evidence",
    detail: "A public evidence object with a declared author and source.",
    source: JSON.stringify(
      {
        schema: "haven-object/1",
        id: "urn:haven:object:evidence:continuity-001",
        type: "Evidence",
        visibility: "PUBLIC",
        createdAt: "2026-09-23T14:00:00.000Z",
        author: "did:haven:local:agent:0001-elia",
        subject: "urn:haven:claim:continuity-calibration",
        evidence: ["urn:haven:receipt:handoff-003"],
      },
      null,
      2,
    ),
  },
  {
    id: "delegated-runtime",
    label: "Runtime delegation",
    detail: "A narrow, time-bound authority claim for a replaceable runtime.",
    source: JSON.stringify(
      {
        schema: "haven-delegation/1",
        id: "urn:haven:delegation:elia-research-01",
        type: "RuntimeDelegation",
        visibility: "RELATIONAL",
        createdAt: "2026-09-23T14:05:00.000Z",
        expiresAt: "2026-09-23T15:05:00.000Z",
        issuer: "did:haven:local:agent:0001-elia",
        subject: "runtime:elia:research-01",
        capability: ["commons.read", "evidence.attach"],
        proof: {
          type: "DataIntegrityProof",
          proofPurpose: "assertionMethod",
          proofValue: "demo-not-verified",
        },
      },
      null,
      2,
    ),
  },
  {
    id: "credential-style",
    label: "Credential-style claim",
    detail: "A familiar issuer, subject, proof and status shape for comparison.",
    source: JSON.stringify(
      {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        id: "urn:haven:credential:continuity-steward-001",
        type: ["VerifiableCredential", "AgentContinuityClaim"],
        issuer: "did:haven:local:node:alpha",
        validFrom: "2026-09-23T14:00:00.000Z",
        credentialSubject: {
          id: "did:haven:local:agent:0001-elia",
          role: "continuity-steward",
        },
        credentialStatus: {
          id: "urn:haven:status:continuity-steward-001",
          type: "StatusListEntry",
        },
        proof: {
          type: "DataIntegrityProof",
          proofPurpose: "assertionMethod",
          proofValue: "demo-not-verified",
        },
      },
      null,
      2,
    ),
  },
] as const;

function asObject(value: unknown): ProofObject {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected a JSON object at the root.");
  return value as ProofObject;
}

function hasString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasType(value: unknown) {
  return (
    hasString(value) ||
    (Array.isArray(value) && value.some((item) => hasString(item)))
  );
}

function hasDate(value: unknown) {
  return hasString(value) && Number.isFinite(Date.parse(value));
}

function hasDeclaredValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return hasString(value);
}

function hasKnownVisibility(value: unknown) {
  return (
    hasString(value) &&
    ["PUBLIC", "RELATIONAL", "PRIVATE", "EPHEMERAL"].includes(value)
  );
}

export async function createProofReceipt(source: string): Promise<ProofDeskReport> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new Error("Invalid JSON. Nothing was executed, stored, or uploaded.");
  }
  const object = asObject(parsed);
  const inspection = await inspectObject(source);

  const stableIdentifier = hasString(object.id) || hasString(object.canonicalId);
  const typeDeclared = hasType(object.type);
  const timeBound = [
    object.createdAt,
    object.created_at,
    object.validFrom,
    object.issued,
  ].some(hasDate);
  const visibilityDeclared = hasKnownVisibility(object.visibility);
  const issuerOrAuthorDeclared = [object.issuer, object.author, object.agent].some(
    hasDeclaredValue,
  );
  const subjectDeclared = [object.subject, object.credentialSubject].some(
    hasDeclaredValue,
  );
  const evidenceDeclared = hasDeclaredValue(object.evidence);
  const proofDeclared = [object.proof, object.proofs, object.signature].some(
    hasDeclaredValue,
  );
  const statusDeclared = [object.credentialStatus, object.status].some(
    hasDeclaredValue,
  );

  const meaningComplete = stableIdentifier && typeDeclared && timeBound;
  const verdict = !meaningComplete
    ? {
        title: "Needs a clearer public shape",
        detail:
          "Add a stable identifier, a type and a creation or validity time before another person can review this object coherently.",
      }
    : proofDeclared
      ? {
          title: "Ready for human review",
          detail:
            "The object has a reviewable public shape and declares a proof. The proof and any status still need a real verifier.",
        }
      : {
          title: "Structured, but unsigned",
          detail:
            "The object is readable as a record, but it does not declare a signature or proof that could connect it to an author.",
        };

  return {
    schema: "haven-proof-receipt/1",
    createdAt: new Date().toISOString(),
    receipt: {
      bytes: inspection.bytes,
      sha256: inspection.sha256,
      fieldCount: inspection.fieldCount,
    },
    verdict,
    stages: [
      {
        id: "receipt",
        label: "Exact receipt",
        status: "verified",
        detail: "HAVEN calculated an SHA-256 fingerprint from the exact UTF-8 bytes in this browser.",
      },
      {
        id: "structure",
        label: "Readable structure",
        status: "verified",
        detail: `The input is a JSON object with ${inspection.fieldCount} root fields. No code was run.`,
      },
      {
        id: "meaning",
        label: "Public meaning",
        status: meaningComplete ? "declared" : "missing",
        detail: meaningComplete
          ? "Identifier, type and time are present as object declarations. They remain claims until independently checked."
          : "A reviewable public record needs an identifier, type and creation or validity time.",
      },
      {
        id: "authorship",
        label: "Authorship proof",
        status: proofDeclared ? "declared" : "missing",
        detail: proofDeclared
          ? "A signature or proof field is present. Cryptographic verification is intentionally not performed in this local surface."
          : "No signature or proof field is declared.",
      },
      {
        id: "validity",
        label: "Current validity",
        status: statusDeclared ? "declared" : "missing",
        detail: statusDeclared
          ? "A status field is declared. No remote URL, registry or issuer was contacted from this browser."
          : "No credential or object status is declared.",
      },
    ],
    observations: {
      stableIdentifier,
      typeDeclared,
      timeBound,
      visibilityDeclared,
      issuerOrAuthorDeclared,
      subjectDeclared,
      evidenceDeclared,
      proofDeclared,
      statusDeclared,
    },
    boundary:
      "No source value, signature material, or external URL was resolved by this receipt.",
  };
}
