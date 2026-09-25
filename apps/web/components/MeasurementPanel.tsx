"use client";

import { BarChart3, Download, FlaskConical, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import { heroCtaExperiment } from "@/lib/experiments";
import { useEffect, useState } from "react";
import { localize, useLocale } from "./LocaleContext";
import { useMeasurement } from "./MeasurementProvider";

const stageLabels = {
  orient: { en: "Orient", ru: "Ориентация" },
  verify: { en: "Verify", ru: "Проверка" },
  bound: { en: "Bound", ru: "Границы" },
  prepare: { en: "Prepare", ru: "Подготовка" },
  contact: { en: "Contact", ru: "Контакт" },
} as const;

export function MeasurementPanel() {
  const { locale } = useLocale();
  const measurement = useMeasurement();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get("diagnostics") === "1");
  }, []);

  if (!visible) return null;
  const {
    ledger,
    attribution,
    funnel,
    friction,
    ready,
    exportMeasurement,
    resetMeasurement,
  } = measurement;
  const attributionEntries = Object.entries(attribution);
  const nextStage = funnel.nextStage ? stageLabels[funnel.nextStage][locale] : null;

  return (
    <aside
      className="measurement-panel"
      aria-label={localize(locale, "Session diagnostics", "Диагностика сессии")}
      data-ready={ready ? "true" : "false"}
    >
      <details>
        <summary className="measurement-panel-summary">
          <span>
            <BarChart3 size={15} aria-hidden="true" />
            {localize(locale, "Session diagnostics", "Диагностика сессии")}
          </span>
          <span aria-live="polite">
            {ledger.events.length} {localize(locale, "events", "событий")} ·{" "}
            {funnel.reached}/{funnel.total} {localize(locale, "ordered", "по порядку")}
            {funnel.observed !== funnel.reached ? " · " + funnel.observed + " observed" : ""}
          </span>
        </summary>

        <div className="measurement-panel-body">
          <div className="measurement-panel-privacy">
            <ShieldCheck size={16} aria-hidden="true" />
            <p>
              <strong>
                {localize(locale, "This tab session only", "Только эта сессия вкладки")}
              </strong>
              <span>
                {localize(
                  locale,
                  "Semantic events only. No typed text, cookies, cross-session ID or network analytics transmission.",
                  "Только семантические события. Без введённого текста, cookies, межсессионного ID и сетевой передачи аналитики.",
                )}
              </span>
            </p>
          </div>

          <div className="measurement-panel-section">
            <span>{localize(locale, "First-touch source", "Первичный источник")}</span>
            <p>
              {attributionEntries.length > 0
                ? attributionEntries
                    .map(([key, value]) => key + ": " + value)
                    .join(" · ")
                : localize(locale, "Direct / unattributed", "Прямой / не определён")}
            </p>
          </div>

          <div className="measurement-panel-section">
            <span>{localize(locale, "Decision funnel", "Воронка решения")}</span>
            <ol className="measurement-funnel">
              {funnel.stages.map((stage) => (
                <li
                  className={stage.reached ? "is-reached" : ""}
                  key={stage.id}
                  title={stage.completionEvent}
                >
                  <span aria-hidden="true">{stage.reached ? "●" : "○"}</span>
                  {stageLabels[stage.id][locale]}
                </li>
              ))}
            </ol>
            <p>
              {nextStage
                ? localize(
                    locale,
                    "Next uncompleted evidence step: " + nextStage + ".",
                    "Следующий незавершённый шаг с доказательством: " + nextStage + ".",
                  )
                : localize(
                    locale,
                    "All five evidence steps were completed in this tab session.",
                    "Все пять шагов с доказательствами завершены в этой сессии вкладки.",
                  )}
            </p>
          </div>

          <div className="measurement-panel-section">
            <span>
              <TriangleAlert size={13} aria-hidden="true" />{" "}
              {localize(locale, "Observed friction", "Наблюдаемое трение")}
            </span>
            <p>
              {friction.total === 0
                ? localize(
                    locale,
                    "No proof, pilot-handoff or journey-reset failures recorded in this session.",
                    "В этой сессии не зафиксированы ошибки proof, передачи пилота или сбросы пути.",
                  )
                : localize(
                    locale,
                    "Proof failures: " + friction.proofFailures + " · Pilot failures: " + friction.pilotFailures + " · Journey resets: " + friction.journeyResets,
                    "Ошибки proof: " + friction.proofFailures + " · Ошибки пилота: " + friction.pilotFailures + " · Сбросы пути: " + friction.journeyResets,
                  )}
            </p>
          </div>

          <div className="measurement-panel-section">
            <span>
              <FlaskConical size={13} aria-hidden="true" />{" "}
              {localize(locale, "Experiment integrity", "Целостность эксперимента")}
            </span>
            <p>
              {localize(
                locale,
                heroCtaExperiment.id + ": QA-only. Control is the default; query overrides are for interface verification and are not eligible for inference.",
                heroCtaExperiment.id + ": только QA. По умолчанию используется контроль; query-переопределения нужны для проверки интерфейса и не подходят для статистических выводов.",
              )}
            </p>
          </div>

          <div className="measurement-panel-actions">
            <button
              type="button"
              onClick={exportMeasurement}
              disabled={!ready}
              data-measure="measurement_export"
            >
              <Download size={14} aria-hidden="true" />
              {localize(locale, "Export session JSON", "Экспорт JSON сессии")}
            </button>
            <button
              type="button"
              onClick={resetMeasurement}
              disabled={!ready}
            >
              <RotateCcw size={14} aria-hidden="true" />
              {localize(locale, "Reset session", "Сбросить сессию")}
            </button>
          </div>
        </div>
      </details>
    </aside>
  );
}
