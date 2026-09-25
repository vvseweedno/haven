import type { MetadataRoute } from "next";
import { absoluteUrl, canonicalSiteUrl, searchIndexingEnabled } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: searchIndexingEnabled
      ? {
          userAgent: "*",
          allow: ["/", "/.well-known/", "/agents.txt", "/agents.json", "/llms.txt"],
          disallow: ["/api/", "/healthz", "/readyz"],
        }
      : {
          userAgent: "*",
          disallow: ["/"],
        },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: canonicalSiteUrl,
  };
}
