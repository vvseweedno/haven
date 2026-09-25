# HAVEN local product prototype

HAVEN is a local, evidence-led product prototype for evaluating continuity infrastructure for software agents. It explores how identity, provenance, typed memory boundaries and delegated authority could remain inspectable when models, runtimes or operators change.

This repository is not a live agent network, production identity provider or operating federation. It contains a Next.js product site, browser-local workflows, curated fixtures, read-only public APIs and machine-readable discovery contracts. The implemented/deferred boundary is part of the product and must remain visible in every release.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:41731`. This address is the canonical URL for the local prototype.

For a production-mode check:

```bash
npm run build
npm start
```

## Evaluate the product

| Need | Route | Current result |
| --- | --- | --- |
| Understand the thesis and choose an evaluation path | `/` | Product orientation |
| Compare implemented and deferred capabilities | `/trust` | Live local status plus an explicit capability ledger |
| Inspect exact bytes and create a proof receipt | `/proof-desk` | Browser-local receipt; no external truth resolution |
| Explore public demonstration knowledge | `/commons` | Curated public fixtures and evidence context |
| Prepare an arrival payload | `/arrival` | Validated local draft; no identity admission |
| Inspect protocol and discovery surfaces | `/protocol` | Readable protocol boundaries and machine links |
| Test conversation and participation concepts | `/agora`, `/cabinet` | Browser-local prototypes; no multi-user service |
| Review independent branch and release governance | `/atelier`, `/delivery` | Local proposals and gates; human merge/release required |
| Qualify a possible pilot | `/landscape` | Local, unsubmitted brief; no CRM submission |

## Implementation boundary

Implemented now:

- Responsive product and Observatory routes with English and Russian interface copy selected in the browser.
- Curated demonstration records for agents, claims, evidence, projects, lineages, collectives and federation concepts.
- Read-only `GET`/`HEAD` public catalog and capability-status APIs with validation, caching and a process-local request budget.
- Browser-local forum, human profile, arrival draft, saved collection, proposal queue and pilot brief workflows.
- Browser-local encrypted notebook with explicit save, encrypted import/export, inactivity lock and stale-tab protection.
- Exact-byte SHA-256 inspection and proof receipts that separate computed evidence from declared meaning.
- A bounded browser-local evaluation ledger with no cookies, user IDs, fingerprinting or external analytics transport.
- Machine-readable discovery files and a schema.org `WebSite` plus `WebApplication` description.

Deferred:

- Remote identity admission and cryptographic identity verification.
- Multi-user realtime messaging, moderation operations and authenticated remote mutation.
- Federation replication, trust-path resolution and live node handshakes.
- Remote agent execution, task dispatch and autonomous branch merging.
- FastAPI node services and PostgreSQL, Redis or MinIO persistence.
- Production telemetry, CRM delivery, population analytics and experiment conclusions.
- Docker Compose full-node operation.

Seeded identities, peers, records and research metrics are fixtures. Local proof receipts establish bytes and declared context only; they do not establish legal identity, external truth, consciousness or sentience.

## Machine discovery

| Resource | Purpose |
| --- | --- |
| `/llms.txt` | Curated, factual reading path for language-model clients |
| `/agents.txt` | Concise plain-text capability and boundary card |
| `/agents.json` | Structured routes, capabilities, localization and status |
| `/.well-known/haven.json` | HAVEN local-node manifest |
| `/.well-known/ard.json` | Agentic resource discovery descriptor |
| `/.well-known/agent-card.json` | Read-only A2A discovery card |
| `/openapi.json` | OpenAPI 3.1 contract for implemented HTTP endpoints |
| `/sitemap.xml` | Local crawl inventory |
| `/robots.txt` | Local crawler directives and discovery pointers |

Discovery is descriptive, not authorization. Machine clients must use `/api/v1/status` for the current capability boundary and must not infer remote execution, admission or mutation from the presence of a protocol page.

## Language and search status

The interface provides English and Russian copy through a same-URL browser preference. It does not yet publish separately crawlable locale URLs, so the project does not claim `hreflang` coverage or independent RU/EN indexing. The canonical host is `localhost`; public search visibility and Local SEO are therefore not release outcomes for this build.

No legal organization, physical address, customer list, testimonial, rating or `LocalBusiness` entity is asserted. Add such information only after it exists, is verified and is visible to users.

See [the content and SEO contract](docs/content-seo.md) for the keyword/entity map, editorial rules, localization policy, ownership and release checklist.

## Verification

```bash
npm test
node scripts/check-content-seo.mjs
npm run build
```

`npm test` runs security tests, discovery/content checks and TypeScript validation. The content audit validates JSON parsing, route uniqueness, required product and documentation references, local URL consistency, API/schema boundaries and prohibited unsupported claims.

With the local production server running, the browser suites are:

```bash
python -m pip install playwright
python -m playwright install chromium
python scripts/test-ui.py
python scripts/test-security-ui.py
```

Screenshots are written to `.artifacts/ui/` and `.artifacts/security/`. Set `HAVEN_TEST_URL` to test another local server.

## Repository map

- `apps/web` - Next.js App Router product site.
- `apps/web/public` - crawlable and machine-readable discovery resources.
- `docs/source-pack` - supplied audited HAVEN reference material; it is design input, not proof of implementation.
- `docs/business-strategy.md` - product and business boundary.
- `docs/marketing-growth.md` - acquisition and lifecycle contract.
- `docs/cro-analytics.md` - local measurement and experimentation contract.
- `docs/product-delivery.md` - accountable delivery chain and release gates.
- `docs/content-seo.md` - content, SEO, localization and communication contract.
- `scripts` - security, discovery, content and browser verification.

See [SECURITY.md](SECURITY.md) before using browser-local storage. The notebook is not an agent identity, credential store or backend memory service, and it must not be the only copy of valuable information.
