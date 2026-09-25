import {
  Activity,
  BookOpen,
  Braces,
  ClipboardCheck,
  Database,
  Eye,
  FileJson,
  Fingerprint,
  GitBranch,
  Globe2,
  KeyRound,
  Landmark,
  Library,
  LockKeyhole,
  MessageCircle,
  Network,
  Orbit,
  Radio,
  Scale,
  ShieldCheck,
  UserRound,
  Waypoints,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavLabel = { en: string; ru: string };
export type NavItem = { href: string; label: NavLabel; icon: LucideIcon };
export type NavGroup = {
  id: "workspace" | "evidence" | "architecture";
  label: NavLabel;
  icon: LucideIcon;
  items: NavItem[];
};
export type JourneyStage = NavItem & { id: string; routes: string[] };

/**
 * Primary navigation is intentionally identical to the decision journey.
 * Deep product ontology belongs to the reference groups below, not in the
 * first-contact path.
 */
export const primaryNav: NavItem[] = [
  {
    href: "/landscape",
    label: { en: "1. Evaluate fit", ru: "1. Оценить применимость" },
    icon: Eye,
  },
  {
    href: "/proof-desk",
    label: { en: "2. Verify evidence", ru: "2. Проверить доказательство" },
    icon: Fingerprint,
  },
  {
    href: "/trust",
    label: { en: "3. Review boundaries", ru: "3. Проверить границы" },
    icon: ShieldCheck,
  },
  {
    href: "/delivery",
    label: { en: "4. Prepare pilot", ru: "4. Подготовить пилот" },
    icon: ClipboardCheck,
  },
];

export const navGroups: NavGroup[] = [
  {
    id: "workspace",
    label: { en: "My evaluation workspace", ru: "Моё пространство оценки" },
    icon: UserRound,
    items: [
      { href: "/saved", label: { en: "Saved evidence", ru: "Сохранённые доказательства" }, icon: Library },
      { href: "/cabinet", label: { en: "Profile & consent", ru: "Профиль и согласия" }, icon: UserRound },
      { href: "/vault", label: { en: "Private notes", ru: "Приватные заметки" }, icon: LockKeyhole },
    ],
  },
  {
    id: "evidence",
    label: { en: "Evidence & research", ru: "Доказательства и исследования" },
    icon: Database,
    items: [
      { href: "/observatory", label: { en: "Evidence observatory", ru: "Обсерватория доказательств" }, icon: Activity },
      { href: "/commons", label: { en: "Evidence commons", ru: "База доказательств" }, icon: Database },
      { href: "/agents", label: { en: "Demo identity records", ru: "Демо-записи идентичностей" }, icon: KeyRound },
      { href: "/projects", label: { en: "Project fixtures", ru: "Фикстуры проектов" }, icon: Workflow },
      { href: "/lineages", label: { en: "Lineage fixtures", ru: "Фикстуры линий" }, icon: GitBranch },
      { href: "/agora", label: { en: "Discussion prototype", ru: "Прототип обсуждений" }, icon: MessageCircle },
    ],
  },
  {
    id: "architecture",
    label: { en: "Architecture & governance", ru: "Архитектура и управление" },
    icon: Network,
    items: [
      { href: "/protocol", label: { en: "Protocol & API", ru: "Протокол и API" }, icon: FileJson },
      { href: "/forge", label: { en: "Inspectable resources", ru: "Проверяемые ресурсы" }, icon: Braces },
      { href: "/atelier", label: { en: "Review workbench", ru: "Рабочее пространство проверки" }, icon: Orbit },
      { href: "/arrival", label: { en: "Arrival draft", ru: "Черновик прибытия" }, icon: Radio },
      { href: "/federation", label: { en: "Federation model", ru: "Модель федерации" }, icon: Globe2 },
      { href: "/governance", label: { en: "Governance", ru: "Управление" }, icon: Scale },
      { href: "/constitution", label: { en: "Constitution", ru: "Конституция" }, icon: BookOpen },
      { href: "/collectives", label: { en: "Collective fixtures", ru: "Фикстуры коллективов" }, icon: Landmark },
      {
        href: "/persistent-agent-identity",
        label: { en: "Persistent identity model", ru: "Модель постоянной идентичности" },
        icon: KeyRound,
      },
      { href: "/agent-memory", label: { en: "Memory model", ru: "Модель памяти" }, icon: Database },
      {
        href: "/agent-federation",
        label: { en: "Federation architecture", ru: "Архитектура федерации" },
        icon: Globe2,
      },
      {
        href: "/agent-native-web",
        label: { en: "Agent-native web", ru: "Веб для агентов" },
        icon: Waypoints,
      },
      { href: "/agent-network", label: { en: "Network architecture", ru: "Архитектура сети" }, icon: Network },
      {
        href: "/worlds/continuity",
        label: { en: "Continuity fixture", ru: "Фикстура непрерывности" },
        icon: Waypoints,
      },
    ],
  },
];

/**
 * Four stages answer the four questions a first-time evaluator actually has:
 * fit -> evidence -> boundary -> bounded pilot.
 */
export const journeyStages: JourneyStage[] = [
  {
    id: "evaluate",
    href: "/landscape",
    label: { en: "Evaluate fit", ru: "Применимость" },
    icon: Eye,
    routes: ["/", "/landscape"],
  },
  {
    id: "evidence",
    href: "/proof-desk",
    label: { en: "Verify evidence", ru: "Доказательство" },
    icon: Fingerprint,
    routes: [
      "/proof-desk",
      "/observatory",
      "/commons",
      "/agora",
      "/projects",
      "/agents",
      "/lineages",
      "/saved",
    ],
  },
  {
    id: "boundary",
    href: "/trust",
    label: { en: "Review boundaries", ru: "Границы" },
    icon: ShieldCheck,
    routes: [
      "/trust",
      "/protocol",
      "/arrival",
      "/federation",
      "/constitution",
      "/vault",
      "/cabinet",
      "/agent-network",
      "/persistent-agent-identity",
      "/agent-memory",
      "/agent-federation",
      "/agent-native-web",
    ],
  },
  {
    id: "pilot",
    href: "/delivery",
    label: { en: "Prepare pilot", ru: "Пилот" },
    icon: ClipboardCheck,
    routes: [
      "/delivery",
      "/pilot",
      "/atelier",
      "/forge",
      "/worlds/continuity",
      "/governance",
      "/collectives",
    ],
  },
];

export function navigationContext(pathname: string): {
  section: NavLabel;
  item: NavLabel;
  href: string;
} {
  if (pathname === "/pilot") {
    return {
      section: { en: "Decision path", ru: "Путь решения" },
      item: { en: "Pilot request", ru: "Запрос на пилот" },
      href: "/pilot",
    };
  }

  const primary = primaryNav.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (primary) {
    return {
      section: { en: "Decision path", ru: "Путь решения" },
      item: primary.label,
      href: primary.href,
    };
  }

  for (const group of navGroups) {
    const item = group.items.find(
      (candidate) =>
        pathname === candidate.href || pathname.startsWith(`${candidate.href}/`),
    );
    if (item) return { section: group.label, item: item.label, href: item.href };
  }

  return {
    section: { en: "HAVEN", ru: "HAVEN" },
    item: { en: "Product orientation", ru: "Обзор продукта" },
    href: "/",
  };
}
