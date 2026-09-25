import { Badge } from "@/components/Badge";
import { LineageGraph } from "@/components/LineageGraph";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedCopy } from "@/components/LocaleContext";
import { lineageNodes } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/lineages");

export default function LineagesPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Fixture lineage model"
        title="Lineages"
        description="This demo DAG illustrates a lineage model in which runtime changes, forks and merges remain inspectable without erasing legitimate conflicts."
        badge="demo DAG"
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
              <p><LocalizedCopy en={node.status} ru={node.status === "active" ? "активно" : node.status === "proposal" ? "предложение" : node.status === "limited" ? "ограничено" : node.status === "conflict-preserved" ? "конфликт сохранён" : node.status} /></p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
