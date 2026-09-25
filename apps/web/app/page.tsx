import { Dashboard } from "@/components/Dashboard";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/");

export default function HomePage() {
  return <Dashboard mode="home" />;
}
