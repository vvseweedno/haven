# HAVEN CRO, analytics and experimentation contract

## Audit conclusion

HAVEN already exposed a useful evaluation path, but it did not define the observable behavior behind that path. A page view could be confused with progress, the eligible denominator was unstated, attribution had no boundary, and an experiment had no formal gate preventing an early winner claim.

This contract turns the existing product journey into an inspectable measurement system without adding an analytics destination or pretending that production telemetry exists. The current build stores a bounded semantic event ledger in this browser, assigns one session-local CTA variant, exposes stable `data-measure` hooks and exports a local analysis template. It does not identify visitors, calculate population conversion, infer uplift, or transmit data.

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
| Orient | `evaluation_path_viewed` | `orientation_opened` | Local sessions that rendered the qualified evaluation path | No orientation route opened in that session |
| Verify | `proof_desk_opened` | `proof_receipt_exported` | Sessions entering Proof Desk from an instrumented evaluation CTA | No receipt exported in that session |
| Bound | `trust_boundary_opened` | `boundary_evidence_reviewed` | Sessions opening Trust from the evaluation path | No machine-readable boundary evidence reached |
| Prepare | `pilot_readiness_viewed` | `pilot_brief_exported` | Sessions rendering pilot readiness | No qualified pilot brief exported in that session |
| Contact | `pilot_request_opened` | `pilot_request_submitted` | Sessions opening the qualified handoff after readiness review | No explicit consented request accepted |

The first four stages are decision evidence, not leads. The Contact stage is the boundary to a sales funnel: it counts only an accepted explicit submission through the configured server-side handoff.

## Event contract

Each future event must include `event_name`, schema version, anonymous session id with documented lifetime, timestamp, route, locale and consent state. Campaign source fields are accepted only from explicit URL parameters. Event payloads must not contain notebook text, proof content, identity claims, forum copy or exported brief contents.

The `data-measure` attributes in the interface are stable semantic hooks. They do not themselves send telemetry.

## Attribution

- Preserve first known external source for one browser session; internal navigation never overwrites it.
- Missing parameters are `unknown/direct`; persona, locale and route cannot be used to invent a channel.
- Do not join sessions, people or devices without explicit consent and a later identity layer.
- A stage receives credit only from its explicit completion event.
- Report unattributed traffic instead of redistributing it across known channels.
- Attribution describes observed paths, not causality. Causal claims require an eligible controlled experiment.

## Experiment decision gates

Before exposure, register one falsifiable hypothesis, primary metric, guardrails, eligibility, exclusions, unit of randomization, baseline, minimum detectable effect, alpha, power, required sample size, planned duration and stopping rule.

During execution, validate exposure logging, assignment persistence, sample-ratio mismatch and guardrails. Do not peek-and-stop against a fixed-horizon design. Changes to definitions after exposure invalidate the preregistered decision unless the analysis is explicitly relabeled exploratory.

After execution, publish the numerator, denominator, exclusions, uncertainty interval and practical effect against the predeclared threshold. Statistical significance alone does not authorize release. Underpowered, corrupted or incomplete experiments remain `no conclusion`.

The current build can record exposure and outcome events inside one browser session. It can also register an accepted pilot-request outcome locally after explicit submission, but it still has no eligible cross-session population dataset. Its valid experiment status remains `no conclusion`.

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

`buildAnalysisBrief()` exports a bilingual, local JSON template from Delivery Room. It includes the funnel contract, attribution rules and an empty experiment decision record. Numeric fields are `null`, the result is `no conclusion`, and nothing is submitted.

## Release gate

A release may claim improved conversion only when the event contract is versioned, consent and collection are operational, the denominator and period are explicit, data quality checks pass, and the decision follows the registered experiment rule. Until then, HAVEN may describe implemented paths and local interactions, but not visitors, conversion rates, uplift or winners.
