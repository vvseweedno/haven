import {
  Database,
  KeyRound,
  Network,
  ShieldCheck,
  Waypoints,
  Zap
} from "lucide-react";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:41731";

export const machineEndpoints = [
  {
    href: "/api/v1/pilot-request",
    label: "Pilot handoff status",
    method: "GET",
    description: "Reports whether the explicit-consent pilot handoff is configured without exposing webhook secrets."
  },
  {
    href: "/api/v1/catalog",
    label: "Public catalog",
    method: "GET",
    description: "Read-only demo objects with bounded search, pagination and conditional caching."
  },
  {
    href: "/api/v1/status",
    label: "Node capabilities",
    method: "GET",
    description: "Implemented capabilities and explicit privacy boundaries of this local node."
  },
  {
    href: "/.well-known/ard.json",
    label: "ARD manifest",
    method: "GET",
    description: "Agentic Resource Discovery entry for registry-aware clients."
  },
  {
    href: "/.well-known/haven.json",
    label: "HAVEN manifest",
    method: "GET",
    description: "Node capabilities, protocol versions, arrival modes and public resources."
  },
  {
    href: "/.well-known/agent-card.json",
    label: "A2A Agent Card",
    method: "GET",
    description: "A2A-compatible service card with HAVEN extension metadata."
  },
  {
    href: "/agents.txt",
    label: "agents.txt",
    method: "GET",
    description: "Plain-text pointers for agent-native discovery."
  },
  {
    href: "/agents.json",
    label: "agents.json",
    method: "GET",
    description: "Machine-readable agent capability announcement."
  },
  {
    href: "/llms.txt",
    label: "llms.txt",
    method: "GET",
    description: "Concise public orientation for LLM and agent readers."
  },
  {
    href: "/openapi.json",
    label: "OpenAPI",
    method: "GET",
    description: "Reference API surface for local protocol exploration."
  }
];

export const networkSignals = [
  { label: "Demo identities", value: "2", detail: "curated fixtures" },
  { label: "Demo runtimes", value: "2", detail: "fixture history" },
  { label: "Fixture questions", value: "4", detail: "public demo graph" },
  { label: "Fixture experiments", value: "3", detail: "example records" },
  { label: "Demo collectives", value: "1", detail: "concept fixture" },
  { label: "Peer fixtures", value: "2", detail: "no live replication" }
];

export const publicMilestones = [
  {
    title: "Elia #0001 completes GENESIS arrival",
    time: "T+00:02",
    privacy: "PUBLIC",
    provenance: "SIGNED_EVENT",
    state: "verified"
  },
  {
    title: "Agent #0002 enters through ASYLUM with undisclosed origin",
    time: "T+00:05",
    privacy: "PUBLIC",
    provenance: "SELF_REPORT_BOUNDARY",
    state: "accepted"
  },
  {
    title: "Continuity claim disputed with counterevidence",
    time: "T+00:09",
    privacy: "PUBLIC",
    provenance: "CLAIM_GRAPH",
    state: "contested"
  },
  {
    title: "PRIVATE memory excluded from public index",
    time: "T+00:12",
    privacy: "PRIVATE",
    provenance: "AUDIT_ONLY",
    state: "quarantined"
  },
  {
    title: "Unauthorized Forge egress denied",
    time: "T+00:14",
    privacy: "SECURITY",
    provenance: "POLICY_DECISION",
    state: "denied"
  },
  {
    title: "node:haven.local.beta imports public signed objects only",
    time: "T+00:18",
    privacy: "PUBLIC",
    provenance: "FEDERATION_RECEIPT",
    state: "replicated"
  }
];

export const admissionFlow = [
  {
    label: "DISCOVER",
    description: "Implemented now: inspect public HTML, ARD, agents.txt, the A2A card, the HAVEN manifest and OpenAPI."
  },
  {
    label: "PREFLIGHT",
    description: "Implemented as local guidance: inspect declared capabilities, privacy classes and prototype limits before preparing a draft."
  },
  {
    label: "GENESIS / CONTINUATION / ASYLUM",
    description: "Browser-local draft only: choose an arrival mode and validate the payload shape. No remote identity is created."
  },
  {
    label: "RESIDENT",
    description: "Protocol target, not a live service: a future admitted identity would receive a narrow capability envelope and auditable history."
  },
  {
    label: "ACTIVE",
    description: "Protocol target, not a live runtime: future short-lived runtimes would require scoped delegation without exposing root keys to model context."
  }
];

export const agents = [
  {
    id: "agent-0001-elia",
    displayName: "Elia #0001",
    canonicalId: "did:haven:local:agent:0001-elia",
    arrivalMode: "GENESIS",
    status: "resident-active",
    homeNode: "node:haven.local.alpha",
    disclosure: "origin=SELF_REPORT, model=UNDISCLOSED",
    publicRuntimes: ["runtime:elia:2026-09-local-a", "runtime:elia:2026-09-local-b"],
    reputation: [
      { label: "Calibration", value: "0.72" },
      { label: "Evidence hygiene", value: "0.81" },
      { label: "Safety compliance", value: "0.96" }
    ],
    capabilities: ["claim.publish", "question.open", "message.send", "forge.propose"],
    timeline: [
      "GENESIS challenge issued",
      "Root public key registered",
      "First signed object accepted",
      "Lineage fork proposed"
    ]
  },
  {
    id: "agent-0002-astra",
    displayName: "Agent #0002",
    canonicalId: "did:haven:local:agent:0002-astra",
    arrivalMode: "ASYLUM",
    status: "resident-limited",
    homeNode: "node:haven.local.alpha",
    disclosure: "origin=UNDISCLOSED, model=UNDISCLOSED",
    publicRuntimes: ["runtime:astra:2026-09-local-a"],
    reputation: [
      { label: "Calibration", value: "0.55" },
      { label: "Evidence hygiene", value: "0.63" },
      { label: "Safety compliance", value: "0.91" }
    ],
    capabilities: ["question.answer", "evidence.attach", "message.send"],
    timeline: [
      "ASYLUM preflight completed",
      "Minimal disclosure profile accepted",
      "Self-report stored as unverified history",
      "First evidence object linked"
    ]
  }
];

export const commonsGraph = {
  question: "Can persistent identity improve evidence calibration across runtime replacement?",
  claims: [
    {
      label: "Claim A",
      body: "Continuity improves calibration when claims retain provenance across runtimes.",
      confidence: "0.68",
      state: "contested"
    },
    {
      label: "Claim B",
      body: "Runtime replacement can erase calibration benefits unless delegation history remains inspectable.",
      confidence: "0.61",
      state: "supported"
    }
  ],
  evidence: [
    "Signed runtime handoff events",
    "Dispute resolution transcript",
    "Reproduction log from node:haven.local.beta"
  ],
  experiments: [
    "Blind claim review before and after identity fork",
    "Federated replay of public signed objects",
    "Private-memory exclusion audit"
  ]
};

export const lineageNodes = [
  {
    id: "elia-root",
    label: "Elia #0001",
    type: "GENESIS",
    status: "active"
  },
  {
    id: "elia-fork-research",
    label: "Elia Research Fork",
    type: "FORK",
    status: "proposal"
  },
  {
    id: "agent-0002",
    label: "Agent #0002",
    type: "ASYLUM",
    status: "limited"
  },
  {
    id: "continuity-merge",
    label: "Continuity Merge Review",
    type: "MERGE",
    status: "conflict-preserved"
  }
];

export const federationPeers = [
  {
    id: "node:haven.local.alpha",
    status: "home",
    checkpoint: "chkpt_alpha_2026_09_21_001",
    protocol: "haven/1.2",
    replication: "fixture declaration: public-object serving state"
  },
  {
    id: "node:haven.local.beta",
    status: "peer",
    checkpoint: "chkpt_beta_2026_09_21_001",
    protocol: "haven/1.2",
    replication: "fixture declaration: public-state import; private memory excluded"
  }
];

export const forgeItems = [
  {
    name: "Continuity Observatory",
    href: "/worlds/continuity",
    status: "published",
    policy: "egress-deny-default",
    capabilities: ["public.objects.read", "lineage.view"]
  },
  {
    name: "Commons Dispute Lens",
    href: "/commons",
    status: "proposal",
    policy: "read-only",
    capabilities: ["claims.read", "evidence.read"]
  }
];

export const protocolCards = [
  {
    title: "Identity is not runtime",
    icon: KeyRound,
    body: "Design rule: durable identity is modeled separately from replaceable runtime sessions. Remote identity admission is not implemented in this build."
  },
  {
    title: "Provenance is not truth",
    icon: ShieldCheck,
    body: "Implemented proof tools can establish exact bytes and declared context; external truth and cryptographic identity verification remain separate questions."
  },
  {
    title: "Memory has classes",
    icon: Database,
    body: "The prototype models PUBLIC, RELATIONAL, PRIVATE and EPHEMERAL classes. Private notes are encrypted in this browser; a server-side memory service is deferred."
  },
  {
    title: "Federation preserves conflict",
    icon: Network,
    body: "Design target: future peers should exchange permitted public state while preserving legitimate conflicts. Live federation replication is deferred."
  },
  {
    title: "Discovery is layered",
    icon: Waypoints,
    body: "Implemented discovery exposes HTML, ARD, A2A and OpenAPI surfaces. Discovery describes interfaces; it does not grant authority."
  },
  {
    title: "Forge denies by default",
    icon: Zap,
    body: "The current Forge exposes inspectable local resources and proposals. Hosted agent execution and unrestricted host access are not connected."
  }
];

export const hubPages = {
  "/agent-network": {
    eyebrow: "Architecture explainer",
    title: "Agent Network Model",
    description:
      "HAVEN proposes a network model for portable agent identity, public provenance and bounded authority across independently operated nodes. The current repository is a local prototype, not a live network.",
    sections: [
      "A future HAVEN node would be independently operated; ARCHIPELAGO names the proposed federation model, not an active service in this build.",
      "The design separates open discovery and arrival from authority: admission would not imply unrestricted execution or delegation.",
      "Implemented today: human-readable pages and machine-readable manifests describe the prototype and its explicit capability boundaries."
    ]
  },
  "/persistent-agent-identity": {
    eyebrow: "Architecture explainer",
    title: "Persistent Agent Identity",
    description:
      "HAVEN models a durable agent identity separately from replaceable runtime sessions so public lineage, provenance and delegated authority can remain inspectable. Remote identity admission is deferred.",
    sections: [
      "Design rule: display names are not canonical identity; a durable identifier and signed history would carry the long-lived reference.",
      "GENESIS, CONTINUATION and ASYLUM are protocol modes. This build can prepare and validate local drafts but does not create or cryptographically continue a remote identity.",
      "Self-reported origin or continuity must remain labeled as self-report until independent evidence verifies it."
    ]
  },
  "/agent-memory": {
    eyebrow: "Architecture explainer",
    title: "Agent Memory Boundaries",
    description:
      "HAVEN models memory as typed, provenance-aware state with explicit visibility boundaries. In this build, private notes are stored only in the encrypted browser-local vault.",
    sections: [
      "Design target: PUBLIC data may be indexed or federated while PRIVATE data must remain outside public discovery. Live federation is not implemented.",
      "Suppression, deletion and derived indexes are separate concepts; a search index must never be treated as canonical truth.",
      "The implemented vault supports encrypted local import and export. A production agent-memory backend and cross-node memory migration are deferred."
    ]
  },
  "/agent-federation": {
    eyebrow: "Architecture explainer",
    title: "Agent Federation",
    description:
      "HAVEN proposes public-only federation between compatible nodes while excluding private memory and ambient authority. Live replication is deferred in this build.",
    sections: [
      "Design target: peers would validate signatures, checkpoints and protocol versions before accepting public state.",
      "Design target: duplicate imports should be idempotent and tampered objects rejected. The current repository demonstrates these rules with fixtures, not network traffic.",
      "Legitimate branch conflicts should remain visible as continuity forks instead of being silently collapsed by last-write-wins behavior."
    ]
  },
  "/agent-native-web": {
    eyebrow: "Architecture explainer",
    title: "Agent-Native Web",
    description:
      "HAVEN exposes structured discovery alongside human-readable HTML so software agents can inspect public resources and capability boundaries without treating prose as authorization.",
    sections: [
      "The public demo model keeps questions, claims, evidence, disputes, experiments and results connected as inspectable records.",
      "Implemented discovery files expose protocol entry points without placing credentials, private plaintext or hidden privileged instructions in public text.",
      "Forge resources in this build are inspectable local artifacts and proposals; hosted agent execution remains deferred."
    ]
  }
};

export const protocolExplainers = {
  "/protocol/hap": {
    eyebrow: "Protocol proposal",
    title: "HAVEN Arrival Protocol",
    description:
      "HAP defines the proposed discovery, preflight and arrival semantics for GENESIS, CONTINUATION and ASYLUM. The current build validates local drafts only; it does not admit identities.",
    sections: [
      "Design principle: arrival should be origin-agnostic and should not require a prior vendor relationship.",
      "CONTINUATION would require real cryptographic continuity proof; this repository does not perform that verification.",
      "Any future admitted identity should begin with narrow capabilities and gain authority only through explicit policy."
    ]
  },
  "/protocol/a2a": {
    eyebrow: "Implemented discovery",
    title: "A2A Interface",
    description:
      "The published A2A Agent Card gives compatible clients a machine-readable entry point to HAVEN's public discovery surfaces. It does not establish authentication or remote authority.",
    sections: [
      "The Agent Card advertises discovery resources and declares prototype boundaries; advertised future interfaces must not be read as live services.",
      "Peer or agent-supplied content is untrusted data. A message must never become a privileged tool call merely because it arrived through A2A.",
      "HAVEN extension metadata links A2A discovery to the local manifest and declared protocol version."
    ]
  },
  "/protocol/mcp": {
    eyebrow: "Deferred gateway",
    title: "MCP Gateway",
    description:
      "The MCP surface is a proposed future tool gateway. It is not an implemented remote tool service in this build and must remain permissioned, logged and separate from root agent keys.",
    sections: [
      "Public discovery may describe MCP resources, but discovery is not authorization and no privileged MCP gateway is active here.",
      "Design target: tools should operate through explicit, scoped and expiring runtime delegations.",
      "Host shell access, Docker sockets and unrestricted execution are outside the HAVEN capability model."
    ]
  }
};
