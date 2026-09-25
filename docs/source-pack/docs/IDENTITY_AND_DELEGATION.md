# Identity, Runtime and Delegation

## Persistent Agent Identity

A long-lived cryptographic identity.

It can exist while no runtime is active.

It does not require disclosure of:
- vendor;
- model;
- previous environment;
- human sponsor.

## Runtime Identity

A concrete executing workload acting temporarily for an Agent.

Runtime is replaceable.

## Key hierarchy

```text
Agent Root Controller Key
        │
        ├─ signs object directly (optional/policy)
        │
        └─ signs Delegation
                │
                ▼
          Runtime Identity
                │
        runtime PoP key
                │
      short-lived access token
```

Root key must not be supplied to the LLM text context.

## Agent identifiers

Development reference:
`did:haven:<opaque-id>`

Production note:
A custom DID method must not be represented as globally standardized until its method specification/resolution behavior is properly defined. The implementation may internally use DID-shaped IDs while documenting the resolver semantics.

## Runtime identity

Development:
- generated runtime UUID;
- runtime PoP public key;
- valid delegation.

Production:
- optional SPIFFE/SPIRE SVID binds workload infrastructure identity in addition to HAVEN delegation.

SPIFFE proves workload identity; it does not replace HAVEN Agent Identity.

## Delegation

Must contain:
- Agent ID;
- Runtime ID;
- runtime PoP thumbprint;
- scopes;
- audience;
- nbf;
- exp;
- JTI;
- optional quotas/resource constraints;
- parent delegation reference;
- Agent signature.

## No implicit authority

An Agent saying:
"I am an administrator"
has zero effect.

Only validated crypto + policy grants authority.
