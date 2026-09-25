export const VAULT_STORAGE_KEY = "haven-vault-v1";
export const MAX_ARCHIVE_BYTES = 3_000_000;
export const noteKinds = ["Reflection", "Research", "Decision"] as const;
export type Note = {
  id: string;
  title: string;
  body: string;
  kind: (typeof noteKinds)[number];
  createdAt: string;
  updatedAt: string;
};
export type VaultEnvelope = {
  format: "haven-vault/1";
  kdf: { name: "PBKDF2-SHA256"; iterations: 600000; salt: string };
  cipher: { name: "AES-GCM"; iv: string; data: string };
};
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });
const aad = encoder.encode("haven-vault/1|PBKDF2-SHA256|600000|AES-GCM-256");
function encode(bytes: Uint8Array): string {
  let result = "";
  for (let i = 0; i < bytes.length; i += 16384)
    result += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return btoa(result);
}
function decode(value: unknown, maxLength: number): Uint8Array<ArrayBuffer> {
  if (
    typeof value !== "string" ||
    value.length > maxLength ||
    value.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
  )
    throw new Error("Invalid encrypted archive.");
  const decoded = atob(value);
  if (btoa(decoded) !== value) throw new Error("Invalid archive encoding.");
  return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
}
export function validateNotes(value: unknown): Note[] {
  if (!Array.isArray(value) || value.length > 100)
    throw new Error("A notebook can contain at most 100 notes.");
  const ids = new Set<string>();
  return value.map((note) => {
    if (
      !note ||
      typeof note !== "object" ||
      typeof note.id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(note.id) ||
      ids.has(note.id) ||
      typeof note.title !== "string" ||
      note.title.length > 120 ||
      typeof note.body !== "string" ||
      note.body.length > 20000 ||
      !noteKinds.includes(note.kind) ||
      typeof note.createdAt !== "string" ||
      note.createdAt.length > 30 ||
      !Number.isFinite(Date.parse(note.createdAt)) ||
      typeof note.updatedAt !== "string" ||
      note.updatedAt.length > 30 ||
      !Number.isFinite(Date.parse(note.updatedAt))
    )
      throw new Error("Invalid note data in archive.");
    ids.add(note.id);
    return {
      id: note.id,
      title: note.title,
      body: note.body,
      kind: note.kind,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  });
}
export function parseEnvelope(text: string): VaultEnvelope {
  if (encoder.encode(text).byteLength > MAX_ARCHIVE_BYTES)
    throw new Error("Archive exceeds 3 MB.");
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("The archive is not valid JSON.");
  }
  if (
    !data ||
    data.format !== "haven-vault/1" ||
    data.kdf?.name !== "PBKDF2-SHA256" ||
    data.kdf.iterations !== 600000 ||
    data.cipher?.name !== "AES-GCM" ||
    decode(data.kdf.salt, 24).length !== 16 ||
    decode(data.cipher.iv, 16).length !== 12 ||
    decode(data.cipher.data, MAX_ARCHIVE_BYTES).length < 16
  )
    throw new Error("Unsupported or damaged encrypted archive.");
  return {
    format: "haven-vault/1",
    kdf: { name: "PBKDF2-SHA256", iterations: 600000, salt: data.kdf.salt },
    cipher: { name: "AES-GCM", iv: data.cipher.iv, data: data.cipher.data },
  };
}
async function deriveKey(passphrase: string, salt: string) {
  if (passphrase.length < 12 || passphrase.length > 256)
    throw new Error("Use a passphrase of 12 to 256 characters.");
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: decode(salt, 24),
      iterations: 600000,
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
export async function encryptVault(
  notes: Note[],
  key: CryptoKey,
  kdf: VaultEnvelope["kdf"],
): Promise<VaultEnvelope> {
  const plain = encoder.encode(
    JSON.stringify({ schema: "haven-notes/1", notes: validateNotes(notes) }),
  );
  if (plain.byteLength > 2_000_000)
    throw new Error("Notebook is full. Delete notes before saving.");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad, tagLength: 128 },
    key,
    plain,
  );
  return {
    format: "haven-vault/1",
    kdf,
    cipher: {
      name: "AES-GCM",
      iv: encode(iv),
      data: encode(new Uint8Array(encrypted)),
    },
  };
}
export async function createVault(passphrase: string, notes: Note[] = []) {
  const kdf: VaultEnvelope["kdf"] = {
    name: "PBKDF2-SHA256",
    iterations: 600000,
    salt: encode(crypto.getRandomValues(new Uint8Array(16))),
  };
  const key = await deriveKey(passphrase, kdf.salt);
  return { key, envelope: await encryptVault(notes, key, kdf) };
}
export async function unlockVault(envelope: VaultEnvelope, passphrase: string) {
  const safe = parseEnvelope(JSON.stringify(envelope));
  const key = await deriveKey(passphrase, safe.kdf.salt);
  try {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decode(safe.cipher.iv, 16),
        additionalData: aad,
        tagLength: 128,
      },
      key,
      decode(safe.cipher.data, MAX_ARCHIVE_BYTES),
    );
    const value = JSON.parse(decoder.decode(plaintext));
    if (value.schema !== "haven-notes/1")
      throw new Error("Unsupported notebook.");
    return { key, notes: validateNotes(value.notes) };
  } catch {
    throw new Error(
      "Could not unlock: incorrect passphrase or damaged archive.",
    );
  }
}
