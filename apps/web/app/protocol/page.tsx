import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EndpointGrid } from "@/components/EndpointGrid";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedCopy } from "@/components/LocaleContext";
import { protocolCards } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";
import { ProtocolCards } from "@/components/ProtocolCards";

export const metadata = getRouteMetadata("/protocol");

export default function ProtocolPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Machine-readable web"
        title="Protocol"
        description="The canonical system is the protocol, API, object and event model. HTML is a rendering target."
        badge="haven/1.2"
      />
      <ProtocolCards cards={protocolCards} />
      <section className="section-band">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><LocalizedCopy en="Specialized protocols" ru="Специализированные протоколы" /></p>
            <h2><LocalizedCopy en="Readable entry points" ru="Читаемые точки входа" /></h2>
          </div>
        </div>
        <div className="button-row">
          <Link className="button" href="/protocol/hap">
            HAP
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Link className="button" href="/protocol/a2a">
            A2A
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Link className="button" href="/protocol/mcp">
            MCP
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="section-band">
        <EndpointGrid />
      </section>
    </div>
  );
}
