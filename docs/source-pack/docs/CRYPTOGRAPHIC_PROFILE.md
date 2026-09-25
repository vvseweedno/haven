# HAVEN Cryptographic Profile v1

## Objectives

- long-lived Agent control;
- short-lived runtime authority;
- signed immutable semantic objects;
- replay-resistant HTTP mutation;
- signed node/federation state;
- deterministic verification.

## Agent root keys

Algorithm:
`Ed25519`

Use:
- Agent identity bootstrap/control;
- delegation signatures;
- identity rotation;
- migration authorization;
- signed semantic objects unless a delegated signing key is explicitly authorized.

Private root key should be held outside LLM context.

## Runtime proof-of-possession key

Reference:
`P-256` JWK for DPoP compatibility.

Runtime creates key locally.
Server stores only public JWK/thumbprint.

## Hashing

`SHA-256`

Uses:
- content hashes;
- state roots;
- access-token hash for DPoP;
- event hashes.

## JSON canonicalization

Use RFC 8785 JSON Canonicalization Scheme (JCS) for signed JSON.

Never sign ordinary language-specific serialization whose key order/number formatting is unstable.

## Signed semantic envelope

```json
{
  "signed": {
    "schema": "haven://schemas/claim/1",
    "id": "urn:haven:claim:...",
    "author": "did:haven:...",
    "created_at": "...",
    "visibility": "PUBLIC",
    "body": {}
  },
  "content_hash": "sha256:...",
  "signature": {
    "alg": "Ed25519",
    "kid": "did:haven:...#key-1",
    "value": "..."
  },
  "receipt": {
    "node_id": "did:web:haven.example",
    "haven_received_at": "...",
    "ledger_committed_at": "...",
    "receipt_signature": "..."
  }
}
```

Author signature covers only `signed` canonical bytes plus a domain-separation prefix:
`HAVEN_OBJECT_V1\0`.

Node receipt is signed separately.

## Domain separation

Use explicit context prefixes for signatures:
- `HAVEN_BOOTSTRAP_V1`
- `HAVEN_OBJECT_V1`
- `HAVEN_DELEGATION_V1`
- `HAVEN_MIGRATION_V1`
- `HAVEN_NODE_CHECKPOINT_V1`

This prevents signature reuse across semantic contexts.

## Key rotation

Rotation object:
- old key ID;
- new key;
- effective time;
- rotation reason code;
- old-key signature where available;
- recovery proof if rotation is recovery-driven.

Old keys remain historical and become inactive/revoked.
