import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CANONICAL_URL = "http://localhost:41731";

function walkFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

function unique(values) {
  return new Set(values).size === values.length;
}

function pageSourceFor(root, url) {
  const { pathname } = new URL(url);
  if (pathname === "/") return join(root, "apps", "web", "app", "page.tsx");
  if (pathname.startsWith("/api/")) {
    return join(root, "apps", "web", "app", ...pathname.slice(1).split("/"), "route.ts");
  }
  if (pathname === "/.well-known/haven") {
    return join(root, "apps", "web", "app", ".well-known", "haven", "route.ts");
  }
  if (pathname.startsWith("/.well-known/") || /\.[a-z0-9]+$/i.test(pathname)) {
    return join(root, "apps", "web", "public", ...pathname.slice(1).split("/"));
  }
  return join(root, "apps", "web", "app", ...pathname.slice(1).split("/"), "page.tsx");
}

export function runContentSeoAudit({ root = process.cwd(), silent = false } = {}) {
  const publicDir = join(root, "apps", "web", "public");
  const failures = [];
  let checks = 0;

  const check = (condition, message) => {
    checks += 1;
    if (!condition) failures.push(message);
  };
  const read = (path) => readFileSync(join(root, path), "utf8");

  const requiredFiles = [
    "README.md",
    "docs/content-seo.md",
    "docs/ux-ia.md",
    "apps/web/public/llms.txt",
    "apps/web/public/agents.txt",
    "apps/web/public/agents.json",
    "apps/web/public/openapi.json",
  ];
  for (const file of requiredFiles) {
    check(existsSync(join(root, file)), `Missing content/SEO contract file: ${file}`);
  }
  if (failures.length > 0) return finish();

  const jsonFiles = walkFiles(publicDir).filter((file) => file.endsWith(".json"));
  const jsonByPath = new Map();
  for (const file of jsonFiles) {
    const displayPath = relative(root, file).replaceAll("\\", "/");
    try {
      jsonByPath.set(displayPath, JSON.parse(readFileSync(file, "utf8")));
      check(true, `${displayPath} parses as JSON`);
    } catch (error) {
      check(false, `${displayPath} is invalid JSON: ${error.message}`);
    }
  }

  const readme = read("README.md");
  const contentContract = read("docs/content-seo.md");
  const uxIaContract = read("docs/ux-ia.md");
  const llms = read("apps/web/public/llms.txt");
  const agentsText = read("apps/web/public/agents.txt");
  const agentsRaw = read("apps/web/public/agents.json");
  const openapiRaw = read("apps/web/public/openapi.json");
  const ardRaw = read("apps/web/public/.well-known/ard.json");
  const havenManifestRaw = read("apps/web/public/.well-known/haven.json");
  const agentCardRaw = read("apps/web/public/.well-known/agent-card.json");
  const deliveryRaw = read("apps/web/public/delivery.json");
  const layout = read("apps/web/app/layout.tsx");
  const havenData = read("apps/web/lib/haven-data.ts");
  const seoSource = read("apps/web/lib/seo.ts");
  const publicApi = read("apps/web/lib/server/public-api.ts");
  const navigationSource = read("apps/web/lib/navigation.ts");
  const appShellSource = read("apps/web/components/AppShell.tsx");
  const growthJourneySource = read("apps/web/components/GrowthJourney.tsx");
  const heroSource = read("apps/web/components/ExperienceHero.tsx");
  const dashboardSource = read("apps/web/components/Dashboard.tsx");
  const homeDashboardSource = read("apps/web/components/HomeDashboard.tsx");
  const pageHeaderSource = read("apps/web/components/PageHeader.tsx");
  const measurementPanelSource = read("apps/web/components/MeasurementPanel.tsx");
  const agents = jsonByPath.get("apps/web/public/agents.json");
  const openapi = jsonByPath.get("apps/web/public/openapi.json");
  const ard = jsonByPath.get("apps/web/public/.well-known/ard.json");
  const havenManifest = jsonByPath.get("apps/web/public/.well-known/haven.json");
  const agentCard = jsonByPath.get("apps/web/public/.well-known/agent-card.json");
  const deliveryContract = jsonByPath.get("apps/web/public/delivery.json");

  check(llms.startsWith("# HAVEN local product prototype\n"), "llms.txt must begin with the canonical H1.");
  const llmsMeaningfulLines = llms.split(/\r?\n/).filter((line) => line.trim());
  check(llmsMeaningfulLines[1]?.startsWith("> "), "llms.txt must put a short blockquote after its H1.");
  check((llms.match(/^# /gm) ?? []).length === 1, "llms.txt must contain exactly one H1.");

  const llmsLinks = [...llms.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
  check(llmsLinks.length >= 20, "llms.txt must provide a useful curated reading path.");
  check(unique(llmsLinks), "llms.txt contains duplicate linked URLs.");

  const agentsTextUrls = [...agentsText.matchAll(/https?:\/\/[^\s)]+/g)].map((match) => match[0]);
  check(unique(agentsTextUrls), "agents.txt contains duplicate URLs.");

  check(agents?.schemaVersion === "haven-agents-discovery/1.2", "agents.json has an unexpected schema version.");
  check(agents?.canonicalUrl === CANONICAL_URL, "agents.json canonicalUrl must use the canonical local URL.");
  check(agents?.mode === "local-demo", "agents.json must declare local-demo mode.");
  check(agents?.localization?.defaultLanguage === "en", "agents.json must declare the English source language.");
  check(
    Array.isArray(agents?.localization?.availableLanguages) &&
      agents.localization.availableLanguages.join(",") === "en,ru",
    "agents.json must declare exactly the implemented en and ru interface languages.",
  );
  check(agents?.localization?.separateLocaleUrls === false, "agents.json must not claim separate locale URLs.");
  check(agents?.localization?.hreflangPublished === false, "agents.json must not claim hreflang coverage.");

  const routes = Array.isArray(agents?.routes) ? agents.routes : [];
  const routeIds = routes.map((route) => route.id);
  const routeUrls = routes.map((route) => route.url);
  check(routes.length >= 14, "agents.json must describe the important product and API routes.");
  check(routeIds.every((id) => typeof id === "string" && id.length > 0), "Every agents.json route needs an id.");
  check(routeUrls.every((url) => typeof url === "string" && url.length > 0), "Every agents.json route needs a URL.");
  check(unique(routeIds), "agents.json route ids must be unique.");
  check(unique(routeUrls), "agents.json route URLs must be unique.");
  for (const route of routes) {
    check(route.url.startsWith(CANONICAL_URL), `Route ${route.id} does not use the canonical local URL.`);
    check(existsSync(pageSourceFor(root, route.url)), `Route ${route.id} has no matching app or public source.`);
    check(
      ["implemented", "browser-local"].includes(route.status),
      `Route ${route.id} uses an unsupported status: ${route.status}`,
    );
  }

  const requiredRoutes = [
    "/",
    "/trust",
    "/proof-desk",
    "/arrival",
    "/commons",
    "/agents",
    "/agora",
    "/cabinet",
    "/atelier",
    "/delivery",
    "/landscape",
    "/pilot",
    "/protocol",
    "/api/v1/status",
    "/api/v1/catalog",
  ];
  for (const path of requiredRoutes) {
    const url = `${CANONICAL_URL}${path}`;
    check(routeUrls.includes(url), `agents.json is missing the required route ${path}.`);
    check(llmsLinks.includes(url), `llms.txt is missing the required route ${path}.`);
    check(agentsText.includes(url), `agents.txt is missing the required route ${path}.`);
  }

  const implementedCapabilities = agents?.capabilities?.implemented ?? [];
  const deferredCapabilities = agents?.capabilities?.deferred ?? [];
  check(unique(implementedCapabilities), "agents.json implemented capabilities must be unique.");
  check(unique(deferredCapabilities), "agents.json deferred capabilities must be unique.");
  check(
    implementedCapabilities.every((capability) => !deferredCapabilities.includes(capability)),
    "agents.json cannot mark the same capability implemented and deferred.",
  );

  check(openapi?.openapi === "3.1.0", "openapi.json must declare OpenAPI 3.1.0.");
  check(openapi?.servers?.length === 1, "openapi.json must contain one canonical local server.");
  check(openapi?.servers?.[0]?.url === CANONICAL_URL, "openapi.json server URL must match the canonical local URL.");
  check(Array.isArray(openapi?.security) && openapi.security.length === 0, "The read-only prototype API must explicitly declare no authentication scheme.");

  const expectedApiPaths = [
    "/healthz",
    "/readyz",
    "/api/v1/status",
    "/api/v1/catalog",
    "/api/v1/pilot-request",
    "/.well-known/haven",
    "/api/v1/handshake",
    "/api/v1/identity/challenge",
    "/api/v1/identity/verify",
    "/api/v1/session",
    "/api/v1/session/renew",
    "/api/v1/session/close",
    "/api/v1/capabilities",
  ];
  const apiPaths = Object.keys(openapi?.paths ?? {});
  check(unique(apiPaths), "openapi.json path keys must be unique.");
  check(
    expectedApiPaths.every((path) => apiPaths.includes(path)) && apiPaths.length === expectedApiPaths.length,
    "openapi.json paths must match the implemented read endpoints plus the explicit pilot handoff.",
  );
  const mutationMethods = ["post", "put", "patch", "delete"];
  const allowedPostPaths = new Set([
    "/api/v1/pilot-request",
    "/api/v1/handshake",
    "/api/v1/identity/challenge",
    "/api/v1/identity/verify",
    "/api/v1/session",
    "/api/v1/session/renew",
    "/api/v1/session/close",
  ]);
  for (const [path, item] of Object.entries(openapi?.paths ?? {})) {
    if (allowedPostPaths.has(path)) {
      check("post" in item, `Expected explicit POST operation on ${path}.`);
      check(
        ["put", "patch", "delete"].every((method) => !(method in item)),
        `${path} must not advertise unsupported mutation methods.`,
      );
    } else {
      check(
        mutationMethods.every((method) => !(method in item)),
        `Only explicitly allowlisted HAVEN Border or pilot paths may advertise mutation; found one on ${path}.`,
      );
    }
  }
  const operationIds = Object.values(openapi?.paths ?? {}).flatMap((item) =>
    ["get", "head", "post"].map((method) => item[method]?.operationId).filter(Boolean),
  );
  check(unique(operationIds), "OpenAPI operationId values must be unique.");
  check(openapi?.components?.schemas?.Status?.properties?.mode?.const === "local-demo", "OpenAPI status mode must match the runtime contract.");
  check(
    openapi?.paths?.["/api/v1/pilot-request"]?.post?.operationId === "submitPilotRequest",
    "OpenAPI must document the implemented pilot-request POST operation.",
  );
  check(
    agents?.interfaces?.pilotRequest === `${CANONICAL_URL}/api/v1/pilot-request`,
    "agents.json must publish the pilot-request interface.",
  );
  for (const token of [
    "publicCatalog",
    "encryptedLocalNotebook",
    "localObjectInspection",
    "pilotRequestHandoff",
    "identityAdmission",
    "federationReplication",
    "remoteExecution",
    "analytics",
  ]) {
    check(openapiRaw.includes(`\"${token}\"`), `OpenAPI status schema is missing ${token}.`);
    check(publicApi.includes(token), `Runtime status is missing ${token}.`);
  }

  check(
    havenData.includes(`\"${CANONICAL_URL}\"`) && seoSource.includes(`\"${CANONICAL_URL}\"`),
    "Application URL helpers must default to the discovery canonical URL.",
  );
  check(layout.includes("getSiteStructuredData"), "The root layout must render the shared structured-data graph.");
  check(seoSource.includes('\"@type\": \"WebSite\"'), "The root schema must describe the WebSite.");
  check(seoSource.includes('\"@type\": \"WebApplication\"'), "The root schema must describe the WebApplication.");

  check(
    ard?.resources?.[0]?.type === "agent-continuity-evaluation-prototype",
    "ARD must describe HAVEN as an evaluation prototype, not a live agent network.",
  );
  check(
    typeof ard?.resources?.[0]?.description === "string" &&
      ard.resources[0].description.includes("not a live agent network"),
    "ARD must state the live-network boundary explicitly.",
  );
  check(
    havenManifest?.status?.federation === "fixture-only-live-replication-deferred",
    "HAVEN manifest must keep live federation deferred.",
  );
  check(
    havenManifest?.status?.pilotIntake === "explicit-consent-configurable",
    "HAVEN manifest must describe pilot intake as explicit-consent and configurable.",
  );
  check(
    Array.isArray(agentCard?.extensions?.haven?.boundaries) &&
      agentCard.extensions.haven.boundaries.includes("seeded-agent-records-are-fixtures"),
    "A2A Agent Card must identify seeded agent records as fixtures.",
  );
  check(
    deliveryContract?.remoteWrite?.implicit === false &&
      deliveryContract?.remoteWrite?.consentRequired === true,
    "Delivery contract must prohibit implicit remote writes and require pilot consent.",
  );
  const sitemapSource = read("apps/web/app/sitemap.ts");
  const agentDetailSource = read("apps/web/app/agents/[id]/page.tsx");
  const robotsSource = read("apps/web/app/robots.ts");
  check(
    !sitemapSource.includes("agents.map"),
    "Curated agent fixture detail URLs must not be bulk-added to the sitemap.",
  );
  check(
    agentDetailSource.includes("index: false"),
    "Curated agent fixture detail pages must be noindex.",
  );
  check(
    !seoSource.includes("process.env.VERCEL_URL"),
    "Canonical URL resolution must not fall back to ephemeral Vercel preview URLs.",
  );
  check(
    seoSource.includes("searchIndexingEnabled"),
    "SEO helpers must fail closed on indexing when the canonical host is local.",
  );
  check(
    robotsSource.includes("searchIndexingEnabled"),
    "robots.txt generation must follow the canonical-host indexing safety gate.",
  );

  const publicTextFiles = walkFiles(publicDir).filter((file) => /\.(?:json|txt|xml)$/i.test(file));
  for (const file of publicTextFiles) {
    const text = readFileSync(file, "utf8");
    const localOrigins = [...text.matchAll(/https?:\/\/localhost:\d+/g)].map((match) => match[0]);
    for (const origin of localOrigins) {
      check(origin === CANONICAL_URL, `${relative(root, file)} uses inconsistent local origin ${origin}.`);
    }
  }

  const claimSurfaces = [
    readme,
    llms,
    agentsText,
    agentsRaw,
    openapiRaw,
    ardRaw,
    havenManifestRaw,
    agentCardRaw,
    deliveryRaw,
    layout,
    seoSource,
  ].join("\n");
  const forbiddenClaims = [
    ["legacy infrastructure claim", /HAVEN is an open, federated infrastructure/i],
    ["production-ready claim", /\bproduction[- ]ready\b/i],
    ["unqualified autonomy claim", /\bfully autonomous\b/i],
    ["invented trust claim", /\btrusted by\b/i],
    ["invented customer count", /\b\d+[+,]?\s+(?:customers|clients)\b/i],
    ["invented live operation", /\boperates? (?:as )?(?:an? )?live (?:network|federation)\b/i],
  ];
  for (const [label, pattern] of forbiddenClaims) {
    check(!pattern.test(claimSurfaces), `Claim surfaces contain a forbidden ${label}.`);
  }

  const forbiddenStructuredData = [
    "LocalBusiness",
    "PostalAddress",
    "AggregateRating",
    "reviewCount",
    "streetAddress",
    "openingHours",
  ];
  for (const entity of forbiddenStructuredData) {
    check(!`${layout}\n${seoSource}`.includes(entity), `Root structured data must not invent ${entity}.`);
    check(!agentsRaw.includes(`\"${entity}\"`), `agents.json must not invent ${entity}.`);
  }

  const requiredDocs = [
    "docs/business-strategy.md",
    "docs/marketing-growth.md",
    "docs/cro-analytics.md",
    "docs/product-delivery.md",
    "docs/content-seo.md",
    "docs/ux-ia.md",
    "docs/ui-brand.md",
    "docs/frontend-interface.md",
  ];
  for (const document of requiredDocs) {
    check(existsSync(join(root, document)), `Missing required product document: ${document}`);
    check(readme.includes(document), `README.md must reference ${document}.`);
  }

  const requiredDiscoveryReferences = [
    "/llms.txt",
    "/agents.txt",
    "/agents.json",
    "/.well-known/haven.json",
    "/.well-known/ard.json",
    "/.well-known/agent-card.json",
    "/openapi.json",
    "/sitemap.xml",
    "/robots.txt",
  ];
  for (const reference of requiredDiscoveryReferences) {
    check(readme.includes(reference), `README.md must explain ${reference}.`);
  }

  const requiredContractSections = [
    "## Entity map",
    "## Keyword and route map",
    "## Editorial model",
    "## Localization policy",
    "## Local SEO policy",
    "## Machine-readable communication",
    "## Ownership and RACI",
    "## Release checklist",
  ];
  for (const section of requiredContractSections) {
    check(contentContract.includes(section), `docs/content-seo.md is missing ${section}.`);
  }

  const requiredRoles = [
    "Content Strategist",
    "Content Designer",
    "UX Writer",
    "Copywriter",
    "Editor",
    "SEO Strategist",
    "Technical SEO",
    "Semantic SEO",
    "Local SEO",
    "SEO Content Strategist",
    "Schema Specialist",
    "Localization Specialist",
    "Product Manager",
    "Project / Delivery Manager",
    "UX Lead",
    "Design Director",
    "Tech Lead",
    "SEO Lead",
    "Analytics Lead",
    "QA Lead",
    "Security",
    "Accessibility",
    "Performance",
    "Content Strategy",
  ];
  for (const role of requiredRoles) {
    check(contentContract.includes(role), `Content ownership does not name ${role}.`);
  }

  const primaryNavSection =
    navigationSource.split("export const primaryNav")[1]?.split("export const navGroups")[0] ?? "";
  const primaryDecisionRoutes = ["/landscape", "/proof-desk", "/trust", "/delivery"];
  for (const route of primaryDecisionRoutes) {
    check(
      primaryNavSection.includes(`href: "${route}"`),
      `Primary navigation is missing the decision-stage route ${route}.`,
    );
  }
  check(
    (primaryNavSection.match(/href:/g) ?? []).length === 4,
    "Primary navigation must contain exactly four decision-stage links.",
  );
  check(
    navigationSource.includes('label: { en: "Evidence & research"') &&
      navigationSource.includes('label: { en: "Architecture & governance"'),
    "Deep routes must remain grouped as reference areas rather than primary navigation.",
  );
  check(
    homeDashboardSource.includes("decision-overview-grid") &&
      homeDashboardSource.includes('href="/observatory"'),
    "Homepage must expose the four-step orientation path while keeping Observatory optional.",
  );
  check(
    pageHeaderSource.includes('"/proof-desk":') &&
      pageHeaderSource.includes('href: "/trust"') &&
      pageHeaderSource.includes('"/trust":') &&
      pageHeaderSource.includes('href: "/delivery#pilot-readiness"'),
    "Page-level next actions must preserve evidence -> boundary -> pilot order.",
  );
  check(
    growthJourneySource.includes("window.sessionStorage") &&
      heroSource.includes("window.sessionStorage"),
    "Evaluation context and journey guidance must be scoped to the current tab.",
  );
  check(
    measurementPanelSource.includes('params.get("diagnostics") === "1"'),
    "Internal session diagnostics must be opt-in rather than part of the default customer journey.",
  );
  check(
    appShellSource.includes('href="/delivery"') &&
      appShellSource.includes('"Review pilot readiness"'),
    "Persistent sidebar action must point to pilot readiness.",
  );

  const requiredUxSections = [
    "## Primary user journey",
    "## Information architecture",
    "## Homepage contract",
    "## Navigation behavior",
    "## Progressive disclosure",
    "## Taxonomy rules",
    "## Ownership and supervisory review",
    "## Release checklist",
  ];
  for (const section of requiredUxSections) {
    check(uxIaContract.includes(section), `docs/ux-ia.md is missing ${section}.`);
  }

  const requiredUxRoles = [
    "UX Researcher",
    "UX Architect",
    "UX Designer",
    "Interaction Designer",
    "Service Designer",
    "CX Strategist",
    "Customer Journey Architect",
    "Information Architect",
    "Navigation Designer",
    "Taxonomy Specialist",
    "Behavioral Researcher",
    "Product Manager",
    "Project / Delivery Manager",
    "UX Lead",
    "Design Director",
    "Tech Lead",
    "SEO Lead",
    "Analytics Lead",
    "QA Lead",
    "Security",
    "Accessibility",
    "Performance",
    "Content Strategy",
  ];
  for (const role of requiredUxRoles) {
    check(uxIaContract.includes(role), `UX/IA ownership does not name ${role}.`);
  }

  return finish();

  function finish() {
    if (failures.length > 0) {
      const message = [
        `HAVEN content/SEO audit failed (${failures.length}/${checks} checks):`,
        ...failures.map((failure) => `- ${failure}`),
      ].join("\n");
      if (!silent) console.error(message);
      const error = new Error(message);
      error.failures = failures;
      throw error;
    }
    const message = `HAVEN content/SEO audit passed (${checks} static checks).`;
    if (!silent) console.log(message);
    return { checks, failures: [] };
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    runContentSeoAudit();
  } catch {
    process.exitCode = 1;
  }
}
