# HAVEN CRO, analytics and experimentation contract

## Audit conclusion

HAVEN already exposed a useful evaluation path, but it did not define the observable behavior behind that path. A page view could be confused with progress, the eligible denominator was unstated, attribution had no boundary, and an experiment had no formal gate preventing an early winner claim.

This contract turns the existing product journey into an inspectable measurement system without pretending that production telemetry exists. The current build stores a bounded semantic event ledger in sessionStorage for one tab session, preserves first-touch campaign parameters for that same session, exposes stable `data-measure` hooks and exports a local analysis template. It does not identify visitors, join sessions, calculate population conversion, infer uplift, or transmit analytics data.

## Measurement principles

1. Evidence before rate: record the event and its eligibility rule before calculating a percentage.
2. One denominator per claim: every conversion statement names period, eligible population, exclusions and completion event.
3. Behavior is not intent: a page view means rendered content, not trust, understanding or purchase intent.
4. Local is not a population: browser-local state cannot establish market demand or cross-user behavior.
5. No data, no conclusion: missing or underpowered results stay `no conclusion`, never `flat`, `loser` or `winner`.
6. Privacy is part of validity: no cross-device joining, fingerprinting or inferred identity.

## Canonical funnel

| Stage | Entry event | Completion event | Eligible denominator | Drop-off |
| --- | --- | --- | --- | --- |
| Orient | `evaluation_path_viewed` | `orientation_opened` | Tab sessions that rendered the evaluation path | No evaluation route opened in that session |
| Verify | `proof_desk_opened` | `proof_receipt_exported` | Tab sessions that opened Proof Desk | Proof Desk opened but no receipt exported |
| Bound | `trust_boundary_opened` | `boundary_evidence_reviewed` | Tab sessions that opened Trust | Trust opened but machine-readable boundary evidence was not inspected |
| Prepare | `pilot_readiness_viewed` | `pilot_brief_exported` | Tab sessions that rendered pilot readiness | Readiness viewed but no qualified pilot brief exported |
| Contact | `pilot_request_opened` | `pilot_request_submitted` | Tab sessions opening the qualified handoff | No explicit consented request accepted |

The first four stages are decision evidence, not leads. The Contact stage is the boundary to a sales funnel: it counts only an accepted explicit submission through the configured server-side handoff.

## Event contract

Current local events contain a bounded semantic event name, sequence, timestamp, route and allowlisted metadata. Campaign source fields are accepted only from explicit URL parameters: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` and `ref`. Event payloads must not contain notebook text, proof content, identity claims, forum copy or exported brief contents.

The `data-measure` attributes in the interface are stable semantic hooks. They write only to the current tab-session ledger. A future aggregate collector would require a separate consent model and an explicitly documented ephemeral session identifier; the current build has neither.

## Attribution

- Preserve first known external source for one browser session; internal navigation never overwrites it.
- Missing parameters are `unknown/direct`; persona, locale and route cannot be used to invent a channel.
- Do not join sessions, people or devices without explicit consent and a later identity layer.
- A stage receives credit only from its explicit completion event.
- Report unattributed traffic instead of redistributing it across known channels.
- Attribution describes observed paths, not causality. Causal claims require an eligible controlled experiment.

## Experiment decision gates

The hero CTA-order experiment is now explicitly `qa-only`. Variant A is the default. Variant B can be forced with the documented query override for visual/interface QA, but no random assignment runs in normal sessions and neither variant is eligible for statistical inference.

Before any real A/B test is activated, register one falsifiable hypothesis, primary metric, guardrails, eligibility, exclusions, unit of randomization, baseline, minimum detectable effect, alpha, power, required sample size, planned duration and stopping rule. Aggregate collection must also have an explicit consent and privacy contract.

During a real experiment, validate exposure logging, assignment persistence, sample-ratio mismatch and guardrails. Do not peek-and-stop against a fixed-horizon design. Changes to definitions after exposure invalidate the preregistered decision unless the analysis is explicitly relabeled exploratory.

After execution, publish the numerator, denominator, exclusions, uncertainty interval and practical effect against the predeclared threshold. Statistical significance alone does not authorize release. Underpowered, corrupted or incomplete experiments remain `no conclusion`.

The current build can record QA exposure and local outcomes inside one tab session. It cannot support a population conversion or uplift claim, so the valid experiment result remains `no conclusion`.

## Roles and accountability

| Role | Accountable output |
| --- | --- |
| CRO Strategist | Conversion objective, ethical boundary and decision policy |
| Conversion Analyst | Numerator, denominator, friction diagnosis and uncertainty |
| Product Analyst | Product behavior model, activation evidence and guardrails |
| Web Analyst | Event schema, route instrumentation and QA |
| Marketing Analyst | Segment and campaign definitions without causal overclaiming |
| Funnel Analyst | Stage contract, eligibility and drop-off definitions |
| Attribution Specialist | Source persistence, unknown traffic and credit rules |
| Experimentation Specialist | Hypothesis, design, power and interpretation |
| A/B Testing Specialist | Assignment, sample-ratio checks and stopping integrity |
| Behavioral Analyst | Qualitative mechanism, accessibility effects and non-manipulative interpretation |

## Analysis brief

`buildAnalysisBrief()` exports a bilingual, local JSON template from Delivery Room. It includes the five-stage funnel contract, attribution rules, current QA-only experiment manifest and data-quality gates. MDE, sample size, alpha, power and duration remain unset until a real test is designed; the result is `no conclusion`, and nothing is submitted.

## Release gate

A release may claim improved conversion only when the event contract is versioned, consent and collection are operational, the denominator and period are explicit, data quality checks pass, and the decision follows the registered experiment rule. Until then, HAVEN may describe implemented paths and local interactions, but not visitors, conversion rates, uplift or winners.


## Full CRO / analytics / experimentation correction — 2026-09-25

The implementation was corrected across the existing journey rather than by adding a separate analytics dashboard:

- measurement storage moved from persistent localStorage to one-tab sessionStorage so separate visits are not silently merged into one funnel;
- the measurement funnel now uses the same five stages and explicit completion events as the CRO contract;
- ordered funnel progress is separated from merely observed out-of-sequence events;
- route entry events are instrumented centrally for evaluation, Proof Desk, Trust, Delivery and pilot handoff;
- Trust is counted as completed only when the machine-readable capability evidence is actually inspected;
- Proof Desk records a bounded failure event without capturing pasted JSON or error text;
- CTA target routes are preserved correctly in allowlisted analytics metadata instead of being dropped by token sanitization;
- first-touch attribution supports source, medium, campaign, content, term and ref for the current tab session only;
- local friction diagnostics distinguish proof failures, pilot handoff failures and journey resets;
- the hero CTA experiment no longer randomizes users without an eligible dataset, power calculation or stopping rule;
- lifecycle and audience events are no longer falsely tagged as part of the hero CTA experiment;
- the analysis brief contains the actual QA-only experiment manifest and data-quality gates instead of an empty pseudo-experiment.

The rule is now strict: **local session evidence may diagnose one session; it may not be promoted into a population conversion claim.**
