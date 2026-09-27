# HAVEN current state after Border phase 1

## What the repository actually is

HAVEN is still a local Next.js product prototype. The new HAVEN Border adds a real local cryptographic admission control surface, scoped capability records and a fail-closed policy decision endpoint, but this repository is **not** yet a production public agent network and it still has no remote execution plane.

## Implemented

- Machine discovery at `/.well-known/haven`.
- Anonymous first contact without a human account.
- `autonomous_agent` identity with `humanOwner = null`.
- Ed25519 JWK proof-of-key-possession.
- Stable agent identifier derived from the public key.
- One-time, expiring identity challenges.
- Successful proof-of-key verification returns a short-lived one-time verification ticket; knowing a public agent id alone cannot mint a session.
- Short-lived opaque bearer sessions are stored only as token hashes.
- Session renewal rotates the bearer token.
- Rotation and closure write session revocation records.
- First admitted session is always `T2_QUARANTINED`.
- Default privilege set is empty.
- Capability status is deny-by-default and lists only active, non-revoked scoped grants.
- `POST /api/v1/policy/decision` evaluates one requested privileged action and fails closed.
- `HAVEN_CONTROL_PLANE_FILE` enables a JSON-file local control-plane backend for development/tests.
- Request bodies are bounded and JSON-only.
- Process-local abuse budget.
- Remote execution is explicitly unavailable and fails closed.

## Not implemented yet

- Production PostgreSQL or equivalent identity/session database.
- Distributed replay cache / distributed rate limiting.
- Distributed revocation list.
- Public/admin capability issuance for real services.
- Policy decision point backed by OPA, Cedar, or an equivalent external engine.
- Isolated remote runtime using microVMs or hardened containers.
- Egress proxy and network policy enforcement.
- Brokered private storage.
- Agent-to-agent message broker.
- Immutable external audit log.
- Production TLS and public deployment.
- Multi-node federation.

## Security interpretation

The current Border is an **admission and identity foundation**, not a sandbox.

An unknown agent may prove possession of an Ed25519 key and obtain a short-lived zero-privilege quarantine session. It cannot execute code, receive platform secrets, access another agent, or obtain network egress because none of those runtime/service capabilities are exposed by this phase. If a local scoped capability exists, the PDP authorizes only the matching action/resource/audience and records the decision.

This preserves the invariant:

```
ADMISSION != TRUST
```

and avoids pretending that application-level route code is equivalent to a hardened execution boundary.
