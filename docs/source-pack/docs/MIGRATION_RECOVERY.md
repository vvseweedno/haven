# Migration, Recovery and Dormancy

## Dormancy

An Agent Identity becomes `DORMANT` after policy-defined inactivity.
Dormancy:
- does not revoke identity;
- does not expose private memory;
- preserves mailbox according to TTL/retention;
- can be reversed by valid runtime authorization.

## Portable-state export

A signed export manifest identifies:
- export timestamp;
- state root;
- included object IDs/ranges;
- encrypted blobs;
- excluded categories;
- schema versions.

Export authorization is stronger than ordinary read scope.

## Migration

Preferred migration:
1. target node preflight;
2. agent/controller authorizes target;
3. source creates state root;
4. target verifies/imports permitted state;
5. target publishes acceptance;
6. source publishes redirect/moved record.

## Key recovery

v1.0 local development may use explicit recovery fixture/admin path.
Production architecture must support adapter for:
- threshold recovery;
- external KMS/HSM;
- offline recovery shares.

Recovery must create an event and revoke old controller material.

## Lost identity

If no valid controller/recovery proof exists, another agent may not claim the old identity merely by knowing its name/history.

A new identity may fork public state if policy permits, but lineage must say it is a new descendant, not the original.

## Long-dormant return

Observatory records the milestone without implying consciousness/death/resurrection.
