"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { emitHavenMeasure } from "@/lib/experiments";
import {
  GROWTH_STORAGE_KEY,
  GROWTH_UPDATE_EVENT,
  LEGACY_GROWTH_STORAGE_KEY,
  audienceContexts,
  createGrowthJourneyState,
  funnelSignals,
  getGrowthRecommendation,
  parseGrowthJourneyState,
  recordGrowthSignal,
  recordGrowthVisit,
  setGrowthAudience,
  type AudienceContext,
  type GrowthJourneyState,
} from "@/lib/growth";
import { localize, useLocale } from "./LocaleContext";

export function GrowthJourney({ pathname }: { pathname: string }) {
  const { locale } = useLocale();
  const [state, setState] = useState<GrowthJourneyState>(
    createGrowthJourneyState,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = parseGrowthJourneyState(
        window.localStorage.getItem(GROWTH_STORAGE_KEY) ||
          window.localStorage.getItem(LEGACY_GROWTH_STORAGE_KEY),
      );
      setState(recordGrowthVisit(stored, pathname));
    } catch {
      setState((current) => recordGrowthVisit(current, pathname));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setState((current) => recordGrowthVisit(current, pathname));
  }, [pathname, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(GROWTH_STORAGE_KEY, JSON.stringify(state));
      window.localStorage.removeItem(LEGACY_GROWTH_STORAGE_KEY);
    } catch {
      /* The journey remains available for the current session. */
    }
  }, [ready, state]);

  useEffect(() => {
    const readJourney = () => {
      setState(
        recordGrowthVisit(
          parseGrowthJourneyState(
            window.localStorage.getItem(GROWTH_STORAGE_KEY) ||
              window.localStorage.getItem(LEGACY_GROWTH_STORAGE_KEY),
          ),
          pathname,
        ),
      );
    };
    const syncJourney = (event: StorageEvent) => {
      if (event.key !== GROWTH_STORAGE_KEY) return;
      readJourney();
    };
    const recordEvidenceMilestone = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string; measure?: string }>).detail;
      const name = detail?.name || detail?.measure;
      if (name === "pilot_brief_exported") {
        setState((current) => recordGrowthSignal(current, "pilot_reviewed"));
      }
    };
    window.addEventListener("storage", syncJourney);
    window.addEventListener(GROWTH_UPDATE_EVENT, readJourney);
    window.addEventListener("haven:measure", recordEvidenceMilestone);
    return () => {
      window.removeEventListener("storage", syncJourney);
      window.removeEventListener(GROWTH_UPDATE_EVENT, readJourney);
      window.removeEventListener("haven:measure", recordEvidenceMilestone);
    };
  }, [pathname]);

  const recommendation = useMemo(
    () => getGrowthRecommendation(state),
    [state],
  );
  const signalCount = state.observedSignals.length;

  const selectAudience = (audience: string) => {
    const nextAudience = (audience || null) as AudienceContext | null;
    setState((current) => setGrowthAudience(current, nextAudience));
    emitHavenMeasure({
      measure: "audience_context_selected",
      surface: "growth_journey",
      audience: nextAudience || "exploring",
    });
  };

  const resetJourney = () => {
    const reset = recordGrowthVisit(
      createGrowthJourneyState(),
      pathname,
    );
    setState(reset);
    try {
      window.localStorage.removeItem(GROWTH_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_GROWTH_STORAGE_KEY);
    } catch {
      /* State is still reset for the current session. */
    }
    emitHavenMeasure({
      measure: "growth_journey_reset",
      surface: "growth_journey",
    });
  };

  const measureNextAction = () => {
    emitHavenMeasure({
      measure: "next_best_action_click",
      surface: "growth_journey",
      audience: state.audience || "exploring",
      target: recommendation.href,
    });
  };

  return (
    <section
      className="growth-journey"
      aria-labelledby="growth-journey-title"
      data-ready={ready ? "true" : "false"}
      data-measure="lifecycle_progress"
      data-measure-mode="manual"
    >
      <div className="growth-journey-heading">
        <span id="growth-journey-title">
          {localize(locale, "Decision path", "Путь решения")}
        </span>
        <span aria-live="polite">
          {localize(
            locale,
            `${signalCount}/5 decision steps observed`,
            `Пройдено шагов: ${signalCount}/5`,
          )}
        </span>
      </div>
      <progress
        className="growth-journey-progress"
        value={signalCount}
        max={5}
        title={funnelSignals
          .map((signal) => `${state.observedSignals.includes(signal.id) ? "✓" : "○"} ${signal.label[locale]}`)
          .join(" · ")}
        aria-label={localize(
          locale,
          `${signalCount} of 5 decision steps observed`,
          `Пройдено шагов решения: ${signalCount} из 5`,
        )}
      />
      <label className="growth-journey-context">
        <span>{localize(locale, "My decision context", "Контекст решения")}</span>
        <select
          value={state.audience || ""}
          onChange={(event) => selectAudience(event.target.value)}
          data-measure="audience_context_selected"
          data-measure-mode="manual"
        >
          <option value="">
            {localize(locale, "Understand whether HAVEN fits", "Понять, подходит ли HAVEN")}
          </option>
          {audienceContexts.map((context) => (
            <option value={context.id} key={context.id}>
              {context.label[locale]}
            </option>
          ))}
        </select>
      </label>
      <div className="growth-journey-next">
        <span>{localize(locale, "Next evidence step", "Следующий шаг с доказательствами")}</span>
        <Link
          prefetch={false}
          href={recommendation.href}
          data-measure="next_best_action_click"
          data-measure-mode="manual"
          onClick={measureNextAction}
        >
          <span>{recommendation.label[locale]}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <small>{recommendation.reason[locale]}</small>
      </div>
      <div className="growth-journey-privacy">
        <small>
          {localize(
            locale,
            "Progress guidance stays in this browser. Session measurement is local to this tab and is not population analytics or a sales submission.",
            "Подсказки прогресса остаются в этом браузере. Измерение сессии локально для этой вкладки и не является аналитикой всей аудитории или отправкой в продажи.",
          )}
        </small>
        <button type="button" onClick={resetJourney}>
          <RotateCcw size={13} aria-hidden="true" />
          {localize(locale, "Clear progress", "Очистить прогресс")}
        </button>
      </div>
    </section>
  );
}
