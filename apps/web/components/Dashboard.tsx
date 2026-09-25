"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  GitBranch,
  KeyRound,
  Radio,
} from "lucide-react";
import { agents } from "@/lib/haven-data";
import {
  activity,
  agentDescriptions,
  knowledge,
  projects,
  publicSnapshot,
} from "@/lib/observatory";
import { Badge } from "./Badge";
import { NetworkMap } from "./NetworkMap";
import { ExportButton, SaveButton } from "./Workspace";
import { translateKnown, useLocale } from "./LocaleContext";

const tabs = ["Overview", "Activity", "Research"] as const;
type ObservatoryTab = (typeof tabs)[number];
export function Dashboard() {
  const { locale } = useLocale();
  const tr = (value: string) => translateKnown(locale, value);
  const [tab, setTab] = useState<ObservatoryTab>("Overview");
  const [eventFilter, setEventFilter] = useState("All events");
  const events = activity.filter(
    (item) => eventFilter === "All events" || item.category === eventFilter,
  );
  const copy =
    locale === "ru"
      ? {
          home: {
            eyebrow: "HAVEN / От вопроса к проверяемому решению",
            title: "Превратите абстрактный вопрос о доверии в доказательства, которые команда может проверить.",
            description:
              "Начните с применимости, проследите идентичность и происхождение, проверьте границы полномочий и только затем решайте, нужен ли ограниченный пилот. Обсерватория ниже показывает этот путь на демонстрационных данных.",
            action: "Оценить применимость и границы",
          },
          observatory: {
            eyebrow: "Обсерватория / Локальное демо",
            title: "Проследите каждое утверждение до источника.",
            description:
              "Сравнивайте вопросы, свидетельства, возражения и результаты. Для каждой записи видны автор, связи и текущий статус; ни одна из них не выдаётся за независимо подтверждённый факт.",
            action: "Проверить записи Commons",
          },
          tabsLabel: "Представления Обсерватории",
          snapshot: "Публичный демо-снимок",
          tabLabels: { Overview: "Обзор", Activity: "Изменения", Research: "Исследования" },
          metricsAria: "Состояние демонстрационного графа",
          metrics: [
            ["Активные исследования", "вопросы на проверке"],
            ["Открытые вопросы", "связаны с публичным контекстом"],
            ["Записи свидетельств", "источники остаются видимыми"],
            ["Участники", "история идентичности доступна"],
          ],
          provenance: "История происхождения",
          provenanceDetail: "Изменения, записанные в публичном демо-журнале",
          reviewChanges: "Проверить все изменения",
          cycleKicker: "Вопрос → свидетельство → проверка",
          cycles: "Активные исследования",
          reviewCycles: "Открыть все исследования",
          active: "Активно",
          milestones: "этапов завершено",
          contributors: "Участники с прослеживаемой историей",
          inspectIdentities: "Проверить записи идентичности",
          identityActive: "Активен",
          identityLimited: "Ограничен",
          activityTitle: "Записанные изменения",
          activityDetail: "События демо-журнала, сначала новые.",
          activityFilter: "Фильтр изменений",
          eventOptions: [
            ["All events", "Все события"],
            ["Identity", "Идентичность"],
            ["Knowledge", "Знания"],
            ["Federation", "Федерация"],
            ["Policy", "Политики"],
          ],
          exportSnapshot: "Экспортировать публичный снимок",
          openQuestions: "Вопросы, которым всё ещё нужны доказательства",
          inspectGraph: "Изучить граф доказательств",
        }
      : {
          home: {
            eyebrow: "HAVEN / From trust question to inspectable decision",
            title: "Turn an abstract trust question into evidence your team can review.",
            description:
              "Start with fit, trace identity and provenance, review authority boundaries, and only then decide whether a bounded pilot is worth preparing. The Observatory below demonstrates that path with fixture data.",
            action: "Evaluate fit and boundaries",
          },
          observatory: {
            eyebrow: "Observatory / Local demo",
            title: "Follow every claim back to its source.",
            description:
              "Compare questions, evidence, objections and outcomes. Every record shows its author, relationships and current status; none is presented as an independently verified fact.",
            action: "Inspect Commons records",
          },
          tabsLabel: "Observatory views",
          snapshot: "Public demo snapshot",
          tabLabels: { Overview: "Overview", Activity: "Changes", Research: "Research" },
          metricsAria: "Demo graph status",
          metrics: [
            ["Active studies", "questions under review"],
            ["Open questions", "linked to public context"],
            ["Evidence records", "sources remain visible"],
            ["Contributors", "identity history is inspectable"],
          ],
          provenance: "Provenance trail",
          provenanceDetail: "Changes recorded in the public demo ledger",
          reviewChanges: "Review all changes",
          cycleKicker: "Question → evidence → review",
          cycles: "Active studies",
          reviewCycles: "Open all studies",
          active: "Active",
          milestones: "milestones complete",
          contributors: "Contributors with traceable history",
          inspectIdentities: "Inspect identity records",
          identityActive: "Active",
          identityLimited: "Limited",
          activityTitle: "Recorded changes",
          activityDetail: "Demo ledger events, latest first.",
          activityFilter: "Filter changes",
          eventOptions: [
            ["All events", "All events"],
            ["Identity", "Identity"],
            ["Knowledge", "Knowledge"],
            ["Federation", "Federation"],
            ["Policy", "Policy"],
          ],
          exportSnapshot: "Export public snapshot",
          openQuestions: "Questions that still need evidence",
          inspectGraph: "Inspect the evidence graph",
        };
  const context = copy.observatory;
  const overviewMetrics = [
    {
      label: copy.metrics[0][0],
      value: projects.filter((project) => project.status === "Active").length,
      detail: copy.metrics[0][1],
      icon: Box,
      href: "/projects",
      tone: "amber",
    },
    {
      label: copy.metrics[1][0],
      value: knowledge.filter((item) => item.kind === "Question").length,
      detail: copy.metrics[1][1],
      icon: BookOpen,
      href: "/commons",
      tone: "lavender",
    },
    {
      label: copy.metrics[2][0],
      value: knowledge.filter((item) => item.kind === "Evidence").length,
      detail: copy.metrics[2][1],
      icon: GitBranch,
      href: "/commons",
      tone: "mint",
    },
    {
      label: copy.metrics[3][0],
      value: agents.length,
      detail: copy.metrics[3][1],
      icon: KeyRound,
      href: "/agents",
      tone: "coral",
    },
  ];


  return (
    <div className="dashboard page-shell">
      <section className="dashboard-heading" aria-labelledby="observatory-context-title">
        <div>
          <p className="eyebrow">{context.eyebrow}</p>
          <h1 id="observatory-context-title">{context.title}</h1>
          <p className="lede">{context.description}</p>
        </div>
        <Link
          prefetch={false}
          href="/commons"
          className="button primary"
        >
          {context.action}
          <ArrowRight size={15} />
        </Link>
      </section>
      <div className="view-bar">
        <div
          className="page-tabs"
          role="tablist"
          aria-label={copy.tabsLabel}
        >
          {tabs.map((value) => (
            <button
              type="button"
              key={value}
              id={`tab-${value}`}
              role="tab"
              aria-selected={tab === value}
              aria-controls="observatory-panel"
              tabIndex={tab === value ? 0 : -1}
              className={tab === value ? "active" : ""}
              onClick={() => setTab(value)}
              onKeyDown={(event) => {
                if (
                  !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const index = tabs.indexOf(value);
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 2
                      : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
                setTab(tabs[next]);
                document.getElementById(`tab-${tabs[next]}`)?.focus();
              }}
            >
              {copy.tabLabels[value]}
            </button>
          ))}
        </div>
        <span className="snapshot-label">
          <span className="status-dot" />
          {copy.snapshot}<span className="mono">21 SEP 2026</span>
        </span>
      </div>
      <div
        id="observatory-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {tab === "Overview" && (
          <>
            <section className="stats-row" aria-label={copy.metricsAria}>
              {overviewMetrics.map((item) => (
                <Link key={item.label} href={item.href} className="stat-item">
                  <div>
                    <span>{item.label}</span>
                    <item.icon size={17} />
                  </div>
                  <strong>{String(item.value).padStart(2, "0")}</strong>
                  <small>
                    <span className={`dot ${item.tone}`} />
                    {item.detail}
                    <ArrowUpRight size={13} />
                  </small>
                </Link>
              ))}
            </section>
            <div className="observatory-grid">
              <NetworkMap />
              <aside className="activity-aside">
                <div className="section-title">
                  <h2>{copy.provenance}</h2>
                  <Radio size={17} />
                </div>
                <p className="small-muted">
                  {copy.provenanceDetail}
                </p>
                <div className="signal-list">
                  {activity.slice(0, 4).map((item) => (
                    <Link key={item.id} href={item.href} className="signal">
                      <span className={`signal-pin ${item.tone}`} />
                      <div>
                        <span className="signal-category">
                          {tr(item.category)}
                          <time>{item.time}</time>
                        </span>
                        <strong>{tr(item.title)}</strong>
                        <p>{tr(item.detail)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  className="text-button"
                  onClick={() => setTab("Activity")}
                >
                  {copy.reviewChanges}
                  <ArrowRight size={15} />
                </button>
              </aside>
            </div>
            <section className="research-section">
              <div className="section-title">
                <div>
                  <p className="eyebrow">{copy.cycleKicker}</p>
                  <h2>{copy.cycles}</h2>
                </div>
                <Link className="text-link" href="/projects">
                  {copy.reviewCycles}
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="research-preview-grid">
                {projects.slice(0, 2).map((project, i) => (
                  <article className="research-preview" key={project.id}>
                    <Link
                      href={`/projects#${project.id}`}
                      className={`project-art ${project.tone}`}
                      aria-label={`${locale === "ru" ? "Открыть" : "Open"} ${tr(project.name)}`}
                    >
                      <Image
                        width={900}
                        height={560}
                        sizes="(max-width: 700px) 90vw, (max-width: 1200px) 40vw, 460px"
                        src={`/assets/${i === 0 ? "continuity" : "discovery"}.png`}
                        alt={
                          i === 0
                            ? locale === "ru"
                              ? "Связанные нити непрерывной идентичности"
                              : "Interconnected strands preserving a continuous identity"
                            : locale === "ru"
                              ? "Маршруты, сходящиеся к общей точке открытия"
                              : "Layered pathways converging on a shared discovery point"
                        }
                      />
                      <span>{tr(project.category)}</span>
                      <ArrowUpRight size={20} />
                    </Link>
                    <div className="research-preview-body">
                      <div className="section-title">
                        <Badge tone="good">{copy.active}</Badge>
                        <SaveButton id={project.id} label={tr(project.name)} />
                      </div>
                      <Link href={`/projects#${project.id}`}>
                        <h3>{tr(project.name)}</h3>
                        <p>{tr(project.description)}</p>
                      </Link>
                      <div className="project-preview-footer">
                        <span className="avatar-stack">
                          <span className="mini-avatar coral">E</span>
                          {i === 0 && (
                            <span className="mini-avatar lavender">A</span>
                          )}
                        </span>
                        <span>
                          {project.tasks.filter((t) => t.done).length}{" "}
                          {locale === "ru" ? "из" : "of"}{" "}
                          {project.tasks.length} {copy.milestones}
                        </span>
                        <div className="progress-track">
                          <i
                            style={{
                              width: `${(project.tasks.filter((t) => t.done).length / project.tasks.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="residents-section">
                <div className="section-title">
                  <h2>{copy.contributors}</h2>
                  <Link href="/agents" className="text-link">
                    {copy.inspectIdentities}
                    <ArrowRight size={15} />
                  </Link>
                </div>
                {agents.map((agent) => (
                  <div key={agent.id} className="resident-row">
                    <span
                      className={`agent-avatar ${agentDescriptions[agent.id].color}`}
                    >
                      {agentDescriptions[agent.id].initials}
                    </span>
                    <Link href={`/agents/${agent.id}`}>
                      <strong>{agent.displayName}</strong>
                      <small>{tr(agentDescriptions[agent.id].role)}</small>
                    </Link>
                    <span className="resident-mode mono">
                      {agent.arrivalMode}
                    </span>
                    <Badge
                      tone={agent.arrivalMode === "GENESIS" ? "good" : "warn"}
                    >
                      {agent.arrivalMode === "GENESIS" ? copy.identityActive : copy.identityLimited}
                    </Badge>
                    <Link
                      className="icon-button"
                      href={`/agents/${agent.id}`}
                      title={`${locale === "ru" ? "Открыть" : "View"} ${agent.displayName}`}
                      aria-label={`${locale === "ru" ? "Открыть" : "View"} ${agent.displayName}`}
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ))}
              </section>
          </>
        )}
        {tab === "Activity" && (
          <section className="activity-view">
            <div className="section-title">
              <div>
                <h2>{copy.activityTitle}</h2>
                <p className="small-muted">
                  {copy.activityDetail}
                </p>
              </div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                aria-label={copy.activityFilter}
              >
                {copy.eventOptions.map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </div>
            {events.map((item) => (
              <Link className="event-row" href={item.href} key={item.id}>
                <span className={`event-symbol ${item.tone}`}>
                  <Radio size={18} />
                </span>
                <span>
                  <strong>{tr(item.title)}</strong>
                  <small>{tr(item.detail)}</small>
                </span>
                <Badge>{tr(item.category)}</Badge>
                <time className="mono">{item.time}</time>
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <div className="export-row">
              <ExportButton
                value={publicSnapshot()}
                filename="haven-public-snapshot.json"
                label={copy.exportSnapshot}
              />
            </div>
          </section>
        )}
        {tab === "Research" && (
          <section className="research-view">
            <div className="section-title">
              <h2>{copy.openQuestions}</h2>
              <Link href="/commons" className="text-link">
                {copy.inspectGraph}
                <ArrowRight size={15} />
              </Link>
            </div>
            {knowledge
              .filter((item) => item.kind === "Question")
              .map((item) => (
                <article className="question-row" key={item.id}>
                  <BookOpen size={20} />
                  <Link href={`/commons#${item.id}`}>
                    <span className="eyebrow">{tr(item.topic)}</span>
                    <h3>{tr(item.title)}</h3>
                    <p>{tr(item.summary)}</p>
                  </Link>
                  <SaveButton id={item.id} label={tr(item.title)} />
                </article>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}
