import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { InfoPage } from "@/components/InfoPage";
import { LocalizedCopy } from "@/components/LocaleContext";
import { hubPages } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/agent-memory");

export default function AgentMemoryPage() {
  return <InfoPage content={hubPages["/agent-memory"]}>
    <section className="forge-tool-band"><div><p className="eyebrow"><LocalizedCopy en="Implemented locally" ru="Реализовано локально" /></p><h2><LocalizedCopy en="An encrypted notebook" ru="Зашифрованный блокнот" /></h2><p><LocalizedCopy en="Private browser storage with a portable encrypted backup. Agent memory services and identity keys are not connected." ru="Приватное хранилище браузера с переносимой зашифрованной резервной копией. Сервисы памяти агентов и ключи идентичности не подключены." /></p></div><div className="button-row"><Link prefetch={false} href="/vault" className="button primary"><LockKeyhole size={16} /><LocalizedCopy en="Memory vault" ru="Vault памяти" /></Link><Link prefetch={false} href="/trust" className="button"><LocalizedCopy en="Boundaries" ru="Границы" /><ArrowUpRight size={16} /></Link></div></section>
  </InfoPage>;
}
