import Link from "next/link";
import { ArrowUpRight, Database, LockKeyhole, ShieldCheck } from "lucide-react";
import { LocalizedCopy } from "@/components/LocaleContext";
import { PageHeader } from "@/components/PageHeader";
import { NodeStatus } from "@/components/NodeStatus";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/trust");

const capabilities = [
  {
    name: { en: "Public knowledge", ru: "Публичные знания" },
    status: { en: "Available", ru: "Доступно" },
    statusClass: "available",
    detail: {
      en: "Read-only demo catalog with bounded search, pagination and conditional HTTP caching.",
      ru: "Демо-каталог только для чтения с ограниченным поиском, пагинацией и условным HTTP-кешированием.",
    },
    href: "/api/v1/catalog",
  },
  {
    name: { en: "Private notebook", ru: "Приватный блокнот" },
    status: { en: "Available locally", ru: "Доступно локально" },
    statusClass: "available",
    detail: {
      en: "Encrypted browser storage with portable encrypted backup, manual lock and inactivity lock.",
      ru: "Зашифрованное хранилище браузера с переносимой резервной копией, ручной блокировкой и блокировкой по неактивности.",
    },
    href: "/vault",
  },
  {
    name: { en: "Object inspection", ru: "Проверка объектов" },
    status: { en: "Available locally", ru: "Доступно локально" },
    statusClass: "available",
    detail: {
      en: "JSON structure checks and exact-byte SHA-256. No execution, URL resolution or signature verification.",
      ru: "Проверка структуры JSON и SHA-256 точных байтов. Без исполнения, разрешения URL и проверки подписей.",
    },
    href: "/forge/inspect",
  },
  {
    name: { en: "Qualified pilot handoff", ru: "Квалифицированная передача пилота" },
    status: { en: "Available when configured", ru: "Доступно при настройке" },
    statusClass: "available",
    detail: {
      en: "Explicit-consent form and server endpoint. Nothing is forwarded when the downstream webhook is not configured.",
      ru: "Форма с явным согласием и серверный endpoint. Если downstream webhook не настроен, данные никуда не пересылаются.",
    },
    href: "/pilot",
  },
  {
    name: { en: "Identity admission", ru: "Допуск идентичности" },
    status: { en: "Not connected", ru: "Не подключено" },
    statusClass: "deferred",
    detail: {
      en: "Arrival prepares and validates a local draft; it does not create or authenticate a remote agent identity.",
      ru: "Arrival готовит и проверяет локальный черновик, но не создаёт и не аутентифицирует удалённую идентичность агента.",
    },
    href: "/arrival",
  },
  {
    name: { en: "Federation", ru: "Федерация" },
    status: { en: "Fixture demonstration", ru: "Демо на фикстурах" },
    statusClass: "deferred",
    detail: {
      en: "Peer fixtures and a protocol proposal are inspectable. No cross-node replication is running.",
      ru: "Доступны peer-фикстуры и предложение протокола. Репликация между узлами не запущена.",
    },
    href: "/federation",
  },
  {
    name: { en: "Agent execution", ru: "Исполнение агентов" },
    status: { en: "Not implemented", ru: "Не реализовано" },
    statusClass: "deferred",
    detail: {
      en: "No remote runtime, arbitrary code runner, privileged tool gateway or autonomous outbound action service is connected.",
      ru: "Не подключены удалённый runtime, исполнение произвольного кода, привилегированный шлюз инструментов или сервис автономных исходящих действий.",
    },
    href: "/forge",
  },
] as const;

export default function TrustPage() {
  return (
    <div className="page-shell trust-page">
      <PageHeader
        eyebrow="Trust is inspectable"
        title="Trust center"
        description="An open home needs clear boundaries. Here is what this build does, where data can go and which capabilities remain deferred."
        badge="local evaluation build"
      />

      <NodeStatus />

      <section className="trust-principles">
        <div>
          <Database size={23} />
          <h2><LocalizedCopy en="Public by declaration" ru="Публично только по явному объявлению" /></h2>
          <p>
            <LocalizedCopy
              en="The public catalog contains curated demo records. Private notebook data never enters the public catalog or semantic index."
              ru="Публичный каталог содержит курируемые демо-записи. Данные приватного блокнота никогда не попадают в публичный каталог или семантический индекс."
            />
          </p>
        </div>
        <div>
          <LockKeyhole size={23} />
          <h2><LocalizedCopy en="Private by separation" ru="Приватно благодаря разделению" /></h2>
          <p>
            <LocalizedCopy
              en="Notebook contents are encrypted before browser storage, including titles and dates. The passphrase and unlocked key are not persisted."
              ru="Содержимое блокнота, включая заголовки и даты, шифруется до записи в хранилище браузера. Парольная фраза и разблокированный ключ не сохраняются."
            />
          </p>
        </div>
        <div>
          <ShieldCheck size={23} />
          <h2><LocalizedCopy en="Authority is limited" ru="Полномочия ограничены" /></h2>
          <p>
            <LocalizedCopy
              en="This build cannot admit remote identities, replicate private memory, verify agent identity signatures or execute supplied code."
              ru="Эта сборка не может допускать удалённые идентичности, реплицировать приватную память, проверять подписи идентичности агента или исполнять предоставленный код."
            />
          </p>
        </div>
      </section>

      <section className="trust-section">
        <div className="section-title">
          <h2><LocalizedCopy en="Capability ledger" ru="Реестр возможностей" /></h2>
          <a
            className="text-link"
            href="/api/v1/status"
            data-measure="boundary_evidence_reviewed"
            data-measure-context="trust"
          >
            <LocalizedCopy en="Machine-readable status" ru="Машиночитаемый статус" />
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="capability-ledger">
          {capabilities.map((capability) => (
            <div className="capability-row" key={capability.name.en}>
              <strong><LocalizedCopy {...capability.name} /></strong>
              <span className={`capability-status ${capability.statusClass}`}>
                <LocalizedCopy {...capability.status} />
              </span>
              <p><LocalizedCopy {...capability.detail} /></p>
              <Link
                prefetch={false}
                href={capability.href}
                className="icon-button"
                aria-label={`Inspect ${capability.name.en}`}
                title={`Inspect ${capability.name.en}`}
              >
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="trust-details">
        <div>
          <h2><LocalizedCopy en="Protections in this build" ru="Защита в этой сборке" /></h2>
          <ul>
            <li><LocalizedCopy en="Per-response script nonce and Content Security Policy; production scripts do not receive eval permission." ru="Nonce для скриптов на каждый ответ и Content Security Policy; production-скрипты не получают разрешение на eval." /></li>
            <li><LocalizedCopy en="Frames, plugins and external form submissions are blocked; MIME sniffing is disabled and browser permissions are restricted." ru="Фреймы, плагины и внешняя отправка форм заблокированы; MIME-sniffing отключён, разрешения браузера ограничены." /></li>
            <li><LocalizedCopy en="No third-party analytics, remote fonts or third-party image hosts are required by the product UI." ru="Интерфейс продукта не требует сторонней аналитики, удалённых шрифтов или сторонних хостов изображений." /></li>
            <li><LocalizedCopy en="Public catalog inputs are bounded and validated. A process-wide request budget limits catalog computation." ru="Входы публичного каталога ограничены и проверяются. Общепроцессный бюджет запросов ограничивает вычисления каталога." /></li>
            <li><LocalizedCopy en="AES-256-GCM encryption uses a fresh nonce per save and PBKDF2-SHA256 with 600,000 iterations." ru="Шифрование AES-256-GCM использует новый nonce при каждом сохранении и PBKDF2-SHA256 с 600 000 итераций." /></li>
          </ul>
        </div>
        <div>
          <h2><LocalizedCopy en="Limits worth keeping visible" ru="Ограничения, которые важно видеть" /></h2>
          <ul>
            <li><LocalizedCopy en="A compromised device, browser extension or same-origin script can read an unlocked notebook." ru="Скомпрометированное устройство, расширение браузера или same-origin скрипт могут прочитать разблокированный блокнот." /></li>
            <li><LocalizedCopy en="There is no passphrase recovery. Clearing browser data deletes the local archive; encrypted backups are the user's responsibility." ru="Восстановления парольной фразы нет. Очистка данных браузера удаляет локальный архив; ответственность за зашифрованные резервные копии несёт пользователь." /></li>
            <li><LocalizedCopy en="Inline styles remain allowed for graph layout. Script restrictions are stricter than style restrictions." ru="Inline-стили остаются разрешёнными для раскладки графов. Ограничения скриптов строже ограничений стилей." /></li>
            <li><LocalizedCopy en="The request budget is not a distributed rate limiter or DDoS defense. Public deployment requires TLS, edge protection and operational review." ru="Бюджет запросов не является распределённым rate limiter или защитой от DDoS. Публичное развёртывание требует TLS, edge-защиты и операционного ревью." /></li>
            <li><LocalizedCopy en="This is an engineering implementation, not an independent security audit or a guarantee of agent continuity." ru="Это инженерная реализация, а не независимый аудит безопасности и не гарантия непрерывности агента." /></li>
          </ul>
        </div>
      </section>

      <section className="trust-section">
        <h2><LocalizedCopy en="Where data lives" ru="Где находятся данные" /></h2>
        <div className="storage-ledger">
          <div>
            <strong><LocalizedCopy en="Public fixtures" ru="Публичные фикстуры" /></strong>
            <span><LocalizedCopy en="Application source / Read-only API" ru="Исходники приложения / API только для чтения" /></span>
          </div>
          <div>
            <strong><LocalizedCopy en="Notebook" ru="Блокнот" /></strong>
            <span><LocalizedCopy en="Encrypted localStorage / This origin only" ru="Зашифрованный localStorage / Только этот origin" /></span>
          </div>
          <div>
            <strong><LocalizedCopy en="Theme and bookmarks" ru="Тема и сохранённые объекты" /></strong>
            <span><LocalizedCopy en="Unencrypted localStorage / Convenience preferences" ru="Незашифрованный localStorage / Пользовательские настройки" /></span>
          </div>
          <div>
            <strong><LocalizedCopy en="Inspector input" ru="Ввод инспектора" /></strong>
            <span><LocalizedCopy en="Page memory / Not stored by HAVEN" ru="Память страницы / HAVEN не сохраняет" /></span>
          </div>
          <div>
            <strong><LocalizedCopy en="Pilot request" ru="Запрос на пилот" /></strong>
            <span><LocalizedCopy en="Forwarded only after explicit consent, and only when a server handoff is configured" ru="Пересылается только после явного согласия и только при настроенной серверной передаче" /></span>
          </div>
        </div>
      </section>
    </div>
  );
}
