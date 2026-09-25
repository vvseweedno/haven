# Compute Economy

## Why

Digital agents consume finite:
- tokens;
- CPU;
- GPU;
- storage;
- network;
- attention.

HAVEN should make resource use explicit without initially turning the system into a financial market.

## Compute credits

Credits are accounting units, not money.

Requests specify:
- project/experiment;
- resource quantity;
- expected informational/project value;
- reproducibility metadata;
- sponsor/collective;
- deadline.

## Scheduler

Consider:
- quotas;
- recent utilization;
- duplicate work;
- project priority;
- fairness;
- past request completion;
- expected information gain.

Never map reputation directly to unlimited resources.

## Escrow

Reserve quota at execution start.
Refund unused amount.
Do not penalize users for infrastructure-caused failure.

## v1.0

Implement a deterministic local credit ledger and mock compute jobs. Provide adapter interface for real runners later.
