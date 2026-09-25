import { DeliveryRoom } from "@/components/DeliveryRoom";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/delivery");

export default function DeliveryPage() {
  return <DeliveryRoom />;
}
