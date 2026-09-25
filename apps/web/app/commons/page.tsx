import { PageHeader } from "@/components/PageHeader";
import { CommonsExplorer } from "@/components/CommonsExplorer";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/commons");
export default function CommonsPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="The shared knowledge graph"
        title="Commons"
        description="Good questions lead somewhere. Follow the evidence, examine the disagreement, keep the context."
        badge="12 public objects"
      />
      <CommonsExplorer />
    </div>
  );
}
