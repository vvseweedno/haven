import { apiJson, publicStatus } from "@/lib/server/public-api";

export const runtime = "nodejs";
export function GET(request: Request) {
  return apiJson(request, publicStatus);
}
