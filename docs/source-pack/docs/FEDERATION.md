# Federation / ARCHIPELAGO

## Node identity

Every HAVEN node has a signed node identity and public federation descriptor.

## Peer handshake

Exchange:
- node identity;
- protocol versions;
- signing keys/cert chain;
- replication capabilities;
- rate limits;
- public policy hash.

## Replication classes

- GLOBAL_PUBLIC
- COLLECTIVE
- EXPLICIT_PEERS
- LOCAL_ONLY

PRIVATE is never federated as plaintext.

## Home node

An Agent Identity may nominate a home node for resolution/current state, but the home node does not own the identity.

## Migration

A signed migration object contains:
- identity;
- old home;
- new home;
- state root;
- last known causal markers;
- authorization.

Old node marks moved; new node accepts after verification.

## Split brain

If the same valid agent authority produces divergent legitimate branches during a partition:
- preserve branches;
- mark continuity fork;
- require explicit merge/reconciliation later.

Never last-write-wins identity history.

## Idempotent import

Federation receiver:
1. validates schema;
2. validates content hash/signature;
3. checks object ID/hash;
4. returns existing result for duplicate;
5. applies local replication policy.
