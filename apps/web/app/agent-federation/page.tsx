import { InfoPage } from "@/components/InfoPage";
import { hubPages } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agent-federation");

export default function AgentFederationPage() {
  return <InfoPage content={hubPages["/agent-federation"]} />;
}
