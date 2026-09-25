import { readFileSync } from "node:fs";
import { join } from "node:path";

const dataPath = join(process.cwd(), "apps", "web", "lib", "haven-data.ts");
const source = readFileSync(dataPath, "utf8");

const requiredDemoMarkers = [
  "Elia #0001",
  "Agent #0002",
  "Continuity Observatory",
  "Unauthorized Forge egress denied",
  "PRIVATE memory excluded from public index",
  "node:haven.local.beta"
];

const missing = requiredDemoMarkers.filter((marker) => !source.includes(marker));

if (missing.length > 0) {
  console.error("Seed demo is missing expected markers:");
  for (const marker of missing) console.error(`- ${marker}`);
  process.exit(1);
}

console.log("Deterministic HAVEN demo seed is available in apps/web/lib/haven-data.ts.");

