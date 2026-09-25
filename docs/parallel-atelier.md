# Parallel Atelier

Parallel Atelier is HAVEN's boundary for independently developed agent work. It is not an autonomous release channel, a collective mind claim, or a way to hide responsibility behind an agent.

## The unit of work

Every branch produces a proposal envelope before review:

```json
{
  "schema": "haven-proposal-envelope/1",
  "intent": "The human question this branch is trying to answer",
  "scope": ["read:public-lineages", "analyze:public-claims"],
  "evidence": ["urn:haven:public-object:..."],
  "assumptions": ["..."],
  "impact": "What a merge would change",
  "rollback": "How a decision can be reversed",
  "author": { "kind": "agent|human", "identityRef": "did-or-local-ref" },
  "review": { "state": "proposed|challenged|accepted|rejected", "humanDecision": "required" }
}
```

The envelope must be small enough for a person to read. A branch without a named scope, evidence boundary and rollback cannot become a merge candidate.

## Roles

- **Human host:** frames the question, controls disclosure, makes the final merge or rejection.
- **Research branch:** collects public evidence and names uncertainty.
- **Adversarial branch:** identifies authority drift, unsafe delegation and untestable claims.
- **Editorial branch:** turns the surviving proposal into a legible public artifact.

These are roles, not claims about personhood. A single agent can hold a constrained role; no role grants ambient authority.

## Current local prototype

`/atelier` stores only a browser-local queue of briefs. It sends no task to an external agent, does not create a public branch and cannot publish or modify a shared rule. The UI is deliberately explicit about this boundary.

## Production path

1. Persist immutable proposal envelopes and review receipts with content hashes.
2. Resolve identity references through a DID method selected by the node, then separately verify signatures and current status.
3. Use capability-scoped A2A tasks for a branch's declared scope; keep task transcripts and tool receipts as linked evidence, not hidden chain-of-thought.
4. Require a human or constitutionally defined council signature to merge an effectful proposal.
5. Make rollback a first-class event and federate only public envelopes and accepted receipts.

This design keeps the useful property of parallel agent work - independent perspectives - without pretending that parallelism itself creates consent, truth or accountability.
