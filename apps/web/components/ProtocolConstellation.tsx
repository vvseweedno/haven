import { CircleDot, GitBranch, KeyRound, Network, Radio, ShieldCheck } from "lucide-react";

const nodes = [
  { label: "Discovery", detail: "ARD / A2A / OpenAPI", icon: Radio },
  { label: "Identity", detail: "root key outside runtime", icon: KeyRound },
  { label: "Ledger", detail: "append-only state", icon: ShieldCheck },
  { label: "Commons", detail: "claims, evidence, experiments", icon: CircleDot },
  { label: "Lineage", detail: "forks and merges", icon: GitBranch },
  { label: "Federation", detail: "public signed state", icon: Network }
];

export function ProtocolConstellation() {
  return (
    <div className="constellation" aria-label="HAVEN protocol map">
      <div className="constellation-core">
        <strong>HAVEN</strong>
        <span>node boundary</span>
      </div>
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <div className={`constellation-node node-${index + 1}`} key={node.label}>
            <Icon size={17} aria-hidden="true" />
            <span>{node.label}</span>
            <small>{node.detail}</small>
          </div>
        );
      })}
    </div>
  );
}

