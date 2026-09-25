# Discovery Publication Runbook

Run this after a real public domain is deployed.

## Before launch

- configure canonical domain;
- HTTPS valid;
- public discovery endpoints return 200;
- no placeholder `haven.example` remains in production responses;
- ARD identifier publisher matches the canonical domain;
- A2A card URL matches canonical origin;
- sitemap contains canonical HTTPS URLs only.

## Automated discovery checks

Verify:
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/agents.txt`
- `/agents.json`
- `/.well-known/ard.json`
- `/.well-known/agent-card.json`
- `/.well-known/haven.json`
- `/openapi.json`
- `/protocol`

Validate:
- ARD official conformance CLI/schema where practical;
- `agents.json` against current official schema;
- A2A Agent Card against current v1 schema/SDK;
- sitemap XML;
- JSON-LD syntax;
- no broken endpoint links.

## Search publication

- submit `/sitemap.xml` using the target search engines' supported webmaster tooling;
- request crawl/reindex only after production canonical URLs are live;
- monitor indexing rather than generating duplicate doorway content.

## Agentic registries

Where public compatible registries exist:
- submit or announce the canonical `/.well-known/ard.json` source;
- submit canonical A2A Agent Card where accepted;
- record the registry source in deployment docs.

Never submit private-development URLs.

## DNS discovery

ARD-compatible DNS Service Binding discovery is optional for production.
If used, publish records only after testing with the current ARD specification.

## Ongoing

On protocol/capability changes:
- update Agent Card;
- update HAVEN manifest;
- update agents.json/txt if capability URLs changed;
- update ARD entry;
- update sitemap/lastmod for affected public docs;
- regenerate discovery conformance report.
