"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Fingerprint,
  GitBranch,
  Sparkles,
} from "lucide-react";
import {
  analogs,
  developmentTrajectory,
  maturitySignals,
} from "@/lib/product-landscape";
import {
  attributionRules,
  evaluationCriteria,
  evaluationPath,
  funnelStages,
  pilotQuestions,
} from "@/lib/adoption";
import { DeferredContinuumScene } from "./DeferredContinuumScene";
import { useLocale } from "./LocaleContext";

const evaluationCopy = {
  en: {
    pageEyebrow: "HAVEN / Product landscape",
    pageTitle: "See where HAVEN fits and what it can prove today.",
    pageLead: "HAVEN combines ideas from content addressing, portable identity, private data stores and access control. It is not a replacement for those systems: it is a human-facing workspace for checking agent identity, provenance and authority across them.",
    positioning: "Product role",
    positioningBody: "A verification layer between people, AI agents, private memory and public evidence.",
    maturityAria: "Current HAVEN implementation status",
    buildPulse: "Available now",
    buildTitle: "Read the evidence behind every implementation claim",
    testClaim: "Check a public object",
    verifyLimits: "Review product limits",
    nearby: "Adjacent systems",
    analogTitle: "Compare the parts HAVEN can learn from",
    external: "Links open official documentation in a new tab.",
    partial: "Partial overlap",
    closest: "Shared ground",
    difference: "What HAVEN adds",
    usefulNext: "Possible next step",
    openDocs: "Open official documentation for",
    eyebrow: "Pilot evaluation",
    title: "Decide whether a bounded pilot is worth preparing",
    fit: "A fit when",
    noFit: "Not a fit when",
    questions: "Questions to answer first",
    evidence: "Evidence for the next decision",
    open: "Open step",
    measurement: "How progress is counted",
    measurementTitle: "Measure each step only among people who could complete it",
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
    pageTitle: "Поймите место HAVEN и проверьте, что он умеет сегодня.",
    pageLead: "HAVEN объединяет идеи адресации контента, переносимой идентичности, приватных хранилищ и контроля доступа. Он не заменяет эти системы, а даёт человеку среду для проверки идентичности, происхождения и полномочий агента между ними.",
    positioning: "Роль продукта",
    positioningBody: "Слой проверки между людьми, ИИ-агентами, приватной памятью и публичными доказательствами.",
    maturityAria: "Текущий статус реализации HAVEN",
    buildPulse: "Доступно сейчас",
    buildTitle: "Проверьте доказательства каждого заявления о реализации",
    testClaim: "Проверить публичный объект",
    verifyLimits: "Изучить границы продукта",
    nearby: "Смежные системы",
    analogTitle: "Сравните компоненты, у которых HAVEN может учиться",
    external: "Ссылки откроют официальную документацию в новой вкладке.",
    partial: "Частичное пересечение",
    closest: "Общая основа",
    difference: "Что добавляет HAVEN",
    usefulNext: "Возможный следующий шаг",
    openDocs: "Открыть официальную документацию",
    eyebrow: "Оценка пилота",
    title: "Решите, стоит ли готовить ограниченный пилот",
    fit: "Подходит, когда",
    noFit: "Не подходит, когда",
    questions: "Что выяснить сначала",
    evidence: "Доказательство для следующего решения",
    open: "Открыть шаг",
    measurement: "Как считается прогресс",
    measurementTitle: "Измеряйте каждый шаг только среди тех, кто мог его завершить",
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

      <section className="analog-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">{evaluationText.nearby}</p>
            <h2>{evaluationText.analogTitle}</h2>
          </div>
          <span className="small-muted">
            {evaluationText.external}
          </span>
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
                <div>
                  <dt>{evaluationText.closest}</dt>
                  <dd>{analog.closest}</dd>
                </div>
                <div>
                  <dt>{evaluationText.difference}</dt>
                  <dd>{analog.difference}</dd>
                </div>
                <div>
                  <dt>{evaluationText.usefulNext}</dt>
                  <dd>{analog.next}</dd>
                </div>
              </dl>
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
        <div className="analog-grid">
          {evaluationCriteria.map((criterion) => (
            <article className="analog-card" key={criterion.dimension.en}>
              <p className="eyebrow">{evaluationText.fitLabel}</p>
              <h3>{criterion.dimension[locale]}</h3>
              <dl>
                <div><dt>{evaluationText.fit}</dt><dd>{criterion.fit[locale]}</dd></div>
                <div><dt>{evaluationText.noFit}</dt><dd>{criterion.noFit[locale]}</dd></div>
              </dl>
            </article>
          ))}
          {[pilotQuestions.buyer, pilotQuestions.technicalLead].map((group) => (
            <article className="analog-card" key={group.title.en}>
              <p className="eyebrow">{evaluationText.questions}</p>
              <h3>{group.title[locale]}</h3>
              <dl>
                {group.questions.map((question, index) => (
                  <div key={question.en}>
                    <dt>{String(index + 1).padStart(2, "0")}</dt>
                    <dd>{question[locale]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="human-route-section" aria-labelledby="measurement-contract">
        <div className="section-title">
          <div>
            <p className="eyebrow">{evaluationText.measurement}</p>
            <h2 id="measurement-contract">{evaluationText.measurementTitle}</h2>
          </div>
          <Compass size={20} />
        </div>
        <div className="analog-grid">
          {funnelStages.map((stage) => (
            <article className="analog-card" key={stage.id}>
              <p className="eyebrow">{stage.id}</p>
              <h3>{stage.label[locale]}</h3>
              <dl>
                <div><dt>{evaluationText.entry}</dt><dd className="mono">{stage.entryEvent}</dd></div>
                <div><dt>{evaluationText.completion}</dt><dd className="mono">{stage.completionEvent}</dd></div>
                <div><dt>{evaluationText.denominator}</dt><dd>{stage.denominator[locale]}</dd></div>
                <div><dt>{evaluationText.dropOff}</dt><dd>{stage.dropOff[locale]}</dd></div>
              </dl>
            </article>
          ))}
          <article className="analog-card">
            <p className="eyebrow">{evaluationText.attribution}</p>
            <h3>{evaluationText.causal}</h3>
            <dl>
              {attributionRules.map((item) => (
                <div key={item.id}>
                  <dt>{item.id}</dt>
                  <dd>{item.rule[locale]}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      <section className="trajectory-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">{evaluationText.development}</p>
            <h2>{evaluationText.developmentTitle}</h2>
          </div>
          <GitBranch size={20} />
        </div>
        <div className="trajectory-grid">
          {developmentTrajectory.map((item) => (
            <article key={item.stage} className="trajectory-card">
              <span>{item.stage}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <small>{item.signal}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="artifact-strip" aria-label={evaluationText.artifacts}>
        {[
          ["continuity.png", "Continuity strands"],
          ["discovery.png", "Discovery pathways"],
          ["federation.png", "Federation bridge"],
        ].map(([src], index) => (
          <div key={src} className="artifact-panel">
            <Image
              src={`/assets/${src}`}
              alt={evaluationText.artifactLabels[index]}
              width={900}
              height={560}
              sizes="(max-width: 700px) 88vw, 30vw"
            />
            <span>{evaluationText.artifactLabels[index]}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
