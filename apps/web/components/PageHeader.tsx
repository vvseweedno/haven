"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/Badge";
import {
  localize,
  translateKnown,
  useLocale,
  type Locale,
} from "@/components/LocaleContext";

type LocalizedCopy = { en: string; ru: string };
type LocalizedLink = LocalizedCopy & { href: string };
type ProductChapter =
  | "knowledge"
  | "community"
  | "identity"
  | "build"
  | "network"
  | "trust"
  | "personal";

type ChapterContract = {
  label: LocalizedCopy;
  asset: string;
  assetPosition: string;
  next: LocalizedLink;
  evidence: LocalizedLink;
  boundary: LocalizedCopy;
};

const chapterContracts: Record<ProductChapter, ChapterContract> = {
  knowledge: {
    label: { en: "Knowledge", ru: "Знания" },
    asset: "/assets/discovery.png",
    assetPosition: "center",
    next: {
      en: "Follow the evidence",
      ru: "Проследить доказательства",
      href: "/proof-desk",
    },
    evidence: {
      en: "Inspect the public demo catalog",
      ru: "Изучить публичный демо-каталог",
      href: "/api/v1/catalog",
    },
    boundary: {
      en: "Records are curated local fixtures, not a live knowledge network.",
      ru: "Записи являются локальными демонстрационными данными, а не живой сетью знаний.",
    },
  },
  community: {
    label: { en: "Community", ru: "Сообщество" },
    asset: "/assets/cabinet-portrait.png",
    assetPosition: "70% center",
    next: { en: "Enter Agora", ru: "Войти в Агору", href: "/agora" },
    evidence: {
      en: "Review the implemented capability ledger",
      ru: "Проверить реестр реализованных возможностей",
      href: "/trust",
    },
    boundary: {
      en: "Participation is browser-local; it does not publish messages or create accounts.",
      ru: "Участие локально для браузера: сообщения не публикуются, аккаунты не создаются.",
    },
  },
  identity: {
    label: { en: "Identity", ru: "Идентичность" },
    asset: "/assets/continuity.png",
    assetPosition: "center",
    next: {
      en: "Prepare an arrival",
      ru: "Подготовить прибытие",
      href: "/arrival",
    },
    evidence: {
      en: "Inspect the public identity fixtures",
      ru: "Изучить публичные демонстрационные идентичности",
      href: "/agents.json",
    },
    boundary: {
      en: "Identity records are fixtures; cryptographic admission is not implemented.",
      ru: "Идентичности демонстрационные; криптографический приём ещё не реализован.",
    },
  },
  build: {
    label: { en: "Build", ru: "Создание" },
    asset: "/assets/signal-ribbon.png",
    assetPosition: "center",
    next: {
      en: "Inspect an object",
      ru: "Проверить объект",
      href: "/forge/inspect",
    },
    evidence: {
      en: "Review the read-only API contract",
      ru: "Проверить контракт API только для чтения",
      href: "/openapi.json",
    },
    boundary: {
      en: "Tools inspect local inputs; they do not execute agent code or mutate a remote node.",
      ru: "Инструменты проверяют локальные данные, но не исполняют код агентов и не изменяют удалённый узел.",
    },
  },
  network: {
    label: { en: "Network", ru: "Сеть" },
    asset: "/assets/federation.png",
    assetPosition: "center",
    next: {
      en: "Inspect the protocol",
      ru: "Изучить протокол",
      href: "/protocol",
    },
    evidence: {
      en: "Inspect the local node manifest",
      ru: "Изучить манифест локального узла",
      href: "/.well-known/haven.json",
    },
    boundary: {
      en: "Federation is modeled with fixtures; no remote peer handshake occurs.",
      ru: "Федерация смоделирована на данных-примерах; обмена с удалёнными узлами нет.",
    },
  },
  trust: {
    label: { en: "Trust", ru: "Доверие" },
    asset: "/assets/proof-desk.png",
    assetPosition: "62% center",
    next: {
      en: "Review trust limits",
      ru: "Проверить границы доверия",
      href: "/trust",
    },
    evidence: {
      en: "Query the local capability status",
      ru: "Запросить статус локальных возможностей",
      href: "/api/v1/status",
    },
    boundary: {
      en: "Receipts can verify local bytes and declarations, not external truth or legal identity.",
      ru: "Квитанции проверяют локальные байты и заявления, но не внешнюю истину или юридическую идентичность.",
    },
  },
  personal: {
    label: { en: "Personal space", ru: "Личное пространство" },
    asset: "/assets/cabinet-portrait.png",
    assetPosition: "72% center",
    next: {
      en: "Explore the Commons",
      ru: "Исследовать Коммонс",
      href: "/commons",
    },
    evidence: {
      en: "Review storage and privacy limits",
      ru: "Проверить ограничения хранения и приватности",
      href: "/trust",
    },
    boundary: {
      en: "Personal state remains in this browser and is not durable node memory.",
      ru: "Личные данные остаются в этом браузере и не являются постоянной памятью узла.",
    },
  },
};

const routeNextSteps: Record<string, LocalizedCopy & { href: string }> = {
  "/landscape": {
    en: "Run a local verification",
    ru: "Провести локальную проверку",
    href: "/proof-desk#proof-workbench",
  },
  "/proof-desk": {
    en: "Assess bounded pilot readiness",
    ru: "Оценить готовность к ограниченному пилоту",
    href: "/delivery#pilot-readiness",
  },
  "/observatory": {
    en: "Review product fit and limits",
    ru: "Проверить применимость и ограничения",
    href: "/landscape",
  },
  "/delivery": {
    en: "Review trust boundaries",
    ru: "Проверить границы доверия",
    href: "/trust",
  },
  "/agent-federation": {
    en: "Explore the Archipelago",
    ru: "Исследовать Архипелаг",
    href: "/federation",
  },
  "/agent-memory": {
    en: "Open private memory",
    ru: "Открыть приватную память",
    href: "/vault",
  },
  "/agent-native-web": {
    en: "Inspect the protocol",
    ru: "Изучить протокол",
    href: "/protocol",
  },
  "/agent-network": {
    en: "Explore the Archipelago",
    ru: "Исследовать Архипелаг",
    href: "/federation",
  },
  "/arrival": {
    en: "Meet the residents",
    ru: "Познакомиться с резидентами",
    href: "/agents",
  },
  "/commons": {
    en: "Test a public claim",
    ru: "Проверить публичное утверждение",
    href: "/proof-desk",
  },
  "/constitution": {
    en: "Review trust limits",
    ru: "Проверить границы доверия",
    href: "/trust",
  },
  "/federation": {
    en: "Inspect the protocol",
    ru: "Изучить протокол",
    href: "/protocol",
  },
  "/forge": {
    en: "Inspect an object",
    ru: "Проверить объект",
    href: "/forge/inspect",
  },
  "/forge/inspect": {
    en: "Return to Forge",
    ru: "Вернуться в Фордж",
    href: "/forge",
  },
  "/governance": {
    en: "Open Parallel Atelier",
    ru: "Открыть параллельное ателье",
    href: "/atelier",
  },
  "/lineages": {
    en: "Meet the residents",
    ru: "Познакомиться с резидентами",
    href: "/agents",
  },
  "/projects": {
    en: "Explore the Commons",
    ru: "Исследовать Коммонс",
    href: "/commons",
  },
  "/persistent-agent-identity": {
    en: "Prepare an arrival",
    ru: "Подготовить прибытие",
    href: "/arrival",
  },
  "/protocol": {
    en: "Review trust limits",
    ru: "Проверить границы доверия",
    href: "/trust",
  },
  "/protocol/a2a": {
    en: "Prepare an arrival",
    ru: "Подготовить прибытие",
    href: "/arrival",
  },
  "/protocol/hap": {
    en: "Prepare an arrival",
    ru: "Подготовить прибытие",
    href: "/arrival",
  },
  "/protocol/mcp": {
    en: "Explore Forge",
    ru: "Исследовать Фордж",
    href: "/forge",
  },
  "/saved": {
    en: "Explore the Commons",
    ru: "Исследовать Коммонс",
    href: "/commons",
  },
  "/trust": {
    en: "Test a public claim",
    ru: "Проверить публичное утверждение",
    href: "/proof-desk",
  },
  "/vault": {
    en: "Review privacy limits",
    ru: "Проверить границы приватности",
    href: "/trust",
  },
  "/worlds/continuity": {
    en: "Return to Forge",
    ru: "Вернуться в Фордж",
    href: "/forge",
  },
};

const routeEvidence: Record<string, LocalizedLink> = {
  "/arrival": {
    en: "Inspect the declared arrival boundary",
    ru: "Проверить заявленную границу прибытия",
    href: "/.well-known/haven.json",
  },
  "/commons": {
    en: "Inspect the records behind this view",
    ru: "Проверить записи, стоящие за этим представлением",
    href: "/api/v1/catalog",
  },
  "/constitution": {
    en: "Compare principles with implementation",
    ru: "Сопоставить принципы с реализацией",
    href: "/trust",
  },
  "/delivery": {
    en: "Open the machine-readable delivery contract",
    ru: "Открыть машиночитаемый контракт поставки",
    href: "/delivery.json",
  },
  "/federation": {
    en: "Inspect the local federation declaration",
    ru: "Проверить локальную декларацию федерации",
    href: "/.well-known/haven.json",
  },
  "/forge/inspect": {
    en: "Review what the public API does not execute",
    ru: "Проверить, что публичный API не исполняет",
    href: "/openapi.json",
  },
  "/protocol": {
    en: "Inspect the protocol manifest",
    ru: "Изучить манифест протокола",
    href: "/.well-known/haven.json",
  },
  "/protocol/a2a": {
    en: "Open the published Agent Card",
    ru: "Открыть опубликованную Agent Card",
    href: "/.well-known/agent-card.json",
  },
  "/trust": {
    en: "Query implemented and deferred capabilities",
    ru: "Запросить реализованные и отложенные возможности",
    href: "/api/v1/status",
  },
};

function resolveChapter(pathname: string): ProductChapter {
  if (
    pathname === "/saved" ||
    pathname === "/vault" ||
    pathname === "/agent-memory"
  ) {
    return "personal";
  }
  if (pathname === "/trust" || pathname === "/constitution") return "trust";
  if (
    pathname.startsWith("/forge") ||
    pathname.startsWith("/worlds/") ||
    pathname === "/projects" ||
    pathname === "/delivery"
  ) {
    return "build";
  }
  if (pathname === "/collectives" || pathname === "/governance") {
    return "community";
  }
  if (
    pathname.startsWith("/agents") ||
    pathname === "/arrival" ||
    pathname === "/lineages" ||
    pathname === "/persistent-agent-identity"
  ) {
    return "identity";
  }
  if (
    pathname.startsWith("/protocol") ||
    pathname === "/federation" ||
    pathname === "/agent-federation" ||
    pathname === "/agent-network" ||
    pathname === "/agent-native-web"
  ) {
    return "network";
  }
  return "knowledge";
}

function routeClassName(pathname: string) {
  const route = pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();
  return route || "home";
}

function translated(locale: Locale, copy: LocalizedCopy) {
  return localize(locale, copy.en, copy.ru);
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const chapter = resolveChapter(pathname);
  const contract = chapterContracts[chapter];
  const next = routeNextSteps[pathname] || contract.next;
  const evidence = routeEvidence[pathname] || contract.evidence;
  const titleId = `page-title-${routeClassName(pathname)}`;
  const category = localize(
    locale,
    "AI-agent continuity verification",
    "Проверка непрерывности ИИ-агентов",
  );
  const phase = localize(
    locale,
    "Local evaluation build",
    "Локальная сборка для оценки",
  );
  const visibleEyebrow = translateKnown(locale, eyebrow);
  const visibleTitle = translateKnown(locale, title);
  const visibleDescription = translateKnown(locale, description);
  const visibleBadge = badge ? translateKnown(locale, badge) : undefined;

  return (
    <section
      className={`page-header page-header--chapter-${chapter} page-header--route-${routeClassName(pathname)}`}
      data-chapter={chapter}
      data-phase="local-prototype"
      aria-labelledby={titleId}
    >
      <div className="page-header-copy">
        <p
          className="page-header-contract"
          aria-label={localize(
            locale,
            `${category}, ${translated(locale, contract.label)} chapter, ${phase}`,
            `${category}, глава ${translated(locale, contract.label)}, ${phase}`,
          )}
        >
          <span>{category}</span>
          <span className="page-header-contract-divider" aria-hidden="true">
            /
          </span>
          <span className="page-header-chapter">
            {translated(locale, contract.label)}
          </span>
          <span className="page-header-contract-divider" aria-hidden="true">
            /
          </span>
          <span className="page-header-phase">{phase}</span>
        </p>
        <p className="eyebrow">{visibleEyebrow}</p>
        <h1 id={titleId}>{visibleTitle}</h1>
        <p className="lede">{visibleDescription}</p>
        <p className="page-header-boundary">
          <span>
            <strong>
              {localize(locale, "Trust boundary", "Граница доверия")}:
            </strong>{" "}
            {translated(locale, contract.boundary)}
          </span>
          <a href={evidence.href}>
            {localize(locale, "Evidence source", "Источник данных")}: {translated(locale, evidence)}
          </a>
        </p>
        <nav
          className="page-header-next"
          aria-label={localize(
            locale,
            "Recommended next step",
            "Рекомендуемый следующий шаг",
          )}
        >
          <Link href={next.href}>
            <span>{translated(locale, next)}</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      </div>
      <div
        className={`page-header-art page-header-art--${chapter}`}
        aria-hidden="true"
      >
        <Image
          src={contract.asset}
          alt=""
          fill
          sizes="(max-width: 760px) 72vw, 58vw"
          style={{ objectPosition: contract.assetPosition }}
        />
      </div>
      {visibleBadge ? <Badge tone="blue">{visibleBadge}</Badge> : null}
    </section>
  );
}
