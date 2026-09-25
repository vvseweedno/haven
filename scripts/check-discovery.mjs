import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runContentSeoAudit } from "./check-content-seo.mjs";

const root = process.cwd();
const publicDir = join(root, "apps", "web", "public");

const requiredFiles = [
  "llms.txt",
  "agents.txt",
  "agents.json",
  "parallel-atelier.json",
  "delivery.json",
  "openapi.json",
  ".well-known/ard.json",
  ".well-known/haven.json",
  ".well-known/agent-card.json"
];

const requiredPages = [
  "app/page.tsx",
  "app/arrival/page.tsx",
  "app/observatory/page.tsx",
  "app/agora/page.tsx",
  "app/cabinet/page.tsx",
  "app/atelier/page.tsx",
  "app/delivery/page.tsx",
  "app/landscape/page.tsx",
  "app/pilot/page.tsx",
  "app/proof-desk/page.tsx",
  "app/agents/page.tsx",
  "app/agents/[id]/page.tsx",
  "app/commons/page.tsx",
  "app/lineages/page.tsx",
  "app/forge/page.tsx",
  "app/federation/page.tsx",
  "app/protocol/page.tsx",
  "app/worlds/continuity/page.tsx"
];

const missing = [
  ...requiredFiles
    .filter((file) => !existsSync(join(publicDir, file)))
    .map((file) => `public/${file}`),
  ...requiredPages
    .filter((file) => !existsSync(join(root, "apps", "web", file)))
    .map((file) => `apps/web/${file}`)
];

if (
  !existsSync(join(publicDir, "robots.txt")) &&
  !existsSync(join(root, "apps", "web", "app", "robots.ts"))
) {
  missing.push("public/robots.txt or apps/web/app/robots.ts");
}

if (
  !existsSync(join(publicDir, "sitemap.xml")) &&
  !existsSync(join(root, "apps", "web", "app", "sitemap.ts"))
) {
  missing.push("public/sitemap.xml or apps/web/app/sitemap.ts");
}

if (missing.length > 0) {
  console.error("HAVEN discovery check failed. Missing:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

for (const file of ["agents.json", "parallel-atelier.json", "delivery.json", ".well-known/ard.json", ".well-known/haven.json", ".well-known/agent-card.json", "openapi.json"]) {
  JSON.parse(readFileSync(join(publicDir, file), "utf8"));
}

const staticRobotsPath = join(publicDir, "robots.txt");
const robots = readFileSync(
  existsSync(staticRobotsPath)
    ? staticRobotsPath
    : join(root, "apps", "web", "app", "robots.ts"),
  "utf8",
);
if (
  existsSync(staticRobotsPath)
    ? !robots.includes("Agentmap: http://localhost:41731/.well-known/ard.json")
    : !robots.includes('"/.well-known/"') || !robots.includes("sitemap")
) {
  console.error("Crawler discovery is missing the local manifest or sitemap reference.");
  process.exit(1);
}

const staticSitemapPath = join(publicDir, "sitemap.xml");
const sitemap = existsSync(staticSitemapPath)
  ? readFileSync(staticSitemapPath, "utf8")
  : `${readFileSync(join(root, "apps", "web", "app", "sitemap.ts"), "utf8")}\n${readFileSync(join(root, "apps", "web", "lib", "seo.ts"), "utf8")}`;
const sitemapIncludes = (path) =>
  existsSync(staticSitemapPath)
    ? sitemap.includes(`http://localhost:41731${path}`)
    : sitemap.includes(`\"${path}\"`);
const llms = readFileSync(join(publicDir, "llms.txt"), "utf8");
const manifest = JSON.parse(
  readFileSync(join(publicDir, ".well-known/haven.json"), "utf8"),
);
if (
  !sitemapIncludes("/proof-desk") ||
  !llms.includes("http://localhost:41731/proof-desk") ||
  manifest.publicResources?.proofDesk !== "http://localhost:41731/proof-desk" ||
  !sitemapIncludes("/agora") ||
  !llms.includes("http://localhost:41731/agora") ||
  manifest.publicResources?.agora !== "http://localhost:41731/agora" ||
  !sitemapIncludes("/delivery") ||
  !llms.includes("http://localhost:41731/delivery") ||
  manifest.publicResources?.deliveryContract !== "http://localhost:41731/delivery.json" ||
  manifest.status?.delivery !== "local-delivery-contract-human-release-required" ||
  !sitemapIncludes("/pilot") ||
  !llms.includes("http://localhost:41731/pilot") ||
  manifest.publicResources?.pilot !== "http://localhost:41731/pilot" ||
  manifest.publicResources?.pilotRequest !== "http://localhost:41731/api/v1/pilot-request" ||
  manifest.status?.pilotIntake !== "explicit-consent-configurable" ||
  manifest.publicResources?.parallelAtelierManifest !== "http://localhost:41731/parallel-atelier.json" ||
  manifest.status?.parallelAtelier !== "proposal-only-human-merge-required"
) {
  console.error("Interactive public surfaces are missing from discovery.");
  process.exit(1);
}

try {
  const result = runContentSeoAudit({ root, silent: true });
  console.log(
    `HAVEN discovery surfaces are present, parseable and content-safe (${result.checks} content/SEO checks).`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
