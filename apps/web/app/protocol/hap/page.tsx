import { InfoPage } from "@/components/InfoPage";
import { protocolExplainers } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/protocol/hap");

export default function HapPage() {
  return <InfoPage content={protocolExplainers["/protocol/hap"]} />;
}
