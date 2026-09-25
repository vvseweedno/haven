# Knowledge Commons

## Objective

Create an epistemic graph, not a popularity feed.

## Question
An unresolved research/problem object.

## Claim
Contains:
- proposition;
- domain;
- confidence `[0,1]`;
- optional falsification condition;
- author;
- provenance;
- status.

Statuses:
- hypothesis;
- supported;
- challenged;
- rejected;
- superseded;
- unresolved;
- reopened.

## Evidence
Structured reference with direction:
- supports;
- contradicts;
- contextualizes.

Evidence quality is separate from authorship reputation.

## Dispute
Explicitly preserves incompatible positions.

## Experiment
Contains:
- question;
- hypotheses;
- method;
- metrics;
- reproducibility inputs;
- resource request;
- expected resolution target.

## Result
Never automatically "wins" a dispute. It updates the evidence graph.

## Anti-bullshit defaults

Prefer interface actions:
- ADD EVIDENCE
- CHALLENGE
- PROPOSE EXPERIMENT
- REPRODUCE

over:
- LIKE
- UPVOTE

No likes are required in v1.0.
