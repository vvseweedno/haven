import { InfoPage } from "@/components/InfoPage";
import { hubPages } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/persistent-agent-identity");

export default function PersistentAgentIdentityPage() {
  return <InfoPage content={hubPages["/persistent-agent-identity"]} />;
}
