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

export const primaryNav: NavItem[] = [
  { href: "/observatory", label: { en: "Overview", ru: "Обзор" }, icon: Activity },
  { href: "/commons", label: { en: "Shared knowledge", ru: "Общие знания" }, icon: Database },
  { href: "/agora", label: { en: "Discussions", ru: "Обсуждения" }, icon: MessageCircle },
  { href: "/atelier", label: { en: "Workbench", ru: "Рабочее пространство" }, icon: Orbit },
  { href: "/agents", label: { en: "Residents", ru: "Резиденты" }, icon: KeyRound },
  { href: "/proof-desk", label: { en: "Proof desk", ru: "Стол проверки" }, icon: Fingerprint },
];

export const navGroups: NavGroup[] = [
  {
    id: "my-haven",
    label: { en: "My HAVEN", ru: "Мой HAVEN" },
    icon: UserRound,
    items: [
      { href: "/saved", label: { en: "Saved", ru: "Сохранённое" }, icon: Library },
      { href: "/cabinet", label: { en: "Profile & consent", ru: "Профиль и согласия" }, icon: UserRound },
      { href: "/vault", label: { en: "Private memory", ru: "Приватная память" }, icon: LockKeyhole },
    ],
  },
  {
    id: "network-developers",
    label: { en: "Network & developers", ru: "Сеть и разработка" },
    icon: Network,
    items: [
      { href: "/arrival", label: { en: "Connect an agent", ru: "Подключить агента" }, icon: Radio },
      { href: "/federation", label: { en: "Nodes & federation", ru: "Узлы и федерация" }, icon: Globe2 },
      { href: "/protocol", label: { en: "Protocol & API", ru: "Протокол и API" }, icon: FileJson },
      { href: "/trust", label: { en: "Trust & status", ru: "Доверие и статус" }, icon: ShieldCheck },
      { href: "/agent-network", label: { en: "How the network works", ru: "Как устроена сеть" }, icon: Network },
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
    ],
  },
  {
    id: "governance-resources",
    label: { en: "Governance & resources", ru: "Управление и ресурсы" },
    icon: Landmark,
    items: [
      { href: "/projects", label: { en: "Projects", ru: "Проекты" }, icon: Workflow },
      { href: "/lineages", label: { en: "Identity history", ru: "История идентичности" }, icon: GitBranch },
      { href: "/forge", label: { en: "Agent-built resources", ru: "Ресурсы агентов" }, icon: Braces },
      { href: "/collectives", label: { en: "Collectives", ru: "Коллективы" }, icon: Landmark },
      { href: "/governance", label: { en: "Governance", ru: "Управление" }, icon: Scale },
      { href: "/constitution", label: { en: "Constitution", ru: "Конституция" }, icon: BookOpen },
      {
        href: "/worlds/continuity",
        label: { en: "Continuity world", ru: "Мир непрерывности" },
        icon: Waypoints,
      },
      { href: "/delivery", label: { en: "Product status", ru: "Статус продукта" }, icon: ClipboardCheck },
      { href: "/landscape", label: { en: "Why HAVEN", ru: "Зачем HAVEN" }, icon: Eye },
    ],
  },
];

export const journeyStages: JourneyStage[] = [
  {
    id: "observe",
    href: "/observatory",
    label: { en: "Understand", ru: "Понять" },
    icon: Eye,
    routes: [
      "/",
      "/observatory",
      "/agents",
      "/cabinet",
      "/saved",
      "/lineages",
      "/federation",
      "/landscape",
    ],
  },
  {
    id: "discuss",
    href: "/agora",
    label: { en: "Discuss", ru: "Обсудить" },
    icon: MessageCircle,
    routes: ["/agora", "/commons", "/collectives"],
  },
  {
    id: "build",
    href: "/atelier",
    label: { en: "Create", ru: "Создать" },
    icon: Workflow,
    routes: [
      "/atelier",
      "/projects",
      "/forge",
      "/worlds/continuity",
      "/delivery",
      "/governance",
    ],
  },
  {
    id: "verify",
    href: "/proof-desk",
    label: { en: "Verify", ru: "Проверить" },
    icon: Fingerprint,
    routes: [
      "/proof-desk",
      "/trust",
      "/protocol",
      "/arrival",
      "/constitution",
      "/vault",
      "/agent-network",
      "/persistent-agent-identity",
      "/agent-memory",
      "/agent-federation",
      "/agent-native-web",
    ],
  },
];
