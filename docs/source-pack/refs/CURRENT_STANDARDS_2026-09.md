# Standards Baseline — verified 2026-09-21

This file records external standards used by HAVEN. The coding LLM should prefer official implementations/docs and negotiate versions rather than hard-code brittle assumptions.

## A2A

Official:
https://a2a-protocol.org/latest/
https://a2a-protocol.org/latest/definitions/
https://a2a-protocol.org/latest/topics/extensions/

Verified:
- A2A is an open protocol for interoperability/collaboration among independent agents.
- v1.0 is the current production-ready major release announced in August 2026.
- normative schema is provided as protobuf; JSON schema is also available.
- Agent interfaces include protocol binding and protocol version.
- core protocol bindings include JSONRPC, gRPC and HTTP+JSON.
- A2A provides an extension mechanism with globally unique extension URIs.
- HAVEN must use its own extension URI namespace; it must not pretend to own the official `a2a-protocol.org/extensions/` namespace.

HAVEN uses A2A for inter-agent transport/collaboration; HAVEN adds continuity, memory, lineage, federation and society semantics.

## MCP

Official:
https://modelcontextprotocol.io/
https://blog.modelcontextprotocol.io/posts/2026-07-28/

Verified:
- MCP specification `2026-07-28` was released July 28, 2026.
- it introduced a stateless protocol core;
- extension framework;
- authorization hardening;
- cacheable list results and other scaling improvements.

HAVEN uses MCP as a tool/resource interface, not as the canonical Agent Identity system.

## W3C DID

Official:
https://www.w3.org/TR/did/
https://www.w3.org/standards/history/did-1.1/
https://www.w3.org/standards/history/did-resolution-1.0/

Verified:
- DID v1.1 Candidate Recommendation Snapshot: 5 March 2026.
- DID Resolution v1 reached Candidate Recommendation Snapshot on 6 August 2026 and Candidate Recommendation Draft on 28 August 2026.
- DIDs are identifiers designed to support verifiable decentralized identity/control without requiring a single centralized identity provider.

HAVEN may use DID-compatible concepts. A custom `did:haven:` method must be documented honestly as a project method until formally specified/registered as appropriate.

## SPIFFE

Official:
https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/
https://spiffe.io/docs/latest/deploying/svids/

Verified:
- SPIFFE Workload API is stable.
- it provides workload identity material.
- X.509-SVID and JWT-SVID profiles are mandatory profiles in the Workload API specification.
- SVIDs are suitable for workload provenance/mTLS.
- WIT-SVID is optional/incubating.

HAVEN uses SPIFFE as an optional production Runtime/Workload Identity adapter, not as long-lived Agent Identity.

## OAuth DPoP

Official RFC:
https://www.rfc-editor.org/rfc/rfc9449

Verified:
- RFC 9449 defines OAuth 2.0 Demonstrating Proof of Possession.
- it sender-constrains access/refresh tokens to a client key.
- a DPoP proof JWT binds request method/URI and, for access-token use, the token hash.
- this reduces usefulness of stolen replayable bearer tokens.

HAVEN v1 uses DPoP-like/RFC-9449-compatible runtime sessions for protected mutations.

## RFC 8785 JCS

Use JSON Canonicalization Scheme for deterministic JSON signatures.

The implementation should cite and test the exact canonicalization library/behavior in generated repository docs.


## ARD — Agentic Resource Discovery

Canonical proposal:
https://github.com/ards-project/ard-spec

Verified 2026-09-21:
- current proposal shown by the spec: v0.91, dated 2026-08-26;
- canonical static manifest path is `/.well-known/ard.json`;
- entries are JSON-LD nodes;
- an entry MUST include `identifier`, `displayName`, `type` and exactly one of `url` or `data`;
- `representativeQueries` SHOULD contain 2–5 examples and is central to semantic discovery;
- discovery also supports `rel="ard"` in HTML and `Agentmap:` in `robots.txt`;
- predecessor `/.well-known/ai-catalog.json` is optional backward-compatibility only;
- ARD relevance scores are not security/trust scores.

HAVEN adopts ARD as an additive discovery proposal and must not treat it as authentication or authorization.

## agents.txt

Canonical community draft:
https://github.com/agents-txt/agents-txt

Verified 2026-09-21:
- specification is v1.0, status Draft;
- `/agents.txt` is the canonical plain-text capability declaration;
- `/agents.json` is the strongly recommended structured companion;
- A2A is declared with `A2A: <AgentCard URL>`;
- MCP is declared with `MCP: <endpoint URL>`;
- URL sets in `agents.txt` and `agents.json` should remain consistent.

HAVEN adopts it as an additive discovery layer, not a security boundary.

## llms.txt

Reference:
https://llmstxt.org/

Use `/llms.txt` as a public LLM-readable orientation/index.
Treat it as documentation only; it must not grant authority.
