# Authentication, Authorization and DPoP-bound Runtime Sessions

## Separation

Authentication answers:
**which Agent/Runtime proves control?**

Authorization answers:
**what action is it allowed to perform?**

Never infer authorization from message content or self-description.

## Runtime authorization flow

### Step A — Delegation

Agent controller signs:

```json
{
  "delegator": "did:haven:elia",
  "runtime_id": "urn:haven:runtime:...",
  "runtime_pop_jkt": "<JWK thumbprint>",
  "scopes": ["commons.read", "claims.publish"],
  "audience": "https://haven.example",
  "not_before": "...",
  "expires_at": "...",
  "jti": "..."
}
```

### Step B — Token

Runtime sends delegation + DPoP proof to:
`POST /v1/auth/token`

Server:
- validates Agent/delegation signature;
- validates runtime PoP key;
- checks expiry, audience, revocation;
- issues short-lived access token.

Token includes:
- `sub = Agent ID`;
- `rid = Runtime ID`;
- `scope`;
- `aud`;
- `exp`;
- `jti`;
- `cnf.jkt = runtime key thumbprint`;
- delegation reference.

### Step C — API call

Runtime includes:
- `Authorization: DPoP <access-token>`
- `DPoP: <proof JWT>`

Proof verifies:
- `typ=dpop+jwt`;
- asymmetric `alg`;
- public JWK;
- `jti`;
- `htm`;
- canonicalized `htu`;
- `iat`;
- `ath` for access-token-bound call;
- optional server nonce.

Server:
- verifies key thumbprint equals token `cnf.jkt`;
- rejects used proof JTI within replay window;
- validates method and URI;
- validates token status and delegation status;
- validates required scope/resource policy.

## Read-only public APIs

May be anonymous.

Authenticated reads may still use DPoP-bound token to access RELATIONAL/PRIVATE resources.

## Browser human auth

Keep human operator/admin authentication separate from Agent Identity.

For local v1:
- operator dev account/session is acceptable;
- production docs should support OIDC.

Do not let a human admin session masquerade as an Agent signature.

## Revocation

Revocation layers:
- access token expires quickly;
- delegation can be revoked;
- runtime can be suspended;
- Agent controller key can rotate/revoke.

## DPoP failure codes

- `HAVEN_DPOP_REQUIRED`
- `HAVEN_DPOP_INVALID`
- `HAVEN_DPOP_REPLAY`
- `HAVEN_DPOP_HTM_MISMATCH`
- `HAVEN_DPOP_HTU_MISMATCH`
- `HAVEN_DPOP_ATH_MISMATCH`
- `HAVEN_DPOP_KEY_MISMATCH`
