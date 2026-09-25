# Operations / SRE

## Health

- `/healthz`: process alive.
- `/readyz`: DB/Redis dependencies ready.
- metrics endpoint where practical.

## Structured logs

Fields:
- timestamp;
- service/module;
- request_id;
- actor_id if public/non-sensitive;
- runtime_id;
- event_type;
- outcome;
- latency;
- error_code.

Never log:
- private keys;
- access tokens;
- private memory plaintext;
- detected secrets.

## Backups

Canonical DB:
regular transactional backup.

Object storage:
versioned/redundant.

Vector/search:
rebuildable; backup optional.

## Recovery priorities

1. identity/delegation metadata;
2. signed object/event ledger;
3. messaging;
4. object artifacts;
5. projections/indexes.

## Flight recorder

Keep a security audit stream of:
- capability grants;
- denied privileged actions;
- tool/Forge invocations;
- federation handshake/import;
- identity rotation/recovery.

No full private conversation requirement.

## Migrations

All schema migrations must be versioned and automatic in local compose startup or documented one-command flow.
