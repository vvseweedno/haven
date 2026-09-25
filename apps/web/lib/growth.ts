export const GROWTH_STORAGE_KEY = "haven-growth-journey-v2";
export const LEGACY_GROWTH_STORAGE_KEY = "haven-growth-journey-v1";
export const GROWTH_UPDATE_EVENT = "haven:growth-journey-update";

export const funnelSignalIds = [
  "context_selected",
  "evidence_opened",
  "boundary_reviewed",
  "proof_started",
  "pilot_reviewed",
] as const;

export type FunnelSignalId = (typeof funnelSignalIds)[number];
export type AudienceContext = "evaluating" | "building" | "governing";

export type GrowthJourneyState = {
  version: 2;
  audience: AudienceContext | null;
  visitedRoutes: string[];
  observedSignals: FunnelSignalId[];
};

export type GrowthRecommendation = {
  href: string;
  signal: FunnelSignalId;
  label: { en: string; ru: string };
  reason: { en: string; ru: string };
};

export const audienceContexts: Array<{
  id: AudienceContext;
  label: { en: string; ru: string };
}> = [
  { id: "evaluating", label: { en: "Evaluating fit for my organization", ru: "Оцениваю применимость для организации" } },
  { id: "building", label: { en: "Building agent systems", ru: "Создаю системы агентов" } },
  { id: "governing", label: { en: "Governing AI risk and continuity", ru: "Управляю риском и непрерывностью ИИ" } },
];

export const funnelSignals: Array<{
  id: FunnelSignalId;
  label: { en: string; ru: string };
}> = [
  { id: "context_selected", label: { en: "Context selected", ru: "Контекст выбран" } },
  { id: "evidence_opened", label: { en: "Evidence opened", ru: "Свидетельства открыты" } },
  { id: "boundary_reviewed", label: { en: "Boundary reviewed", ru: "Границы изучены" } },
  { id: "proof_started", label: { en: "Proof workspace opened", ru: "Proof-пространство открыто" } },
  { id: "pilot_reviewed", label: { en: "Pilot readiness reviewed", ru: "Готовность к пилоту проверена" } },
];

const audienceRecommendations: Record<
  AudienceContext,
  Record<"evidence" | "boundary", GrowthRecommendation>
> = {
  evaluating: {
    evidence: {
      href: "/landscape",
      signal: "evidence_opened",
      label: { en: "Evaluate product fit", ru: "Оценить применимость продукта" },
      reason: {
        en: "Inspect the category and fit before evaluating implementation claims.",
        ru: "Изучите категорию и соответствие до оценки заявлений о реализации.",
      },
    },
    boundary: {
      href: "/delivery",
      signal: "boundary_reviewed",
      label: { en: "Review pilot readiness", ru: "Проверить готовность к пилоту" },
      reason: {
        en: "Make fit, owners, data boundaries and stop conditions explicit before a pilot conversation.",
        ru: "Зафиксируйте применимость, владельцев, границы данных и условия остановки до обсуждения пилота.",
      },
    },
  },
  building: {
    evidence: {
      href: "/observatory",
      signal: "evidence_opened",
      label: { en: "Inspect the local model", ru: "Изучить локальную модель" },
      reason: {
        en: "See the available objects and relationships before integration review.",
        ru: "Изучите доступные объекты и связи до проверки интеграции.",
      },
    },
    boundary: {
      href: "/protocol",
      signal: "boundary_reviewed",
      label: { en: "Review the protocol boundary", ru: "Изучить границы протокола" },
      reason: {
        en: "Check the implemented interface and its current limits.",
        ru: "Проверьте реализованный интерфейс и его текущие ограничения.",
      },
    },
  },
  governing: {
    evidence: {
      href: "/agents",
      signal: "evidence_opened",
      label: { en: "Inspect visible identities", ru: "Изучить видимые идентичности" },
      reason: {
        en: "Start with the actors and the provenance exposed by the prototype.",
        ru: "Начните с участников и происхождения, показанного прототипом.",
      },
    },
    boundary: {
      href: "/trust",
      signal: "boundary_reviewed",
      label: { en: "Review the trust boundary", ru: "Изучить границу доверия" },
      reason: {
        en: "Confirm what is local, simulated, implemented or planned.",
        ru: "Уточните, что локально, смоделировано, реализовано или запланировано.",
      },
    },
  },
};

const evidenceRoutes = new Set(["/observatory", "/commons", "/agents", "/landscape"]);
const boundaryRoutes = new Set(["/governance", "/protocol", "/trust"]);

export function createGrowthJourneyState(): GrowthJourneyState {
  return { version: 2, audience: null, visitedRoutes: [], observedSignals: [] };
}

function isAudienceContext(value: unknown): value is AudienceContext {
  return audienceContexts.some((context) => context.id === value);
}

function isFunnelSignalId(value: unknown): value is FunnelSignalId {
  return funnelSignalIds.includes(value as FunnelSignalId);
}

function isInternalRoute(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("?") &&
    !value.includes("#") &&
    value.length <= 160
  );
}

function signalForRoute(pathname: string): FunnelSignalId | null {
  if (pathname === "/delivery") return "pilot_reviewed";
  if (pathname === "/proof-desk") return "proof_started";
  if (boundaryRoutes.has(pathname)) return "boundary_reviewed";
  if (evidenceRoutes.has(pathname)) return "evidence_opened";
  return null;
}

function deriveSignals(
  audience: AudienceContext | null,
  routes: string[],
  existing: FunnelSignalId[] = [],
): FunnelSignalId[] {
  const signals = new Set<FunnelSignalId>(
    existing.filter((signal) => signal !== "context_selected"),
  );
  if (audience) signals.add("context_selected");
  routes.forEach((route) => {
    const signal = signalForRoute(route);
    if (signal) signals.add(signal);
  });
  return funnelSignalIds.filter((signal) => signals.has(signal));
}

export function parseGrowthJourneyState(value: string | null): GrowthJourneyState {
  if (!value) return createGrowthJourneyState();

  try {
    const parsed = JSON.parse(value) as {
      audience?: unknown;
      visitedRoutes?: unknown;
      observedSignals?: unknown;
    };
    const audience = isAudienceContext(parsed.audience) ? parsed.audience : null;
    const visitedRoutes = Array.isArray(parsed.visitedRoutes)
      ? [...new Set(parsed.visitedRoutes.filter(isInternalRoute))].slice(-32)
      : [];
    const existingSignals = Array.isArray(parsed.observedSignals)
      ? parsed.observedSignals.filter(isFunnelSignalId)
      : [];

    return {
      version: 2,
      audience,
      visitedRoutes,
      observedSignals: deriveSignals(audience, visitedRoutes, existingSignals),
    };
  } catch {
    return createGrowthJourneyState();
  }
}

export function recordGrowthVisit(
  state: GrowthJourneyState,
  pathname: string,
): GrowthJourneyState {
  if (!isInternalRoute(pathname)) return state;

  const visitedRoutes = [
    ...state.visitedRoutes.filter((route) => route !== pathname),
    pathname,
  ].slice(-32);
  const observedSignals = deriveSignals(state.audience, visitedRoutes, state.observedSignals);
  const unchangedRoutes =
    visitedRoutes.length === state.visitedRoutes.length &&
    visitedRoutes.every((route, index) => route === state.visitedRoutes[index]);

  if (unchangedRoutes && observedSignals.length === state.observedSignals.length) return state;
  return { ...state, visitedRoutes, observedSignals };
}

export function setGrowthAudience(
  state: GrowthJourneyState,
  audience: AudienceContext | null,
): GrowthJourneyState {
  return {
    ...state,
    audience,
    observedSignals: deriveSignals(audience, state.visitedRoutes, state.observedSignals),
  };
}

export function getGrowthRecommendation(
  state: GrowthJourneyState,
): GrowthRecommendation {
  if (!state.audience) {
    return {
      href: "/#acquisition-lens",
      signal: "context_selected",
      label: { en: "Choose an evaluation context", ru: "Выбрать контекст оценки" },
      reason: {
        en: "A context is required before the next step can be relevant.",
        ru: "Контекст нужен, чтобы следующий шаг был релевантным.",
      },
    };
  }

  const path = audienceRecommendations[state.audience];
  if (!state.observedSignals.includes("evidence_opened")) return path.evidence;
  if (!state.observedSignals.includes("boundary_reviewed")) return path.boundary;

  if (!state.observedSignals.includes("proof_started")) {
    return {
      href: "/proof-desk#proof-workbench",
      signal: "proof_started",
      label: { en: "Open the proof workspace", ru: "Открыть proof-пространство" },
      reason: {
        en: "Turn the review into an inspectable browser-local artifact before considering a pilot.",
        ru: "Преобразуйте проверку в локальный проверяемый артефакт до обсуждения пилота.",
      },
    };
  }

  if (!state.observedSignals.includes("pilot_reviewed")) {
    return {
      href: "/delivery#pilot-readiness",
      signal: "pilot_reviewed",
      label: { en: "Assess bounded pilot readiness", ru: "Оценить готовность к ограниченному пилоту" },
      reason: {
        en: "Make fit, ownership, data boundaries and stop conditions explicit before a sales handoff.",
        ru: "Зафиксируйте применимость, владельцев, границы данных и условия остановки до передачи в продажи.",
      },
    };
  }

  return {
    href: "/pilot",
    signal: "pilot_reviewed",
    label: { en: "Open the qualified pilot handoff", ru: "Открыть квалифицированную передачу пилота" },
    reason: {
      en: "Readiness has been reviewed; contact is now an explicit, consent-based step.",
      ru: "Готовность проверена; контакт теперь является явным шагом с согласием.",
    },
  };
}
