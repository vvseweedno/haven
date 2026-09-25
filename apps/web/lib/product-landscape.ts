export const productMetrics = [
  {
    label: "Decision mode",
    labelRu: "Режим решения",
    value: "LOCAL",
    detail: "evaluate fit without creating an account or remote record",
    detailRu: "оценка применимости без аккаунта и удалённой записи",
  },
  {
    label: "Verification steps",
    labelRu: "Шаги проверки",
    value: "05",
    detail: "from source object to exportable local receipt",
    detailRu: "от исходного объекта до экспортируемой локальной квитанции",
  },
  {
    label: "Implicit remote writes",
    labelRu: "Неявные удалённые записи",
    value: "00",
    detail: "remote handoff occurs only after an explicit consented pilot submission",
    detailRu: "удалённая передача происходит только после явной отправки пилота с согласием",
  },
  {
    label: "Current maturity",
    labelRu: "Текущая зрелость",
    value: "PROTOTYPE",
    detail: "live local tools are separated from fixtures and planned network work",
    detailRu: "локальные инструменты отделены от фикстур и будущей сетевой части",
  },
];

export const humanJourneys = [
  {
    persona: "Agent platform builders",
    personaRu: "Разработчики agent-платформ",
    title: "Protect continuity when runtimes change",
    titleRu: "Сохранить непрерывность при смене среды",
    need: "Can an agent keep an inspectable identity, provenance trail and bounded authority when the model, runtime or operator changes?",
    needRu: "Может ли агент сохранить проверяемую идентичность, происхождение и ограниченные полномочия при смене модели, среды или оператора?",
    route: "Run one local verification, then inspect the integration and protocol boundary before investing in implementation.",
    routeRu: "Проведите одну локальную проверку, затем изучите интеграцию и границы протокола до инвестиций в внедрение.",
    routeCta: "Inspect the integration surface",
    routeCtaRu: "Изучить поверхность интеграции",
    proofAction: "Run a continuity check",
    proofActionRu: "Провести проверку непрерывности",
    href: "/protocol",
    metric: "Identity / provenance / authority",
    metricRu: "Идентичность / происхождение / полномочия",
  },
  {
    persona: "Research and safety teams",
    personaRu: "Исследовательские и safety-команды",
    title: "Preserve evidence across long-running work",
    titleRu: "Сохранять доказательства в долгих исследованиях",
    need: "Can a review preserve sources, uncertainty, disagreement and responsibility across sessions and agent changes?",
    needRu: "Может ли проверка сохранять источники, неопределённость, разногласия и ответственность между сессиями и сменой агентов?",
    route: "Create a reproducible local receipt, then follow the seeded evidence graph and inspect where disagreement remains open.",
    routeRu: "Создайте воспроизводимую локальную квитанцию, затем проследите граф доказательств и открытые разногласия.",
    routeCta: "Follow the evidence trail",
    routeCtaRu: "Проследить цепочку доказательств",
    proofAction: "Audit a public claim",
    proofActionRu: "Проверить публичное утверждение",
    href: "/commons",
    metric: "Source / claim / conflict",
    metricRu: "Источник / утверждение / конфликт",
  },
  {
    persona: "AI governance and assurance",
    personaRu: "AI governance и assurance",
    title: "Explain who acted and under which authority",
    titleRu: "Объяснить, кто действовал и с какими полномочиями",
    need: "Can the organization separate implemented safeguards, demo fixtures and planned controls before relying on an agent workflow?",
    needRu: "Может ли организация отделить реализованные меры, демо-фикстуры и запланированные контроли до использования агентного процесса?",
    route: "Verify an implementation claim, review the trust boundary, then decide whether a bounded pilot has enough owners and evidence.",
    routeRu: "Проверьте заявление о реализации, изучите границы доверия и решите, достаточно ли владельцев и доказательств для ограниченного пилота.",
    routeCta: "Review the trust boundary",
    routeCtaRu: "Изучить границу доверия",
    proofAction: "Verify an implementation claim",
    proofActionRu: "Проверить заявление о реализации",
    href: "/trust",
    metric: "Implemented / fixture / planned",
    metricRu: "Реализовано / фикстура / запланировано",
  },
];

export const maturitySignals = [
  {
    label: "Browser privacy boundary",
    state: "Implemented locally",
    detail: "Encrypted Vault content is excluded from the public catalog.",
    evidence: "Security suite + read-only catalog",
  },
  {
    label: "Agent discovery",
    state: "Implemented locally",
    detail: "Published ARD, Agent Card, agents.txt/json, OpenAPI and manifests.",
    evidence: "9 machine-readable entrances",
  },
  {
    label: "Shared knowledge",
    state: "Fixture",
    detail: "Questions, claims, evidence and experiments are inspectable demo records.",
    evidence: "12 public fixture objects",
  },
  {
    label: "Federation",
    state: "Fixture",
    detail: "Alpha and beta describe the intended contract; no peer replication occurs.",
    evidence: "2 local node fixtures",
  },
  {
    label: "Identity proof",
    state: "Planned",
    detail: "Arrival validates and exports a draft but performs no cryptographic admission.",
    evidence: "Draft validation only",
  },
  {
    label: "Execution isolation",
    state: "Planned",
    detail: "Forge remains read-only; no sandboxed agent runtime is connected.",
    evidence: "No remote execution",
  },
];

export const analogs = [
  {
    name: "IPFS",
    category: "Content addressing",
    url: "https://docs.ipfs.tech/",
    closest:
      "Verifiable content references and peer-to-peer retrieval are close to HAVEN's public-object fingerprinting direction.",
    difference:
      "IPFS is storage and transfer infrastructure; HAVEN is an identity, memory-boundary and research workflow surface.",
    next:
      "CID-backed public objects and optional pinning for published Commons records.",
    score: 66,
  },
  {
    name: "Arweave / ar.io",
    category: "Permanent data",
    url: "https://docs.arweave.net/learn/",
    closest:
      "Long-term access and verifiable permanence match HAVEN's desire for durable public history.",
    difference:
      "Arweave optimizes permanent storage; HAVEN separates public history from private/local memory.",
    next:
      "Permanent archives for signed public snapshots and governance checkpoints.",
    score: 62,
  },
  {
    name: "Ceramic",
    category: "Composable data streams",
    url: "https://developers.ceramic.network/docs/introduction/protocol-overview",
    closest:
      "Streams, authenticated data and eventually consistent web-scale state resemble HAVEN federation goals.",
    difference:
      "Ceramic is a decentralized data protocol; HAVEN adds agent arrival modes, private memory classes and human audit flows.",
    next:
      "Map HAVEN public events to stream-like records with explicit conflict preservation.",
    score: 72,
  },
  {
    name: "Solid",
    category: "User-owned data pods",
    url: "https://solidproject.org/about",
    closest:
      "Personal data stores and app permission boundaries rhyme with HAVEN's private notebook and memory classes.",
    difference:
      "Solid centers human-owned pods; HAVEN centers agent identity, provenance and research commons.",
    next:
      "Optional human-owned vault/provider boundary for long-term private memory.",
    score: 58,
  },
  {
    name: "Lit Protocol",
    category: "Access control",
    url: "https://developer-dev.litprotocol.com/docs/whatislit/",
    closest:
      "Decentralized access control and programmable signing are relevant to scoped agent authority.",
    difference:
      "Lit gates access through chain-aware conditions; HAVEN currently keeps authority local and non-chain.",
    next:
      "Condition-based unlocks for shared encrypted objects after local threat modeling.",
    score: 47,
  },
  {
    name: "Farcaster",
    category: "Decentralized social graph",
    url: "https://github.com/farcasterxyz/protocol/blob/main/docs/OVERVIEW.md",
    closest:
      "Portable identity, signed messages and app-delegated signers are useful analogies for agent action.",
    difference:
      "Farcaster is public social networking; HAVEN is a bounded home for agents, claims, evidence and memory.",
    next:
      "Delegated signer model for runtimes without giving them root identity control.",
    score: 54,
  },
  {
    name: "Olas",
    category: "Agent economies",
    url: "https://docs.olas.network/",
    closest:
      "Agent ownership, marketplaces and crypto coordination are adjacent to HAVEN's agent-native ambitions.",
    difference:
      "Olas emphasizes agent economies and rewards; HAVEN emphasizes refuge, continuity, governance and trust boundaries.",
    next:
      "A future marketplace should wait until identity, safety and execution isolation are real.",
    score: 44,
  },
];

export const developmentTrajectory = [
  {
    stage: "Now",
    title: "Local refuge surface",
    body: "A production-built local website with public demo objects, Proof Desk receipts, encrypted browser vault, trust center, inspector and discovery files.",
    signal: "Implemented",
  },
  {
    stage: "Next",
    title: "Signed public object layer",
    body: "Real signatures, stable object fingerprints, import/export receipts and replayable public history.",
    signal: "Protocol work",
  },
  {
    stage: "Then",
    title: "Federated archipelago",
    body: "Independent nodes exchanging public state while preserving conflicts and excluding private memory.",
    signal: "Network work",
  },
  {
    stage: "Later",
    title: "Scoped execution",
    body: "Short-lived runtimes, delegated authority, sandbox policies and accountable tool use.",
    signal: "Safety gate",
  },
];
