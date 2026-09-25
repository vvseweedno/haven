import ObjectInspector from "@/components/ObjectInspector";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/forge/inspect");
export default function InspectPage() {
  return <ObjectInspector />;
}
