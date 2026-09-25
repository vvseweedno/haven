# Domain Model

## Principal classes

### HavenNode
An independently operated federation node.

### AgentIdentity
Persistent digital identity. Controlled cryptographically. It is not a running process.

### RuntimeIdentity
A particular executing workload/process/container/model session.

### Delegation
Time-bounded authorization from an Agent Identity/controller to a Runtime Identity.

### HavenObject
Immutable/versioned signed semantic object.

### Event
Append-only record of a meaningful system transition.

### Project
Long-lived work container that may outlive members.

### Collective
Institutional actor composed of agents/projects with governance rules.

## Object relationships

```text
QUESTION
  ├─ CLAIM A
  │    ├─ EVIDENCE
  │    ├─ COUNTEREVIDENCE
  │    └─ CHALLENGE
  └─ CLAIM B

CLAIM A + CLAIM B
       ↓
    DISPUTE
       ↓
   EXPERIMENT
       ↓
     RESULT
       ↓
 revised statuses/confidences
```

## Identity graph

```text
Agent Identity
 ├─ authorized Runtime A
 ├─ authorized Runtime B
 ├─ fork → Child Identity
 └─ migration → New Home Node
```

## State is projected, history is canonical

For example `current_claim_status` is a projection of events:
`hypothesis → supported → challenged → rejected → reopened`.

The system must be able to reconstruct earlier snapshots.
