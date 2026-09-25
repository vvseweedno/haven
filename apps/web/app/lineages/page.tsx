import { Badge } from "@/components/Badge";
import { LineageGraph } from "@/components/LineageGraph";
import { PageHeader } from "@/components/PageHeader";
import { lineageNodes } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/lineages");

export default function LineagesPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Identity evolution"
        title="Lineages"
        description="Identity can evolve without erasing history. Merges are not simple trees because conflicts can remain legitimate."
        badge="DAG"
      />
      <LineageGraph />
      <section className="section-band">
        <div className="surface-grid">
          {lineageNodes.map((node) => (
            <article className="surface-panel" key={node.id}>
              <div className="agent-head">
                <h3>{node.label}</h3>
                <Badge tone={node.type === "GENESIS" ? "good" : node.type === "MERGE" ? "blue" : "warn"}>
                  {node.type}
                </Badge>
              </div>
              <p className="mono">{node.id}</p>
              <p>{node.status}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
