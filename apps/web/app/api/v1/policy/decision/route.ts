import {
  authorizeCapabilityUse,
  borderErrorResponse,
  borderJson,
  readBearerToken,
  readBoundedJson,
} from "@/lib/server/agent-border";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const token = readBearerToken(request);
    const body = await readBoundedJson(request);
    return borderJson({ ok: true, ...authorizeCapabilityUse(token, body) });
  } catch (error) {
    return borderErrorResponse(error);
  }
}
