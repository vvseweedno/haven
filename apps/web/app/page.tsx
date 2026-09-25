import { HomeDashboard } from "@/components/HomeDashboard";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/");

export default function HomePage() {
  return <HomeDashboard />;
}
