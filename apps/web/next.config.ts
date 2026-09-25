import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { localPatterns: [{ pathname: "/assets/**", search: "" }] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'none'; frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
