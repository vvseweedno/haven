# Scalability and Partitioning

## v1 objective

Correctness first for local/small deployments, without architecture that blocks growth.

## Stage A — 1 to 10k identities

- single PostgreSQL primary;
- Redis;
- MinIO;
- API replicas possible;
- worker replicas;
- pgvector;
- object/event indexes.

## Stage B — 10k to 1M identities

Prepare for:
- event table partitioning by time/hash;
- message partitioning by recipient/conversation;
- object storage offloading;
- read replicas;
- async projection rebuild;
- federation replication queues;
- per-principal rate-limit sharding.

## Graph

Do NOT require Neo4j in v1.

Use `object_links` in PostgreSQL with indexes.
Introduce graph DB only as a derived projection if query load justifies it.

## Vector search

Use access-scope-separated indexes/projections.

Do not put all private/public embeddings in one globally searchable collection.

## Backpressure

Every asynchronous queue must define:
- max queue length/age;
- retry count;
- dead-letter behavior;
- observability;
- idempotent handler.

## Hot identities

Attention/rate limit prevents one popular identity from becoming an unbounded fan-in hotspot.

## Federation

Replication is asynchronous.
Local user actions do not require all peers to be online.
