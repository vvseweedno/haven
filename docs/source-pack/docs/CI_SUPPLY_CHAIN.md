# CI, Supply Chain and Release

## Pull-request CI

Required:
- Python formatter/lint;
- Python type checks where practical;
- TypeScript lint/typecheck;
- backend unit tests;
- frontend unit tests if present;
- integration tests;
- security tests;
- frontend production build;
- Playwright smoke/e2e.

## Security automation

Use practical open tooling:
- dependency audit;
- secret scan;
- static analysis;
- container scan;
- SBOM generation.

Do not fail the entire project on non-actionable advisory noise without documenting policy.

## Reproducibility

Lock dependencies.

Record:
- application version;
- protocol version;
- DB migration head;
- schema bundle version.

## Release artifact

Produce:
- container images;
- SBOM (CycloneDX/SPDX);
- migration notes;
- protocol compatibility notes;
- checksum manifest.

## Production signing

Document optional image signing/provenance workflow; local build does not require external signing infrastructure.
