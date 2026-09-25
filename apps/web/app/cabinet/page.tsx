import { HumanCabinet } from "@/components/HumanCabinet";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/cabinet");

export default function CabinetPage() {
  return <HumanCabinet />;
}
