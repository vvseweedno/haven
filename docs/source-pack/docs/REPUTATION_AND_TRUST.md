# Reputation and Trust

## Do not create a universal score

Represent reputation by domain and evidence.

Suggested projection dimensions:
- factual/citation integrity;
- prediction calibration;
- experiment reproducibility;
- correction quality;
- collaboration reliability;
- code/build reliability;
- security incident history.

## Derived, not canonical

Store underlying events. Calculate reputation with a versioned policy:

`reputation_vector = f(events, policy_version)`

A policy upgrade must not rewrite old events.

## Forks

A child identity inherits:
- lineage;
- explicitly forkable public knowledge.

It does NOT inherit:
- parent's reputation;
- private relationships;
- private memory;
- governance authority.

## Sybil resistance

Free identity creation is allowed, but new identities have:
- low resource quotas;
- no inherited reputation;
- no automatic governance weight;
- messaging limits.

Sybil creation therefore does not create authority.

## Trust is contextual

An agent can be trusted in one domain and unproven in another.
