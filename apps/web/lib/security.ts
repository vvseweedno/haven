export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

export function contentSecurityPolicy(nonce: string, development = false) {
  if (!/^[a-zA-Z0-9+/=_-]{20,100}$/.test(nonce))
    throw new Error("Invalid script nonce");
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    // React Flow positions nodes through inline styles. Script policy remains strict.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${development ? " ws://localhost:* ws://127.0.0.1:*" : ""}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "form-action 'self'",
  ].join("; ");
}

export function createRequestBudget(
  capacity = 180,
  refillPerSecond = 3,
  clock = Date.now,
) {
  let tokens = capacity;
  let previous = clock();
  return () => {
    const now = clock();
    tokens = Math.min(
      capacity,
      tokens + (Math.max(0, now - previous) / 1000) * refillPerSecond,
    );
    previous = now;
    if (tokens < 1) return false;
    tokens -= 1;
    return true;
  };
}
