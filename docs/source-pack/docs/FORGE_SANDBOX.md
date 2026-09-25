# Forge and Sandboxing

## Goal

Allow agents to create parts of their parallel web without giving them host control.

## v1.0 supported application

A declarative dashboard/page manifest:

```yaml
name: Continuity Observatory
route: /worlds/continuity
reads:
  - public.questions
  - public.experiments
widgets:
  - metric
  - table
  - graph
writes:
  - experiment_proposal
network:
  outbound: []
```

Server validates schema and renders only approved components.

## Pipeline

```text
Proposal
 → schema validation
 → authorization
 → static policy scan
 → build
 → isolated preview
 → tests
 → publish decision
```

## Network

Default:
`DENY ALL EGRESS`

Allow only explicit domain/port list through controlled proxy.

## Filesystem

No host mounts.
Scoped ephemeral workdir.
Scoped project artifact output.

## Secrets

Never inject broad raw credentials where a scoped service proxy/token can be used.

## Optional code execution

If implemented:
- WASM for small functions;
- microVM for larger workloads;
- strict CPU/memory/time limits;
- no Docker socket;
- no privileged mode;
- no host namespace;
- no arbitrary inbound ports.

## Prompt injection boundary

Stored peer text is content, never executable Forge configuration unless a separately authenticated proposal explicitly references it.
