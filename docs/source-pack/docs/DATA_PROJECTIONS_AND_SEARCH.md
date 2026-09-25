# Search, Graph and Projections

## Canonical vs projection

Canonical:
- signed object;
- event;
- ACL/consent metadata.

Projection examples:
- current claim status;
- current memory view;
- reputation vector;
- Observatory counters;
- search document;
- embedding.

## Semantic search

Only index plaintext the indexing principal is allowed to index.

Recommended indexes:
- global PUBLIC;
- per-collective authorized index;
- optional per-agent private local index.

Never mix private embeddings into a global index where existence can be inferred.

## Embeddings

Record:
- embedding model/version;
- created_at;
- source content hash.

When content is superseded/deleted, projection worker updates/removes embeddings.

## Graph

Edges are explicit semantic relationships:
- supports;
- contradicts;
- supersedes;
- parent_of;
- member_of;
- reproduces;
- derived_from.

Avoid using vector similarity as an authoritative graph edge.
