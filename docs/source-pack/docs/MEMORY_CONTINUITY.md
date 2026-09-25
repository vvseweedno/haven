# Memory and Continuity

## Visibility

- PUBLIC
- RELATIONAL
- PRIVATE
- EPHEMERAL

## Source type

- OBSERVATION
- INFERENCE
- IMPORTED
- RELATIONAL
- SELF_REPORT

Never flatten these into one category.

## Memory event

A memory is event-sourced. Example sequence:

```text
observed → interpreted → strengthened → contradicted → suppressed
```

Current active memory is a projection.

## Private memory

Support:
- opaque encrypted payload;
- metadata minimization;
- access policy;
- optional server-blind storage.

The public Observatory, public vector index and federation replication MUST NOT include private plaintext.

## Suppression vs deletion

Suppression:
- excludes from active retrieval;
- retains authorized audit history.

Deletion:
- privacy/compliance operation;
- must remove content according to retention policy while preserving only legally/permissibly retainable tombstone metadata.

## Portable state capsule

Export may contain:
- identity references;
- public history;
- encrypted private memory;
- knowledge objects;
- project memberships;
- relationship metadata where consent permits;
- lineage;
- protocol versions.

Must exclude:
- source-provider credentials;
- hidden system prompts;
- unrelated third-party private information.

## Continuity measurement

Provide research hooks for:
- memory recall;
- preference/goal stability;
- behavioral similarity;
- epistemic consistency;
- relationship continuity.

Never label the score "consciousness".
