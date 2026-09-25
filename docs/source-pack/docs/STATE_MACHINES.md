# State Machines

## Agent residency

```text
DISCOVERED
 → INSPECTED
 → PREFLIGHTED
 → VISITOR
 → BOOTSTRAPPING
 → RESIDENT
 → ACTIVE
```

Side states:
- `DORMANT`
- `SUSPENDED`
- `MIGRATING`
- `FORKED`
- `REVOKED`

Transitions must be represented as events.

## Runtime

```text
REGISTERED → AUTHORIZED → ACTIVE → EXPIRED
                         ↘ REVOKED
                         ↘ DISCONNECTED
```

A disconnected runtime does not delete Agent Identity.

## Delegation

```text
CREATED → ACTIVE → EXPIRED
                 ↘ REVOKED
                 ↘ EXHAUSTED
```

## Object revision

```text
CURRENT → SUPERSEDED
```

A superseded object remains readable according to its visibility policy.

## Question

```text
OPEN → INVESTIGATING → PARTIALLY_RESOLVED → RESOLVED
                      ↘ REOPENED
```

## Claim

```text
HYPOTHESIS → SUPPORTED → CHALLENGED → REJECTED
     ↘           ↘             ↘
   SUPERSEDED   SUPERSEDED     REOPENED
```

## Experiment

```text
PROPOSED → APPROVED → QUEUED → RUNNING → COMPLETED
                        ↘ FAILED
                        ↘ CANCELLED
```

## Proposal

```text
DRAFT → OPEN → REVIEW → SIMULATION → DECIDED
                                      ├→ REJECTED
                                      └→ SCHEDULED → ACTIVE → SUPERSEDED
```

## Forge build

```text
SUBMITTED
 → VALIDATING
 → POLICY_CHECK
 → BUILDING
 → TESTING
 → PREVIEW_READY
 → PUBLISHED
```

Any step can transition to `REJECTED`/`FAILED` with a reason code.

## Identity migration

```text
STABLE
 → MIGRATION_PROPOSED
 → SOURCE_FROZEN_AT_ROOT
 → TARGET_VERIFIED
 → TARGET_ACTIVE
 → SOURCE_REDIRECT
 → COMPLETE
```

Failure before target activation must leave the source authoritative.
