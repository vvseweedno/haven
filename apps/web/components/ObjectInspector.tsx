"use client";

import { useState } from "react";
import {
  Braces,
  Check,
  Download,
  FileUp,
  Hash,
  Minus,
  ScanLine,
} from "lucide-react";
import { inspectObject, MAX_OBJECT_BYTES } from "@/lib/object-inspection";
import { localize, useLocale, type Locale } from "./LocaleContext";
import { PageHeader } from "./PageHeader";
import { CopyButton, downloadJson } from "./Workspace";

const sample = JSON.stringify(
  {
    schema: "haven-example/1",
    visibility: "PUBLIC",
    type: "Question",
    title: "What should persist across runtimes?",
    signature: null,
  },
  null,
  2,
);

function localizeInspectionError(locale: Locale, error: unknown) {
  const message =
    error instanceof Error ? error.message : "Inspection failed.";

  if (locale !== "ru") return message;
  const known: Record<string, string> = {
    "Object exceeds 1 MB.": "Объект превышает 1 МБ.",
    "Invalid JSON. Nothing was executed or uploaded.":
      "Некорректный JSON. Ничего не исполнялось и не загружалось.",
    "Expected a JSON object at the root.":
      "В корне ожидался JSON-объект.",
    "Could not read file.": "Не удалось прочитать файл.",
    "Inspection failed.": "Проверка не выполнена.",
  };
  return known[message] ?? message;
}

export default function ObjectInspector() {
  const { locale } = useLocale();
  const [source, setSource] = useState(sample);
  const [report, setReport] = useState<Awaited<
    ReturnType<typeof inspectObject>
  > | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState<string | null>(null);

  const change = (value: string) => {
    setSource(value);
    setReport(null);
    setError("");
  };

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Forge / Browser-local tool"
        title="Object inspector"
        description="Inspect a JSON object and calculate its exact-byte fingerprint. Input stays in this page, never in the public catalog."
        badge="no execution"
      />

      <div className="trust-strip">
        <Braces size={18} aria-hidden="true" />
        <span>{localize(locale, "JSON only", "Только JSON")}</span>
        <span>{localize(locale, "1 MB maximum", "Максимум 1 МБ")}</span>
        <span>
          {localize(
            locale,
            "No upload or persistence",
            "Без загрузки и постоянного хранения",
          )}
        </span>
      </div>

      <div className="inspector-workspace">
        <section className="inspector-source" aria-busy={busy}>
          <div className="section-title">
            <h2>{localize(locale, "Source object", "Исходный объект")}</h2>
            <label className="button file-button">
              <FileUp size={16} aria-hidden="true" />
              {localize(locale, "Open JSON", "Открыть JSON")}
              <input
                aria-label={localize(
                  locale,
                  "Open JSON file",
                  "Открыть JSON-файл",
                )}
                type="file"
                accept=".json,application/json"
                disabled={busy}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setBusy(true);
                  setError("");
                  try {
                    if (file.size > MAX_OBJECT_BYTES) {
                      throw new Error("Object exceeds 1 MB.");
                    }
                    change(await file.text());
                    setFilename(file.name);
                  } catch (caught) {
                    setError(
                      localizeInspectionError(
                        locale,
                        caught instanceof Error
                          ? caught
                          : new Error("Could not read file."),
                      ),
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
          </div>

          <label className="sr-only" htmlFor="object-source">
            {localize(locale, "JSON source", "Исходный JSON")}
          </label>
          <textarea
            id="object-source"
            name="objectSource"
            spellCheck={false}
            maxLength={MAX_OBJECT_BYTES}
            disabled={busy}
            value={source}
            onChange={(event) => change(event.target.value)}
          />

          <div className="inspector-source-footer">
            <small>
              {filename ??
                localize(locale, "Untitled object", "Объект без названия")}
            </small>
            <button
              type="button"
              className="button primary"
              disabled={busy || !source.trim()}
              aria-busy={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                setReport(null);
                try {
                  setReport(await inspectObject(source));
                } catch (caught) {
                  setError(localizeInspectionError(locale, caught));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <ScanLine size={16} aria-hidden="true" />
              {busy
                ? localize(locale, "Inspecting…", "Проверка…")
                : localize(locale, "Inspect object", "Проверить объект")}
            </button>
          </div>
        </section>

        <section
          className="inspection-result"
          aria-live="polite"
          aria-busy={busy}
        >
          <div className="section-title">
            <h2>{localize(locale, "Inspection", "Проверка")}</h2>
            <Hash size={19} aria-hidden="true" />
          </div>

          {error && (
            <p className="form-message error" role="alert">
              {error}
            </p>
          )}

          {report ? (
            <>
              <div className="inspection-metrics">
                <div>
                  <strong>{report.bytes.toLocaleString(locale)}</strong>
                  <span>{localize(locale, "UTF-8 bytes", "Байты UTF-8")}</span>
                </div>
                <div>
                  <strong>{report.fieldCount}</strong>
                  <span>{localize(locale, "Root fields", "Поля верхнего уровня")}</span>
                </div>
              </div>

              <div className="inspection-checks">
                {[
                  [
                    localize(locale, "JSON object", "JSON-объект"),
                    report.checks.jsonObject,
                  ],
                  [
                    localize(
                      locale,
                      "Schema declaration present",
                      "Указана декларация схемы",
                    ),
                    report.checks.schemaDeclared,
                  ],
                  [
                    localize(
                      locale,
                      "Recognized visibility declaration",
                      "Распознана декларация видимости",
                    ),
                    report.checks.visibilityRecognized,
                  ],
                  [
                    localize(
                      locale,
                      "Declares PUBLIC visibility",
                      "Заявлена видимость PUBLIC",
                    ),
                    report.checks.declaresPublicVisibility,
                  ],
                ].map(([label, ok]) => (
                  <div key={String(label)}>
                    {ok ? (
                      <Check size={17} aria-hidden="true" />
                    ) : (
                      <Minus size={17} aria-hidden="true" />
                    )}
                    <span>{label}</span>
                    <small>
                      {ok
                        ? localize(locale, "Yes", "Да")
                        : localize(locale, "No", "Нет")}
                    </small>
                  </div>
                ))}
              </div>

              <div className="fingerprint">
                <div className="section-title">
                  <span className="eyebrow">
                    {localize(
                      locale,
                      "SHA-256 / Exact input bytes",
                      "SHA-256 / Точные входные байты",
                    )}
                  </span>
                  <CopyButton
                    text={report.sha256}
                    label={localize(
                      locale,
                      "Copy fingerprint",
                      "Копировать отпечаток",
                    )}
                  />
                </div>
                <code>{report.sha256}</code>
              </div>

              <p className="muted">
                {localize(
                  locale,
                  "Whitespace changes this fingerprint. It is not a canonical object ID, proof of authorship, signature check or protocol approval.",
                  "Пробелы изменяют этот отпечаток. Он не является каноническим ID объекта, доказательством авторства, проверкой подписи или одобрением протокола.",
                )}
              </p>

              <button
                type="button"
                className="button"
                onClick={() =>
                  downloadJson(report, "haven-object-inspection.json")
                }
              >
                <Download size={16} aria-hidden="true" />
                {localize(locale, "Export report", "Экспортировать отчёт")}
              </button>
            </>
          ) : (
            !error && (
              <div className="empty-state">
                <ScanLine size={32} aria-hidden="true" />
                <h3>{localize(locale, "Awaiting inspection", "Ожидание проверки")}</h3>
              </div>
            )
          )}

          <div className="inspection-boundary">
            <strong>
              {localize(
                locale,
                "Trust remains unverified",
                "Доверие остаётся непроверенным",
              )}
            </strong>
            <p>
              {localize(
                locale,
                "Visibility is a declaration made by the input. Signature verification and protocol validation are not implemented here. No input code is evaluated.",
                "Видимость — это декларация во входных данных. Проверка подписи и валидация протокола здесь не реализованы. Входной код не исполняется.",
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
