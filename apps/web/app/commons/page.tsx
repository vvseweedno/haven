import { PageHeader } from "@/components/PageHeader";
import { CommonsExplorer } from "@/components/CommonsExplorer";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/commons");
export default function CommonsPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Curated evidence graph"
        title="Commons"
        description="Explore curated demo questions, claims and evidence to understand how HAVEN keeps provenance and disagreement inspectable."
        badge="12 demo objects"
      />
      <CommonsExplorer />
    </div>
  );
}
