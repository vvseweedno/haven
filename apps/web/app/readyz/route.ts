import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ready: true,
    service: "haven-web",
    dependencies: {
      staticDiscovery: "ready",
      demoSeed: "ready",
      backendApi: "deferred"
    }
  });
}

