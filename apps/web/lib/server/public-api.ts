import { createHash } from "node:crypto";
import { searchRecords } from "../observatory";
import { parseCatalogQuery } from "../public-contract";
import { createRequestBudget } from "../security";

// Only this explicit projection is exposed; no browser storage or private notes enter the catalog.
const catalog = searchRecords
  .filter((record) => record.id !== "/vault")
  .map((record) => ({
    id: record.id,
    title: record.title,
    kind: record.kind,
    description: record.description,
    href: record.href,
    visibility: "PUBLIC" as const,
  }));
const indexed = catalog.map((record) => ({
  record,
    text: `${record.id} ${record.title} ${record.description} ${record.kind}`.toLowerCase(),
}));
const budget = createRequestBudget();

export function apiJson(request: Request, data: unknown) {
  const body = JSON.stringify(data);
  const etag = `"${createHash("sha256").update(body).digest("hex")}"`;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ETag: etag,
    "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
    "X-Content-Type-Options": "nosniff",
  };
  const matches = (request.headers.get("if-none-match") ?? "")
    .split(",")
    .some(
      (value) =>
        value.trim() === "*" || value.trim().replace(/^W\//, "") === etag,
    );
  return matches
    ? new Response(null, { status: 304, headers })
    : new Response(body, { headers });
}

export function catalogResponse(request: Request) {
  if (!budget())
    return Response.json(
      { error: "Request budget exhausted. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": "1", "Cache-Control": "no-store" },
      },
    );
  try {
    const query = parseCatalogQuery(new URL(request.url).searchParams);
    const words = query.q.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = indexed.filter(
      (item) =>
        (!query.kind || item.record.kind === query.kind) &&
        words.every((word) => item.text.includes(word)),
    );
    return apiJson(request, {
      schema: "haven-public-catalog/1",
      source: "local-demo",
      total: matches.length,
      limit: query.limit,
      offset: query.offset,
      items: matches
        .slice(query.offset, query.offset + query.limit)
        .map((item) => item.record),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid query" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export const publicStatus = {
  schema: "haven-public-status/1",
  node: "node:haven.local.alpha",
  mode: "local-demo",
  capabilities: {
    publicCatalog: true,
    encryptedLocalNotebook: true,
    localObjectInspection: true,
    identityAdmission: false,
    federationReplication: false,
    remoteExecution: false,
  },
  privacy: {
    notebookStorage: "encrypted-in-this-browser",
    notebookUpload: false,
    publicIndexIncludesNotebook: false,
    analytics: false,
  },
  api: {
    version: "v1",
    methods: ["GET", "HEAD"],
    maxPageSize: 100,
    maxQueryLength: 120,
    cacheSeconds: 30,
  },
};
