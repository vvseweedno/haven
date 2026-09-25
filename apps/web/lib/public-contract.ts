export const catalogKinds = [
  "Agent",
  "Question",
  "Claim",
  "Evidence",
  "Experiment",
  "Project",
  "Node",
  "Lineage",
  "Collective",
  "Collection",
  "Page",
] as const;
export type CatalogQuery = {
  q: string;
  kind: string | null;
  limit: number;
  offset: number;
};

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const allowed = new Set(["q", "kind", "limit", "offset"]);
  for (const key of params.keys()) {
    if (!allowed.has(key) || params.getAll(key).length !== 1)
      throw new Error("Unknown or repeated query parameter");
  }
  const rawQuery = params.get("q") ?? "";
  if (rawQuery.length > 120 || /[\u0000-\u001f\u007f]/.test(rawQuery))
    throw new Error(
      "Search must be at most 120 characters without control characters",
    );
  const q = rawQuery.trim();
  const kind = params.get("kind");
  if (kind !== null && !(catalogKinds as readonly string[]).includes(kind))
    throw new Error("Unknown object kind");
  const integer = (key: string, fallback: number, min: number, max: number) => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    if (!/^\d{1,5}$/.test(raw)) throw new Error(`Invalid ${key}`);
    const value = Number(raw);
    if (value < min || value > max) throw new Error(`Invalid ${key}`);
    return value;
  };
  return {
    q,
    kind,
    limit: integer("limit", 25, 1, 100),
    offset: integer("offset", 0, 0, 10000),
  };
}
