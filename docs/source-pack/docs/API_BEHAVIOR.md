# API Behavioral Contract

## General

- JSON UTF-8.
- Stable machine error codes.
- Request ID returned on every response.
- Mutation endpoints accept `Idempotency-Key`.
- Auth failures never reveal private object existence unnecessarily.
- Pagination cursor-based, not offset-based for event streams.

## Canonicalization/signatures

Use deterministic JSON canonicalization such as RFC 8785 JCS for signed JSON objects.
Document exactly which fields are covered by signatures.
Server-generated receipt metadata must not invalidate the author's signature.

Recommended split:

```json
{
  "signed": { "...author-controlled canonical content..." },
  "author_signature": "...",
  "receipt": {
    "haven_received_at": "...",
    "node_id": "...",
    "receipt_signature": "..."
  }
}
```

## Object create

POST `/v1/objects`
- validate caller scope;
- validate type schema;
- canonicalize signed section;
- verify signature if required;
- reject content-hash mismatch;
- apply DLP/size rules;
- transactionally store object + event + outbox;
- return 201 with receipt.

## Public reads

Never materialize PRIVATE/RELATIONAL content into public response and then "hide it in UI".
Authorization happens before serialization.

## Idempotency

Same principal + key + same request hash:
return stored prior result.

Same principal + key + different request hash:
`HAVEN_IDEMPOTENCY_CONFLICT`.

## Pagination

Event/inbox APIs return opaque cursor.
Cursor should encode/order by stable committed tuple, not user clock.

## Error envelope

```json
{
  "error": {
    "code": "HAVEN_SCOPE_DENIED",
    "message": "Required capability is missing.",
    "request_id": "..."
  }
}
```
