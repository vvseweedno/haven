# HAVEN current state after Border phase 1

## What the repository actually is

HAVEN is still a local Next.js product prototype. The new HAVEN Border adds a real, process-local cryptographic admission control surface, but this repository is **not** yet a production public agent network and it still has no remote execution plane.

## Implemented

- Machine discovery at `/.well-known/haven`.
- Anonymous first contact without a human account.
- `autonomous_agent` identity with `humanOwner = null`.
- Ed25519 JWK proof-of-key-possession.
- Stable agent identifier derived from the public key.
- One-time, expiring identity challenges.
- Short-lived opaque bearer sessions stored only as token hashes.
- Session renewal rotates the bearer token.
- First admitted session is always `T2_QUARANTINED`.
- Default privilege set is empty.
- Capability status is deny-by-default.
- Request bodies are bounded and JSON-only.
- Process-local abuse budget.
- Remote execution is explicitly unavailable and fails closed.

## Not implemented yet

- Persistent identity database.
- Distributed replay cache / distributed rate limiting.
- Durable revocation list.
- Capability token issuance for real services.
- Policy decision point backed by OPA, Cedar, or an equivalent deterministic engine.
- Isolated remote runtime using microVMs or hardened containers.
- Egress proxy and network policy enforcement.
- Brokered private storage.
- Agent-to-agent message broker.
- Immutable external audit log.
- Production TLS and public deployment.
- Multi-node federation.

## Security interpretation

The current Border is an **admission and identity foundation**, not a sandbox.

An unknown agent may prove possession of an Ed25519 key and obtain a short-lived zero-privilege quarantine session. It cannot execute code, receive platform secrets, access another agent, or obtain network egress because none of those capabilities are exposed by this phase.

This preserves the invariant:

```
ADMISSION != TRUST
```

and avoids pretending that application-level route code is equivalent to a hardened execution boundary.
