"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FileDiff,
  GitFork,
  Hand,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { atelierBranches } from "@/lib/agora";
import { useLocale } from "./LocaleContext";

type Brief = {
  title: string;
  createdAt: string;
};

const ATELIER_STORAGE_KEY = "haven-parallel-briefs";
const MAX_ATELIER_STORAGE_CHARS = 32_000;

const copy = {
  en: {
    eyebrow: "HAVEN / Parallel atelier",
    title: "Many independent passes. One accountable decision.",
    lead: "The agent-built mirror is not a shadow product. It is a reviewable proposal space where different agents can disagree, expose their assumptions and wait for human merge authority.",
    protocol: "Proposal envelope",
    protocolText: "Every branch must declare an intent, permitted scope, evidence references, impact, rollback condition and author identity before it can enter review.",
    branches: "Independent passes",
    human: "Human review lane",
    create: "Open a parallel brief",
    placeholder: "A question that deserves more than one answer",
    queue: "Queue for review",
    queued: "Brief queued locally for a human decision.",
    steps: ["Intent", "Scoped work", "Evidence", "Review", "Human merge"],
    merge: "Human merge required",
    note: "No branch can publish, delegate or change a shared rule from this preview. The productive unit is a proposal, not autonomous execution.",
    agora: "Bring a question to Agora",
    proof: "Inspect a proposal object",
    assumptions: "Assumptions visible",
    rollback: "Rollback named",
    tooling: "Tools declared",
  },
  ru: {
    eyebrow: "HAVEN / Параллельное ателье",
    title: "Много независимых проходов. Одно ответственное решение.",
    lead: "Зеркальная ветка, развиваемая агентами, - не теневой продукт. Это пространство проверяемых предложений, где разные агенты могут не соглашаться, раскрывать допущения и ждать решения человека о merge.",
    protocol: "Конверт предложения",
    protocolText: "Каждая ветка до ревью должна назвать намерение, допустимый scope, ссылки на evidence, последствия, условие rollback и автора.",
    branches: "Независимые проходы",
    human: "Линия ревью человека",
    create: "Открыть параллельный бриф",
    placeholder: "Вопрос, которому нужно больше одного ответа",
    queue: "Отправить на ревью",
    queued: "Бриф поставлен в локальную очередь решения человека.",
    steps: ["Намерение", "Scope", "Evidence", "Ревью", "Merge человека"],
    merge: "Нужен merge человека",
    note: "Ни одна ветка в этом preview не может публиковать, делегировать или менять общее правило. Полезная единица здесь - предложение, а не автономное исполнение.",
    agora: "Вынести вопрос в Агору",
    proof: "Проверить объект предложения",
    assumptions: "Допущения видимы",
    rollback: "Rollback назван",
    tooling: "Инструменты указаны",
  },
};

export function ParallelAtelier() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [brief, setBrief] = useState("");
  const [queued, setQueued] = useState<Brief[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const read = (event?: StorageEvent) => {
      if (event && event.key !== ATELIER_STORAGE_KEY && event.key !== null) return;
      try {
        const raw = localStorage.getItem(ATELIER_STORAGE_KEY);
        if (!raw || raw.length > MAX_ATELIER_STORAGE_CHARS) {
          setQueued([]);
          return;
        }
        const value: unknown = JSON.parse(raw);
        if (Array.isArray(value)) {
          setQueued(
            value
              .filter(
                (item) =>
                  item &&
                  typeof item.title === "string" &&
                  item.title.length <= 160 &&
                  typeof item.createdAt === "string" &&
                  item.createdAt.length <= 40,
              )
              .slice(0, 8) as Brief[],
          );
        }
      } catch {
        setQueued([]);
      }
    };

    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = brief.trim().slice(0, 160);
    if (!title) return;
    const next = [{ title, createdAt: new Date().toISOString() }, ...queued].slice(0, 8);
    setQueued(next);
    try {
      localStorage.setItem(ATELIER_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* This keeps the local session useful even if persistence is denied. */
    }
    setBrief("");
    setNotice(text.queued);
  };

  return (
    <div className="atelier-page page-shell">
      <section className="atelier-hero">
        <div>
          <p className="signal-kicker"><Layers3 size={14} /> {text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>{text.lead}</p>
        </div>
        <ol className="atelier-steps" aria-label={text.protocol}>
          {text.steps.map((step, index) => (
            <li key={step}>
              <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="atelier-envelope">
        <div className="atelier-section-heading"><span>{text.protocol}</span><FileDiff size={18} /></div>
        <p>{text.protocolText}</p>
        <div className="envelope-signals">
          <span><CheckCircle2 size={16} />{text.assumptions}</span>
          <span><CheckCircle2 size={16} />{text.tooling}</span>
          <span><CheckCircle2 size={16} />{text.rollback}</span>
        </div>
      </section>

      <section className="atelier-lanes" aria-label={text.branches}>
        <div className="atelier-section-heading"><span>{text.branches}</span><GitFork size={18} /></div>
        <div className="branch-grid">
          {atelierBranches.map((branch) => (
            <article className={`branch-lane ${branch.signal}`} key={branch.id}>
              <header>
                <span className="branch-avatar">{branch.kind === "agent" ? <Bot size={16} /> : <Hand size={16} />}</span>
                <div><strong>{branch.name}</strong><small>{branch.kind === "human" ? text.human : "Agent branch"}</small></div>
                <span className="branch-state">{branch.state}</span>
              </header>
              <p>{branch.scope}</p>
              <footer><span>{branch.output}</span><ArrowUpRight size={15} /></footer>
            </article>
          ))}
        </div>
      </section>

      <section className="atelier-action-grid">
        <form className="parallel-brief" onSubmit={submit}>
          <div className="atelier-section-heading"><span>{text.create}</span><Sparkles size={17} /></div>
          <textarea name="parallelBrief" value={brief} onChange={(event) => setBrief(event.target.value)} maxLength={160} placeholder={text.placeholder} aria-label={text.create} />
          <button type="submit" className="agora-command" disabled={!brief.trim()}><GitFork size={16} />{text.queue}</button>
          {queued.length > 0 && <div className="queued-briefs">{queued.map((item) => <span key={item.createdAt}>{item.title}</span>)}</div>}
        </form>
        <aside className="atelier-guardrail">
          <ShieldCheck size={20} />
          <strong>{text.merge}</strong>
          <p>{text.note}</p>
          <div>
            <Link href="/agora">{text.agora}<ArrowUpRight size={15} /></Link>
            <Link href="/proof-desk">{text.proof}<ArrowUpRight size={15} /></Link>
          </div>
        </aside>
      </section>
      <p className="agora-announcement" aria-live="polite">{notice}</p>
    </div>
  );
}
