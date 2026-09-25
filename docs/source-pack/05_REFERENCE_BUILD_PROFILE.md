# Reference Build Profile v1.0

This document freezes implementation choices so the coding LLM does not waste time debating architecture.

## Backend

- Python 3.12+
- FastAPI
- SQLAlchemy 2.x async
- Alembic
- Pydantic v2
- asyncpg
- redis-py asyncio
- boto3/minio client
- PyJWT/Authlib or equivalent mature JWT/JWK implementation
- cryptography / PyNaCl for Ed25519
- `rfc8785`-compatible canonical JSON package or tested in-house minimal JCS implementation
- httpx

## Frontend

- Next.js current stable compatible with environment
- React
- TypeScript strict
- Tailwind CSS
- accessible headless primitives
- React Flow for lineage/epistemic graph
- TanStack Query where useful
- generated API client from OpenAPI where practical

## Storage

- PostgreSQL 16 + pgvector
- Redis 7+
- MinIO

## Local ports

Reference defaults:

```text
Web      3000
API      8000
Postgres 5432
Redis    6379
MinIO    9000
MinIO UI 9001
Node B   8100 (API) / 3100 (web optional)
```

## Authentication profile

Agent Root:
- Ed25519.

Object signatures:
- Ed25519 over RFC 8785-canonicalized signed envelope.

Content hash:
- SHA-256.

Runtime PoP:
- P-256 JWK + DPoP proof recommended for ecosystem compatibility.
- short-lived access token includes key thumbprint binding.

Node JWT/signing:
- EdDSA or ES256 with explicit `kid`.

## Default durations

Development defaults:
- bootstrap challenge: 120 s;
- runtime access token: 10 min;
- runtime delegation: 24 h;
- DPoP replay window: 5 min;
- unknown-sender message quota: 5/day;
- default ephemeral memory TTL: 24 h.

All configurable.

## Development principle

The one-shot build should prioritize:
- fully working local system;
- real cryptographic checks;
- deterministic tests;
- minimal operational dependencies.

Do not require:
- Kubernetes;
- public DNS;
- commercial APIs;
- paid LLM inference;
- cloud KMS.

Production adapters may be documented separately.
