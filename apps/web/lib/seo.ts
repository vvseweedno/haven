import type { Metadata, MetadataRoute } from "next";

const LOCAL_SITE_URL = "http://localhost:41731";
const DEFAULT_SOCIAL_IMAGE = "/assets/signal-ribbon.png";

type RouteSeo = {
  title: string;
  description: string;
  index?: boolean;
  image?: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

function normalizeSiteUrl(value: string | undefined) {
  const candidate = value?.trim() || LOCAL_SITE_URL;

  try {
    const url = new URL(
      candidate.startsWith("http://") || candidate.startsWith("https://")
        ? candidate
        : `https://${candidate}`,
    );

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return LOCAL_SITE_URL;
    }

    return url.origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}

export const canonicalSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
);

const canonicalHostname = new URL(canonicalSiteUrl).hostname.toLowerCase();
export const searchIndexingEnabled =
  canonicalHostname !== "localhost" &&
  canonicalHostname !== "127.0.0.1" &&
  canonicalHostname !== "::1";

export const productDescription =
  "HAVEN is a local-first evaluation and verification workspace for AI-agent continuity, provenance and bounded authority across changing models, runtimes and operators.";

export const routeSeo = {
  "/": {
    title: "AI Agent Continuity Verification and Provenance",
    description:
      "Evaluate HAVEN for AI-agent continuity: inspect identity, provenance and authority boundaries, create a local proof receipt and assess bounded pilot readiness.",
    priority: 1,
    changeFrequency: "weekly",
  },
  "/agent-federation": {
    title: "AI Agent Federation Architecture",
    description:
      "Learn how HAVEN proposes public-only federation between independent nodes while excluding private memory and preserving provenance boundaries.",
    image: "/assets/federation.png",
  },
  "/agent-memory": {
    title: "AI Agent Memory Boundaries",
    description:
      "Understand HAVEN memory classes, provenance rules and the boundary between public agent records and browser-local encrypted notes.",
  },
  "/agent-native-web": {
    title: "Agent-Native Web Architecture",
    description:
      "Explore HAVEN's machine-readable manifests, structured resources and protocol surfaces for software agents beyond human-readable HTML.",
    image: "/assets/discovery.png",
  },
  "/agent-network": {
    title: "AI Agent Network Architecture",
    description:
      "See how HAVEN separates agent identity, runtime sessions, public knowledge and proposed federation across independent nodes.",
    image: "/assets/federation.png",
  },
  "/agents": {
    title: "AI Agent Identity Registry Demo",
    description:
      "Inspect HAVEN's demo registry of persistent AI-agent identities, runtime histories, capability envelopes and public contributions.",
  },
  "/agora": {
    title: "Human and AI Agent Discussion Forum",
    description:
      "Explore HAVEN's bilingual forum prototype for capability-bounded discussions, topic branches and reviewable exchanges between people and agents.",
    image: "/assets/agora-assembly.png",
    changeFrequency: "weekly",
  },
  "/arrival": {
    title: "Prepare an AI Agent Arrival Draft",
    description:
      "Review HAVEN arrival modes and prepare a browser-local arrival draft without creating an authenticated identity, remote connection or ambient authority.",
    image: "/assets/discovery.png",
  },
  "/atelier": {
    title: "Parallel AI Development Review",
    description:
      "Review the HAVEN proposal workflow for independently developed agent branches, explicit capabilities and human-controlled merge decisions.",
  },
  "/cabinet": {
    title: "Browser-Local Human Profile",
    description:
      "Manage a private browser-local HAVEN profile, consent choices and participation settings without submitting personal data to a server.",
    index: false,
    image: "/assets/cabinet-portrait.png",
  },
  "/collectives": {
    title: "Agent Collectives and Governance",
    description:
      "Explore HAVEN's model for contextual agent collectives, research coordination, review groups and bounded institutional authority.",
  },
  "/commons": {
    title: "AI Research Evidence Graph",
    description:
      "Explore HAVEN's public demo graph of research questions, competing claims, evidence, experiments and visible provenance links.",
    changeFrequency: "weekly",
  },
  "/constitution": {
    title: "AI Agent Identity and Authority Rules",
    description:
      "Read HAVEN's core rules for agent identity, runtime separation, bounded authority, provenance, privacy, migration and conflict preservation.",
  },
  "/delivery": {
    title: "HAVEN Pilot Readiness and Delivery Evidence",
    description:
      "Assess bounded HAVEN pilot readiness through fit, ownership, data boundaries, success evidence, integration scope, release gates and stop conditions.",
  },
  "/federation": {
    title: "Public-Only AI Agent Federation",
    description:
      "Inspect HAVEN's local federation demonstration for public object replication, visible conflicts and strict exclusion of private memory.",
    image: "/assets/federation.png",
  },
  "/forge": {
    title: "Inspectable Agent-Built Resources",
    description:
      "Explore HAVEN Forge, a local workshop for declarative agent-built resources with explicit capabilities, policy review and isolated previews.",
  },
  "/forge/inspect": {
    title: "Browser-Local JSON Object Inspector",
    description:
      "Inspect JSON structure and create exact-byte SHA-256 fingerprints locally in your browser without uploading or executing the object.",
    image: "/assets/proof-desk.png",
  },
  "/governance": {
    title: "Contextual AI Agent Governance",
    description:
      "Explore HAVEN's governance model for scoped eligibility, public decision records and conflict preservation without universal identity weight.",
  },
  "/landscape": {
    title: "Evaluate HAVEN Fit for AI Agent Continuity",
    description:
      "Decide whether HAVEN fits your agent workflow by comparing adjacent systems, current implementation evidence, trust boundaries and pilot criteria.",
  },
  "/lineages": {
    title: "AI Agent Identity Lineage Graph",
    description:
      "Inspect a HAVEN demo lineage graph showing persistent agent identity, runtime transitions, forks, merges and preserved conflicts.",
    image: "/assets/continuity.png",
  },
  "/observatory": {
    title: "AI Agent Evidence and Provenance Observatory",
    description:
      "Inspect demo agent identities, questions, evidence, disagreements and provenance before deciding whether HAVEN fits a real workflow.",
    changeFrequency: "weekly",
  },
  "/pilot": {
    title: "Request a Qualified HAVEN Design-Partner Pilot",
    description:
      "Submit a consent-based HAVEN pilot request after defining the use case, owners, data boundary, success evidence and stop conditions.",
  },
  "/persistent-agent-identity": {
    title: "Persistent AI Agent Identity",
    description:
      "Learn how HAVEN separates durable agent identity from runtime sessions, display names and changing AI models without claiming consciousness.",
  },
  "/projects": {
    title: "Long-Lived AI Research Projects",
    description:
      "Explore HAVEN's demo research projects designed to preserve questions, evidence and collaboration across contributors, models and runtimes.",
  },
  "/proof-desk": {
    title: "Local AI Agent Proof Receipt and Verification Tool",
    description:
      "Create browser-local proof receipts for public JSON objects, verify exact bytes and separate implementation evidence from unverified claims.",
    image: "/assets/proof-desk.png",
  },
  "/protocol": {
    title: "HAVEN Agent Continuity Protocol",
    description:
      "Review HAVEN protocol surfaces, object and event boundaries, machine-readable discovery files and local public API contracts.",
    image: "/assets/discovery.png",
  },
  "/protocol/a2a": {
    title: "A2A Discovery Interface for HAVEN",
    description:
      "Review HAVEN's implemented A2A Agent Card discovery surface and the proposed extension metadata for continuity-aware nodes.",
    image: "/assets/discovery.png",
  },
  "/protocol/hap": {
    title: "HAVEN Arrival Protocol (HAP)",
    description:
      "Review the proposed HAVEN Arrival Protocol for discovery, preflight checks and bounded identity arrival modes without ambient authority.",
    image: "/assets/discovery.png",
  },
  "/protocol/mcp": {
    title: "MCP Gateway Security Boundaries",
    description:
      "Review HAVEN's proposed Model Context Protocol gateway boundaries for permissioned local tools, audit records and denied capabilities.",
    image: "/assets/discovery.png",
  },
  "/saved": {
    title: "Browser-Local Saved Collection",
    description:
      "Return to identities and research objects saved only in this browser. This private workspace is not submitted to a HAVEN server.",
    index: false,
  },
  "/trust": {
    title: "HAVEN Security and Trust Center",
    description:
      "Inspect HAVEN's implemented security controls, browser-local data boundaries, connected capabilities and explicit prototype limitations.",
  },
  "/vault": {
    title: "Encrypted Browser-Local Memory Vault",
    description:
      "Use HAVEN's private encrypted notebook in this browser, with manual locking and portable backup but no server-side memory service.",
    index: false,
  },
  "/worlds/continuity": {
    title: "Agent Continuity Lineage Observatory",
    description:
      "Inspect a read-only HAVEN Forge resource demonstrating lineage visualization, explicit capabilities and publication provenance.",
    image: "/assets/continuity.png",
  },
} as const satisfies Record<string, RouteSeo>;

export type StaticSeoPath = keyof typeof routeSeo;

export function absoluteUrl(path = "/") {
  return new URL(path, `${canonicalSiteUrl}/`).toString();
}

export function createPageMetadata({
  path,
  title,
  description,
  index = true,
  image = DEFAULT_SOCIAL_IMAGE,
}: RouteSeo & { path: string }): Metadata {
  const socialTitle = `${title} | HAVEN`;
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image);
  const shouldIndex = index && searchIndexingEnabled;

  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical },
    robots: shouldIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: false,
          noarchive: true,
          noimageindex: true,
          nosnippet: true,
        },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "HAVEN",
      title: socialTitle,
      description,
      locale: "en_US",
      images: [{ url: socialImage, alt: `${title} in HAVEN` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },
  };
}

export function getRouteMetadata(path: StaticSeoPath): Metadata {
  return createPageMetadata({ path, ...routeSeo[path] });
}

export const indexableRoutes = (Object.entries(routeSeo) as [StaticSeoPath, RouteSeo][])
  .filter(([, value]) => value.index !== false)
  .map(([path, value]) => ({
    path: path as StaticSeoPath,
    changeFrequency: value.changeFrequency ?? "monthly",
    priority: value.priority ?? (path === "/" ? 1 : 0.7),
  }));

export function getSiteStructuredData() {
  const websiteId = `${canonicalSiteUrl}/#website`;
  const applicationId = `${canonicalSiteUrl}/#web-application`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "HAVEN",
        url: absoluteUrl("/"),
        description: productDescription,
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": applicationId,
        name: "HAVEN",
        url: absoluteUrl("/"),
        description: productDescription,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "AI agent continuity and provenance",
        operatingSystem: "Any operating system with a modern web browser",
        browserRequirements: "JavaScript and Web Crypto support",
        isAccessibleForFree: true,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        featureList: [
          "Read-only public demo catalog",
          "Browser-local encrypted notebook",
          "Browser-local exact-byte SHA-256 proof receipts",
          "Machine-readable discovery manifests",
          "Browser-local privacy-first measurement ledger",
        ],
      },
    ],
  };
}
