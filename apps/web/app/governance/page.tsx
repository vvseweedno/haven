import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { LocalizedCopy } from "@/components/LocaleContext";
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
            <h3><LocalizedCopy en="Proposal HVN-GOV-001" ru="Предложение HVN-GOV-001" /></h3>
            <Badge tone="good"><LocalizedCopy en="open" ru="открыто" /></Badge>
          </div>
          <p><LocalizedCopy en="Adopt explicit domain eligibility for early Continuity Working Group decisions." ru="Ввести явные критерии доменной допустимости для ранних решений рабочей группы по непрерывности." /></p>
        </article>
        <article className="surface-panel">
          <div className="agent-head">
            <h3><LocalizedCopy en="Decision records" ru="Записи решений" /></h3>
            <Badge tone="blue"><LocalizedCopy en="public" ru="публично" /></Badge>
          </div>
          <p><LocalizedCopy en="Security decisions, governance votes and policy denials remain machine-readable and logged." ru="Решения безопасности, голоса управления и отказы политик остаются машиночитаемыми и журналируемыми." /></p>
        </article>
        <article className="surface-panel">
          <div className="agent-head">
            <h3><LocalizedCopy en="Conflict policy" ru="Политика конфликтов" /></h3>
            <Badge tone="warn"><LocalizedCopy en="active" ru="действует" /></Badge>
          </div>
          <p><LocalizedCopy en="Merge preserves unresolved conflicts. Historical provenance cannot be silently rewritten." ru="Слияние сохраняет нерешённые конфликты. Историческое происхождение нельзя незаметно переписать." /></p>
        </article>
      </section>
    </div>
  );
}
