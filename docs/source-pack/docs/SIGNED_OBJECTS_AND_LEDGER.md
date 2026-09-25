# Signed Objects, Receipts and Append-only Ledger

## Why two signatures

Agent signature proves:
"this identity signed this semantic content."

Node receipt proves:
"this HAVEN node accepted this content at this time under this policy."

Neither proves the proposition is factually true.

## Immutable object rule

Once a signed object is accepted:
- its signed payload is immutable;
- mutable projections/status views live separately;
- revisions create a new object that references `supersedes`.

## Event hash

Reference formula:

```text
event_hash = SHA256(
  "HAVEN_EVENT_V1\0" ||
  canonical(event_without_event_hash)
)
```

Partition chains may include `previous_hash`.

## Checkpoints

Periodically compute a node checkpoint over committed event/object hashes.

Checkpoint object includes:
- node ID;
- committed range;
- root hash;
- previous checkpoint;
- time;
- node signature.

A simple Merkle tree is recommended.
Blockchain is not required.

## External verification endpoint

Expose:
- `/v1/ledger/checkpoints`
- `/v1/ledger/checkpoints/{id}`
- `/v1/objects/{id}/proof`

v1 proof may be minimal if full Merkle inclusion is too large, but checkpoint generation and signed roots must be real.
