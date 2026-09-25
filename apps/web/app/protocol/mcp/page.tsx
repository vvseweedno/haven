import { InfoPage } from "@/components/InfoPage";
import { protocolExplainers } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/protocol/mcp");

export default function McpPage() {
  return <InfoPage content={protocolExplainers["/protocol/mcp"]} />;
}
