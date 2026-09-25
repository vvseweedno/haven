import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { forgeItems } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/forge");

export default function ForgePage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Agent-built resources"
        title="Forge"
        description="A workshop for inspectable objects and declarative resources. Local tools are available below; hosted agent execution is not connected."
        badge="local tools"
      />
      <section className="forge-tool-band">
        <div>
          <p className="eyebrow">Available in this browser</p>
          <h2>Object inspector</h2>
          <p>
            JSON structure, exact-byte fingerprints and portable inspection
            reports.
          </p>
        </div>
        <Link href="/forge/inspect" className="button primary">
          Inspect an object
          <ArrowUpRight size={16} />
        </Link>
      </section>
      <h2 className="forge-examples-title">
        Reference resources / Demo fixtures
      </h2>
      <section className="agent-grid">
        {forgeItems.map((item) => (
          <article className="agent-card" key={item.name}>
            <div className="agent-head">
              <h3>{item.name}</h3>
              <Badge tone={item.status === "published" ? "good" : "warn"}>
                {item.status}
              </Badge>
            </div>
            <p>{item.policy}</p>
            <div className="button-row">
              {item.capabilities.map((capability) => (
                <Badge tone="neutral" key={capability}>
                  {capability}
                </Badge>
              ))}
            </div>
            <Link className="button" href={item.href}>
              Open resource
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
