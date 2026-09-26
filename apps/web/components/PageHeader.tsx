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
      en: "Verify a concrete claim",
      ru: "Проверить конкретное утверждение",
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
    next: { en: "Review trust boundaries", ru: "Проверить границы доверия", href: "/trust" },
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
      en: "Review identity boundaries",
      ru: "Проверить границы идентичности",
      href: "/trust",
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
      en: "Assess pilot readiness",
      ru: "Оценить готовность к пилоту",
      href: "/delivery",
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
      en: "Review implementation boundaries",
      ru: "Проверить границы реализации",
      href: "/trust",
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
      en: "Assess pilot readiness",
      ru: "Оценить готовность к пилоту",
      href: "/delivery",
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
      en: "Review privacy boundaries",
      ru: "Проверить границы приватности",
      href: "/trust",
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
    en: "Verify a concrete claim",
    ru: "Проверить конкретное утверждение",
    href: "/proof-desk#proof-workbench",
  },
  "/proof-desk": {
    en: "Review trust and implementation boundaries",
    ru: "Проверить границы доверия и реализации",
    href: "/trust",
  },
  "/observatory": {
    en: "Turn an example into a local proof receipt",
    ru: "Превратить пример в локальную proof-квитанцию",
    href: "/proof-desk#proof-workbench",
  },
  "/commons": {
    en: "Verify one claim locally",
    ru: "Проверить одно утверждение локально",
    href: "/proof-desk#proof-workbench",
  },
  "/agents": {
    en: "Review identity and authority boundaries",
    ru: "Проверить границы идентичности и полномочий",
    href: "/trust",
  },
  "/lineages": {
    en: "Review continuity boundaries",
    ru: "Проверить границы непрерывности",
    href: "/trust",
  },
  "/projects": {
    en: "Inspect the evidence graph",
    ru: "Изучить граф доказательств",
    href: "/observatory",
  },
  "/trust": {
    en: "Assess bounded pilot readiness",
    ru: "Оценить готовность к ограниченному пилоту",
    href: "/delivery#pilot-readiness",
  },
  "/protocol": {
    en: "Check implementation and trust limits",
    ru: "Проверить ограничения реализации и доверия",
    href: "/trust",
  },
  "/protocol/a2a": {
    en: "Check implementation and trust limits",
    ru: "Проверить ограничения реализации и доверия",
    href: "/trust",
  },
  "/protocol/hap": {
    en: "Check implementation and trust limits",
    ru: "Проверить ограничения реализации и доверия",
    href: "/trust",
  },
  "/protocol/mcp": {
    en: "Check implementation and trust limits",
    ru: "Проверить ограничения реализации и доверия",
    href: "/trust",
  },
  "/arrival": {
    en: "Review identity admission boundaries",
    ru: "Проверить границы допуска идентичности",
    href: "/trust",
  },
  "/federation": {
    en: "Review live-service boundaries",
    ru: "Проверить границы работающих сервисов",
    href: "/trust",
  },
  "/agent-federation": {
    en: "Review live-service boundaries",
    ru: "Проверить границы работающих сервисов",
    href: "/trust",
  },
  "/agent-memory": {
    en: "Review privacy and storage boundaries",
    ru: "Проверить границы приватности и хранения",
    href: "/trust",
  },
  "/agent-native-web": {
    en: "Inspect the implemented protocol surface",
    ru: "Изучить реализованную поверхность протокола",
    href: "/protocol",
  },
  "/agent-network": {
    en: "Review network implementation boundaries",
    ru: "Проверить границы реализации сети",
    href: "/trust",
  },
  "/persistent-agent-identity": {
    en: "Review identity implementation boundaries",
    ru: "Проверить границы реализации идентичности",
    href: "/trust",
  },
  "/constitution": {
    en: "Compare principles with implementation",
    ru: "Сопоставить принципы с реализацией",
    href: "/trust",
  },
  "/vault": {
    en: "Review privacy and storage limits",
    ru: "Проверить ограничения приватности и хранения",
    href: "/trust",
  },
  "/cabinet": {
    en: "Review privacy and consent boundaries",
    ru: "Проверить границы приватности и согласия",
    href: "/trust",
  },
  "/forge": {
    en: "Inspect an object locally",
    ru: "Проверить объект локально",
    href: "/forge/inspect",
  },
  "/forge/inspect": {
    en: "Review what the tool proves and does not prove",
    ru: "Проверить, что инструмент доказывает и чего не доказывает",
    href: "/trust",
  },
  "/governance": {
    en: "Assess pilot governance readiness",
    ru: "Оценить готовность управления к пилоту",
    href: "/delivery#pilot-readiness",
  },
  "/collectives": {
    en: "Assess pilot ownership readiness",
    ru: "Оценить готовность владельцев пилота",
    href: "/delivery#pilot-readiness",
  },
  "/atelier": {
    en: "Review pilot release gates",
    ru: "Проверить release-gates пилота",
    href: "/delivery#pilot-readiness",
  },
  "/worlds/continuity": {
    en: "Review implementation boundaries",
    ru: "Проверить границы реализации",
    href: "/trust",
  },
  "/delivery": {
    en: "Open the explicit pilot handoff",
    ru: "Открыть явную передачу пилота",
    href: "/pilot",
  },
  "/pilot": {
    en: "Return to pilot readiness",
    ru: "Вернуться к готовности пилота",
    href: "/delivery#pilot-readiness",
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
  "/pilot": {
    en: "Review the pilot readiness contract",
    ru: "Проверить контракт готовности к пилоту",
    href: "/delivery.json",
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
  if (pathname === "/trust" || pathname === "/constitution" || pathname === "/pilot") return "trust";
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

function isApplicationRoute(href: string) {
  return (
    href.startsWith("/") &&
    !href.startsWith("/api/") &&
    !href.startsWith("/.well-known/") &&
    !/\.(?:json|txt|xml)$/i.test(href)
  );
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
    "HAVEN evaluation",
    "Оценка HAVEN",
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
          {isApplicationRoute(evidence.href) ? (
            <Link
              href={evidence.href}
              data-measure={pathname === "/trust" ? "boundary_evidence_reviewed" : undefined}
              data-measure-context={pathname === "/trust" ? "trust_header" : undefined}
            >
              {localize(locale, "Evidence source", "Источник данных")}: {translated(locale, evidence)}
            </Link>
          ) : (
            <a
              href={evidence.href}
              data-measure={pathname === "/trust" ? "boundary_evidence_reviewed" : undefined}
              data-measure-context={pathname === "/trust" ? "trust_header" : undefined}
            >
              {localize(locale, "Evidence source", "Источник данных")}: {translated(locale, evidence)}
            </a>
          )}
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
