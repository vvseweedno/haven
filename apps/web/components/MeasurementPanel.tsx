"use client";

import { BarChart3, Download, RotateCcw, ShieldCheck } from "lucide-react";
import { localize, useLocale } from "./LocaleContext";
import { useMeasurement } from "./MeasurementProvider";

const stageLabels = {
  orient: { en: "Orient", ru: "Ориентация" },
  explore: { en: "Explore", ru: "Исследование" },
  verify: { en: "Verify", ru: "Проверка" },
  adopt: { en: "Adopt", ru: "Внедрение" },
} as const;

export function MeasurementPanel() {
  const { locale } = useLocale();
  const {
    ledger,
    attribution,
    funnel,
    ready,
    exportMeasurement,
    resetMeasurement,
  } = useMeasurement();
  const attributionEntries = Object.entries(attribution);

  return (
    <aside
      className="measurement-panel"
      aria-label={localize(locale, "Local measurement", "Локальные измерения")}
      data-ready={ready ? "true" : "false"}
    >
      <details>
        <summary className="measurement-panel-summary">
          <span>
            <BarChart3 size={15} aria-hidden="true" />
            {localize(locale, "Measurement ledger", "Журнал измерений")}
          </span>
          <span aria-live="polite">
            {ledger.events.length} {localize(locale, "events", "событий")} ·{" "}
            {funnel.reached}/{funnel.total}
          </span>
        </summary>
        <div className="measurement-panel-body">
          <div className="measurement-panel-privacy">
            <ShieldCheck size={16} aria-hidden="true" />
            <p>
              <strong>
                {localize(locale, "This browser only", "Только этот браузер")}
              </strong>
              <span>
                {localize(
                  locale,
                  "Semantic events only. No typed text, cookies, user IDs or network transmission.",
                  "Только семантические события. Без введённого текста, cookies, ID пользователя и сетевой отправки.",
                )}
              </span>
            </p>
          </div>
          <div className="measurement-panel-section">
            <span>{localize(locale, "Session source", "Источник сессии")}</span>
            <p>
              {attributionEntries.length > 0
                ? attributionEntries
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(" · ")
                : localize(locale, "Direct / unattributed", "Прямой / не определён")}
            </p>
          </div>
          <div className="measurement-panel-section">
            <span>{localize(locale, "Observed funnel", "Наблюдаемый funnel")}</span>
            <ol className="measurement-funnel">
              {funnel.stages.map((stage) => (
                <li
                  className={stage.reached ? "is-reached" : ""}
                  key={stage.id}
                >
                  <span aria-hidden="true">{stage.reached ? "●" : "○"}</span>
                  {stageLabels[stage.id][locale]}
                </li>
              ))}
            </ol>
          </div>
          <div className="measurement-panel-actions">
            <button
              type="button"
              onClick={exportMeasurement}
              disabled={!ready}
              data-measure="measurement_export"
            >
              <Download size={14} aria-hidden="true" />
              {localize(locale, "Export JSON", "Экспорт JSON")}
            </button>
            <button
              type="button"
              onClick={resetMeasurement}
              disabled={!ready}
            >
              <RotateCcw size={14} aria-hidden="true" />
              {localize(locale, "Reset", "Сбросить")}
            </button>
          </div>
        </div>
      </details>
    </aside>
  );
}
