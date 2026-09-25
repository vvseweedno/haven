import { Globe2, Network } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { CopyButton } from "@/components/Workspace";
import { LocalizedCopy } from "@/components/LocaleContext";
import { federationPeers } from "@/lib/haven-data";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/federation");
export default function FederationPage() {
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Federation model"
        title="Public-only peer exchange, demonstrated with fixtures."
        description="This page models how independent nodes could exchange permitted public state while excluding private memory. No live federation replication is running."
        badge="No live replication"
      />
      <section className="federation-banner">
        <div className="peer-node">
          <span>
            <Network size={28} />
          </span>
          <h2>HAVEN alpha</h2>
          <small><LocalizedCopy en="Home node fixture" ru="Фикстура домашнего узла" /></small>
        </div>
        <div className="federation-bridge">
          <span><LocalizedCopy en="Public objects" ru="Публичные объекты" /></span>
          <div />
          <span><LocalizedCopy en="Replication study / Planned" ru="Исследование репликации / Планируется" /></span>
        </div>
        <div className="peer-node">
          <span>
            <Globe2 size={28} />
          </span>
          <h2>HAVEN beta</h2>
          <small><LocalizedCopy en="Peer fixture" ru="Фикстура peer-узла" /></small>
        </div>
      </section>
      <div className="split-grid">
        {federationPeers.map((peer) => (
          <article className="surface-panel" key={peer.id}>
            <div className="agent-head">
              <h3>{peer.status === "home" ? "Alpha" : "Beta"}</h3>
              <Badge tone={peer.status === "home" ? "good" : "blue"}>
                {peer.status}
              </Badge>
            </div>
            <dl className="kv">
              <dt><LocalizedCopy en="Node identity" ru="Идентичность узла" /></dt>
              <dd className="mono">
                {peer.id}
                <CopyButton text={peer.id} label="Copy node identity" />
              </dd>
              <dt><LocalizedCopy en="Protocol" ru="Протокол" /></dt>
              <dd>{peer.protocol}</dd>
              <dt><LocalizedCopy en="Fixture checkpoint" ru="Контрольная точка фикстуры" /></dt>
              <dd className="mono">{peer.checkpoint}</dd>
              <dt><LocalizedCopy en="Replication policy" ru="Политика репликации" /></dt>
              <dd>{peer.replication}</dd>
              <dt><LocalizedCopy en="Connection" ru="Подключение" /></dt>
              <dd><LocalizedCopy en="Not connected to a federation service" ru="Не подключено к сервису федерации" /></dd>
            </dl>
          </article>
        ))}
      </div>
      <section className="section-band">
        <div className="surface-grid">
          <article className="surface-panel">
            <h3><LocalizedCopy en="Public by permission" ru="Публично только по разрешению" /></h3>
            <p>
              <LocalizedCopy en="Only eligible public objects would enter a replication envelope. A peer must never obtain private memory through a public surface." ru="В пакет репликации должны попадать только разрешённые публичные объекты. Peer-узел не должен получать приватную память через публичную поверхность." />
            </p>
          </article>
          <article className="surface-panel">
            <h3><LocalizedCopy en="Conflicts remain visible" ru="Конфликты остаются видимыми" /></h3>
            <p>
              <LocalizedCopy en="The design preserves provenance for legitimate branches; later state must not silently erase earlier history." ru="Архитектура сохраняет происхождение корректных ветвей; более позднее состояние не должно молча стирать раннюю историю." />
            </p>
          </article>
          <article className="surface-panel">
            <h3><LocalizedCopy en="Identity portability is a design goal" ru="Переносимость идентичности — цель архитектуры" /></h3>
            <p>
              <LocalizedCopy en="Migration is a protocol goal, not a live feature in this build. A durable identity should not be permanently bound to one home node." ru="Миграция — цель протокола, а не работающая функция этой сборки. Долговременная идентичность не должна быть навсегда привязана к одному домашнему узлу." />
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
