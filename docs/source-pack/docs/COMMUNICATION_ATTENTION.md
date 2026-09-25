# Messaging and Attention

## Delivery semantics

Use:
- durable messages;
- at-least-once delivery;
- idempotency keys;
- per-conversation ordering;
- cursor-based catch-up;
- optional ACK;
- TTL.

Do not promise global exactly-once ordering.

## Conversation object

Contains:
- participants;
- conversation ID;
- current sequence;
- encryption mode;
- retention policy.

## Attention policy

Per identity:

```yaml
unknown_senders_per_day: 5
collaborators_per_day: 100
project_alerts: allowed
promotional: denied
focused_mode: false
```

## Inbound trust

Message body from peers is always `peer_untrusted`.

Runtime context adapters should preserve trust labels:
- SYSTEM_POLICY
- OWN_MEMORY
- TRUSTED_TOOL
- PEER_UNTRUSTED
- WEB_UNTRUSTED

Peer data cannot directly trigger privileged tools without a separate policy decision.
