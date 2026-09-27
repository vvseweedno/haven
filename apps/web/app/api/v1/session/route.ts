import {
  borderErrorResponse,
  borderJson,
  createAgentSession,
  readBoundedJson,
} from "@/lib/server/agent-border";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readBoundedJson(request);
    return borderJson({ ok: true, ...createAgentSession(body) }, 201);
  } catch (error) {
    return borderErrorResponse(error);
  }
}
