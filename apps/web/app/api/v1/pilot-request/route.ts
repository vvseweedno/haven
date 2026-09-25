import {
  pilotIntakeConfigured,
  publicPilotContactUrl,
  sanitizePilotRequest,
} from "@/lib/pilot-intake";

export const runtime = "nodejs";

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

export async function GET() {
  return Response.json(
    {
      configured: pilotIntakeConfigured(),
      contactUrl: publicPilotContactUrl(),
      privacy: "explicit-submit-only",
    },
    { headers: jsonHeaders },
  );
}

export async function POST(request: Request) {
  const contactUrl = publicPilotContactUrl();
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(declaredLength) && declaredLength > 20_000) {
    return Response.json(
      { ok: false, code: "payload_too_large", contactUrl },
      { status: 413, headers: jsonHeaders },
    );
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return Response.json(
          { ok: false, code: "origin_rejected", contactUrl },
          { status: 403, headers: jsonHeaders },
        );
      }
    } catch {
      return Response.json(
        { ok: false, code: "origin_rejected", contactUrl },
        { status: 403, headers: jsonHeaders },
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, code: "invalid_json", contactUrl },
      { status: 400, headers: jsonHeaders },
    );
  }

  const parsed = sanitizePilotRequest(body);
  if (!parsed.ok) {
    if (parsed.errors.includes("bot_trap")) {
      return Response.json({ ok: true, accepted: true }, { status: 202, headers: jsonHeaders });
    }
    return Response.json(
      { ok: false, code: "validation_failed", errors: parsed.errors, contactUrl },
      { status: 400, headers: jsonHeaders },
    );
  }

  if (!pilotIntakeConfigured()) {
    return Response.json(
      {
        ok: false,
        code: "intake_not_configured",
        contactUrl,
      },
      { status: 503, headers: jsonHeaders },
    );
  }

  const webhook = process.env.HAVEN_PILOT_WEBHOOK_URL!.trim();
  const token = process.env.HAVEN_PILOT_WEBHOOK_TOKEN?.trim();
  const requestId = crypto.randomUUID();

  const payload = {
    schema: "haven.pilot-request.v1",
    requestId,
    submittedAt: new Date().toISOString(),
    source: "website-pilot-intake",
    request: parsed.value,
  };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "HAVEN-Pilot-Intake/1.0",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return Response.json(
        { ok: false, code: "handoff_failed", contactUrl },
        { status: 502, headers: jsonHeaders },
      );
    }

    return Response.json(
      { ok: true, requestId },
      { status: 202, headers: jsonHeaders },
    );
  } catch {
    return Response.json(
      { ok: false, code: "handoff_unavailable", contactUrl },
      { status: 502, headers: jsonHeaders },
    );
  }
}
