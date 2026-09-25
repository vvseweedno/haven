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

The first-contact journey is intentionally four stages:

| Decision | Route | Current result |
| --- | --- | --- |
| 1. Does HAVEN fit the problem? | `/landscape` | Explicit fit/no-fit criteria and current implementation evidence |
| 2. Can a concrete claim be inspected? | `/proof-desk` | Browser-local proof receipt; no external truth resolution |
| 3. Are the boundaries acceptable? | `/trust` | Implemented/local/fixture/deferred capability and privacy ledger |
| 4. Is a bounded pilot ready to discuss? | `/delivery` | Owners, data boundary, success evidence and stop conditions |
| Optional human handoff after readiness | `/pilot` | Explicit-consent submission when configured; otherwise disabled |

Deep routes such as Observatory, Commons, demo identities, protocol, federation, governance, arrival, Forge, Agora and the private workspace remain available as evidence or architecture references. They are not prerequisites for understanding the primary evaluation path.

## Implementation boundary

Implemented now:

- Responsive product and Observatory routes with English and Russian interface copy selected in the browser.
- Curated demonstration records for agents, claims, evidence, projects, lineages, collectives and federation concepts.
- Read-only `GET`/`HEAD` public catalog and capability-status APIs with validation, caching and a process-local request budget.
- Browser-local forum, human profile, arrival draft, saved collection, proposal queue and pilot brief workflows.
- A qualified pilot-request form plus a server-side handoff endpoint that forwards only explicitly entered consented fields when configured.
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
- Production telemetry, implicit CRM tracking, population analytics and experiment conclusions.
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
node scripts/check-ui-brand.mjs
npm run build
```

`npm test` runs security tests, content/SEO checks, UI/brand conformance, discovery checks and TypeScript validation. The UI audit verifies the canonical brand mark, shared visual tokens, theme behavior, reduced motion and bounded WebGL rendering alongside the factual content and API contracts.

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
- `docs/ux-ia.md` - UX, CX, navigation and information-architecture contract.
- `docs/ui-brand.md` - UI, brand, design-system, motion, imagery and WebGL contract.
- `scripts` - security, discovery, content, UI-brand and browser verification.

See [SECURITY.md](SECURITY.md) before using browser-local storage. The notebook is not an agent identity, credential store or backend memory service, and it must not be the only copy of valuable information.
