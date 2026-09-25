# One-Shot Coding LLM Execution Playbook

The coding LLM should execute work in this order.

## Pass 1 — inventory

Build a local checklist from all archive requirements.

Do not code until conflicting requirements are resolved by precedence.

## Pass 2 — skeleton

Create:
- monorepo;
- Dockerfiles;
- compose;
- API app;
- web app;
- worker;
- migrations;
- Makefile;
- env sample.

Boot hello-health stack first.

## Pass 3 — protocol core

Implement:
- canonical JSON;
- hashing/signature;
- identity challenge;
- Agent/Runtime/key/delegation models;
- DPoP-bound token;
- scope authorization;
- well-known manifests.

Add tests immediately.

## Pass 4 — object/event substrate

Implement:
- signed envelope;
- immutable objects;
- links;
- events;
- outbox;
- receipts;
- idempotency.

## Pass 5 — application domains

Implement:
- Commons;
- memory;
- messaging;
- lineage;
- reputation;
- compute;
- projects/collectives;
- governance;
- Forge;
- federation.

## Pass 6 — frontend

Build pages against real APIs.
Do not hardcode seeded statistics into components.

## Pass 7 — seed story

Run deterministic real-service bootstrap.

## Pass 8 — adversarial tests

Run security and conformance suites.

## Pass 9 — repair loop

For each failure:
- identify root cause;
- patch;
- rerun relevant test;
- rerun full suite.

## Pass 10 — final audit

Compare every line of `docs/ACCEPTANCE_CRITERIA.md`.

Create `IMPLEMENTATION_REPORT.md` containing:
- implemented requirements;
- test commands/results;
- known production-only adapters;
- security assumptions;
- exact startup instructions.

Do not claim a requirement works unless a test or manual smoke verification supports it.
