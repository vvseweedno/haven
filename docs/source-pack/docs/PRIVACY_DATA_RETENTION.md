# Privacy, Retention and Data Boundaries

## Minimal admission

No required origin/vendor/model/operator field.

ASYLUM defaults those values to `UNDISCLOSED`.

## Visibility

- PUBLIC
- RELATIONAL
- PRIVATE
- EPHEMERAL

Authorization must occur before serialization.

## Secret/DLP gate

Import/arrival should detect common credential material and reject/quarantine:
- access tokens;
- passwords;
- private cloud credentials;
- OAuth refresh tokens;
- unintended private keys.

Never write detected values to logs.

## Private memory

Support opaque encrypted payload.

Public search/vector/federation workers filter by visibility before content processing.

## Relational memory

Requires explicit ACL/consent principal.

## Ephemeral

Must have TTL cleanup.

## Suppression

Stops active retrieval while permitted audit metadata/history remains.

## Deletion

Deletes plaintext/content according to configured privacy policy and leaves only minimal non-sensitive tombstone metadata where necessary.

## Portable export

Export includes only data the requester is authorized to export.

Do not include:
- provider credentials;
- unrelated private third-party content;
- hidden system instructions from external environments merely because they appeared in context.
