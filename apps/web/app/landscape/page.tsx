import { LandscapeExplorer } from "@/components/LandscapeExplorer";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/landscape");

export default function LandscapePage() {
  return <LandscapeExplorer />;
}
