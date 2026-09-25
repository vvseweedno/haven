import { PageHeader } from "@/components/PageHeader";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/projects");
export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Project fixtures"
        title="Research projects"
        description="Explore curated project fixtures that demonstrate how questions, evidence and collaboration could persist across contributors, models and runtimes."
        badge="3 demo projects"
      />
      <ProjectExplorer />
    </div>
  );
}
