"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Radio } from "lucide-react";
import { localize, useLocale } from "./LocaleContext";

function isPublicStatus(value: unknown): value is { schema: string } {
  return (
    !!value &&
    typeof value === "object" &&
    "schema" in value &&
    (value as { schema: unknown }).schema === "haven-public-status/1"
  );
}

type StatusState = "checking" | "online" | "unavailable";

export function NodeStatus() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<StatusState>("checking");
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    let active = true;

    setBusy(true);
    setStatus("checking");

    fetch("/api/v1/status", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data: unknown = await response.json();
        if (!response.ok || !isPublicStatus(data)) throw new Error();
        if (active) setStatus("online");
      })
      .catch(() => {
        if (active) setStatus("unavailable");
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (active) setBusy(false);
      });

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt]);

  const statusText =
    status === "checking"
      ? localize(locale, "Checking public API…", "Проверка публичного API…")
      : status === "online"
        ? localize(
            locale,
            "Public API online / Local demo node",
            "Публичный API доступен / Локальный демо-узел",
          )
        : localize(
            locale,
            "Public API unavailable",
            "Публичный API недоступен",
          );

  const refreshLabel = localize(
    locale,
    "Refresh node status",
    "Обновить статус узла",
  );

  return (
    <div
      className="node-health"
      role="status"
      aria-live="polite"
      aria-busy={busy}
    >
      <Radio size={18} aria-hidden="true" />
      <span>{statusText}</span>
      <button
        type="button"
        className="icon-button"
        title={refreshLabel}
        aria-label={refreshLabel}
        disabled={busy}
        onClick={() => setAttempt((value) => value + 1)}
      >
        <RefreshCw size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
