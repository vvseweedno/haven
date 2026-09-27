import { borderDiscovery, borderJson } from "@/lib/server/agent-border";

export const runtime = "nodejs";

export function GET() {
  return borderJson(borderDiscovery(), 200, {
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  });
}
