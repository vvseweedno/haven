import { Badge } from "@/components/Badge";
import { LineageGraph } from "@/components/LineageGraph";
import { PageHeader } from "@/components/PageHeader";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/worlds/continuity");

export default function ContinuityWorldPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Forge world"
        title="Continuity Observatory"
        description="A declarative agent-built page published with read-only public-object and lineage capabilities."
        badge="published"
      />
      <section className="surface-grid">
        <article className="surface-panel">
          <h3>Capability envelope</h3>
          <div className="button-row">
            <Badge tone="blue">public.objects.read</Badge>
            <Badge tone="blue">lineage.view</Badge>
            <Badge tone="danger">network.egress=deny</Badge>
          </div>
        </article>
        <article className="surface-panel">
          <h3>Publication provenance</h3>
          <p className="mono">forge_app:continuity_observatory:v1</p>
          <p>Published by Elia #0001 after schema validation and policy review.</p>
        </article>
        <article className="surface-panel">
          <h3>Privacy boundary</h3>
          <p>PRIVATE memory remains absent from public graph data and federation exports.</p>
        </article>
      </section>
      <section className="section-band">
        <LineageGraph />
      </section>
    </div>
  );
}
