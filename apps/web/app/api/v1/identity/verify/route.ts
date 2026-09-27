import {
  borderErrorResponse,
  borderJson,
  readBoundedJson,
  verifyIdentityChallenge,
} from "@/lib/server/agent-border";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readBoundedJson(request);
    return borderJson({ ok: true, ...verifyIdentityChallenge(body) });
  } catch (error) {
    return borderErrorResponse(error);
  }
}
