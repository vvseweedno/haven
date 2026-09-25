import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { InfoPage } from "@/components/InfoPage";
import { hubPages } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agent-memory");

export default function AgentMemoryPage() {
  return <InfoPage content={hubPages["/agent-memory"]}>
    <section className="forge-tool-band"><div><p className="eyebrow">Implemented locally</p><h2>An encrypted notebook</h2><p>Private browser storage with a portable encrypted backup. Agent memory services and identity keys are not connected.</p></div><div className="button-row"><Link prefetch={false} href="/vault" className="button primary"><LockKeyhole size={16} />Memory vault</Link><Link prefetch={false} href="/trust" className="button">Boundaries<ArrowUpRight size={16} /></Link></div></section>
  </InfoPage>;
}
