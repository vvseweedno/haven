export const MEASUREMENT_STORAGE_KEY = "haven-measurement-session-v2";
export const LEGACY_MEASUREMENT_STORAGE_KEY = "haven-measurement-ledger-v1";
export const MEASUREMENT_ATTRIBUTION_KEY = "haven-measurement-attribution-v2";
export const LEGACY_MEASUREMENT_ATTRIBUTION_KEY = "haven-measurement-attribution-v1";
export const MEASUREMENT_UPDATE_EVENT = "haven:measurement-update";
export const MEASURE_EVENT = "haven:measure";

export const MAX_MEASUREMENT_EVENTS = 160;

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
] as const;

export type AttributionKey = (typeof attributionKeys)[number];
export type SessionAttribution = Partial<Record<AttributionKey, string>>;

export type MeasurementDetail = {
  name: string;
  context?: string;
  step?: string;
  outcome?: string;
  meta?: Record<string, string | number | boolean>;
};

export type MeasurementEntry = {
  sequence: number;
  timestamp: string;
  name: string;
  route: string;
  context?: string;
  step?: string;
  outcome?: string;
  meta?: Record<string, string | number | boolean>;
};

export type MeasurementLedger = {
  version: 2;
  nextSequence: number;
  events: MeasurementEntry[];
};

export type FunnelStageId = "orient" | "verify" | "bound" | "prepare" | "contact";

export type FunnelStage = {
  id: FunnelStageId;
  reached: boolean;
  firstReachedAt: string | null;
  completionEvent: string;
};

export type FunnelSnapshot = {
  reached: number;
  observed: number;
  total: 5;
  nextStage: FunnelStageId | null;
  stages: FunnelStage[];
};

export type FrictionSnapshot = {
  proofFailures: number;
  pilotFailures: number;
  journeyResets: number;
  total: number;
};

const semanticTokenPattern = /^[a-z0-9][a-z0-9._:-]{0,63}$/;
const attributionTokenPattern = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const allowedMetaKeys = new Set([
  "assignment",
  "audience",
  "count",
  "dimension",
  "experiment",
  "kind",
  "mode",
  "origin",
  "position",
  "scope",
  "source",
  "stagecount",
  "storage",
  "surface",
  "target",
  "value",
  "variant",
]);

function normalizeSemanticToken(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return semanticTokenPattern.test(normalized) ? normalized : undefined;
}

function normalizeAttributionToken(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return attributionTokenPattern.test(normalized) ? normalized : undefined;
}

export function normalizeRoute(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return null;
  }
  const route = value.split(/[?#]/, 1)[0];
  return route.length <= 160 ? route : null;
}

function normalizeMetaValue(
  key: string,
  value: unknown,
): string | number | boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(-1_000_000, Math.min(1_000_000, value));
  }
  if (key === "target") {
    const route = normalizeRoute(value);
    if (route) return route;
  }
  return normalizeSemanticToken(value);
}

export function sanitizeMeasurementDetail(
  value: unknown,
): MeasurementDetail | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<MeasurementDetail> & {
    measure?: unknown;
    surface?: unknown;
    experiment?: unknown;
    variant?: unknown;
    mode?: unknown;
    audience?: unknown;
    target?: unknown;
  };
  const name = normalizeSemanticToken(candidate.name ?? candidate.measure);
  if (!name) return null;

  const context = normalizeSemanticToken(candidate.context ?? candidate.surface);
  const step = normalizeSemanticToken(candidate.step);
  const outcome = normalizeSemanticToken(candidate.outcome);
  const rawMeta = {
    ...(candidate.meta && typeof candidate.meta === "object" ? candidate.meta : {}),
    ...("experiment" in candidate ? { experiment: candidate.experiment } : {}),
    ...("variant" in candidate ? { variant: candidate.variant } : {}),
    ...("mode" in candidate ? { mode: candidate.mode } : {}),
    ...("audience" in candidate ? { audience: candidate.audience } : {}),
    ...("target" in candidate ? { target: candidate.target } : {}),
  } as Record<string, unknown>;

  const meta = Object.entries(rawMeta).reduce<Record<string, string | number | boolean>>(
    (result, [rawKey, rawValue]) => {
      const key = normalizeSemanticToken(rawKey);
      if (!key || !allowedMetaKeys.has(key)) return result;
      const normalized = normalizeMetaValue(key, rawValue);
      if (normalized !== undefined) result[key] = normalized;
      return result;
    },
    {},
  );

  return {
    name,
    ...(context ? { context } : {}),
    ...(step ? { step } : {}),
    ...(outcome ? { outcome } : {}),
    ...(Object.keys(meta).length ? { meta } : {}),
  };
}

export function createMeasurementLedger(): MeasurementLedger {
  return { version: 2, nextSequence: 1, events: [] };
}

function isIsoTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 32 &&
    !Number.isNaN(Date.parse(value))
  );
}

function parseEntry(value: unknown): MeasurementEntry | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<MeasurementEntry>;
  const detail = sanitizeMeasurementDetail(candidate);
  const route = normalizeRoute(candidate.route);
  if (
    !detail ||
    !route ||
    !Number.isSafeInteger(candidate.sequence) ||
    (candidate.sequence || 0) < 1 ||
    !isIsoTimestamp(candidate.timestamp)
  ) {
    return null;
  }
  return {
    sequence: candidate.sequence as number,
    timestamp: candidate.timestamp,
    route,
    ...detail,
  };
}

export function parseMeasurementLedger(value: string | null): MeasurementLedger {
  if (!value) return createMeasurementLedger();
  try {
    const candidate = JSON.parse(value) as Partial<MeasurementLedger>;
    const events = Array.isArray(candidate.events)
      ? candidate.events
          .map(parseEntry)
          .filter((entry): entry is MeasurementEntry => entry !== null)
          .slice(-MAX_MEASUREMENT_EVENTS)
      : [];
    const highestSequence = events.reduce(
      (highest, entry) => Math.max(highest, entry.sequence),
      0,
    );
    return {
      version: 2,
      nextSequence: highestSequence + 1,
      events,
    };
  } catch {
    return createMeasurementLedger();
  }
}

export function appendMeasurement(
  ledger: MeasurementLedger,
  detailValue: unknown,
  routeValue: unknown,
  timestamp = new Date().toISOString(),
): MeasurementLedger {
  const detail = sanitizeMeasurementDetail(detailValue);
  const route = normalizeRoute(routeValue);
  if (!detail || !route || !isIsoTimestamp(timestamp)) return ledger;

  const entry: MeasurementEntry = {
    sequence: ledger.nextSequence,
    timestamp,
    route,
    ...detail,
  };
  return {
    version: 2,
    nextSequence: ledger.nextSequence + 1,
    events: [...ledger.events, entry].slice(-MAX_MEASUREMENT_EVENTS),
  };
}

function routeLifecycleEvent(pathname: string): string | null {
  if (pathname === "/") return "evaluation_path_viewed";
  if (["/landscape", "/observatory", "/commons", "/agents"].includes(pathname)) {
    return "orientation_opened";
  }
  if (pathname === "/proof-desk") return "proof_desk_opened";
  if (pathname === "/trust") return "trust_boundary_opened";
  if (pathname === "/delivery") return "pilot_readiness_viewed";
  if (pathname === "/pilot") return "pilot_request_opened";
  return null;
}

export function appendRouteLifecycle(
  ledger: MeasurementLedger,
  routeValue: unknown,
  timestamp = new Date().toISOString(),
): MeasurementLedger {
  const route = normalizeRoute(routeValue);
  if (!route) return ledger;

  const lastRouteView = [...ledger.events]
    .reverse()
    .find((entry) => entry.name === "route_view");
  if (lastRouteView?.route === route) return ledger;

  let next = appendMeasurement(ledger, { name: "route_view" }, route, timestamp);
  const lifecycle = routeLifecycleEvent(route);
  if (lifecycle) {
    next = appendMeasurement(next, { name: lifecycle }, route, timestamp);
  }
  return next;
}

export function readAttribution(search: string): SessionAttribution {
  const params = new URLSearchParams(search);
  return attributionKeys.reduce<SessionAttribution>((result, key) => {
    const value = normalizeAttributionToken(params.get(key));
    if (value) result[key] = value;
    return result;
  }, {});
}

export function parseAttribution(value: string | null): SessionAttribution {
  if (!value) return {};
  try {
    const candidate = JSON.parse(value) as Record<string, unknown>;
    return attributionKeys.reduce<SessionAttribution>((result, key) => {
      const item = normalizeAttributionToken(candidate[key]);
      if (item) result[key] = item;
      return result;
    }, {});
  } catch {
    return {};
  }
}

function firstMatchingEvent(
  events: MeasurementEntry[],
  eventName: string,
) {
  return events.find((entry) => entry.name === eventName)?.timestamp || null;
}

export function createFunnelSnapshot(
  ledger: MeasurementLedger,
): FunnelSnapshot {
  const definitions: Array<{ id: FunnelStageId; completionEvent: string }> = [
    { id: "orient", completionEvent: "orientation_opened" },
    { id: "verify", completionEvent: "proof_receipt_exported" },
    { id: "bound", completionEvent: "boundary_evidence_reviewed" },
    { id: "prepare", completionEvent: "pilot_brief_exported" },
    { id: "contact", completionEvent: "pilot_request_submitted" },
  ];

  const stages: FunnelStage[] = definitions.map((stage) => {
    const firstReachedAt = firstMatchingEvent(ledger.events, stage.completionEvent);
    return {
      ...stage,
      firstReachedAt,
      reached: firstReachedAt !== null,
    };
  });

  let reached = 0;
  for (const stage of stages) {
    if (!stage.reached) break;
    reached += 1;
  }

  return {
    reached,
    observed: stages.filter((stage) => stage.reached).length,
    total: 5,
    nextStage: stages.find((stage) => !stage.reached)?.id || null,
    stages,
  };
}

export function createFrictionSnapshot(
  ledger: MeasurementLedger,
): FrictionSnapshot {
  const count = (name: string) =>
    ledger.events.filter((entry) => entry.name === name).length;
  const proofFailures = count("proof_receipt_failed");
  const pilotFailures = count("pilot_request_failed");
  const journeyResets = count("growth_journey_reset");
  return {
    proofFailures,
    pilotFailures,
    journeyResets,
    total: proofFailures + pilotFailures + journeyResets,
  };
}

export function createMeasurementExport(
  ledger: MeasurementLedger,
  attribution: SessionAttribution,
) {
  return {
    schema: "haven.measurement.export.v2",
    generatedAt: new Date().toISOString(),
    privacy: {
      scope: "this-tab-session-only",
      containsPii: false,
      networkTransmission: false,
      identifiers: false,
    },
    attribution,
    funnel: createFunnelSnapshot(ledger),
    friction: createFrictionSnapshot(ledger),
    ledger,
  };
}

export function dispatchMeasurement(detail: MeasurementDetail) {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeMeasurementDetail(detail);
  if (!sanitized) return;
  window.dispatchEvent(new CustomEvent(MEASURE_EVENT, { detail: sanitized }));
}
