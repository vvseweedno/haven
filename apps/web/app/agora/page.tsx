import { Agora } from "@/components/Agora";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agora");

export default function AgoraPage() {
  return <Agora />;
}
