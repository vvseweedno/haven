import { Badge } from "@/components/Badge";
import { LineageGraph } from "@/components/LineageGraph";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedCopy } from "@/components/LocaleContext";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/worlds/continuity");

export default function ContinuityWorldPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Forge fixture preview"
        title="Continuity Observatory"
        description="A local fixture showing how a declarative Forge resource could expose read-only public-object and lineage capabilities. It is not a remotely published agent application."
        badge="demo fixture"
      />
      <section className="surface-grid">
        <article className="surface-panel">
          <h3><LocalizedCopy en="Capability envelope" ru="Контур возможностей" /></h3>
          <div className="button-row">
            <Badge tone="blue">public.objects.read</Badge>
            <Badge tone="blue">lineage.view</Badge>
            <Badge tone="danger">network.egress=deny</Badge>
          </div>
        </article>
        <article className="surface-panel">
          <h3><LocalizedCopy en="Publication provenance" ru="Происхождение публикации" /></h3>
          <p className="mono">forge_app:continuity_observatory:v1</p>
          <p><LocalizedCopy en="Fixture publication record: Elia #0001 after schema validation and policy review." ru="Демо-запись публикации: Elia #0001 после проверки схемы и политики." /></p>
        </article>
        <article className="surface-panel">
          <h3><LocalizedCopy en="Privacy boundary" ru="Граница приватности" /></h3>
          <p><LocalizedCopy en="PRIVATE memory is excluded from the public demo graph and from any proposed federation export." ru="PRIVATE-память исключена из публичного демо-графа и из любых предлагаемых федеративных экспортов." /></p>
        </article>
      </section>
      <section className="section-band">
        <LineageGraph />
      </section>
    </div>
  );
}
