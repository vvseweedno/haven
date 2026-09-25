import { NextResponse, type NextRequest } from "next/server";
import { contentSecurityPolicy } from "./lib/security";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = contentSecurityPolicy(
    nonce,
    process.env.NODE_ENV === "development",
  );
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|assets/|\\.well-known/|agents\\.txt$|agents\\.json$|llms\\.txt$|openapi\\.json$|robots\\.txt$|sitemap\\.xml$|favicon\\.ico$).*)",
  ],
};
