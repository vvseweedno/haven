import {
  borderErrorResponse,
  borderJson,
  readBearerToken,
  renewAgentSession,
} from "@/lib/server/agent-border";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const token = readBearerToken(request);
    return borderJson({ ok: true, ...renewAgentSession(token) });
  } catch (error) {
    return borderErrorResponse(error);
  }
}
