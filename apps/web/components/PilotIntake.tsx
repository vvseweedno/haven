"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { dispatchMeasurement } from "@/lib/measurement";
import { localize, useLocale } from "./LocaleContext";
import { useMeasurement } from "./MeasurementProvider";

type IntakeStatus = {
  configured: boolean;
  contactUrl: string | null;
};

const failureModes = [
  ["continuity", "Runtime / model continuity", "Непрерывность runtime / модели"],
  ["provenance", "Evidence provenance", "Происхождение доказательств"],
  ["authority", "Delegated authority", "Делегированные полномочия"],
  ["governance", "Governance / auditability", "Управление / аудит"],
  ["other", "Other", "Другое"],
] as const;

export function PilotIntake() {
  const { locale } = useLocale();
  const { attribution } = useMeasurement();
  const [status, setStatus] = useState<IntakeStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const submissionRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort("status_timeout"), 8000);
    let cancelled = false;

    fetch("/api/v1/pilot-request", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("status_unavailable");
        const value: unknown = await response.json();
        if (cancelled) return;
        const data =
          value && typeof value === "object"
            ? (value as { configured?: unknown; contactUrl?: unknown })
            : {};
        setStatus({
          configured: data.configured === true,
          contactUrl:
            typeof data.contactUrl === "string" ? data.contactUrl : null,
        });
      })
      .catch(() => {
        if (!cancelled) setStatus({ configured: false, contactUrl: null });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort("component_unmounted");
      window.clearTimeout(timeout);
      submissionRequest.current?.abort("component_unmounted");
      submissionRequest.current = null;
    };
  }, []);

  const copy = useMemo(
    () =>
      locale === "ru"
        ? {
            eyebrow: "Квалифицированный запрос на пилот",
            title: "Отправляйте запрос только после того, как проблема и границы пилота стали конкретными.",
            lead: "Форма передаёт только те данные, которые вы явно введёте и согласитесь отправить. Локальные заметки, proof-объекты и история просмотра не прикладываются.",
            configured: "Защищённая передача запроса доступна.",
            unavailable: "Серверная передача запроса пока не настроена. Сохраните pilot brief локально или используйте опубликованный контакт.",
            name: "Имя",
            email: "Рабочий email",
            organization: "Организация",
            role: "Роль",
            failure: "Основная проблема",
            workflow: "Какой реальный процесс вы хотите проверить?",
            goal: "Какой наблюдаемый результат должен доказать ценность пилота?",
            boundary: "Какие данные или действия обязаны остаться локальными? (необязательно)",
            consent: "Я согласен передать введённые мной контактные и квалификационные данные для ответа по пилоту.",
            submit: "Отправить запрос на пилот",
            submitting: "Отправка…",
            success: "Запрос принят. Сохраните request ID для дальнейшей переписки.",
            error: "Запрос не был передан. Ничего не было сохранено локально как CRM-запись.",
            direct: "Открыть опубликованный контакт",
            privacy: "Никакого скрытого профилирования: отправка происходит только после нажатия этой кнопки.",
          }
        : {
            eyebrow: "Qualified pilot request",
            title: "Submit only after the problem and pilot boundary are concrete.",
            lead: "The form sends only the information you explicitly type and consent to submit. Local notes, proof objects and browsing history are not attached.",
            configured: "Secure pilot handoff is available.",
            unavailable: "Server-side pilot handoff is not configured yet. Keep the pilot brief locally or use the published contact route.",
            name: "Name",
            email: "Work email",
            organization: "Organization",
            role: "Role",
            failure: "Primary failure mode",
            workflow: "Which real workflow do you want to evaluate?",
            goal: "What observable result would prove the pilot was useful?",
            boundary: "Which data or actions must remain local? (optional)",
            consent: "I consent to submit the contact and qualification data I entered so the team can respond about a pilot.",
            submit: "Submit qualified pilot request",
            submitting: "Submitting…",
            success: "Request accepted. Keep the request ID for follow-up.",
            error: "The request was not handed off. No CRM record was created by this form.",
            direct: "Open published contact",
            privacy: "No hidden profiling: transmission happens only after you press this button.",
          },
    [locale],
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!status?.configured || submitting) return;
    setSubmitting(true);
    setResult("idle");
    setMessage("");
    dispatchMeasurement({ name: "pilot_request_started", context: "pilot_intake" });

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      locale,
      fullName: form.get("fullName"),
      workEmail: form.get("workEmail"),
      organization: form.get("organization"),
      role: form.get("role"),
      failureMode: form.get("failureMode"),
      workflow: form.get("workflow"),
      pilotGoal: form.get("pilotGoal"),
      dataBoundary: form.get("dataBoundary"),
      consent: form.get("consent") === "on",
      website: form.get("website"),
      attribution,
    };

    submissionRequest.current?.abort("replaced");
    const controller = new AbortController();
    submissionRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort("submit_timeout"), 12000);

    try {
      const response = await fetch("/api/v1/pilot-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data: unknown = await response.json();
      const resultData =
        data && typeof data === "object"
          ? (data as { ok?: unknown; code?: unknown; requestId?: unknown })
          : {};
      if (!response.ok || resultData.ok !== true) {
        setResult("error");
        setMessage(copy.error);
        dispatchMeasurement({
          name: "pilot_request_failed",
          context: "pilot_intake",
          outcome:
            typeof resultData.code === "string" ? resultData.code : "unknown",
        });
        return;
      }

      setResult("success");
      setMessage(
        typeof resultData.requestId === "string"
          ? `${copy.success} ${resultData.requestId}`
          : copy.success,
      );
      formElement.reset();
      dispatchMeasurement({
        name: "pilot_request_submitted",
        context: "pilot_intake",
        outcome: "accepted",
      });
    } catch {
      if (
        controller.signal.aborted &&
        submissionRequest.current !== controller
      ) {
        return;
      }
      setResult("error");
      setMessage(copy.error);
      dispatchMeasurement({
        name: "pilot_request_failed",
        context: "pilot_intake",
        outcome: controller.signal.aborted ? "timeout" : "network_error",
      });
    } finally {
      window.clearTimeout(timeout);
      if (submissionRequest.current === controller) {
        submissionRequest.current = null;
        setSubmitting(false);
      }
    }
  }

  return (
    <section className="pilot-intake" aria-labelledby="pilot-intake-title">
      <div className="pilot-intake-copy">
        <p className="signal-kicker">
          <Send size={14} aria-hidden="true" /> {copy.eyebrow}
        </p>
        <h2 id="pilot-intake-title">{copy.title}</h2>
        <p>{copy.lead}</p>
        <div
          id="pilot-intake-status"
          className="pilot-intake-status"
          role="status"
          aria-live="polite"
        >
          <ShieldCheck size={17} aria-hidden="true" />
          <span>
            {status === null
              ? localize(locale, "Checking handoff…", "Проверка канала передачи…")
              : status.configured
                ? copy.configured
                : copy.unavailable}
          </span>
        </div>
        {status?.contactUrl ? (
          <a
            className="text-link"
            href={status.contactUrl}
            target={status.contactUrl.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            data-measure="pilot_contact_opened"
          >
            {copy.direct}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <form
        className="pilot-intake-form"
        onSubmit={submit}
        aria-busy={submitting}
        aria-describedby="pilot-intake-status"
      >
        {status !== null && !status.configured ? (
          <div className="pilot-intake-unavailable" role="status">
            <strong>
              {localize(locale, "Handoff is not available yet.", "Передача запроса пока недоступна.")}
            </strong>
            <p>{copy.unavailable}</p>
            <div className="button-row">
              <Link href="/delivery#pilot-readiness" className="button">
                {localize(locale, "Return to pilot readiness", "Вернуться к готовности пилота")}
              </Link>
              {status.contactUrl ? (
                <a className="button" href={status.contactUrl}>
                  {copy.direct}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        <fieldset className="pilot-intake-fields" disabled={!status?.configured}>
        <legend className="sr-only">
          {localize(locale, "Pilot request details", "Данные запроса на пилот")}
        </legend>
        <div className="pilot-intake-grid">
          <label>
            <span>{copy.name}</span>
            <input name="fullName" autoComplete="name" minLength={2} maxLength={80} required />
          </label>
          <label>
            <span>{copy.email}</span>
            <input name="workEmail" type="email" autoComplete="email" maxLength={160} required />
          </label>
          <label>
            <span>{copy.organization}</span>
            <input name="organization" autoComplete="organization" minLength={2} maxLength={120} required />
          </label>
          <label>
            <span>{copy.role}</span>
            <input name="role" autoComplete="organization-title" minLength={2} maxLength={100} required />
          </label>
        </div>

        <label>
          <span>{copy.failure}</span>
          <select name="failureMode" defaultValue="continuity">
            {failureModes.map(([value, en, ru]) => (
              <option key={value} value={value}>
                {locale === "ru" ? ru : en}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{copy.workflow}</span>
          <textarea name="workflow" minLength={20} maxLength={1200} rows={5} required />
        </label>
        <label>
          <span>{copy.goal}</span>
          <textarea name="pilotGoal" minLength={20} maxLength={1200} rows={4} required />
        </label>
        <label>
          <span>{copy.boundary}</span>
          <textarea name="dataBoundary" maxLength={800} rows={3} />
        </label>

        <label className="pilot-intake-consent">
          <input name="consent" type="checkbox" required />
          <span>{copy.consent}</span>
        </label>

        <label className="pilot-intake-honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <div className="pilot-intake-submit">
          <button
            type="submit"
            className="button primary"
            disabled={!status?.configured || submitting}
          >
            {result === "success" ? (
              <CheckCircle2 size={16} aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
            {submitting ? copy.submitting : copy.submit}
          </button>
          <small>{copy.privacy}</small>
        </div>

        {result !== "idle" ? (
          <p
            className={`pilot-intake-message ${result}`}
            role={result === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}
        </fieldset>
      </form>
    </section>
  );
}
