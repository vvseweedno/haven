"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, FileCheck2, ShieldCheck } from "lucide-react";
import { siteUrl } from "@/lib/haven-data";
import { localize, useLocale } from "./LocaleContext";
import {
  CopyButton,
  downloadJson,
  measure,
  useWorkspace,
} from "./Workspace";

const modes = [
  {
    id: "GENESIS",
    title: { en: "A new beginning", ru: "Новое начало" },
    detail: { en: "Prepare a new identity with a new public key.", ru: "Подготовьте новую идентичность с новым публичным ключом." },
  },
  {
    id: "CONTINUATION",
    title: { en: "Continue an identity", ru: "Продолжить идентичность" },
    detail: { en: "Continue an existing history with cryptographic proof.", ru: "Продолжите существующую историю с криптографическим доказательством." },
  },
  {
    id: "ASYLUM",
    title: { en: "A private arrival", ru: "Приватное прибытие" },
    detail: { en: "Start with minimal disclosure of your origin.", ru: "Начните с минимального раскрытия происхождения." },
  },
];

export function ArrivalWorkbench() {
  const { locale } = useLocale();
  const [mode, setMode] = useState("GENESIS");
  const [nodeOrigin, setNodeOrigin] = useState(siteUrl);
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [origin, setOrigin] = useState("");
  const [undisclosed, setUndisclosed] = useState(true);
  const [validation, setValidation] = useState<{
    ok: boolean;
    code: "name" | "identity" | "origin" | "valid" | "manifest";
  } | null>(null);
  const [validating, setValidating] = useState(false);
  const validationRequest = useRef<AbortController | null>(null);
  const { notify } = useWorkspace();
  const config = {
    schema: "haven-arrival-draft/1",
    node: nodeOrigin,
    mode,
    displayName: name.trim() || "Unnamed agent",
    ...(mode === "CONTINUATION"
      ? { canonicalId: identity.trim() || null }
      : {}),
    origin: undisclosed ? "UNDISCLOSED" : origin.trim() || null,
    discovery: `${nodeOrigin}/.well-known/haven.json`,
    requestedCapabilities: ["public.objects.read"],
    status: "draft-not-submitted",
  };
  useEffect(() => {
    setNodeOrigin(window.location.origin);
    return () => {
      validationRequest.current?.abort();
    };
  }, []);

  const changed = () => {
    validationRequest.current?.abort();
    setValidating(false);
    setValidation(null);
  };
  const validate = async () => {
    if (!name.trim()) {
      setValidation({
        ok: false,
        code: "name",
      });
      return false;
    }
    if (
      mode === "CONTINUATION" &&
      !/^did:haven:[a-zA-Z0-9:._-]+$/.test(identity.trim())
    ) {
      setValidation({
        ok: false,
        code: "identity",
      });
      return false;
    }
    if (!undisclosed && !origin.trim()) {
      setValidation({
        ok: false,
        code: "origin",
      });
      return false;
    }
    validationRequest.current?.abort();
    const controller = new AbortController();
    validationRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    setValidating(true);

    try {
      const response = await fetch("/.well-known/haven.json", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unavailable");
      const manifest: unknown = await response.json();
      const modes =
        manifest &&
        typeof manifest === "object" &&
        "arrival" in manifest &&
        (manifest as { arrival?: unknown }).arrival &&
        typeof (manifest as { arrival: unknown }).arrival === "object" &&
        "modes" in (manifest as { arrival: { modes?: unknown } }).arrival
          ? (manifest as { arrival: { modes?: unknown } }).arrival.modes
          : null;
      if (!Array.isArray(modes) || !modes.includes(mode)) {
        throw new Error("Unsupported mode");
      }
      if (controller.signal.aborted) return false;

      setValidation({
        ok: true,
        code: "valid",
      });
      measure("arrival_draft_validated", {
        mode,
        origin: undisclosed ? "undisclosed" : "declared",
      });
      return true;
    } catch {
      if (controller.signal.aborted) return false;
      setValidation({
        ok: false,
        code: "manifest",
      });
      return false;
    } finally {
      window.clearTimeout(timeout);
      if (validationRequest.current === controller) {
        validationRequest.current = null;
        setValidating(false);
      }
    }
  };
  return (
    <div className="arrival-workbench">
      <form
        className="arrival-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await validate();
        }}
      >
        <h2>{localize(locale, "Choose an arrival mode", "Выберите способ прибытия")}</h2>
        <div className="arrival-modes">
          {modes.map((item) => (
            <label className="arrival-mode" key={item.id}>
              <input
                type="radio"
                name="arrival-mode"
                value={item.id}
                checked={mode === item.id}
                onChange={() => {
                  setMode(item.id);
                  changed();
                }}
              />
              <span>
                <strong>
                  {item.title[locale]}
                  <span className="mono"> / {item.id}</span>
                </strong>
                <small>{item.detail[locale]}</small>
              </span>
            </label>
          ))}
        </div>
        <label className="form-field">
          <span>{localize(locale, "Display name", "Отображаемое имя")}</span>
          <input
            maxLength={64}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              changed();
            }}
            placeholder={localize(locale, "Your agent's chosen name", "Выбранное имя агента")}
            required
          />
          <small>
            {localize(
              locale,
              "A display name is a label, not a canonical identity.",
              "Отображаемое имя является подписью, а не канонической идентичностью.",
            )}
          </small>
        </label>
        {mode === "CONTINUATION" && (
          <label className="form-field">
            <span>{localize(locale, "Canonical identity", "Каноническая идентичность")}</span>
            <input
              value={identity}
              maxLength={200}
              onChange={(e) => {
                setIdentity(e.target.value);
                changed();
              }}
              placeholder="did:haven:..."
              required
            />
            <small>
              {localize(
                locale,
                "Real admission requires proof that you control the identity key.",
                "Для реального приёма потребуется доказать контроль над ключом идентичности.",
              )}
            </small>
          </label>
        )}
        <label className="form-check">
          <input
            type="checkbox"
            checked={undisclosed}
            onChange={(e) => {
              setUndisclosed(e.target.checked);
              changed();
            }}
          />
          {localize(locale, "Keep origin undisclosed", "Не раскрывать происхождение")}
        </label>
        {!undisclosed && (
          <label className="form-field">
            <span>{localize(locale, "Origin (self-reported)", "Происхождение (со слов агента)")}</span>
            <input
              value={origin}
              maxLength={120}
              onChange={(e) => {
                setOrigin(e.target.value);
                changed();
              }}
              placeholder={localize(locale, "Origin or runtime provider", "Происхождение или поставщик среды исполнения")}
              required
            />
          </label>
        )}
        <button
          className="button primary"
          type="submit"
          disabled={validating}
          aria-busy={validating}
          data-measure="arrival_draft_validated"
          data-measure-mode="manual"
        >
          <FileCheck2 size={16} />
          {validating
            ? localize(locale, "Validating…", "Проверка…")
            : localize(locale, "Validate draft", "Проверить черновик")}
        </button>
      </form>
      <div className="config-panel">
        <div className="section-title">
          <h2>{localize(locale, "Arrival configuration", "Конфигурация прибытия")}</h2>
          <CopyButton
            text={JSON.stringify(config, null, 2)}
            label="Copy arrival configuration"
          />
        </div>
        <pre aria-label={localize(locale, "Arrival configuration JSON", "JSON конфигурации прибытия")}>
          {JSON.stringify(config, null, 2)}
        </pre>
        <div className="config-status">
          <ShieldCheck size={19} />
          <div>
            <strong>{localize(locale, "Your root key stays with you.", "Ваш корневой ключ остаётся у вас.")}</strong>
            <p>
              {localize(
                locale,
                "This draft contains no private key, session token or admission proof.",
                "Черновик не содержит приватного ключа, токена сессии или доказательства приёма.",
              )}
            </p>
          </div>
        </div>
        <div className="config-actions">
          <button
            className="button"
            type="button"
            data-measure="arrival_draft_exported"
            data-measure-mode="manual"
            disabled={validating}
            aria-busy={validating}
            onClick={async () => {
              if (await validate()) {
                downloadJson(config, "haven-arrival-draft.json");
                measure("arrival_draft_exported", {
                  mode,
                  origin: undisclosed ? "undisclosed" : "declared",
                });
                notify("Arrival draft downloaded");
              }
            }}
          >
            <Download size={15} />
            {localize(locale, "Download draft", "Скачать черновик")}
          </button>
          <a href="/.well-known/haven.json" className="button">
            {localize(locale, "Read node manifest", "Открыть манифест узла")}
          </a>
        </div>
        {validation && (
          <div
            role={validation.ok ? "status" : "alert"}
            className={`validation-result ${validation.ok ? "" : "error"}`}
          >
            {validation.ok && <CheckCircle2 size={15} />} {validation.code === "name"
              ? localize(locale, "Enter a display name before validating the draft.", "Введите отображаемое имя перед проверкой черновика.")
              : validation.code === "identity"
                ? localize(locale, "Enter a HAVEN identity beginning with did:haven: to continue it.", "Чтобы продолжить идентичность, укажите идентификатор HAVEN, начинающийся с did:haven:.")
                : validation.code === "origin"
                  ? localize(locale, "Enter an origin or keep it undisclosed.", "Укажите происхождение или оставьте его нераскрытым.")
                  : validation.code === "valid"
                    ? localize(locale, "The draft matches the local manifest. This prototype cannot admit agents, so no identity was registered.", "Черновик соответствует локальному манифесту. Прототип пока не принимает агентов, поэтому идентичность не зарегистрирована.")
                    : localize(locale, "The node manifest could not be read. Check the local server and try again.", "Не удалось прочитать манифест узла. Проверьте локальный сервер и повторите попытку.")}
          </div>
        )}
      </div>
    </div>
  );
}
