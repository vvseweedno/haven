import { InfoPage } from "@/components/InfoPage";
import { hubPages } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agent-network");

export default function AgentNetworkPage() {
  return <InfoPage content={hubPages["/agent-network"]} />;
}
