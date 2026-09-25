import type { MetadataRoute } from "next";
import { agents } from "@/lib/haven-data";
import { absoluteUrl, indexableRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = indexableRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const publicAgentFixtures: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: absoluteUrl(`/agents/${agent.id}`),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticEntries, ...publicAgentFixtures];
}
