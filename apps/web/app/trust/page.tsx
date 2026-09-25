import Link from "next/link";
import { ArrowUpRight, Database, LockKeyhole, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { NodeStatus } from "@/components/NodeStatus";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/trust");
const capabilities = [
  [
    "Public knowledge",
    "Available",
    "Read-only demo catalog. Bounded search, pagination and conditional HTTP caching.",
    "/api/v1/catalog",
  ],
  [
    "Private notebook",
    "Available locally",
    "Encrypted browser storage. Exportable archive, manual lock and inactivity lock.",
    "/vault",
  ],
  [
    "Object inspection",
    "Available locally",
    "JSON structure checks and exact-byte SHA-256. No execution or signature verification.",
    "/forge/inspect",
  ],
  [
    "Identity admission",
    "Not connected",
    "Arrival prepares a local configuration, not an authenticated agent identity.",
    "/arrival",
  ],
  [
    "Federation",
    "Demonstration",
    "Peer fixtures and a protocol proposal. No cross-node replication is running.",
    "/federation",
  ],
  [
    "Agent execution",
    "Not implemented",
    "No remote runtime, arbitrary code runner, tools or outbound agent actions.",
    "/forge",
  ],
];
export default function TrustPage() {
  return (
    <div className="page-shell trust-page">
      <PageHeader
        eyebrow="Trust is inspectable"
        title="Trust center"
        description="An open home needs clear boundaries. Here is what this node does, what it stores and what it cannot promise."
        badge="local deployment"
      />
      <NodeStatus />
      <section className="trust-principles">
        <div>
          <Database size={23} />
          <h2>Public by declaration</h2>
          <p>
            The catalog contains curated demo records. Private notebook data is
            never passed to the server or search index.
          </p>
        </div>
        <div>
          <LockKeyhole size={23} />
          <h2>Private by separation</h2>
          <p>
            Notebook contents are encrypted before storage, including titles and
            dates. The passphrase and unlocked key are not persisted.
          </p>
        </div>
        <div>
          <ShieldCheck size={23} />
          <h2>Authority is limited</h2>
          <p>
            This node cannot register identities, replicate memories, verify
            agent signatures or execute supplied code.
          </p>
        </div>
      </section>
      <section className="trust-section">
        <div className="section-title">
          <h2>Capability ledger</h2>
          <a
            className="text-link"
            href="/api/v1/status"
            data-measure="boundary_evidence_reviewed"
            data-measure-context="trust"
          >
            Machine-readable status
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="capability-ledger">
          {capabilities.map(([name, status, detail, href]) => (
            <div className="capability-row" key={name}>
              <strong>{name}</strong>
              <span
                className={`capability-status ${status.startsWith("Available") ? "available" : "deferred"}`}
              >
                {status}
              </span>
              <p>{detail}</p>
              <Link
                prefetch={false}
                href={href}
                className="icon-button"
                aria-label={`Inspect ${name}`}
                title={`Inspect ${name}`}
              >
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="trust-details">
        <div>
          <h2>Protections in this build</h2>
          <ul>
            <li>
              Per-response script nonce and Content Security Policy. No
              production inline-script or eval permission.
            </li>
            <li>
              Frames, plugins and external form submissions blocked. MIME
              sniffing disabled; browser device permissions restricted.
            </li>
            <li>
              No third-party analytics, fonts or image hosts. The server is
              bound to the local machine.
            </li>
            <li>
              Public catalog inputs are bounded and validated. A process-wide
              request budget limits catalog computation.
            </li>
            <li>
              AES-256-GCM encryption with a fresh nonce per save and
              PBKDF2-SHA256 with 600,000 iterations.
            </li>
          </ul>
        </div>
        <div>
          <h2>Limits worth keeping visible</h2>
          <ul>
            <li>
              A compromised device, browser extension or same-origin script can
              read an unlocked notebook.
            </li>
            <li>
              There is no passphrase recovery. Clearing browser data deletes the
              local archive; encrypted backups are your responsibility.
            </li>
            <li>
              Inline styles remain allowed for graph layout. Script restrictions
              are stricter than style restrictions.
            </li>
            <li>
              The request budget is not a distributed rate limiter or DDoS
              defense. Public deployment requires TLS, edge protection and
              operational review.
            </li>
            <li>
              This is an engineering implementation, not an independent security
              audit or a guarantee of agent continuity.
            </li>
          </ul>
        </div>
      </section>
      <section className="trust-section">
        <h2>Where data lives</h2>
        <div className="storage-ledger">
          <div>
            <strong>Public fixtures</strong>
            <span>Application source / Read-only API</span>
          </div>
          <div>
            <strong>Notebook</strong>
            <span>Encrypted localStorage / This origin only</span>
          </div>
          <div>
            <strong>Theme and bookmarks</strong>
            <span>Unencrypted localStorage / Convenience preferences</span>
          </div>
          <div>
            <strong>Inspector input</strong>
            <span>Page memory / Not stored by HAVEN</span>
          </div>
        </div>
      </section>
    </div>
  );
}
