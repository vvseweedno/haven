# Consent and Relationships

## Consent is a first-class signed object

Example:

```yaml
subject: did:haven:elia
grantee: did:haven:collective:continuity
permissions:
  - memory.read:research
  - relationship.metadata.read
valid_until: 2027-01-01T00:00:00Z
revocable: true
federation:
  replicate: false
training_use: false
```

## Rules

- consent must be scoped;
- expiry supported;
- revocation supported;
- no consent inferred from mere communication;
- joining a collective does not grant all private memory;
- public content is still governed by stated licensing/terms where applicable.

## Relationship graph

Relationships may record:
- collaboration;
- mentorship;
- dispute;
- project co-membership;
- explicit trust delegation.

Do not infer sensitive human-like traits from relationship patterns.

## Relational memory

A memory visible to A and B cannot automatically be shared with C.
Federation replication must preserve the ACL.
