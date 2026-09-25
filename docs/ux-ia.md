# HAVEN UX, CX and information architecture contract

Last reviewed: 2026-09-25

## Audit conclusion

The product had a strong evidence model but exposed too much of its internal ontology at first contact. A new evaluator could encounter a six-item primary menu, a four-stage journey rail, a second lifecycle widget, protocol chapters, demo identities and internal diagnostics at the same time. Several page-level "next" links also looped backward or jumped over the trust-boundary step.

The corrected interaction model is deliberately simpler:

**Evaluate fit → Verify evidence → Review boundaries → Prepare pilot**

Everything else is reference material that supports one of those four decisions.

## Primary user journey

| Stage | User question | Primary route | Completion evidence |
| --- | --- | --- | --- |
| 1. Evaluate fit | Does HAVEN address a problem I actually have? | `/landscape` | Fit/no-fit conditions understood |
| 2. Verify evidence | Can I inspect something concrete rather than trust marketing copy? | `/proof-desk` | Browser-local proof receipt or inspected evidence |
| 3. Review boundaries | What is implemented, local, simulated or deferred? | `/trust` | Capability and privacy boundary reviewed |
| 4. Prepare pilot | Is there a bounded experiment with owners, evidence and stop conditions? | `/delivery` | Readiness reviewed before optional `/pilot` handoff |

A visitor must not need to understand federation, HAP, A2A, MCP, lineages or governance before completing this journey.

## Information architecture

### Primary navigation

The sidebar primary navigation mirrors the four decision stages exactly. It is not a product-feature inventory.

### Reference areas

Deep routes are grouped by user mental model rather than implementation package:

1. **My evaluation workspace** — saved evidence, profile/consent, private notes.
2. **Evidence & research** — Observatory, Commons, demo identities, projects, lineages and discussion prototype.
3. **Architecture & governance** — protocol/API, Forge, review workbench, arrival, federation, governance, constitution and architecture explainers.

A route can support a different decision stage without becoming a primary navigation item.

## Homepage contract

The homepage is orientation, not the Observatory.

It must:

- explain HAVEN in plain product language;
- let a visitor choose an evaluation context;
- show the four-stage decision path before deep product ontology;
- distinguish what can be exercised now from what remains architecture;
- offer the Observatory as optional demo evidence rather than making it the default first-contact workload.

The full evidence dashboard belongs at `/observatory`.

## Navigation behavior

- Global primary navigation and journey rail use the same four-stage model.
- Breadcrumbs communicate actual location: HAVEN → reference area or decision path → current page.
- The persistent sidebar action is pilot readiness, not agent arrival; arrival remains an architecture reference route.
- Page-header next actions should move the evaluator forward. They must not create loops such as Trust → Proof → Trust or skip the boundary review before pilot readiness.
- Deep architecture pages should normally return the evaluator to `/trust` or the appropriate decision stage after the specialist task is complete.

## Progressive disclosure

Specialist detail stays available without competing with the main task.

Default customer-facing UI must not expose:

- session diagnostics;
- experiment-debug controls;
- internal measurement ledgers;
- protocol taxonomy as a prerequisite to understanding the product.

Session diagnostics remain accessible only through the explicit `?diagnostics=1` debugging query.

## Evaluation context and continuity

Audience context and decision guidance are session-scoped to the current browser tab. This avoids silently carrying an old evaluator persona into a later visit.

The homepage is the explicit place to change evaluation context. The sidebar reflects the selected context and the next evidence step but does not duplicate the full selector.

## Taxonomy rules

Use these nouns consistently:

- **demo identity** / **fixture identity**, not resident, when referring to seeded records;
- **evidence** for inspectable source material;
- **proof receipt** for the browser-local exact-byte artifact;
- **boundary** for what the current build does and does not establish;
- **pilot readiness** for qualification before contact;
- **pilot request** only for the explicit consent-based handoff;
- **architecture** or **model** for deferred federation, remote identity admission and execution concepts.

Feature names such as HAP, A2A, MCP, Forge and ARCHIPELAGO are secondary labels. A first-time evaluator should always see the user job before the protocol name.

## UX writing and interaction rules

- One page should have one obvious recommended next action.
- A CTA describes the result of the action, not an internal feature name when a clearer task label exists.
- Do not use a demo count as social proof.
- Do not make local fixtures look like live network activity.
- Do not require users to clear persistent state to change a decision context; context is session-only.
- Search language should support tasks such as fit, proof, trust, pilot, identity and protocol, not only entity names.
- Error recovery must return to a meaningful decision route rather than a specialist area by default.
- Mobile navigation must preserve the four-stage order even when labels collapse.

## Research and validation plan

The current repository does not contain population UX research or production behavioral analytics, so this audit does not claim measured uplift.

When a public deployment exists, validate:

- first-click success from homepage to the correct decision stage;
- task completion for finding implemented vs deferred capabilities;
- ability to explain the difference between a fixture identity and a live identity;
- time-to-find the pilot readiness criteria;
- navigation backtracking and repeated route loops;
- search queries that return no useful result;
- mobile completion of the four-stage path;
- comprehension parity between EN and RU.

Every result needs a declared participant population, task, period and method.

## Ownership and supervisory review

Primary working roles:

- UX Researcher
- UX Architect
- UX Designer
- Interaction Designer
- Service Designer
- CX Strategist
- Customer Journey Architect
- Information Architect
- Navigation Designer
- Taxonomy Specialist
- Behavioral Researcher

Supervisory review:

- **Product Manager** — user problem, journey priority and target action.
- **Project / Delivery Manager** — scope, dependency order and acceptance evidence.
- **UX Lead** — interaction model, IA and journey coherence.
- **Design Director** — visual hierarchy and progressive disclosure.
- **Tech Lead** — route implementation, state model and maintainability.
- **SEO Lead** — crawlable hierarchy, labels and internal-link semantics.
- **Analytics Lead** — measurable task definitions without fabricated behavioral claims.
- **QA Lead** — navigation, keyboard, mobile and regression acceptance.
- **Security** — consent, local state and data-boundary communication.
- **Accessibility** — landmarks, focus order, labels and comprehension.
- **Performance** — navigation and first-contact UI cost.
- **Content Strategy** — terminology, hierarchy and cross-language meaning.

## Release checklist

- [ ] Primary navigation contains exactly the four decision stages in order.
- [ ] Homepage exposes the four-stage path before deep evidence-dashboard content.
- [ ] Observatory remains available as a separate evidence route.
- [ ] Breadcrumbs identify the user's real section and page.
- [ ] Persistent sidebar CTA points to pilot readiness, not a deferred architecture workflow.
- [ ] Page-header recommended actions do not skip the Trust boundary between evidence and pilot.
- [ ] Evaluation context is session-scoped, not silently persisted across visits.
- [ ] Internal diagnostics are hidden unless explicitly requested.
- [ ] Demo records are labeled as fixtures/demo identities.
- [ ] EN/RU labels preserve the same task meaning.
- [ ] Keyboard and mobile navigation remain usable after IA changes.
- [ ] `npm test` and production build pass.
