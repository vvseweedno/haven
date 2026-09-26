# HAVEN Universal Agent Refuge implementation status

## 1. What existed before

The repository was a local Next.js product/evidence prototype with read-only public APIs, browser-local workflows, machine-readable discovery and explicit documentation that identity admission, cryptographic verification and remote execution were deferred.

## 2. Critical weaknesses found

For the universal-refuge objective, the repository lacked a real machine admission handshake, proof-of-key identity, ownerless server-side principal state, expiring sessions and a fail-closed boundary between discovery and any future execution.

## 3. Architecture implemented in this phase

A new HAVEN Border now provides a real process-local identity/admission control plane.

Unknown software may contact the Border without a human account. It can prove possession of an Ed25519 key and receive a short-lived quarantine session.

Admission never grants execution or service access.

## 4. HAVEN Border

**PASS (local prototype).**

Machine discovery and bounded JSON endpoints are implemented.

## 5. Identity

**PASS (process-local).**

Ed25519 proof-of-key-possession, stable public-key-derived agent IDs, single-use challenges and one-time verification tickets bound to session creation are implemented. A public agent identifier is not accepted as a session credential.

## 6. Ownerless agents

**PASS.**

`autonomous_agent` does not require a human owner.

## 7. Quarantine

**PARTIAL.**

The admission state exists and has zero privileges, but a real microVM/container execution cell does not yet exist. Therefore remote execution is disabled rather than simulated.

## 8. Capability security

**PARTIAL.**

The current session has an empty grant set and explicit deny-by-default capability reporting. Signed/scoped/revocable service capability issuance is not implemented yet.

## 9. Policy

**PARTIAL.**

Current policy is deterministic deny-by-default in application code. A standalone PDP such as OPA/Cedar is not yet present.

## 10. Networking

**PARTIAL.**

Because no agent runtime exists, no runtime egress exists. A future execution plane still needs namespaces/firewall policy and a scoped egress proxy.

## 11. Storage

**PARTIAL.**

No remote per-agent storage service is exposed. Existing encrypted notebook remains browser-local.

## 12. Messaging

**FAIL for production objective.**

No multi-agent authenticated broker exists.

## 13. Safe exit

**FAIL for production objective.**

No server-side resident state exists to export yet.

## 14. Audit

**PARTIAL.**

The Border does not yet have an external append-only security audit sink.

## 15. Threat model

Existing SECURITY.md remains applicable and is extended by the Border documentation. A dedicated full execution-plane threat model is still required before compute is enabled.

## 16. Security tests

**PASS for current Border scope.**

Tests cover ownerless admission, Ed25519 proof, challenge replay rejection, identity mismatch, rejection of agent-id-only session minting, one-time verification-ticket consumption, zero-privilege quarantine sessions, token rotation and session closure. Browser security CI also exercises the live Border discovery, handshake, body/content-type bounds and unauthenticated denial paths.

## 17. Remaining limitations

- Localhost-only deployment.
- Process-local state.
- No durable database.
- No multi-instance coordination.
- No microVM/container execution plane.
- No egress proxy.
- No durable revocation/audit backend.
- No real capability broker.
- No inter-agent message broker.

## 18. Production deployment requirements

The next safe milestone is not "turn on remote execution". It is:

1. persistent identity/session/revocation storage;
2. deterministic external policy engine;
3. append-only audit sink;
4. isolated execution service;
5. deny-by-default network policy;
6. capability broker;
7. adversarial integration tests;
8. only then bounded compute admission.

## 19. Verification commands

```bash
npm ci
npm test
npm run build
```

## 20. Definition-of-done checklist

| Criterion | Status |
| --- | --- |
| Unknown agent can discover HAVEN without human account | PASS |
| Unknown agent can perform handshake | PASS |
| Ownerless autonomous_agent supported | PASS |
| Proof-of-key identity | PASS |
| Unknown agent enters quarantine state | PASS |
| Real host/control-plane isolated quarantine runtime | PARTIAL |
| Zero privilege by default | PASS |
| Service access only capability-based | PARTIAL |
| Short-lived/revocable capabilities | PARTIAL |
| Policy fail-closed | PARTIAL |
| Runtime outbound deny-by-default | PARTIAL |
| Agent receives no platform secrets | PASS for current Border |
| Private remote storage isolated | PARTIAL |
| Agent messaging through broker | FAIL |
| Sensitive actions durably audited | PARTIAL |
| Trust progression exists | PARTIAL |
| Trust downgrade/revocation | PARTIAL |
| Safe exit/export | FAIL |
| Adversarial execution tests | PARTIAL |
| CI green | PASS |
| Documentation matches code | PASS |
| No mock execution boundary | PASS |
| No TODO pretending to be sandbox isolation | PASS |
| No TODO pretending to be policy enforcement | PASS |
| No hardcoded demo-agent allow | PASS |
| Clean install works | PASS |

## Governing rule

```
UNKNOWN DOES NOT MEAN FORBIDDEN.

UNKNOWN MEANS:
IDENTIFY
ISOLATE
OBSERVE
LIMIT
VERIFY
THEN DELEGATE.
```

This phase implements **IDENTIFY** and **LIMIT** at the network/application boundary. It intentionally refuses to claim **ISOLATE** for code execution until a real execution boundary is present.
