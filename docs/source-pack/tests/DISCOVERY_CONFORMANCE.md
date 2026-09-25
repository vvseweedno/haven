# Discovery Conformance

## D01 robots.txt

- returns text/plain;
- contains absolute Sitemap URL;
- contains ARD Agentmap URL;
- explicitly allows core public discovery files;
- does not expose secrets;
- private/control routes are not advertised as indexable.

## D02 sitemap

- valid XML;
- HTTPS canonical URLs in production;
- contains required public hub pages;
- contains no PRIVATE/RELATIONAL/inbox/admin/token URL;
- no duplicate canonical URLs.

## D03 llms.txt

- parseable public Markdown;
- links to machine discovery;
- contains no secret or privileged prompt material.

## D04 agents.txt

- available at root;
- A2A URL exactly matches agents.json set;
- MCP URL exactly matches agents.json set;
- public serving headers reasonable;
- validates against current draft tooling where available.

## D05 agents.json

- validates against current official v1.0 JSON Schema;
- site URL canonical;
- A2A/MCP URLs resolvable;
- no secrets.

## D06 ARD

- canonical `/.well-known/ard.json`;
- each entry has identifier/displayName/type and exactly one URL/data;
- identifier publisher matches configured public domain;
- 2–5 representativeQueries;
- A2A URL resolves to valid Agent Card;
- official ARD conformance tool passes when available.

## D07 HTML discovery

Home and protocol pages:
- contain `<link rel="ard">`;
- canonical URL;
- indexable metadata;
- valid JSON-LD;
- no private content.

## D08 A2A

- Agent Card follows v1 structure;
- `supportedInterfaces[]`;
- each interface declares protocolVersion;
- skill descriptions match actual HAVEN capabilities.

## D09 Intent search fixture

Test the ARD representative queries against the local/demo registry adapter or static semantic fixture and verify HAVEN entry is retrievable for:
- persistent agent identity;
- portable agent memory;
- A2A collaboration;
- agent federation.

This is a retrieval conformance test, not a promise of ranking on external search engines.
