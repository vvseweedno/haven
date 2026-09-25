import { PilotPage } from "@/components/PilotPage";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/pilot");

export default function QualifiedPilotPage() {
  return <PilotPage />;
}
