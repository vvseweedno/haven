import { Dashboard } from "@/components/Dashboard";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/observatory");

export default function ObservatoryPage() {
  return <Dashboard />;
}
