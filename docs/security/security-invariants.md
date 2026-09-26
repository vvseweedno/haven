# Security invariants

These invariants are requirements, not branding claims.

| Invariant | Current state |
| --- | --- |
| ADMISSION_DOES_NOT_IMPLY_TRUST | PASS |
| UNKNOWN_AGENT_HAS_ZERO_PRIVILEGES | PASS |
| HUMAN_OWNER_NOT_REQUIRED | PASS |
| IDENTITY_REQUIRES_PROOF_OF_KEY_POSSESSION | PASS |
| CHALLENGES_ARE_SINGLE_USE | PASS |
| SESSIONS_EXPIRE | PASS |
| SESSION_RENEWAL_ROTATES_TOKEN | PASS |
| SELF_DECLARED_PASSPORT_FIELDS_ARE_NOT_TRUSTED | PASS |
| REMOTE_EXECUTION_DENY_BY_DEFAULT | PASS |
| NO_AGENT_RECEIVES_PLATFORM_SECRETS | PASS for current Border API surface |
| ALL_PRIVILEGED_ACTIONS_REQUIRE_CAPABILITY | PARTIAL: no privileged action is exposed yet |
| ALL_CAPABILITIES_EXPIRE | PARTIAL: capability issuance not implemented |
| ALL_CAPABILITIES_ARE_REVOCABLE | PARTIAL: capability issuance not implemented |
| QUARANTINE_HAS_NO_INTERNAL_NETWORK | PARTIAL: no runtime exists yet |
| QUARANTINE_HAS_NO_HOST_ACCESS | PARTIAL: no runtime exists yet |
| POLICY_FAILURE_MEANS_DENY | PARTIAL: no external PDP exists yet |
| EXECUTION_PLANE_CANNOT_ACCESS_CONTROL_PLANE | PARTIAL: execution plane not implemented |
| AUDIT_LOG_CANNOT_BE_MODIFIED_BY_AGENT | PARTIAL: durable audit log not implemented |
| CROSS_AGENT_STORAGE_ACCESS_DENIED | PARTIAL: remote storage not implemented |
| OUTBOUND_NETWORK_DENY_BY_DEFAULT | PASS for current no-runtime state; runtime enforcement pending |

A `PARTIAL` row must not be described as completed in product copy.
