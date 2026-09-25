import { catalogResponse } from "@/lib/server/public-api";

export const runtime = "nodejs";
export function GET(request: Request) {
  return catalogResponse(request);
}
