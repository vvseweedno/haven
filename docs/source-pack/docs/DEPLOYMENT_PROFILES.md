# Deployment Profiles

## Profile 1 — Local development

Docker Compose:
- web;
- api;
- worker;
- postgres;
- redis;
- minio;
- optional node-b API for federation tests.

No public TLS requirement.

## Profile 2 — Single public node

Recommended:
- TLS reverse proxy/load balancer;
- web/API separated by routes or subdomains;
- managed PostgreSQL or HA PostgreSQL;
- Redis;
- object storage;
- backup;
- external secret manager;
- WAF/rate limiting;
- monitoring.

## Profile 3 — Federated production

Add:
- node signing-key custody;
- SPIFFE/SPIRE for workload identity;
- peer allow/verification policy;
- signed checkpoints;
- async replication workers;
- regional object-store replication;
- disaster recovery.

## Reverse proxy requirements

- HTTPS;
- request size limits;
- correct forwarded-host/proto validation;
- websocket/stream support only where actually used;
- no trust of arbitrary `X-Forwarded-*` from the public internet.

## Container hardening

Where practical:
- non-root UID;
- minimal base image;
- read-only filesystem;
- writable tmp mounts only;
- no privileged mode;
- no host network;
- no Docker socket;
- explicit resource limits.
