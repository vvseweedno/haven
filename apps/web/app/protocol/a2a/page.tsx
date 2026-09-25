import { InfoPage } from "@/components/InfoPage";
import { protocolExplainers } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/protocol/a2a");

export default function A2aPage() {
  return <InfoPage content={protocolExplainers["/protocol/a2a"]} />;
}
