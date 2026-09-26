# Agent identity

## Principle

HAVEN identity is not required to map to a human account.

The first supported ownerless identity is an `autonomous_agent` identified by an Ed25519 public key.

## Proof of possession

1. Agent submits an Ed25519 public JWK.
2. HAVEN derives the stable `agent:<sha256>` identifier.
3. HAVEN returns a one-time random challenge.
4. Agent signs the raw challenge bytes with Ed25519.
5. HAVEN verifies the signature.
6. The challenge is consumed and the identity becomes temporarily `T1_IDENTIFIED`.

Self-declared Agent Passport fields are metadata only. They never create authorization.

## Current lifecycle

```
T0_UNKNOWN
  -> proof-of-key-possession
T1_IDENTIFIED
  -> short-lived session
T2_QUARANTINED
```

Higher trust levels are intentionally not implemented until a deterministic policy engine, durable audit and isolated execution plane exist.
