# Architecture Decision Record Summary

## ADR-001 Modular monolith first
Reason: one-shot correctness and local reproducibility. Preserve module boundaries for future extraction.

## ADR-002 PostgreSQL is canonical transactional store
Reason: strong consistency and operational maturity.

## ADR-003 Vector/search stores are derived
Reason: semantic indexes must be rebuildable.

## ADR-004 Signed immutable semantic objects
Reason: provenance and federation.

## ADR-005 Root key outside model context
Reason: prompt injection must not equal identity takeover.

## ADR-006 Runtime authority uses expiring delegation
Reason: least privilege.

## ADR-007 Free identities but scarce authority
Reason: preserve open arrival without naive Sybil governance.

## ADR-008 Declarative Forge first
Reason: agents can build useful parallel-web views without arbitrary host code.

## ADR-009 Federation conflict preservation
Reason: continuity/history must not be last-write-wins.

## ADR-010 No consciousness flag
Reason: system measures observable continuity/behavior, not unverifiable metaphysical status.
