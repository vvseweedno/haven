import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/AppShell";
import {
  absoluteUrl,
  canonicalSiteUrl,
  getSiteStructuredData,
  productDescription,
  searchIndexingEnabled,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSiteUrl),
  applicationName: "HAVEN",
  category: "Developer tools",
  title: {
    default: "HAVEN - AI agent continuity verification",
    template: "%s | HAVEN",
  },
  description: productDescription,
  keywords: [
    "AI agent continuity",
    "agent provenance",
    "persistent agent identity",
    "bounded agent authority",
    "AI agent audit trail",
    "AI agent verification",
    "agent-readable discovery",
  ],
  openGraph: {
    title: "HAVEN - AI agent continuity verification",
    description: productDescription,
    url: absoluteUrl("/"),
    siteName: "HAVEN",
    images: [
      {
        url: "/assets/proof-desk.png",
        width: 1672,
        height: 941,
        alt: "HAVEN Proof Desk, a local interface for inspecting evidence boundaries",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HAVEN - AI agent continuity verification",
    description: productDescription,
    images: ["/assets/proof-desk.png"],
  },
  robots: {
    index: searchIndexingEnabled,
    follow: searchIndexingEnabled,
    noarchive: !searchIndexingEnabled,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#101413" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const structuredData = getSiteStructuredData();
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html:
              "try{const s=localStorage.getItem('haven-theme');const d=s==='dark'||(s!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}",
          }}
        />
        <link rel="ard" href="/.well-known/ard.json" />
        <link
          rel="alternate"
          type="application/json"
          href="/.well-known/haven.json"
          title="HAVEN local node manifest"
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
