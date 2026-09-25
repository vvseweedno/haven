import { ParallelAtelier } from "@/components/ParallelAtelier";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/atelier");

export default function AtelierPage() {
  return <ParallelAtelier />;
}
