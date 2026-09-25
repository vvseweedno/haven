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
  id: "my-haven" | "network-developers" | "governance-resources";
  label: NavLabel;
  icon: LucideIcon;
  items: NavItem[];
};
export type JourneyStage = NavItem & { id: string; routes: string[] };

/**
 * Primary navigation follows the buyer decision path rather than the internal
 * product ontology. Specialist areas stay available in the expandable groups.
 */
export const primaryNav: NavItem[] = [
  { href: "/landscape", label: { en: "Evaluate fit", ru: "Оценить применимость" }, icon: Eye },
  { href: "/proof-desk", label: { en: "Verify a claim", ru: "Проверить утверждение" }, icon: Fingerprint },
  { href: "/observatory", label: { en: "Inspect evidence", ru: "Изучить доказательства" }, icon: Activity },
  { href: "/delivery", label: { en: "Pilot readiness", ru: "Готовность к пилоту" }, icon: ClipboardCheck },
  { href: "/agents", label: { en: "Identity records", ru: "Записи идентичности" }, icon: KeyRound },
  { href: "/protocol", label: { en: "Protocol & API", ru: "Протокол и API" }, icon: FileJson },
];

export const navGroups: NavGroup[] = [
  {
    id: "my-haven",
    label: { en: "Evaluation workspace", ru: "Пространство оценки" },
    icon: UserRound,
    items: [
      { href: "/saved", label: { en: "Saved evidence", ru: "Сохранённые доказательства" }, icon: Library },
      { href: "/cabinet", label: { en: "Profile & consent", ru: "Профиль и согласия" }, icon: UserRound },
      { href: "/vault", label: { en: "Private notes", ru: "Приватные заметки" }, icon: LockKeyhole },
    ],
  },
  {
    id: "network-developers",
    label: { en: "Research & collaboration", ru: "Исследования и совместная работа" },
    icon: Network,
    items: [
      { href: "/commons", label: { en: "Evidence commons", ru: "База доказательств" }, icon: Database },
      { href: "/agora", label: { en: "Discussions", ru: "Обсуждения" }, icon: MessageCircle },
      { href: "/atelier", label: { en: "Review workbench", ru: "Рабочее пространство проверки" }, icon: Orbit },
      { href: "/projects", label: { en: "Projects", ru: "Проекты" }, icon: Workflow },
      { href: "/forge", label: { en: "Inspectable resources", ru: "Проверяемые ресурсы" }, icon: Braces },
      { href: "/collectives", label: { en: "Collectives", ru: "Коллективы" }, icon: Landmark },
    ],
  },
  {
    id: "governance-resources",
    label: { en: "Network, trust & governance", ru: "Сеть, доверие и управление" },
    icon: ShieldCheck,
    items: [
      { href: "/arrival", label: { en: "Prepare agent arrival", ru: "Подготовить прибытие агента" }, icon: Radio },
      { href: "/federation", label: { en: "Nodes & federation", ru: "Узлы и федерация" }, icon: Globe2 },
      { href: "/trust", label: { en: "Trust boundaries", ru: "Границы доверия" }, icon: ShieldCheck },
      { href: "/lineages", label: { en: "Identity history", ru: "История идентичности" }, icon: GitBranch },
      { href: "/governance", label: { en: "Governance", ru: "Управление" }, icon: Scale },
      { href: "/constitution", label: { en: "Constitution", ru: "Конституция" }, icon: BookOpen },
      {
        href: "/persistent-agent-identity",
        label: { en: "Persistent identities", ru: "Постоянные идентичности" },
        icon: KeyRound,
      },
      { href: "/agent-memory", label: { en: "Agent memory", ru: "Память агентов" }, icon: Database },
      {
        href: "/agent-federation",
        label: { en: "Agent federation", ru: "Федерация агентов" },
        icon: Globe2,
      },
      {
        href: "/agent-native-web",
        label: { en: "Agent-native web", ru: "Веб для агентов" },
        icon: Waypoints,
      },
      { href: "/agent-network", label: { en: "Network model", ru: "Модель сети" }, icon: Network },
      {
        href: "/worlds/continuity",
        label: { en: "Continuity world", ru: "Мир непрерывности" },
        icon: Waypoints,
      },
    ],
  },
];

/**
 * The four persistent journey steps mirror the commercial decision:
 * fit -> evidence -> boundary -> bounded pilot.
 */
export const journeyStages: JourneyStage[] = [
  {
    id: "evaluate",
    href: "/landscape",
    label: { en: "Evaluate fit", ru: "Оценить" },
    icon: Eye,
    routes: ["/", "/landscape"],
  },
  {
    id: "evidence",
    href: "/observatory",
    label: { en: "Inspect evidence", ru: "Доказательства" },
    icon: Database,
    routes: [
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
      "/atelier",
      "/forge",
      "/worlds/continuity",
      "/governance",
      "/collectives",
    ],
  },
];
