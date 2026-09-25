import type { MetadataRoute } from "next";
import { absoluteUrl, canonicalSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/.well-known/", "/agents.txt", "/agents.json", "/llms.txt"],
      disallow: ["/api/", "/healthz", "/readyz"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: canonicalSiteUrl,
  };
}
