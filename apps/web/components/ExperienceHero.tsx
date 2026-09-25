"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { productMetrics, humanJourneys } from "@/lib/product-landscape";
import {
  CTA_EXPERIMENT_ID,
  assignCtaExperiment,
  emitHavenMeasure,
  type ExperimentVariant,
} from "@/lib/experiments";
import {
  GROWTH_STORAGE_KEY,
  GROWTH_UPDATE_EVENT,
  LEGACY_GROWTH_STORAGE_KEY,
  parseGrowthJourneyState,
  setGrowthAudience,
  type AudienceContext,
} from "@/lib/growth";
import { DeferredContinuumScene } from "./DeferredContinuumScene";
import { localize, useLocale } from "./LocaleContext";

export function ExperienceHero() {
  const { locale } = useLocale();
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [experimentVariant, setExperimentVariant] =
    useState<ExperimentVariant | null>(null);
  const text = (english: string, russian: string) =>
    localize(locale, english, russian);
  const activeJourney = humanJourneys[activeJourneyIndex];
  const journeyAudiences: AudienceContext[] = ["building", "evaluating", "governing"];

  useEffect(() => {
    try {
      const audience = parseGrowthJourneyState(
        window.localStorage.getItem(GROWTH_STORAGE_KEY) ||
          window.localStorage.getItem(LEGACY_GROWTH_STORAGE_KEY),
      ).audience;
      const index = audience ? journeyAudiences.indexOf(audience) : -1;
      if (index >= 0) setActiveJourneyIndex(index);
    } catch {
      /* The default audience remains available without local storage. */
    }
  }, []);

  useEffect(() => {
    const variant = assignCtaExperiment();
    setExperimentVariant(variant);
    queueMicrotask(() => {
      emitHavenMeasure({
        measure: "hero_cta_exposure",
        surface: "experience_hero",
        experiment: CTA_EXPERIMENT_ID,
        variant,
      });
    });
  }, []);

  const selectJourney = (index: number) => {
    setActiveJourneyIndex(index);
    try {
      const current = parseGrowthJourneyState(
        window.localStorage.getItem(GROWTH_STORAGE_KEY),
      );
      window.localStorage.setItem(
        GROWTH_STORAGE_KEY,
        JSON.stringify(setGrowthAudience(current, journeyAudiences[index])),
      );
      window.dispatchEvent(new Event(GROWTH_UPDATE_EVENT));
    } catch {
      /* Audience selection still works for the current view. */
    }
    emitHavenMeasure({
      measure: "audience_context_selected",
      surface: "experience_hero",
      experiment: CTA_EXPERIMENT_ID,
      variant: experimentVariant || "a",
      audience: journeyAudiences[index],
    });
  };

  const variant = experimentVariant || "a";
  const routePrimaryLabels = [
    {
      en: "Inspect agent continuity",
      ru: "Проверить непрерывность агента",
    },
    { en: "Trace a claim to evidence", ru: "Проследить утверждение до источника" },
    { en: "Review product limits", ru: "Проверить границы продукта" },
  ];

  const measureCta = (position: "primary" | "secondary", target: string) => {
    emitHavenMeasure({
      measure: "hero_cta_click",
      surface: `experience_hero_${position}`,
      experiment: CTA_EXPERIMENT_ID,
      variant,
      audience: journeyAudiences[activeJourneyIndex],
      target,
    });
  };

  return (
    <section
      className="experience-hero"
      aria-labelledby="experience-title"
      data-experiment={CTA_EXPERIMENT_ID}
      data-variant={variant}
      data-measure="hero_cta_exposure"
      data-measure-mode="manual"
    >
      <DeferredContinuumScene />
      <div className="hero-image-plates" aria-hidden="true">
        <Image
          src="/assets/continuity.png"
          alt=""
          width={900}
          height={560}
          sizes="220px"
          priority
        />
        <Image
          src="/assets/federation.png"
          alt=""
          width={900}
          height={560}
          sizes="220px"
        />
      </div>
      <div className="experience-hero-content">
        <div className="hero-copy">
          <p className="eyebrow">
            {text(
              "HAVEN / Evidence for durable AI-agent continuity",
              "HAVEN / Доказательства непрерывности ИИ-агентов",
            )}
          </p>
          <h1 id="experience-title">
            {text(
              "Know what survives when an AI agent changes model, runtime or operator.",
              "Поймите, что сохраняется при смене модели, среды или оператора ИИ-агента.",
            )}
          </h1>
          <p className="lede">
            {text(
              "HAVEN helps agent-platform, research and governance teams inspect identity, provenance and authority across changes, create a local proof receipt, and decide whether a bounded pilot is worth preparing. This build is an evaluation prototype: it does not connect an agent, create a CRM lead or certify external truth.",
              "HAVEN помогает разработчикам agent-платформ, исследовательским и governance-командам проверять идентичность, происхождение и полномочия при изменениях, создавать локальную proof-квитанцию и решать, стоит ли готовить ограниченный пилот. Эта сборка — прототип для оценки: она не подключает агента, не создаёт CRM-лид и не подтверждает внешнюю истину.",
            )}
          </p>
          <div
            id="acquisition-next-step"
            className="hero-actions"
            aria-live="polite"
            data-experiment={CTA_EXPERIMENT_ID}
            data-variant={variant}
            data-measure="hero_cta_order"
            data-measure-mode="manual"
          >
            {variant === "a" ? (
              <>
                <Link
                  prefetch={false}
                  href="/proof-desk#proof-workbench"
                  className="button primary"
                  data-measure="hero_cta_click"
                  data-measure-mode="manual"
                  onClick={() => measureCta("primary", "/proof-desk")}
                >
                  <Fingerprint size={16} />
                  {text(activeJourney.proofAction, activeJourney.proofActionRu)}
                </Link>
                <Link
                  prefetch={false}
                  href={activeJourney.href}
                  className="text-link"
                  data-measure="hero_cta_click"
                  data-measure-mode="manual"
                  onClick={() => measureCta("secondary", activeJourney.href)}
                >
                  {text(activeJourney.routeCta, activeJourney.routeCtaRu)}
                  <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  prefetch={false}
                  href={activeJourney.href}
                  className="button primary"
                  data-measure="hero_cta_click"
                  data-measure-mode="manual"
                  onClick={() => measureCta("primary", activeJourney.href)}
                >
                  <ArrowRight size={16} />
                  {text(
                    routePrimaryLabels[activeJourneyIndex].en,
                    routePrimaryLabels[activeJourneyIndex].ru,
                  )}
                </Link>
                <Link
                  prefetch={false}
                  href="/proof-desk#proof-workbench"
                  className="text-link"
                  data-measure="hero_cta_click"
                  data-measure-mode="manual"
                  onClick={() => measureCta("secondary", "/proof-desk")}
                >
                  {text("Create an inspectable proof receipt", "Создать проверяемую proof-квитанцию")}
                  <Fingerprint size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
        <div
          className="hero-metrics"
          aria-label={text(
            "Observed local prototype metrics",
            "Наблюдаемые метрики локального прототипа",
          )}
        >
          {productMetrics.map((metric) => (
            <div key={metric.label}>
              <span>{text(metric.label, metric.labelRu)}</span>
              <strong>{metric.value}</strong>
              <small>{text(metric.detail, metric.detailRu)}</small>
            </div>
          ))}
        </div>
      </div>
      <div
        id="acquisition-lens"
        className="journey-strip"
        aria-label={text(
          "Choose an evaluation lens",
          "Выберите задачу проверки",
        )}
      >
        {humanJourneys.map((journey, index) => (
          <button
            type="button"
            className={`journey-chip ${activeJourneyIndex === index ? "is-active" : ""}`}
            key={journey.title}
            aria-pressed={activeJourneyIndex === index}
            aria-controls="acquisition-next-step"
            data-measure="audience_context_selected"
            data-measure-mode="manual"
            onClick={() => selectJourney(index)}
          >
            <span>
              <ShieldCheck size={15} />
              {text(journey.persona, journey.personaRu)}
            </span>
            <strong>{text(journey.title, journey.titleRu)}</strong>
            <small>
              {text(journey.metric, journey.metricRu)}
              <ArrowUpRight size={13} />
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}
