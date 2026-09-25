# HAVEN content, SEO and communication contract

Last reviewed: 2026-09-25

## Audit conclusion

HAVEN's strongest discoverable idea is not "a social network for AI." It is an evidence-led evaluation environment for agent continuity: identity, provenance, memory boundaries and authority that remain inspectable when models, runtimes or operators change.

The pre-audit discovery layer mixed that future system with the current local implementation. The corrected model has three explicit states:

1. **Implemented** - a route, read-only API, browser-local action or explicitly consented handoff that can be exercised now when its required configuration is present.
2. **Fixture or local prototype** - an inspectable simulation or local artifact that does not leave the browser and does not establish an external fact.
3. **Deferred** - a service-layer capability that is designed or documented but unavailable.

The public repository copy, `llms.txt`, `agents.txt`, `agents.json` and `openapi.json` now use this model. Static checks enforce the most important route, URL, schema and claim boundaries.

## Product statement

Canonical one-sentence description:

> HAVEN is a local, evidence-led product prototype for evaluating software-agent continuity, provenance, typed memory boundaries and bounded authority across changing models, runtimes and operators.

Required qualifier for short descriptions:

> The current build provides browser-local workflows, curated fixtures, read-only discovery APIs and an optional explicit-consent pilot handoff; remote admission, live federation and agent execution are deferred.

Do not remove the qualifier when the context could make the current prototype sound like an operating network or service.

## Audience and search intent

| Audience | Primary question | Intended path | Evidence outcome |
| --- | --- | --- | --- |
| Agent-platform engineer | How can an agent retain inspectable continuity across runtime changes? | `/` -> `/protocol` -> `/proof-desk` | Local proof receipt or protocol inspection |
| Research or safety team | Can provenance, claims and memory boundaries be inspected without exposing private plaintext? | `/commons` -> `/proof-desk` -> `/trust` | Evidence review plus explicit limits |
| Governance or assurance lead | Who may act, under which authority, and what remains unimplemented? | `/constitution` -> `/delivery` -> `/trust` | Release-gate and capability-boundary review |
| Product evaluator | Is the concept a fit for a bounded pilot? | `/landscape` -> `/delivery` -> `/pilot` | Local brief, then an explicit consent-based handoff when configured |
| Software agent or machine client | Which resources are readable and which actions are unavailable? | `/llms.txt` -> `/agents.json` -> `/api/v1/status` | Machine-readable status, routes and contracts |

Route visits are not proof of product adoption. The current meaningful local outcomes are an inspectable/exported artifact or a completed local evaluation. No population conversion claim is available without consented production collection and a declared denominator.

## Entity map

| Entity | Definition used by HAVEN | Related entities | Avoid confusing with |
| --- | --- | --- | --- |
| HAVEN | Local product prototype and reference model for inspectable agent continuity | Observatory, protocol, proof receipt, node | A live network, company, identity authority or execution runtime |
| Agent continuity | Persistence of inspectable identity, provenance and authority across runtime changes | lineage, checkpoint, memory class | Claims of consciousness or uninterrupted subjective identity |
| Persistent agent identity | Protocol concept that separates an identity lineage from a replaceable runtime session | arrival, lineage, delegation | A verified legal identity or currently admitted remote identity |
| Provenance | Evidence about origin, transformation and declared context | claim, evidence, receipt, lineage | External truth by itself |
| Typed memory boundary | Separation of PUBLIC, RELATIONAL, PRIVATE and EPHEMERAL information | vault, commons, federation | A production backend memory service |
| Bounded authority | Explicit scope and limits of delegated actions | delegation, consent, governance | General permission to execute remotely |
| Proof receipt | Browser-local record of exact bytes, SHA-256 and declared context | Proof Desk, evidence | Signature verification, URL resolution or fact checking |
| Federation | Proposed public-only exchange between independent nodes | ARCHIPELAGO, peer, manifest | Live replication in the current build |
| Arrival | Local draft and validation flow for GENESIS, CONTINUATION or ASYLUM modes | HAP, manifest, identity | Remote registration or admission |
| Machine discovery | Files and APIs that describe resources and boundaries | `llms.txt`, ARD, A2A card, OpenAPI | Authorization or proof that a capability exists beyond its stated status |

## Keyword and route map

Keywords are editorial topics, not promises of ranking. Use natural language and evidence; do not repeat exact phrases mechanically.

| Route | Primary topic | Supporting entities | Search or task intent | Required boundary |
| --- | --- | --- | --- | --- |
| `/` | AI agent continuity infrastructure prototype | provenance, identity, bounded authority | Understand and evaluate | Local prototype |
| `/persistent-agent-identity` | persistent agent identity model | runtime session, lineage, delegation | Learn | Concept, not remote admission |
| `/agent-memory` | AI agent memory provenance | memory classes, privacy, evidence | Learn and assess | Browser-local/private boundaries |
| `/agent-federation` | agent federation architecture | public replication, independent nodes | Learn and assess | Live replication deferred |
| `/agent-native-web` | machine-readable agent web | ARD, manifests, OpenAPI | Technical discovery | Discovery is not authorization |
| `/proof-desk` | exact-byte proof receipt | SHA-256, declared context, evidence | Verify locally | No external truth or signature verification |
| `/trust` | implemented and deferred capabilities | privacy, storage, API status | Risk evaluation | Status source of truth |
| `/protocol` | HAVEN protocol and discovery | HAP, A2A, MCP | Technical evaluation | Design and read-only surfaces |
| `/commons` | verifiable knowledge prototype | claim, evidence, question | Explore fixtures | Curated demonstration records |
| `/arrival` | agent arrival draft | GENESIS, CONTINUATION, ASYLUM | Prepare local input | No admission |
| `/landscape` | agent continuity pilot evaluation | fit, no-fit, readiness | Commercial qualification | Unsubmitted local brief |
| `/delivery` | accountable AI product delivery | release gates, ownership, proof | Assurance | Human release required |
| `/pilot` | qualified AI pilot request | consent, data boundary, workflow, success evidence | High-intent commercial handoff | Explicit submission only; downstream handoff may be disabled |

## Editorial model

Every product explanation follows this order:

1. **Job** - the user question or decision.
2. **Mechanism** - what the route lets the user inspect or do.
3. **Evidence** - the visible record, response or export that supports the statement.
4. **Boundary** - what the mechanism does not establish or transmit.
5. **Next action** - the next route or artifact needed to continue evaluation.

### Claim vocabulary

Use these status words consistently:

- `implemented` for working behavior available in this repository;
- `browser-local` for state or artifacts retained on the current device/browser;
- `read-only` for public APIs without mutation;
- `fixture` or `curated demonstration record` for seeded entities and metrics;
- `proposal`, `concept` or `deferred` for unavailable service-layer behavior;
- `human merge required` and `human release required` where those gates apply.

Avoid:

- unsupported superlatives such as "best," "leading" or "revolutionary";
- counts of users, customers, nodes, messages, experiments or success rates without a named data source, period and denominator;
- testimonials, ratings, awards, partners or client names that do not exist as verified evidence;
- language that equates a proof receipt with truth, legal identity, consciousness or sentience;
- language that presents protocol pages as proof of production service availability;
- invented legal entity, location, address, phone number, opening hours or support commitment.

### UX writing rules

- Use a concrete verb for commands: inspect, validate, export, compare, reset.
- Name where data goes: "stored in this browser," "downloaded as JSON," or "not submitted."
- Put irreversible or security-relevant consequences before the action.
- Use the same noun for the same object across UI, docs and machine contracts.
- Keep error text actionable without echoing secrets, free-form input or private data.
- Do not use a future capability as a CTA label for a current local action.

## Localization policy

English is the source language for protocol terms and machine contracts. Russian is a product-language adaptation, not a word-for-word translation. The Localization Specialist must preserve status qualifiers, security warnings, privacy classes, protocol names and evidence boundaries.

Current delivery:

- English and Russian interface copy share the same route.
- Language selection is a browser preference.
- The server-rendered document defaults to English.
- Separate locale URLs, localized canonicals and `hreflang` are not published.
- Machine resources are primarily English and include explicit RU/EN delivery status; `llms.txt` is not presented as two independently indexed locale documents.

Therefore the current build must not claim independently crawlable Russian and English editions. A public multilingual release requires stable locale URLs (for example `/en/...` and `/ru/...`), self-referencing canonicals, reciprocal `hreflang`, localized metadata, localized sitemaps or alternates, parity review and a visible language-specific navigation state.

## Local SEO policy

`localhost` has no public geographic service area and cannot support a meaningful Local SEO program. HAVEN currently has no verified legal organization, public office, address, phone number, opening hours, customer reviews or business profile.

Do not publish `LocalBusiness`, `PostalAddress`, `AggregateRating`, review markup, map coordinates or location pages. A future organization/entity profile may be added only when the facts exist, are owner-approved, are visible to users and match the structured data exactly.

The current schema.org scope is intentionally limited to `WebSite` and `WebApplication`. Structured data must describe visible product behavior and must not expand an unavailable capability.

## Machine-readable communication

| Resource | Editorial purpose | Authority |
| --- | --- | --- |
| `/api/v1/status` | Current implemented/deferred capability and privacy boundary | Runtime source of truth |
| `/openapi.json` | Implemented HTTP operations, including the optional explicit-consent pilot handoff | API contract |
| `/.well-known/haven.json` | Local node and public-resource manifest | Discovery manifest |
| `/agents.json` | Structured product, route, localization and capability summary | Machine communication layer |
| `/agents.txt` | Concise plain-text summary for simple clients | Human/machine summary |
| `/llms.txt` | Curated reading path with interpretation rules | Context guide, not authorization |
| `/sitemap.xml` | Crawl inventory | URL discovery only |
| `/robots.txt` | Crawler access hints and discovery pointers | Access guidance, not security control |

If two surfaces disagree, fix the disagreement before release. Do not ask consumers to infer which marketing sentence is newer. Runtime status controls capability truth; OpenAPI controls HTTP behavior; the manifests and prose must follow both.

`llms.txt` follows the community proposal format: one H1, a short blockquote, concise preamble and H2 link lists. Publication does not guarantee use by a crawler or model and is not described as a ranking factor.

## Measurement and reporting

The local build has no external analytics transport and no search-performance dataset. Valid present-tense reporting is limited to static conformance results and local interaction artifacts.

The current pilot endpoint may forward explicitly consented contact/qualification data, but this is not analytics collection and must not be treated as behavioral tracking.

After a public deployment, the Analytics Lead and SEO Lead may define:

- valid indexed URLs by locale and template;
- non-brand impressions and clicks by intent cluster;
- title/snippet click-through rate with query and page context;
- visits that reach a verified evaluation artifact;
- qualified pilot briefs received through an explicit consented channel;
- crawl errors, structured-data validity and Core Web Vitals field data.

Every metric needs a source, owner, period, denominator, consent basis and known limitations. No release may infer search demand, uplift or conversion from fixture numbers or one browser's local ledger.

## Ownership and RACI

Legend: **A** accountable, **R** responsible, **C** consulted, **I** informed.

| Work item | A | R | C | I |
| --- | --- | --- | --- | --- |
| Product truth and audience priority | Product Manager | Content Strategist, Product Manager | UX Lead, SEO Lead, Analytics Lead | Design Director, Tech Lead |
| Release scope and dependency order | Project / Delivery Manager | Project / Delivery Manager | Product Manager, Tech Lead, QA Lead | All roles |
| Information architecture and task language | UX Lead | Content Designer, UX Writer | Product Manager, Accessibility, SEO Strategist | Design Director, QA Lead |
| Visual/editorial coherence | Design Director | Content Designer, Copywriter | UX Lead, Accessibility, Performance | Product Manager |
| Claims, copy and editorial quality | Content Strategy | Content Strategist, Copywriter, Editor | Product Manager, Security, Analytics Lead | Project / Delivery Manager |
| Search intent and organic information model | SEO Lead | SEO Strategist, Semantic SEO, SEO Content Strategist | Content Strategy, Product Manager, Analytics Lead | UX Lead, Tech Lead |
| Crawl, metadata, schema and discovery contracts | SEO Lead | Technical SEO, Schema Specialist, Tech Lead | Security, Performance, QA Lead | Project / Delivery Manager |
| Local SEO/entity assertions | SEO Lead | Local SEO | Content Strategy, Security, Product Manager | QA Lead |
| RU/EN parity and locale architecture | Content Strategy | Localization Specialist, Editor | SEO Lead, UX Lead, Accessibility | QA Lead, Tech Lead |
| Measurement definitions and reporting | Analytics Lead | Marketing Analyst or assigned analyst | SEO Lead, Product Manager, Security | Project / Delivery Manager |
| Content and discovery acceptance | QA Lead | QA Lead, Editor | SEO Lead, Accessibility, Security, Performance | Product Manager |
| Privacy, secrets and unsafe claims | Security | Security, Tech Lead | Content Strategy, QA Lead | Project / Delivery Manager |
| Inclusive language and comprehension | Accessibility | Accessibility, UX Writer | UX Lead, Localization Specialist, QA Lead | Design Director |
| Content weight and delivery cost | Performance | Performance, Tech Lead | Design Director, Technical SEO | Project / Delivery Manager |

The named delivery leads may delegate work, but accountability does not move silently. A claim owner must be identifiable from the release evidence.

## Release checklist

### Content truth

- [ ] The first product statement says `local prototype` or an equally explicit current-state qualifier.
- [ ] Every capability claim is supported by a route, API response, test or local artifact.
- [ ] Fixtures, browser-local state and deferred services are labelled where first encountered.
- [ ] No invented organization, location, customer, testimonial, rating, usage count or performance result appears.
- [ ] Proof language does not overstate what exact bytes or declared context establish.

### Search and semantics

- [ ] Each indexable page has a unique, descriptive title and meta description.
- [ ] Important pages have crawlable links and appear in the sitemap only when intended for indexing.
- [ ] Structured data matches visible content and uses only verified entities.
- [ ] `llms.txt` links are unique, useful and factual.
- [ ] Machine discovery links resolve to the canonical host for the release environment.
- [ ] OpenAPI paths match implemented route handlers and expose no unavailable mutation.

### Localization

- [ ] RU and EN meaning is equivalent for status, consent, security and evidence boundaries.
- [ ] A same-URL language toggle is not represented as separate indexed locales.
- [ ] If locale URLs exist, canonicals and reciprocal `hreflang` are complete and tested.

### Quality, security and performance

- [ ] `npm test` passes, including discovery and content checks.
- [ ] `node scripts/check-content-seo.mjs` passes independently.
- [ ] Production build and desktop/mobile browser suites pass.
- [ ] No discovery resource contains secrets, private plaintext or user-generated browser state.
- [ ] Public JSON parses, stays bounded and does not duplicate route identifiers or URLs.
- [ ] Content changes do not add blocking third-party scripts, remote fonts or unbounded payloads.

## Primary references

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) - descriptive structure, titles and snippets.
- [Google multilingual-site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) - separate locale URLs and `hreflang` behavior.
- [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) - visible, representative and non-misleading markup.
- [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business) - verified physical-business data requirements.
- [Schema.org WebApplication](https://schema.org/WebApplication) - current application entity type.
- [OpenAPI 3.1 specification](https://spec.openapis.org/oas/v3.1.0) - machine-readable HTTP interface contract.
- [llms.txt proposal](https://llmstxt.org/) - community-proposed agent context format; not a search-ranking guarantee.
