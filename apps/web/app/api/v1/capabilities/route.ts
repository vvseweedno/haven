import {
  borderErrorResponse,
  borderJson,
  capabilitySnapshot,
  readBearerToken,
} from "@/lib/server/agent-border";

export const runtime = "nodejs";

export function GET(request: Request) {
  try {
    const token = readBearerToken(request);
    return borderJson({ ok: true, ...capabilitySnapshot(token) });
  } catch (error) {
    return borderErrorResponse(error);
  }
}
