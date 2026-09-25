"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bookmark, Check, Copy, Download, X } from "lucide-react";
import { translateKnown, useLocale } from "./LocaleContext";

type WorkspaceState = {
  saved: string[];
  toggleSaved: (id: string) => void;
  notify: (message: string) => void;
};

type MeasureMeta = Record<string, string | number | boolean>;

export function measure(name: string, meta: MeasureMeta = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("haven:measure", {
      detail: { name, route: window.location.pathname, meta },
    }),
  );
}
const WorkspaceContext = createContext<WorkspaceState>({
  saved: [],
  toggleSaved: () => {},
  notify: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const read = (event?: StorageEvent) => {
      if (event && event.key !== "haven-saved-v1" && event.key !== null) return;
      try {
        const raw = localStorage.getItem("haven-saved-v1") || "[]";
        if (raw.length > 100000) return;
        const value: unknown = JSON.parse(raw);
        if (Array.isArray(value))
          setSaved(
            [
              ...new Set(
                value.filter(
                  (id): id is string =>
                    typeof id === "string" && id.length <= 200,
                ),
              ),
            ].slice(0, 300),
          );
      } catch {
        /* Storage can be unavailable in private contexts. */
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("storage", read);
      clearTimeout(timer.current);
    };
  }, []);
  const notify = useCallback((message: string) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(""), 3500);
  }, []);
  const toggleSaved = useCallback((id: string) => {
    if (id.length > 200 || (!saved.includes(id) && saved.length >= 300)) {
      notify("Collection limit reached (300 items).");
      return;
    }
    const next = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    setSaved(next);
    let storage = "persistent";
    try {
      localStorage.setItem("haven-saved-v1", JSON.stringify(next));
      notify(
        next.includes(id)
          ? "Saved to your collection"
          : "Removed from your collection",
      );
    } catch {
      storage = "session";
      notify("Saved for this session. Browser storage is unavailable.");
    }
    measure(next.includes(id) ? "object_saved" : "object_unsaved", { storage });
  }, [notify, saved]);
  const contextValue = useMemo(
    () => ({ saved, toggleSaved, notify }),
    [notify, saved, toggleSaved],
  );
  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        <Check size={16} />
        {translateKnown(locale, toast)}
      </div>
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);

export function SaveButton({ id, label }: { id: string; label?: string }) {
  const { locale } = useLocale();
  const { saved, toggleSaved } = useWorkspace();
  const active = saved.includes(id);
  const action = active
    ? locale === "ru"
      ? "Убрать из сохранённого"
      : "Remove from saved"
    : locale === "ru"
      ? "Сохранить"
      : "Save to collection";
  const accessibleLabel = label ? `${action}: ${translateKnown(locale, label)}` : action;
  return (
    <button
      type="button"
      className={`icon-button ${active ? "is-saved" : ""}`}
      title={action}
      aria-label={accessibleLabel}
      aria-pressed={active}
      data-measure={active ? "object_unsaved" : "object_saved"}
      data-measure-mode="manual"
      onClick={() => toggleSaved(id)}
    >
      <Bookmark size={17} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const { locale } = useLocale();
  const { notify } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const visibleLabel = translateKnown(locale, label);
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  return (
    <button
      type="button"
      className="icon-button"
      title={visibleLabel}
      aria-label={visibleLabel}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          notify("Copied to clipboard");
        } catch {
          notify("Clipboard unavailable. Select the text to copy it.");
        }
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

export function downloadJson(value: unknown, filename: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ExportButton({
  value,
  filename,
  label = "Export",
  measureName = "object_exported",
  measureMeta = {},
}: {
  value: unknown;
  filename: string;
  label?: string;
  measureName?: string;
  measureMeta?: MeasureMeta;
}) {
  const { locale } = useLocale();
  const { notify } = useWorkspace();
  const visibleLabel = translateKnown(locale, label);
  return (
    <button
      className="button"
      type="button"
      data-measure={measureName}
      data-measure-mode="manual"
      onClick={() => {
        downloadJson(value, filename);
        measure(measureName, measureMeta);
        notify("Export downloaded");
      }}
    >
      <Download size={15} />
      {visibleLabel}
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const visibleTitle = translateKnown(locale, title);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      previousFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      const target = previousFocus.current;
      if (target?.isConnected) {
        requestAnimationFrame(() => target.focus());
      }
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`modal ${className}`}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-heading">
        <strong id={titleId}>{visibleTitle}</strong>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label={locale === "ru" ? "Закрыть диалог" : "Close dialog"}
          title={locale === "ru" ? "Закрыть" : "Close"}
        >
          <X size={18} />
        </button>
      </div>
      {open ? children : null}
    </dialog>
  );
}

export function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  const { locale } = useLocale();
  return (
    <div className="empty-state">
      <Bookmark size={25} />
      <h3>{translateKnown(locale, title)}</h3>
      <p>{translateKnown(locale, detail)}</p>
      {action}
    </div>
  );
}
