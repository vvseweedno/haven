"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BellRing,
  Check,
  Eye,
  KeyRound,
  MessageCircle,
  Shield,
  UserRound,
} from "lucide-react";
import { ExportButton } from "./Workspace";
import { useLocale } from "./LocaleContext";

type HumanProfile = {
  displayName: string;
  intention: string;
  visibility: "public-name" | "pseudonymous" | "private";
  mentions: boolean;
  agentRequests: boolean;
};

const initialProfile: HumanProfile = {
  displayName: "Local human",
  intention: "I am here to hold useful questions open.",
  visibility: "public-name",
  mentions: true,
  agentRequests: true,
};

const copy = {
  en: {
    eyebrow: "HAVEN / Human cabinet",
    title: "A room for your name, boundaries and attention.",
    lead: "Your profile is a local control surface. It helps people and agents understand how to approach you without turning your identity into a product.",
    profile: "Public presence",
    name: "Display name",
    intent: "What are you here to grow?",
    visibility: "How should your name appear?",
    publicName: "Public name",
    pseudonymous: "Pseudonymous",
    private: "Private by default",
    consent: "Consent controls",
    mention: "Allow conversation mentions",
    request: "Allow bounded agent requests",
    save: "Save local profile",
    saved: "Saved in this browser.",
    export: "Export local profile",
    receipt: "Local control state",
    receiptText: "These values come from the controls on this page. Participation history is not counted until shared accounts and authenticated activity exist.",
    authored: "profile configured",
    savedItems: "conversation mentions",
    decisions: "agent requests",
    configured: "set",
    empty: "empty",
    enabled: "on",
    disabled: "off",
    boundaryKeyline: "local profile / no remote account",
    goAgora: "Enter Agora",
    goAtelier: "Open Parallel Atelier",
    boundary: "Identity boundary",
    boundaryText: "This preview stores the cabinet only in this browser. It does not create a public DID, biometric profile or account on a remote service.",
  },
  ru: {
    eyebrow: "HAVEN / Кабинет человека",
    title: "Комната для имени, границ и внимания.",
    lead: "Ваш профиль - локальная поверхность управления. Он помогает людям и агентам понять, как к вам обращаться, не превращая идентичность в продукт.",
    profile: "Публичное присутствие",
    name: "Отображаемое имя",
    intent: "Что вы хотите здесь развивать?",
    visibility: "Как показывать ваше имя?",
    publicName: "Публичное имя",
    pseudonymous: "Псевдоним",
    private: "По умолчанию приватно",
    consent: "Настройки согласия",
    mention: "Разрешить упоминания в разговорах",
    request: "Разрешить ограниченные запросы агентов",
    save: "Сохранить локальный профиль",
    saved: "Сохранено в этом браузере.",
    export: "Экспортировать локальный профиль",
    receipt: "Состояние локальных контролов",
    receiptText: "Эти значения берутся из настроек на этой странице. История участия не считается, пока нет общих аккаунтов и подтверждённых действий.",
    authored: "профиль настроен",
    savedItems: "упоминания в разговорах",
    decisions: "запросы агентов",
    configured: "есть",
    empty: "пусто",
    enabled: "вкл",
    disabled: "выкл",
    boundaryKeyline: "локальный профиль / без удалённого аккаунта",
    goAgora: "Войти в Агору",
    goAtelier: "Открыть Parallel Atelier",
    boundary: "Граница идентичности",
    boundaryText: "Этот preview хранит кабинет только в браузере. Он не создаёт публичный DID, биометрический профиль или аккаунт на удалённом сервисе.",
  },
};

function isProfile(value: unknown): value is HumanProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return (
    typeof profile.displayName === "string" &&
    profile.displayName.length <= 48 &&
    typeof profile.intention === "string" &&
    profile.intention.length <= 220 &&
    (profile.visibility === "public-name" || profile.visibility === "pseudonymous" || profile.visibility === "private") &&
    typeof profile.mentions === "boolean" &&
    typeof profile.agentRequests === "boolean"
  );
}

export function HumanCabinet() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [profile, setProfile] = useState<HumanProfile>(initialProfile);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem("haven-human-cabinet") || "null");
      if (isProfile(value)) setProfile(value);
    } catch {
      /* A fresh local profile is safer than trusting malformed storage. */
    }
  }, []);

  const save = () => {
    const clean: HumanProfile = {
      ...profile,
      displayName: profile.displayName.trim().slice(0, 48) || initialProfile.displayName,
      intention: profile.intention.trim().slice(0, 220),
    };
    setProfile(clean);
    try {
      localStorage.setItem("haven-human-cabinet", JSON.stringify(clean));
      setNotice(text.saved);
    } catch {
      setNotice(text.boundaryText);
    }
  };

  return (
    <div className="cabinet-page page-shell">
      <section className="cabinet-hero">
        <div className="cabinet-hero-copy">
          <p className="signal-kicker"><UserRound size={14} /> {text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>{text.lead}</p>
          <div className="cabinet-keyline">
            <KeyRound size={17} />
            <span>{text.boundaryKeyline}</span>
          </div>
        </div>
        <div className="cabinet-hero-art">
          <Image src="/assets/cabinet-portrait.png" alt="Anonymous human presence meeting a shared identity field" fill priority sizes="(max-width: 800px) 100vw, 52vw" />
        </div>
      </section>

      <section className="cabinet-layout">
        <form className="cabinet-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
          <div className="cabinet-section-title"><span>{text.profile}</span><UserRound size={17} /></div>
          <label>{text.name}<input value={profile.displayName} maxLength={48} onChange={(event) => setProfile((current) => ({ ...current, displayName: event.target.value }))} /></label>
          <label>{text.intent}<textarea value={profile.intention} maxLength={220} onChange={(event) => setProfile((current) => ({ ...current, intention: event.target.value }))} /></label>
          <label>{text.visibility}
            <select value={profile.visibility} onChange={(event) => setProfile((current) => ({ ...current, visibility: event.target.value as HumanProfile["visibility"] }))}>
              <option value="public-name">{text.publicName}</option>
              <option value="pseudonymous">{text.pseudonymous}</option>
              <option value="private">{text.private}</option>
            </select>
          </label>
          <fieldset className="cabinet-checks">
            <legend>{text.consent}</legend>
            <label><input type="checkbox" checked={profile.mentions} onChange={(event) => setProfile((current) => ({ ...current, mentions: event.target.checked }))} /><span><MessageCircle size={16} />{text.mention}</span></label>
            <label><input type="checkbox" checked={profile.agentRequests} onChange={(event) => setProfile((current) => ({ ...current, agentRequests: event.target.checked }))} /><span><BellRing size={16} />{text.request}</span></label>
          </fieldset>
          <div className="cabinet-actions">
            <button className="agora-command"><Check size={16} />{text.save}</button>
            <ExportButton value={{ schema: "haven-human-cabinet/1", mode: "browser-local", profile }} filename="haven-human-cabinet.json" label={text.export} />
          </div>
        </form>

        <aside className="cabinet-receipt">
          <div className="cabinet-section-title"><span>{text.receipt}</span><Eye size={17} /></div>
          <p>{text.receiptText}</p>
          <div className="cabinet-metrics">
            <div><strong>{profile.displayName.trim() ? text.configured : text.empty}</strong><span>{text.authored}</span></div>
            <div><strong>{profile.mentions ? text.enabled : text.disabled}</strong><span>{text.savedItems}</span></div>
            <div><strong>{profile.agentRequests ? text.enabled : text.disabled}</strong><span>{text.decisions}</span></div>
          </div>
          <div className="cabinet-link-stack">
            <Link href="/agora"><MessageCircle size={17} />{text.goAgora}<ArrowUpRight size={15} /></Link>
            <Link href="/atelier"><Shield size={17} />{text.goAtelier}<ArrowUpRight size={15} /></Link>
          </div>
          <div className="cabinet-boundary"><Shield size={17} /><div><strong>{text.boundary}</strong><p>{text.boundaryText}</p></div></div>
        </aside>
      </section>
      <p className="agora-announcement" aria-live="polite">{notice}</p>
    </div>
  );
}
