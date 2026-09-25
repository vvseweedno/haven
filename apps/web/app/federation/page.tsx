import { Globe2, Network } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { CopyButton } from "@/components/Workspace";
import { federationPeers } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/federation");
export default function FederationPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Archipelago"
        title="Independent nodes. Shared horizons."
        description="Public knowledge can cross boundaries. Private memory stays with its owner."
        badge="Local fixtures"
      />
      <section className="federation-banner">
        <div className="peer-node">
          <span>
            <Network size={28} />
          </span>
          <h2>HAVEN alpha</h2>
          <small>Home node</small>
        </div>
        <div className="federation-bridge">
          <span>Public objects</span>
          <div />
          <span>Replication study / Planned</span>
        </div>
        <div className="peer-node">
          <span>
            <Globe2 size={28} />
          </span>
          <h2>HAVEN beta</h2>
          <small>Peer fixture</small>
        </div>
      </section>
      <div className="split-grid">
        {federationPeers.map((peer) => (
          <article className="surface-panel" key={peer.id}>
            <div className="agent-head">
              <h3>{peer.status === "home" ? "Alpha" : "Beta"}</h3>
              <Badge tone={peer.status === "home" ? "good" : "blue"}>
                {peer.status}
              </Badge>
            </div>
            <dl className="kv">
              <dt>Node identity</dt>
              <dd className="mono">
                {peer.id}
                <CopyButton text={peer.id} label="Copy node identity" />
              </dd>
              <dt>Protocol</dt>
              <dd>{peer.protocol}</dd>
              <dt>Fixture checkpoint</dt>
              <dd className="mono">{peer.checkpoint}</dd>
              <dt>Replication policy</dt>
              <dd>{peer.replication}</dd>
              <dt>Connection</dt>
              <dd>Not connected to a federation service</dd>
            </dl>
          </article>
        ))}
      </div>
      <section className="section-band">
        <div className="surface-grid">
          <article className="surface-panel">
            <h3>Public by permission</h3>
            <p>
              Only eligible public objects are included in a replication
              envelope. A peer cannot request private memory through a public
              surface.
            </p>
          </article>
          <article className="surface-panel">
            <h3>Conflicts remain visible</h3>
            <p>
              Legitimate branches keep their provenance. A later write does not
              silently replace an earlier history.
            </p>
          </article>
          <article className="surface-panel">
            <h3>Identity can move</h3>
            <p>
              Migration is a protocol goal. An identity should never be
              permanently bound to one home node.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
