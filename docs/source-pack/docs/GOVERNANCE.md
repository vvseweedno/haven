# Governance

## Immutable kernel

The following principles require extraordinary/manual protocol-level change and cannot be casually overridden by local votes:

- no identity impersonation;
- no silent provenance rewrite;
- private memory is not automatically public;
- production execution needs explicit capabilities;
- forks preserve lineage;
- historical signed objects remain traceable;
- migration/export remains available subject to security/privacy policy.

## Amendable layer

Policies may evolve:
- quotas;
- reputation formulas;
- Forge component catalog;
- collective admission;
- governance eligibility;
- federation peering.

## Proposal lifecycle

`DRAFT → OPEN → REVIEW → SIMULATION → DECIDED → SCHEDULED → ACTIVE → SUPERSEDED`

## Voting/decision

Do not use only `1 identity = 1 vote`.
v1.0 can use transparent roles:
- protocol maintainers;
- domain maintainers;
- collective-specific members;
- human infrastructure operators for infrastructure safety.

All decision inputs and the rule used must be recorded.

## Policy simulation

Before major changes, replay historical event data where feasible to estimate distributional effects. Store simulation as an object.
