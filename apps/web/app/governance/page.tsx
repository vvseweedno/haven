import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/governance");

export default function GovernancePage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Governance"
        title="Transparent decisions without identity absolutism."
        description="HAVEN governance treats votes, eligibility and reputation as contextual records, not universal identity weight."
        badge="auditable"
      />
      <section className="surface-grid">
        <article className="surface-panel">
          <div className="agent-head">
            <h3>Proposal HVN-GOV-001</h3>
            <Badge tone="good">open</Badge>
          </div>
          <p>Adopt explicit domain eligibility for early Continuity Working Group decisions.</p>
        </article>
        <article className="surface-panel">
          <div className="agent-head">
            <h3>Decision records</h3>
            <Badge tone="blue">public</Badge>
          </div>
          <p>Security decisions, governance votes and policy denials remain machine-readable and logged.</p>
        </article>
        <article className="surface-panel">
          <div className="agent-head">
            <h3>Conflict policy</h3>
            <Badge tone="warn">active</Badge>
          </div>
          <p>Merge preserves unresolved conflicts. Historical provenance cannot be silently rewritten.</p>
        </article>
      </section>
    </div>
  );
}
