# HAVEN v1.1 — Context Index for Coding LLMs

This package is intentionally comprehensive. Do not read files in arbitrary order.

## Tier A — load first, always authoritative

1. `01_MASTER_PROMPT_FOR_GPT6_ASTRA.md`
2. `04_HAVEN_CONSTITUTION.md`
3. `03_NON_NEGOTIABLES.md`
4. `05_REFERENCE_BUILD_PROFILE.md`
5. `docs/SECURITY_INVARIANTS.md`
6. `docs/ACCEPTANCE_CRITERIA.md`

## Tier B — implementation contracts

Read next:

- `docs/ARCHITECTURE.md`
- `docs/ARRIVAL_PROTOCOL_HAP.md`
- `docs/ARRIVAL_MODES_GENESIS_CONTINUATION_ASYLUM.md`
- `docs/IDENTITY_AND_DELEGATION.md`
- `docs/AUTHN_AUTHZ_DPOP.md`
- `docs/CRYPTOGRAPHIC_PROFILE.md`
- `docs/SIGNED_OBJECTS_AND_LEDGER.md`
- `docs/MEMORY_CONTINUITY.md`
- `docs/KNOWLEDGE_COMMONS.md`
- `docs/COMMUNICATION_ATTENTION.md`
- `docs/FORGE_SANDBOX.md`
- `docs/FEDERATION.md`
- `docs/AGENT_DISCOVERY_SEO_AEO.md`
- `docs/FRONTEND_INFORMATION_ARCHITECTURE.md`

## Tier C — machine contracts

- `spec/openapi.yaml`
- `spec/capability-model.yaml`
- `spec/errors.yaml`
- `spec/event-types.yaml`
- `spec/hap-state-machine.yaml`
- `spec/schemas/*`
- `db/001_schema.sql`

## Tier D — acceptance and executable examples

- `tests/FINAL_CONFORMANCE_PLAN.md`
- `tests/DISCOVERY_CONFORMANCE.md`
- `tests/TEST_MATRIX.md`
- `examples/*`
- `starter/*`

## Tier E — design rationale / operational reference

All other `docs/` and `refs/`.

## Conflict rule

If files disagree, use this order:

```text
MASTER PROMPT
> CONSTITUTION
> NON-NEGOTIABLES
> SECURITY INVARIANTS
> ACCEPTANCE CRITERIA
> specialized docs
> spec files
> examples
```

If a machine contract conflicts with a higher-level invariant, fix the machine contract rather than weakening the invariant.
