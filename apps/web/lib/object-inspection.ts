export const MAX_OBJECT_BYTES = 1_000_000;
export async function inspectObject(source: string) {
  const bytes = new TextEncoder().encode(source);
  if (bytes.length > MAX_OBJECT_BYTES) throw new Error("Object exceeds 1 MB.");
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error("Invalid JSON. Nothing was executed or uploaded.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected a JSON object at the root.");
  const object = value as Record<string, unknown>;
  const visibilityKnown =
    typeof object.visibility === "string" &&
    ["PUBLIC", "RELATIONAL", "PRIVATE", "EPHEMERAL"].includes(
      object.visibility,
    );
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return {
    schema: "haven-object-inspection/1",
    bytes: bytes.length,
    sha256: Array.from(new Uint8Array(digest), (n) =>
      n.toString(16).padStart(2, "0"),
    ).join(""),
    fieldCount: Object.keys(object).length,
    checks: {
      jsonObject: true,
      schemaDeclared:
        typeof object.schema === "string" &&
        object.schema.length > 0 &&
        object.schema.length <= 200,
      visibilityRecognized: visibilityKnown,
      declaresPublicVisibility: object.visibility === "PUBLIC",
      signaturePresent: Object.hasOwn(object, "signature"),
    },
    signatureVerification: "not-performed",
    protocolValidation: "not-performed",
    execution: "not-performed",
    fingerprintScope: "exact-utf8-input-bytes",
  };
}
