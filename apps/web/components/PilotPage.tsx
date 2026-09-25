"use client";

import { localize, useLocale } from "./LocaleContext";
import { PageHeader } from "./PageHeader";
import { PilotIntake } from "./PilotIntake";

export function PilotPage() {
  const { locale } = useLocale();

  return (
    <div className="page-shell pilot-page">
      <PageHeader
        eyebrow={localize(locale, "Design-partner pilot", "Design-partner пилот")}
        title={localize(
          locale,
          "Turn evaluation evidence into a bounded pilot request.",
          "Превратите доказательства оценки в ограниченный запрос на пилот.",
        )}
        description={localize(
          locale,
          "Use this handoff only after the use case, owners, success evidence, data boundary and stop conditions are concrete. The submission path is explicit and consent-based.",
          "Используйте эту передачу только после того, как сценарий, владельцы, доказательства успеха, границы данных и условия остановки стали конкретными. Отправка явная и требует согласия.",
        )}
        badge={localize(locale, "Qualified handoff", "Квалифицированная передача")}
      />
      <PilotIntake />
    </div>
  );
}
