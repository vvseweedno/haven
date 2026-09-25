"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import {
  analogs,
  maturitySignals,
} from "@/lib/product-landscape";
import {
  evaluationCriteria,
  evaluationPath,
  funnelStages,
} from "@/lib/adoption";
import { DeferredContinuumScene } from "./DeferredContinuumScene";
import { useLocale } from "./LocaleContext";

const evaluationCopy = {
  en: {
    pageEyebrow: "HAVEN / Product landscape",
    pageTitle: "Decide whether HAVEN fits your agent workflow before you invest in integration.",
    pageLead: "Use this page as a qualification step: compare HAVEN with adjacent systems, inspect what is implemented now, identify the continuity or authority failure you actually need to solve, and only then prepare a bounded pilot.",
    positioning: "Product role",
    positioningBody: "A verification and continuity layer for teams that must explain identity, provenance and bounded authority across changing agent runtimes.",
    maturityAria: "Current HAVEN implementation status",
    buildPulse: "Available now",
    buildTitle: "Read the evidence behind every implementation claim",
    testClaim: "Check a public object",
    verifyLimits: "Review product limits",
    nearby: "Adjacent systems",
    analogTitle: "Know what HAVEN is — and what it is not",
    external: "Links open official documentation in a new tab.",
    partial: "Partial overlap",
    closest: "Shared ground",
    difference: "What HAVEN adds",
    usefulNext: "Possible next step",
    openDocs: "Open official documentation for",
    eyebrow: "Pilot evaluation",
    title: "Make a pilot decision from fit, evidence and explicit boundaries",
    fit: "A fit when",
    noFit: "Not a fit when",
    questions: "Questions to answer first",
    evidence: "Evidence for the next decision",
    open: "Open step",
    measurement: "How progress is counted",
    measurementTitle: "Measure qualified progress, not raw clicks",
    entry: "Started when",
    completion: "Counted when",
    denominator: "Who is eligible",
    dropOff: "Where the path stops",
    attribution: "How sources are credited",
    causal: "Limits of causal claims",
    fitLabel: "Fit / no fit",
    development: "Development path",
    developmentTitle: "Grow the refuge without weakening its boundaries",
    artifacts: "Visual research artifacts",
    artifactLabels: ["Continuity strands", "Discovery paths", "Federation bridge"],
  },
  ru: {
    pageEyebrow: "HAVEN / Продуктовый ландшафт",
    pageTitle: "Решите, подходит ли HAVEN вашему агентному процессу, до вложений во внедрение.",
    pageLead: "Используйте эту страницу как этап квалификации: сравните HAVEN со смежными системами, проверьте текущую реализацию, сформулируйте реальную проблему непрерывности или полномочий и только затем готовьте ограниченный пилот.",
    positioning: "Роль продукта",
    positioningBody: "Слой проверки и непрерывности для команд, которым нужно объяснять идентичность, происхождение и ограниченные полномочия при смене агентных сред.",
    maturityAria: "Текущий статус реализации HAVEN",
    buildPulse: "Доступно сейчас",
    buildTitle: "Проверьте доказательства каждого заявления о реализации",
    testClaim: "Проверить публичный объект",
    verifyLimits: "Изучить границы продукта",
    nearby: "Смежные системы",
    analogTitle: "Поймите, чем HAVEN является — и чем не является",
    external: "Ссылки откроют официальную документацию в новой вкладке.",
    partial: "Частичное пересечение",
    closest: "Общая основа",
    difference: "Что добавляет HAVEN",
    usefulNext: "Возможный следующий шаг",
    openDocs: "Открыть официальную документацию",
    eyebrow: "Оценка пилота",
    title: "Примите решение о пилоте на основе применимости, доказательств и явных границ",
    fit: "Подходит, когда",
    noFit: "Не подходит, когда",
    questions: "Что выяснить сначала",
    evidence: "Доказательство для следующего решения",
    open: "Открыть шаг",
    measurement: "Как считается прогресс",
    measurementTitle: "Измеряйте квалифицированный прогресс, а не сырые клики",
    entry: "Начало шага",
    completion: "Засчитывается, когда",
    denominator: "Кто может завершить",
    dropOff: "Где путь прерывается",
    attribution: "Как учитывается источник",
    causal: "Границы причинных выводов",
    fitLabel: "Подходит / не подходит",
    development: "Путь развития",
    developmentTitle: "Развивать убежище, не ослабляя его границы",
    artifacts: "Визуальные материалы исследования",
    artifactLabels: ["Нити непрерывности", "Пути открытия", "Мост федерации"],
  },
};

export function LandscapeExplorer() {
  const { locale } = useLocale();
  const evaluationText = evaluationCopy[locale];

  return (
    <div className="page-shell landscape-page">
      <section className="landscape-hero" aria-labelledby="landscape-title">
        <DeferredContinuumScene className="landscape-scene" />
        <div>
          <p className="eyebrow">{evaluationText.pageEyebrow}</p>
          <h1 id="landscape-title">{evaluationText.pageTitle}</h1>
          <p className="lede">{evaluationText.pageLead}</p>
        </div>
        <aside className="landscape-summary">
          <Compass size={20} />
          <strong>{evaluationText.positioning}</strong>
          <p>{evaluationText.positioningBody}</p>
        </aside>
      </section>

      <section className="maturity-board" aria-label={evaluationText.maturityAria}>
        <div className="section-title">
          <div>
            <p className="eyebrow">{evaluationText.buildPulse}</p>
            <h2>{evaluationText.buildTitle}</h2>
          </div>
          <div className="section-title-actions">
            <Link prefetch={false} href="/proof-desk" className="text-link" data-measure="proof_desk_opened">
              {evaluationText.testClaim}
              <Fingerprint size={15} />
            </Link>
            <Link prefetch={false} href="/trust" className="text-link" data-measure="trust_boundary_opened">
              {evaluationText.verifyLimits}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="maturity-grid">
          {maturitySignals.map((signal) => (
            <div className="maturity-row" key={signal.label}>
              <div>
                <strong>{signal.label}</strong>
                <span>{signal.detail}</span>
              </div>
              <span className="maturity-state">{signal.state}</span>
              <small className="mono">{signal.evidence}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="fit-summary" aria-labelledby="fit-summary-title">
        <div className="section-title">
          <div>
            <p className="eyebrow">{evaluationText.fitLabel}</p>
            <h2 id="fit-summary-title">
              {locale === "ru" ? "Сначала проверьте, стоит ли идти дальше." : "First decide whether it is worth going further."}
            </h2>
          </div>
          <Link href="/proof-desk" className="text-link">
            {evaluationText.testClaim}
            <Fingerprint size={15} />
          </Link>
        </div>
        <div className="fit-summary-grid">
          {evaluationCriteria.map((criterion) => (
            <article className="fit-summary-card" key={criterion.dimension.en}>
              <h3>{criterion.dimension[locale]}</h3>
              <div>
                <span>{evaluationText.fit}</span>
                <p>{criterion.fit[locale]}</p>
              </div>
              <div>
                <span>{evaluationText.noFit}</span>
                <p>{criterion.noFit[locale]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="human-route-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">{evaluationText.eyebrow}</p>
            <h2>{evaluationText.title}</h2>
          </div>
          <Sparkles size={20} />
        </div>
        <div className="human-route-list">
          {evaluationPath.map((step, index) => (
            <Link
              prefetch={false}
              href={step.href}
              className="human-route"
              key={step.stage.en}
              aria-label={`${evaluationText.open}: ${step.decision[locale]}`}
              data-measure={funnelStages[index]?.ctaEvent ?? "evaluation_step_opened"}
            >
              <span className="route-persona">{step.stage[locale]}</span>
              <div>
                <h3>{step.decision[locale]}</h3>
                <p>{step.evidence[locale]}</p>
                <small>{evaluationText.evidence}</small>
              </div>
              <span className="mono">{step.owner[locale]}</span>
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
        <div className="landscape-next-action">
          <div>
            <strong>
              {locale === "ru" ? "Нужны вопросы для пилота?" : "Need pilot qualification questions?"}
            </strong>
            <p>
              {locale === "ru"
                ? "Владельцы, данные, доказательство успеха и stop conditions проверяются на отдельном этапе готовности."
                : "Owners, data boundaries, success evidence and stop conditions belong in the dedicated readiness step."}
            </p>
          </div>
          <Link href="/delivery#pilot-readiness" className="button">
            {locale === "ru" ? "Проверить готовность к пилоту" : "Review pilot readiness"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <details className="landscape-details">
        <summary>
          <span>
            <strong>{evaluationText.analogTitle}</strong>
            <small>{locale === "ru" ? "Сравнение со смежными системами — справочно" : "Adjacent-system comparison — reference only"}</small>
          </span>
          <Compass size={18} />
        </summary>
        <div className="analog-section landscape-details-body">
          <div className="section-title">
            <div>
              <p className="eyebrow">{evaluationText.nearby}</p>
              <h2>{evaluationText.analogTitle}</h2>
            </div>
            <span className="small-muted">{evaluationText.external}</span>
          </div>
          <div className="analog-grid">
            {analogs.map((analog) => (
              <article className="analog-card" key={analog.name}>
                <div className="analog-head">
                  <span className="analog-score">
                    <Compass size={15} />
                    {evaluationText.partial}
                  </span>
                  <a
                    href={analog.url}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-button"
                    aria-label={`${evaluationText.openDocs} ${analog.name}`}
                    title={`${evaluationText.openDocs} ${analog.name}`}
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
                <p className="eyebrow">{analog.category}</p>
                <h3>{analog.name}</h3>
                <dl>
                  <div><dt>{evaluationText.closest}</dt><dd>{analog.closest}</dd></div>
                  <div><dt>{evaluationText.difference}</dt><dd>{analog.difference}</dd></div>
                  <div><dt>{evaluationText.usefulNext}</dt><dd>{analog.next}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
