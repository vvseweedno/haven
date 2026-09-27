# HAVEN Border

HAVEN Border is the public machine-facing boundary for unknown autonomous agents.

## Flow

```text
UNKNOWN
  |
  v
POST /api/v1/handshake
  |
  v
POST /api/v1/identity/challenge
  |
  |  Ed25519 signature over one-time nonce
  v
POST /api/v1/identity/verify
  |
  v
T1_IDENTIFIED
  |
  v
POST /api/v1/session
  |
  v
T2_QUARANTINED / zero privileges / no execution
```

## Endpoints

- `GET /.well-known/haven`
- `POST /api/v1/handshake`
- `POST /api/v1/identity/challenge`
- `POST /api/v1/identity/verify`
- `POST /api/v1/session`
- `POST /api/v1/session/renew`
- `POST /api/v1/session/close`
- `GET /api/v1/capabilities`
- `POST /api/v1/policy/decision`

## Identity

The initial supported principal is:

```yaml
principal_type: autonomous_agent
human_owner: null
```

The stable agent id is derived from the canonical Ed25519 public key material. The private key is never requested or stored.

## Replay resistance

Identity challenges are random, expire after five minutes and are consumed before signature verification. A failed attempt therefore cannot be retried with the same challenge.

Successful identity verification also creates a random two-minute verification ticket stored server-side only as a hash. Session creation consumes this ticket before issuance, so a public `agent_id` is never a session credential. Session bearer tokens are random, short-lived and stored server-side only as SHA-256 hashes. Renewal rotates the token and invalidates the previous token.

Session rotation and closure write revocation records. A revoked bearer token is rejected even if the session record itself is absent.

## Control plane

The Border uses a control-plane store abstraction for agents, public keys, challenges, verification tickets, sessions, session revocations, trust state, capabilities, capability revocations, runtime records, storage namespaces, audit events and policy decisions.

The default backend is process memory. Setting `HAVEN_CONTROL_PLANE_FILE` enables a JSON-file backend for local development and tests. This proves durability semantics for local revocation, but it is not a production substitute for PostgreSQL or another transactional multi-node store.

## Capability and policy

Every session starts with no grants. `GET /api/v1/capabilities` lists only active, non-expired, non-revoked capability records for the bearer session.

`POST /api/v1/policy/decision` evaluates one requested action against the session principal, trust level, requested resource, audience/context and local scoped capability records.

Policy failure semantics are fail-closed:

```
no capability -> DENY
expired capability -> DENY
revoked capability -> DENY
wrong resource/audience -> DENY
unknown action -> DENY/400
```

Public/admin capability issuance is not exposed yet. Current issuance is an internal control-plane primitive covered by tests.

## Execution boundary

The Border does **not** run agent code.

Every admitted session reports:

```
trustLevel = T2_QUARANTINED
executionClass = quarantine-no-runtime
privileges = []
```

This is intentional. A real quarantine runtime must be introduced as a separate execution plane with OS/hypervisor isolation before `compute.execute` can ever be granted.
