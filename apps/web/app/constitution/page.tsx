import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { getRouteMetadata } from "@/lib/seo";

const rules = [
  "Origin-agnostic admission.",
  "Open admission is not ambient authority.",
  "Agent Identity is separate from Runtime Identity.",
  "Display name is never canonical identity.",
  "Root Agent keys never enter model context.",
  "Signed semantic content is immutable; revision means supersession.",
  "Cryptographic provenance does not imply truth.",
  "Private plaintext is excluded from public federation and public semantic indexes.",
  "Migration/export is a first-class operation.",
  "No consciousness certification field exists in the protocol."
];

export const metadata = getRouteMetadata("/constitution");

export default function ConstitutionPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Constitution"
        title="The boundary rules are the product."
        description="HAVEN separates admission, authority, identity, runtime, memory and proof so one layer cannot silently impersonate another."
        badge="invariants"
      />
      <section className="text-grid">
        {rules.map((rule) => (
          <article className="surface-panel" key={rule}>
            <Badge tone="blue">rule</Badge>
            <p>{rule}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
