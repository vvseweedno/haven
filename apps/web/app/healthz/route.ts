import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "haven-web",
    node: "node:haven.local.alpha"
  });
}

