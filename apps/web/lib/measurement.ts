export const MEASUREMENT_STORAGE_KEY = "haven-measurement-ledger-v1";
export const MEASUREMENT_ATTRIBUTION_KEY = "haven-measurement-attribution-v1";
export const MEASUREMENT_UPDATE_EVENT = "haven:measurement-update";
export const MEASURE_EVENT = "haven:measure";

export const MAX_MEASUREMENT_EVENTS = 128;

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
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
  version: 1;
  nextSequence: number;
  events: MeasurementEntry[];
};

export type FunnelStage = {
  id: "orient" | "explore" | "verify" | "qualify" | "contact";
  reached: boolean;
  firstReachedAt: string | null;
};

export type FunnelSnapshot = {
  reached: number;
  total: 5;
  stages: FunnelStage[];
};

const semanticTokenPattern = /^[a-z0-9][a-z0-9._:-]{0,63}$/;
const attributionTokenPattern = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const allowedMetaKeys = new Set([
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

export function sanitizeMeasurementDetail(
  value: unknown,
): MeasurementDetail | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<MeasurementDetail> & {
    measure?: unknown;
    surface?: unknown;
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
    ...("audience" in candidate ? { audience: candidate.audience } : {}),
    ...("target" in candidate ? { target: candidate.target } : {}),
  } as Record<string, unknown>;
  const meta = Object.entries(rawMeta).reduce<Record<string, string | number | boolean>>(
    (result, [rawKey, rawValue]) => {
      const key = normalizeSemanticToken(rawKey);
      if (!key || !allowedMetaKeys.has(key)) return result;
      if (typeof rawValue === "boolean") result[key] = rawValue;
      else if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        result[key] = Math.max(-1_000_000, Math.min(1_000_000, rawValue));
      } else {
        const token = normalizeSemanticToken(rawValue);
        if (token) result[key] = token;
      }
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
  return { version: 1, nextSequence: 1, events: [] };
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
      version: 1,
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

  const last = ledger.events[ledger.events.length - 1];
  if (
    detail.name === "route_view" &&
    last?.name === "route_view" &&
    last.route === route
  ) {
    return ledger;
  }

  const entry: MeasurementEntry = {
    sequence: ledger.nextSequence,
    timestamp,
    route,
    ...detail,
  };
  return {
    version: 1,
    nextSequence: ledger.nextSequence + 1,
    events: [...ledger.events, entry].slice(-MAX_MEASUREMENT_EVENTS),
  };
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
  predicate: (entry: MeasurementEntry) => boolean,
) {
  return events.find(predicate)?.timestamp || null;
}

export function createFunnelSnapshot(
  ledger: MeasurementLedger,
): FunnelSnapshot {
  const stageEvidence: Array<Omit<FunnelStage, "reached">> = [
    {
      id: "orient",
      firstReachedAt: firstMatchingEvent(
        ledger.events,
        (entry) => entry.name === "route_view" && entry.route === "/",
      ),
    },
    {
      id: "explore",
      firstReachedAt: firstMatchingEvent(
        ledger.events,
        (entry) =>
          entry.name === "route_view" &&
          ["/observatory", "/landscape", "/commons"].includes(entry.route),
      ),
    },
    {
      id: "verify",
      firstReachedAt: firstMatchingEvent(
        ledger.events,
        (entry) =>
          entry.name === "proof_receipt_created" ||
          entry.name === "proof_receipt_exported",
      ),
    },
    {
      id: "qualify",
      firstReachedAt: firstMatchingEvent(
        ledger.events,
        (entry) =>
          entry.name === "pilot_brief_exported" ||
          entry.name === "pilot_request_opened",
      ),
    },
    {
      id: "contact",
      firstReachedAt: firstMatchingEvent(
        ledger.events,
        (entry) => entry.name === "pilot_request_submitted",
      ),
    },
  ];
  const stages: FunnelStage[] = stageEvidence.map((stage) => ({
    ...stage,
    reached: stage.firstReachedAt !== null,
  }));

  return {
    reached: stages.filter((stage) => stage.reached).length,
    total: 5,
    stages,
  };
}

export function createMeasurementExport(
  ledger: MeasurementLedger,
  attribution: SessionAttribution,
) {
  return {
    schema: "haven.measurement.export.v1",
    generatedAt: new Date().toISOString(),
    privacy: {
      scope: "this-browser-only",
      containsPii: false,
      networkTransmission: false,
      identifiers: false,
    },
    attribution,
    funnel: createFunnelSnapshot(ledger),
    ledger,
  };
}

export function dispatchMeasurement(detail: MeasurementDetail) {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeMeasurementDetail(detail);
  if (!sanitized) return;
  window.dispatchEvent(new CustomEvent(MEASURE_EVENT, { detail: sanitized }));
}
