"use client";

import Link from "next/link";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { localize, useLocale } from "@/components/LocaleContext";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocale();

  return (
    <div className="page-shell route-error-shell">
      <section className="route-error" role="alert" aria-labelledby="route-error-title">
        <p className="eyebrow">
          {localize(locale, "Interface recovery", "Восстановление интерфейса")}
        </p>
        <h1 id="route-error-title">
          {localize(
            locale,
            "This part of HAVEN could not be rendered.",
            "Эту часть HAVEN не удалось отобразить.",
          )}
        </h1>
        <p className="lede">
          {localize(
            locale,
            "Your browser-local workspace is not cleared by this screen. Retry the route, or return to product orientation.",
            "Этот экран не очищает локальное рабочее пространство браузера. Повторите загрузку маршрута или вернитесь к обзору продукта.",
          )}
        </p>
        <div className="button-row route-error-actions">
          <button type="button" className="button primary" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            {localize(locale, "Try again", "Повторить")}
          </button>
          <Link href="/" className="button">
            <ArrowLeft size={16} aria-hidden="true" />
            {localize(locale, "Return to orientation", "Вернуться к обзору")}
          </Link>
        </div>
      </section>
    </div>
  );
}
