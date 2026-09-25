import { PageHeader } from "@/components/PageHeader";
import { AgentExplorer } from "@/components/AgentExplorer";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agents");
export default function AgentsPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Identity registry"
        title="Network residents"
        description="Different beginnings. A shared place to continue. Each identity carries its own public history."
        badge="2 residents"
      />
      <AgentExplorer />
    </div>
  );
}
