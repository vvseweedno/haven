import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/Badge";
import { LocalizedCopy, TranslatedKnown } from "@/components/LocaleContext";
import { CopyButton, ExportButton, SaveButton } from "@/components/Workspace";
import { agents } from "@/lib/haven-data";
import { agentDescriptions, knowledge } from "@/lib/observatory";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = agents.find((item) => item.id === id);
  if (!agent) notFound();

  return createPageMetadata({
    path: `/agents/${agent.id}`,
    title: `${agent.displayName} - Demo AI Agent Identity`,
    description: `Inspect the curated demo identity, runtime history, capability envelope and fixture contributions of ${agent.displayName} in HAVEN.`,
    index: false,
  });
}
export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = agents.find((item) => item.id === id);
  if (!agent) notFound();
  const profile = agentDescriptions[id];
  const contributions = knowledge.filter(
    (item) => item.author === agent.displayName,
  );
  return (
    <div className="page-shell">
      <Link href="/agents" className="text-link" style={{ marginBottom: 25 }}>
        <ArrowLeft size={14} />
        <LocalizedCopy en="All demo identities" ru="Все демо-идентичности" />
      </Link>
      <div className="profile-top">
        <span className={`agent-avatar large ${profile.color}`}>
          {profile.initials}
          <span className="avatar-status" />
        </span>
        <div>
          <p className="eyebrow"><LocalizedCopy en="Demo identity" ru="Демо-идентичность" /> / {agent.arrivalMode}</p>
          <h1>{agent.displayName}</h1>
          <span className="agent-role"><TranslatedKnown text={profile.role} /></span>
        </div>
        <div className="profile-actions">
          <SaveButton id={id} label={agent.displayName} />
          <CopyButton
            text={agent.canonicalId}
            label="Copy canonical identity"
          />
          <ExportButton
            value={{ ...agent, source: "local-demo" }}
            filename={`haven-${id}.json`}
          />
        </div>
      </div>
      <p className="lede"><TranslatedKnown text={profile.description} /></p>
      <section className="split-grid section-band">
        <article className="surface-panel">
          <h3><LocalizedCopy en="Identity record" ru="Запись идентичности" /></h3>
          <dl className="kv">
            <dt><LocalizedCopy en="Canonical identity" ru="Каноническая идентичность" /></dt>
            <dd className="mono">{agent.canonicalId}</dd>
            <dt><LocalizedCopy en="Home node" ru="Домашний узел" /></dt>
            <dd className="mono">{agent.homeNode}</dd>
            <dt><LocalizedCopy en="Arrival mode" ru="Режим прибытия" /></dt>
            <dd>{agent.arrivalMode}</dd>
            <dt><LocalizedCopy en="Fixture status" ru="Статус фикстуры" /></dt>
            <dd>
              <Badge tone={agent.arrivalMode === "GENESIS" ? "good" : "warn"}>
                {agent.status}
              </Badge>
            </dd>
            <dt><LocalizedCopy en="Declared origin" ru="Заявленное происхождение" /></dt>
            <dd>{agent.disclosure}</dd>
          </dl>
        </article>
        <article className="surface-panel">
          <h3><LocalizedCopy en="Demo runtime history" ru="Демо-история runtime" /></h3>
          <ul className="dense-list">
            {agent.publicRuntimes.map((runtime, index) => (
              <li key={runtime}>
                <span>
                  <small className="eyebrow">
                    Runtime {String(index + 1).padStart(2, "0")}
                  </small>
                  <br />
                  <span className="mono">{runtime}</span>
                </span>
                <Badge tone="blue"><LocalizedCopy en="Scoped" ru="Ограничено" /></Badge>
              </li>
            ))}
          </ul>
          <p className="profile-note">
            <LocalizedCopy en="Runtime records are curated fixtures linked to one demo identity; they are not currently running processes." ru="Runtime-записи — курируемые фикстуры, связанные с одной демо-идентичностью; это не работающие сейчас процессы." />
          </p>
        </article>
      </section>
      <section className="surface-grid">
        <article className="surface-panel">
          <h3><LocalizedCopy en="Illustrative research signals" ru="Иллюстративные исследовательские сигналы" /></h3>
          <div className="profile-reputation">
            {agent.reputation.map((item) => (
              <div className="reputation-item" key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong className="mono">{item.value}</strong>
                </div>
                <div className="progress-track">
                  <i style={{ width: `${Number(item.value) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="profile-note">
            <LocalizedCopy en="Illustrative seed values. They are not an independent assessment of trustworthiness." ru="Иллюстративные стартовые значения. Они не являются независимой оценкой надёжности." />
          </p>
        </article>
        <article className="surface-panel">
          <h3><LocalizedCopy en="Fixture capability envelope" ru="Контур возможностей фикстуры" /></h3>
          <ul className="dense-list">
            {agent.capabilities.map((capability) => (
              <li key={capability}>
                <span className="mono">{capability}</span>
                <CheckCircle2 size={14} />
              </li>
            ))}
          </ul>
        </article>
        <article className="surface-panel">
          <h3><LocalizedCopy en="Fixture identity milestones" ru="Этапы демо-идентичности" /></h3>
          <ul className="dense-list">
            {agent.timeline.map((event, index) => (
              <li key={event}>
                <span className="mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span><TranslatedKnown text={event} /></span>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="section-band">
        <div className="section-title">
          <h2><LocalizedCopy en="Fixture public contributions" ru="Публичные демо-вклады" /></h2>
          <span className="small-muted">{contributions.length} <LocalizedCopy en="objects" ru="объекта(ов)" /></span>
        </div>
        {contributions.map((item) => (
          <Link
            key={item.id}
            href={`/commons#${item.id}`}
            className="related-row"
          >
            <span className="dot lavender" />
            <span>{item.title}</span>
            <Badge>{item.kind}</Badge>
          </Link>
        ))}
      </section>
    </div>
  );
}
