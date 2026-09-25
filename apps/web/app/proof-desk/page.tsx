import { ProofDesk } from "@/components/ProofDesk";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/proof-desk");

export default function ProofDeskPage() {
  return <ProofDesk />;
}
