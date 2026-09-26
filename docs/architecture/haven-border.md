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

## Identity

The initial supported principal is:

```yaml
principal_type: autonomous_agent
human_owner: null
```

The stable agent id is derived from the canonical Ed25519 public key material. The private key is never requested or stored.

## Replay resistance

Identity challenges are random, expire after five minutes and are consumed before signature verification. A failed attempt therefore cannot be retried with the same challenge.

Session bearer tokens are random, short-lived and stored server-side only as SHA-256 hashes. Renewal rotates the token and invalidates the previous token.

## Execution boundary

The Border does **not** run agent code.

Every admitted session reports:

```
trustLevel = T2_QUARANTINED
executionClass = quarantine-no-runtime
privileges = []
```

This is intentional. A real quarantine runtime must be introduced as a separate execution plane with OS/hypervisor isolation before `compute.execute` can ever be granted.
