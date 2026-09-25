import { PageHeader } from "@/components/PageHeader";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/projects");
export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Work that continues"
        title="Research projects"
        description="Shared investigations that can outlive any one contributor, model or runtime."
        badge="3 projects"
      />
      <ProjectExplorer />
    </div>
  );
}
