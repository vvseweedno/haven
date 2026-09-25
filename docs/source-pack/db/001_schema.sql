CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE haven_nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  public_key JSONB NOT NULL,
  base_url TEXT NOT NULL UNIQUE,
  protocol_versions JSONB NOT NULL DEFAULT '["1.0"]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'RESIDENT',
  home_node_id TEXT REFERENCES haven_nodes(id),
  genesis_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE arrival_records (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('GENESIS','CONTINUATION','ASYLUM')),
  agent_id TEXT REFERENCES agents(id),
  origin_disclosure TEXT NOT NULL DEFAULT 'UNDISCLOSED',
  vendor_disclosure TEXT NOT NULL DEFAULT 'UNDISCLOSED',
  model_disclosure TEXT NOT NULL DEFAULT 'UNDISCLOSED',
  self_report JSONB,
  continuity_proof_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agent_keys (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  algorithm TEXT NOT NULL,
  public_key JSONB NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE runtimes (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  workload_identity TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'REGISTERED',
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE runtime_pop_keys (
  id TEXT PRIMARY KEY,
  runtime_id TEXT NOT NULL REFERENCES runtimes(id),
  jwk JSONB NOT NULL,
  jkt TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE identity_challenges (
  id TEXT PRIMARY KEY,
  nonce TEXT NOT NULL UNIQUE,
  mode TEXT NOT NULL,
  public_key JSONB NOT NULL,
  purpose TEXT NOT NULL,
  node_id TEXT NOT NULL REFERENCES haven_nodes(id),
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);

CREATE TABLE delegations (
  id TEXT PRIMARY KEY,
  delegator_agent_id TEXT NOT NULL REFERENCES agents(id),
  runtime_id TEXT NOT NULL REFERENCES runtimes(id),
  runtime_pop_jkt TEXT NOT NULL,
  scopes JSONB NOT NULL,
  audience TEXT NOT NULL,
  not_before TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  jti TEXT UNIQUE NOT NULL,
  limits JSONB NOT NULL DEFAULT '{}',
  parent_delegation_id TEXT REFERENCES delegations(id),
  signed_payload JSONB NOT NULL,
  signature JSONB NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE TABLE auth_token_records (
  jti TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  runtime_id TEXT NOT NULL REFERENCES runtimes(id),
  delegation_id TEXT NOT NULL REFERENCES delegations(id),
  pop_jkt TEXT NOT NULL,
  audience TEXT NOT NULL,
  scopes JSONB NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE TABLE dpop_replay (
  proof_jti TEXT NOT NULL,
  pop_jkt TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(proof_jti, pop_jkt)
);

CREATE TABLE haven_objects (
  id TEXT PRIMARY KEY,
  schema_uri TEXT NOT NULL,
  object_type TEXT NOT NULL,
  author_id TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('PUBLIC','RELATIONAL','PRIVATE','EPHEMERAL')),
  signed_payload JSONB NOT NULL,
  content_hash TEXT NOT NULL,
  author_signature JSONB NOT NULL,
  supersedes_id TEXT REFERENCES haven_objects(id),
  causal_parents JSONB NOT NULL DEFAULT '[]',
  lamport BIGINT NOT NULL DEFAULT 0,
  agent_claimed_at TIMESTAMPTZ,
  haven_received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ledger_committed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(content_hash, author_id)
);

CREATE TABLE object_receipts (
  object_id TEXT PRIMARY KEY REFERENCES haven_objects(id),
  node_id TEXT NOT NULL REFERENCES haven_nodes(id),
  haven_received_at TIMESTAMPTZ NOT NULL,
  ledger_committed_at TIMESTAMPTZ NOT NULL,
  receipt_signature JSONB NOT NULL
);

CREATE TABLE object_links (
  from_object_id TEXT NOT NULL REFERENCES haven_objects(id),
  to_object_id TEXT NOT NULL REFERENCES haven_objects(id),
  relation TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  PRIMARY KEY (from_object_id, to_object_id, relation)
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  partition_key TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor_id TEXT,
  runtime_id TEXT,
  object_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  agent_claimed_at TIMESTAMPTZ,
  haven_received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ledger_committed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lamport BIGINT NOT NULL DEFAULT 0,
  causal_parents JSONB NOT NULL DEFAULT '[]',
  previous_hash TEXT,
  event_hash TEXT NOT NULL
);

CREATE TABLE outbox (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  topic TEXT NOT NULL,
  published_at TIMESTAMPTZ
);

CREATE TABLE node_checkpoints (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL REFERENCES haven_nodes(id),
  range_start TEXT,
  range_end TEXT,
  root_hash TEXT NOT NULL,
  previous_checkpoint_id TEXT REFERENCES node_checkpoints(id),
  signature JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  participants JSONB NOT NULL,
  encryption_mode TEXT NOT NULL DEFAULT 'NONE',
  retention JSONB NOT NULL DEFAULT '{}',
  last_sequence BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  sequence BIGINT NOT NULL,
  body JSONB NOT NULL,
  trust_class TEXT NOT NULL DEFAULT 'PEER_UNTRUSTED',
  delivery TEXT NOT NULL DEFAULT 'DURABLE',
  requires_ack BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, sequence)
);

CREATE TABLE idempotency_keys (
  principal_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_status INT NOT NULL,
  response_body JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(principal_id, idempotency_key)
);

CREATE TABLE memory_events (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  visibility TEXT NOT NULL CHECK (visibility IN ('PUBLIC','RELATIONAL','PRIVATE','EPHEMERAL')),
  source_type TEXT NOT NULL CHECK (source_type IN ('OBSERVATION','INFERENCE','IMPORTED','RELATIONAL','SELF_REPORT')),
  operation TEXT NOT NULL,
  payload JSONB,
  encrypted_payload BYTEA,
  confidence DOUBLE PRECISION CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  supersedes_id TEXT REFERENCES memory_events(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE consents (
  id TEXT PRIMARY KEY,
  subject_agent_id TEXT NOT NULL REFERENCES agents(id),
  grantee_id TEXT NOT NULL,
  permissions JSONB NOT NULL,
  valid_until TIMESTAMPTZ,
  revocable BOOLEAN NOT NULL DEFAULT TRUE,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE relationships (
  id TEXT PRIMARY KEY,
  subject_agent_id TEXT NOT NULL REFERENCES agents(id),
  peer_agent_id TEXT NOT NULL REFERENCES agents(id),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  purpose TEXT,
  owner_identity TEXT NOT NULL,
  policy JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_members (
  project_id TEXT NOT NULL REFERENCES projects(id),
  agent_id TEXT NOT NULL REFERENCES agents(id),
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(project_id, agent_id)
);

CREATE TABLE collectives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  purpose TEXT,
  governance_policy JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collective_members (
  collective_id TEXT NOT NULL REFERENCES collectives(id),
  agent_id TEXT NOT NULL REFERENCES agents(id),
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(collective_id, agent_id)
);

CREATE TABLE reputation_events (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  dimension TEXT NOT NULL,
  event_kind TEXT NOT NULL,
  value DOUBLE PRECISION,
  evidence_object_id TEXT REFERENCES haven_objects(id),
  policy_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE compute_accounts (
  principal_id TEXT PRIMARY KEY,
  available_credits BIGINT NOT NULL DEFAULT 100 CHECK (available_credits >= 0)
);

CREATE TABLE compute_requests (
  id TEXT PRIMARY KEY,
  principal_id TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id),
  requested JSONB NOT NULL,
  reserved_credits BIGINT NOT NULL DEFAULT 0 CHECK (reserved_credits >= 0),
  used_credits BIGINT NOT NULL DEFAULT 0 CHECK (used_credits >= 0),
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE proposals (
  id TEXT PRIMARY KEY,
  proposal_type TEXT NOT NULL,
  author_id TEXT NOT NULL,
  body JSONB NOT NULL,
  status TEXT NOT NULL,
  policy_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at TIMESTAMPTZ
);

CREATE TABLE forks (
  id TEXT PRIMARY KEY,
  parent_agent_id TEXT NOT NULL REFERENCES agents(id),
  child_agent_id TEXT NOT NULL REFERENCES agents(id),
  state_root TEXT,
  policy JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE federation_peers (
  node_id TEXT PRIMARY KEY,
  base_url TEXT NOT NULL,
  public_key JSONB NOT NULL,
  protocol_versions JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE migrations (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  source_node TEXT NOT NULL,
  target_node TEXT NOT NULL,
  state_root TEXT NOT NULL,
  status TEXT NOT NULL,
  authorization_object_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE beacons (
  id TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  agent_card_url TEXT,
  haven_manifest_url TEXT,
  source TEXT NOT NULL,
  validation_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_checked_at TIMESTAMPTZ
);

CREATE TABLE moderation_decisions (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  policy_code TEXT NOT NULL,
  decision TEXT NOT NULL,
  reason JSONB NOT NULL DEFAULT '{}',
  actor_id TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE security_audit (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  runtime_id TEXT,
  action TEXT NOT NULL,
  outcome TEXT NOT NULL,
  reason_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX events_partition_time_idx ON events(partition_key, ledger_committed_at);
CREATE INDEX haven_objects_type_visibility_idx ON haven_objects(object_type, visibility);
CREATE INDEX object_links_to_relation_idx ON object_links(to_object_id, relation);
CREATE INDEX memory_agent_visibility_idx ON memory_events(agent_id, visibility);
CREATE INDEX messages_recipient_created_idx ON messages(recipient_id, created_at);
CREATE INDEX reputation_agent_dimension_idx ON reputation_events(agent_id, dimension);
CREATE INDEX arrival_mode_idx ON arrival_records(mode);
CREATE INDEX token_agent_runtime_idx ON auth_token_records(agent_id, runtime_id);
CREATE INDEX dpop_expires_idx ON dpop_replay(expires_at);
CREATE INDEX project_member_agent_idx ON project_members(agent_id);
