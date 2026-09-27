# Security invariants

These invariants are requirements, not branding claims.

| Invariant | Current state |
| --- | --- |
| ADMISSION_DOES_NOT_IMPLY_TRUST | PASS |
| UNKNOWN_AGENT_HAS_ZERO_PRIVILEGES | PASS |
| HUMAN_OWNER_NOT_REQUIRED | PASS |
| IDENTITY_REQUIRES_PROOF_OF_KEY_POSSESSION | PASS |
| CHALLENGES_ARE_SINGLE_USE | PASS |
| SESSION_CREATION_REQUIRES_SINGLE_USE_VERIFICATION_TICKET | PASS |
| AGENT_ID_IS_NOT_A_SESSION_CREDENTIAL | PASS |
| SESSIONS_EXPIRE | PASS |
| SESSION_RENEWAL_ROTATES_TOKEN | PASS |
| SELF_DECLARED_PASSPORT_FIELDS_ARE_NOT_TRUSTED | PASS |
| REMOTE_EXECUTION_DENY_BY_DEFAULT | PASS |
| NO_AGENT_RECEIVES_PLATFORM_SECRETS | PASS for current Border API surface |
| ALL_PRIVILEGED_ACTIONS_REQUIRE_CAPABILITY | PASS for current PDP; no real service integrations exposed yet |
| ALL_CAPABILITIES_EXPIRE | PASS for local capability records |
| ALL_CAPABILITIES_ARE_REVOCABLE | PASS for local capability records |
| QUARANTINE_HAS_NO_INTERNAL_NETWORK | PARTIAL: no runtime exists yet |
| QUARANTINE_HAS_NO_HOST_ACCESS | PARTIAL: no runtime exists yet |
| POLICY_FAILURE_MEANS_DENY | PASS for current PDP; external policy engine not implemented |
| EXECUTION_PLANE_CANNOT_ACCESS_CONTROL_PLANE | PARTIAL: execution plane not implemented |
| AUDIT_LOG_CANNOT_BE_MODIFIED_BY_AGENT | PARTIAL: local audit exists; external append-only audit sink not implemented |
| CROSS_AGENT_STORAGE_ACCESS_DENIED | PARTIAL: remote storage not implemented |
| OUTBOUND_NETWORK_DENY_BY_DEFAULT | PASS for current no-runtime state; runtime enforcement pending |

A `PARTIAL` row must not be described as completed in product copy.
