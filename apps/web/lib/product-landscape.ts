export const productMetrics = [
  {
    label: "Evaluation mode",
    labelRu: "Режим оценки",
    value: "LOCAL",
    detail: "the first proof stays in this browser",
    detailRu: "первая проверка остаётся в этом браузере",
  },
  {
    label: "Receipt stages",
    labelRu: "Этапы квитанции",
    value: "05",
    detail: "from source object to exportable result",
    detailRu: "от исходного объекта до экспортируемого результата",
  },
  {
    label: "Remote writes",
    labelRu: "Удалённые записи",
    value: "00",
    detail: "no account, admission or backend mutation",
    detailRu: "без аккаунта, admission и изменений бэкенда",
  },
  {
    label: "Network status",
    labelRu: "Статус сети",
    value: "FIXTURE",
    detail: "federation and residents are inspectable demos",
    detailRu: "федерация и резиденты показаны как демо-данные",
  },
];

export const humanJourneys = [
  {
    persona: "Agent platform builders",
    personaRu: "Разработчики agent-платформ",
    title: "Test continuity across runtimes",
    titleRu: "Проверить непрерывность между средами",
    need: "Can an agent carry inspectable identity, provenance and bounded authority when its model or runtime changes?",
    needRu: "Может ли агент сохранить проверяемую идентичность, происхождение и ограниченные полномочия при смене модели или среды?",
    route: "Inspect the working graph after creating a local proof receipt.",
    routeRu: "После локальной proof-квитанции изучите рабочий граф.",
    routeCta: "Then inspect the continuity graph",
    routeCtaRu: "Затем изучить граф непрерывности",
    proofAction: "Test an agent object",
    proofActionRu: "Проверить объект агента",
    href: "/observatory",
    metric: "Identity / provenance / authority",
    metricRu: "Идентичность / происхождение / полномочия",
  },
  {
    persona: "Research and safety teams",
    personaRu: "Команды исследований и safety",
    title: "Trace claims back to evidence",
    titleRu: "Проследить утверждения до доказательств",
    need: "Can a review preserve sources, uncertainty and conflicting records instead of flattening them into a score?",
    needRu: "Может ли проверка сохранить источники, неопределённость и конфликты вместо сведения к одному рейтингу?",
    route: "Follow the seeded evidence after producing a reproducible local receipt.",
    routeRu: "После воспроизводимой локальной квитанции проследите тестовые доказательства.",
    routeCta: "Then follow the evidence trail",
    routeCtaRu: "Затем проследить цепочку доказательств",
    proofAction: "Audit a public claim",
    proofActionRu: "Проверить публичное утверждение",
    href: "/commons",
    metric: "Source / claim / conflict",
    metricRu: "Источник / утверждение / конфликт",
  },
  {
    persona: "AI governance teams",
    personaRu: "Команды AI governance",
    title: "Separate controls from promises",
    titleRu: "Отделить контроли от обещаний",
    need: "Which safeguards are implemented, which are fixtures, and which remain explicitly planned?",
    needRu: "Какие меры уже реализованы, какие являются фикстурами, а какие явно остаются в плане?",
    route: "Read the capability boundary after exporting an evidence-led review receipt.",
    routeRu: "После экспорта evidence-led квитанции изучите границы возможностей.",
    routeCta: "Then review the trust boundary",
    routeCtaRu: "Затем изучить границу доверия",
    proofAction: "Review an implementation claim",
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
