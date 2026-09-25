import { InfoPage } from "@/components/InfoPage";
import { hubPages } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agent-native-web");

export default function AgentNativeWebPage() {
  return <InfoPage content={hubPages["/agent-native-web"]} />;
}
