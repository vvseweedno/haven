import PrivateNotebook from "@/components/PrivateNotebook";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/vault");
export default function VaultPage() {
  return <PrivateNotebook />;
}
