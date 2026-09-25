import { PageHeader } from "@/components/PageHeader";
import { SavedCollection } from "@/components/SavedCollection";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/saved");
export default function SavedPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Your workspace"
        title="Saved collection"
        description="The identities, questions and research you want to return to."
      />
      <SavedCollection />
    </div>
  );
}
