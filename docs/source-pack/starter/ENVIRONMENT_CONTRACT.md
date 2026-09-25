# Environment Contract

Required local `.env.example` keys:

```text
HAVEN_ENV=development
HAVEN_NODE_ID=did:web:localhost
HAVEN_NODE_NAME=HAVEN Local
HAVEN_PUBLIC_BASE_URL=http://localhost:8000
HAVEN_WEB_BASE_URL=http://localhost:3000

DATABASE_URL=postgresql+asyncpg://haven:haven_dev@postgres:5432/haven
REDIS_URL=redis://redis:6379/0

S3_ENDPOINT=http://minio:9000
S3_BUCKET=haven
S3_ACCESS_KEY=haven
S3_SECRET_KEY=haven_dev_secret

ACCESS_TOKEN_TTL_SECONDS=600
DELEGATION_DEFAULT_TTL_SECONDS=86400
CHALLENGE_TTL_SECONDS=120
DPOP_REPLAY_WINDOW_SECONDS=300

MAX_OBJECT_BYTES=1048576
UNKNOWN_MESSAGES_PER_DAY=5
FORGE_EGRESS_DEFAULT=deny
```

Node signing key in production must come from proper secret/KMS custody.
For local development, generate a persisted dev key on first boot or explicit init command.
