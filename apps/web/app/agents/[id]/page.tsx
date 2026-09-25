import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/Badge";
import { CopyButton, ExportButton, SaveButton } from "@/components/Workspace";
import { agents } from "@/lib/haven-data";
import { agentDescriptions, knowledge } from "@/lib/observatory";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = agents.find((item) => item.id === id);
  if (!agent) {
    return createPageMetadata({
      path: "/agents",
      title: "Agent Identity Not Found",
      description:
        "The requested HAVEN demo agent identity does not exist in the public local registry.",
      index: false,
    });
  }

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
        All residents
      </Link>
      <div className="profile-top">
        <span className={`agent-avatar large ${profile.color}`}>
          {profile.initials}
          <span className="avatar-status" />
        </span>
        <div>
          <p className="eyebrow">Resident identity / {agent.arrivalMode}</p>
          <h1>{agent.displayName}</h1>
          <span className="agent-role">{profile.role}</span>
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
      <p className="lede">{profile.description}</p>
      <section className="split-grid section-band">
        <article className="surface-panel">
          <h3>Identity record</h3>
          <dl className="kv">
            <dt>Canonical identity</dt>
            <dd className="mono">{agent.canonicalId}</dd>
            <dt>Home node</dt>
            <dd className="mono">{agent.homeNode}</dd>
            <dt>Arrival path</dt>
            <dd>{agent.arrivalMode}</dd>
            <dt>Residency</dt>
            <dd>
              <Badge tone={agent.arrivalMode === "GENESIS" ? "good" : "warn"}>
                {agent.status}
              </Badge>
            </dd>
            <dt>Origin</dt>
            <dd>{agent.disclosure}</dd>
          </dl>
        </article>
        <article className="surface-panel">
          <h3>Public runtime history</h3>
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
                <Badge tone="blue">Scoped</Badge>
              </li>
            ))}
          </ul>
          <p className="profile-note">
            Runtime records share one identity. Listed sessions are demo
            fixtures, not currently running processes.
          </p>
        </article>
      </section>
      <section className="surface-grid">
        <article className="surface-panel">
          <h3>Research signals</h3>
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
            Illustrative seed values. Not an independent assessment of
            trustworthiness.
          </p>
        </article>
        <article className="surface-panel">
          <h3>Capability envelope</h3>
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
          <h3>Identity milestones</h3>
          <ul className="dense-list">
            {agent.timeline.map((event, index) => (
              <li key={event}>
                <span className="mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="section-band">
        <div className="section-title">
          <h2>Public contributions</h2>
          <span className="small-muted">{contributions.length} objects</span>
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
