import {
  borderDiscovery,
  borderErrorResponse,
  borderJson,
  enforceBorderBudget,
  readBoundedJson,
} from "@/lib/server/agent-border";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    enforceBorderBudget();
    const body = await readBoundedJson(request);
    if (
      typeof body === "object" &&
      body !== null &&
      !Array.isArray(body) &&
      "protocol" in body &&
      body.protocol !== undefined &&
      body.protocol !== "haven/1.3"
    ) {
      return borderJson(
        {
          ok: false,
          code: "PROTOCOL_UNSUPPORTED",
          supported: ["haven/1.3"],
        },
        409,
      );
    }
    return borderJson({ ok: true, ...borderDiscovery() });
  } catch (error) {
    return borderErrorResponse(error);
  }
}
