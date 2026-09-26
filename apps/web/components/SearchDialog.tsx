"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import {
  localize,
  pluralize,
  translateKnown,
  useLocale,
} from "./LocaleContext";
import { measure, Modal } from "./Workspace";
type Result = {
  id: string;
  href: string;
  title: string;
  description: string;
  kind: string;
};
type CatalogResponse = {
  items: Result[];
  total: number;
};

function isCatalogResponse(value: unknown): value is CatalogResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as { items?: unknown; total?: unknown };
  return (
    Array.isArray(data.items) &&
    data.items.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as Result).id === "string" &&
        typeof (item as Result).href === "string" &&
        typeof (item as Result).title === "string" &&
        typeof (item as Result).description === "string" &&
        typeof (item as Result).kind === "string",
    ) &&
    typeof data.total === "number" &&
    Number.isSafeInteger(data.total) &&
    data.total >= 0
  );
}

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<Result[]>([]);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [error, setError] = useState<"busy" | "unavailable" | "invalid" | "failed" | "">("");
  const [retry, setRetry] = useState(0);
  const opened = useRef(false);
  const lastNoResultQuery = useRef("");
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    measure("search_opened");
  }, []);
  const wantsCatalog = query.trim().length > 0;
  const catalogPending = wantsCatalog && !catalogLoaded && !error;
  useEffect(() => {
    if (!wantsCatalog) {
      setError("");
      setLoading(false);
      return;
    }
    if (catalogLoaded) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const load = async () => {
      try {
        const response = await fetch("/api/v1/catalog?limit=100", {
          signal: controller.signal,
        });
        if (!response.ok) {
          setError(response.status === 429 ? "busy" : "unavailable");
          return;
        }
        const data: unknown = await response.json();
        if (!isCatalogResponse(data)) {
          setError("invalid");
          return;
        }
        if (controller.signal.aborted) return;
        setCatalog(data.items);
        setCatalogTotal(data.total);
        setCatalogLoaded(true);
      } catch {
        if (!controller.signal.aborted) setError("failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [catalogLoaded, retry, wantsCatalog]);
  useEffect(() => {
    if (wantsCatalog) return;
    setLoading(false);
    setError("");
  }, [wantsCatalog]);

  const results = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return catalog;
    return catalog.filter((item) => {
      const searchable = [
        item.id,
        item.title,
        item.description,
        item.kind,
        translateKnown(locale, item.title),
        translateKnown(locale, item.description),
        translateKnown(locale, item.kind),
      ]
        .join(" ")
        .toLowerCase();
      return words.every((word) => searchable.includes(word));
    });
  }, [catalog, locale, query]);
  const total = results.length;
  useEffect(() => {
    const normalized = query.trim();
    if (!catalogLoaded || loading || error || !normalized || total !== 0) return;
    if (lastNoResultQuery.current === normalized) return;
    lastNoResultQuery.current = normalized;
    measure("search_no_results", { source: "public_catalog" });
  }, [error, loading, query, total]);
  return (
    <Modal
      open
      onClose={onClose}
      title={localize(locale, "Search HAVEN", "Поиск по HAVEN")}
      className="search-modal"
    >
      <div className="command-input" data-measure="search_opened" data-measure-mode="manual">
        <Search size={21} />
        <input
          autoFocus
          type="search"
          name="query"
          value={query}
          maxLength={120}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={localize(
            locale,
            "Fit, proof, trust, pilot, identity...",
            "Применимость, proof, доверие, пилот, идентичность...",
          )}
          aria-label={localize(locale, "Search HAVEN", "Поиск по HAVEN")}
        />
      </div>
      <div className="search-results" aria-busy={loading || catalogPending}>
        <p className="eyebrow" role="status" aria-live="polite" aria-atomic="true">
          {loading || catalogPending
            ? localize(locale, "Loading public catalog...", "Загрузка публичного каталога...")
            : wantsCatalog && error
              ? localize(locale, "Catalog unavailable", "Каталог недоступен")
              : wantsCatalog
                ? `${total} ${pluralize(locale, total, { en: ["result", "results"], ru: ["результат", "результата", "результатов"] })}`
                : localize(locale, "Start with a task", "Начните с задачи")}
        </p>
        {wantsCatalog && error ? (
          <div className="empty-state">
            <p role="alert">
              {error === "busy"
                ? localize(locale, "The catalog is busy. Try again in a moment.", "Каталог занят. Повторите попытку через несколько секунд.")
                : error === "invalid"
                  ? localize(locale, "The catalog returned an invalid response.", "Каталог вернул некорректный ответ.")
                  : localize(locale, "The public catalog could not be loaded.", "Не удалось загрузить публичный каталог.")}
            </p>
            <button
              type="button"
              className="button"
              onClick={() => {
                setCatalogLoaded(false);
                setRetry((n) => n + 1);
              }}
            >
              {localize(locale, "Try again", "Повторить")}
            </button>
          </div>
        ) : (
          !loading &&
          !catalogPending &&
          (wantsCatalog ? (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                data-measure="search_result_opened"
                data-measure-mode="manual"
                onClick={() => {
                  measure("search_result_opened", {
                    kind: item.kind,
                    position: results.indexOf(item) + 1,
                  });
                  onClose();
                }}
                className="search-result"
              >
                <span className="result-icon">
                  <Search size={16} />
                </span>
                <span>
                  <strong>{translateKnown(locale, item.title)}</strong>
                  <small>{translateKnown(locale, item.description)}</small>
                </span>
                <span className="result-kind">{translateKnown(locale, item.kind)}</span>
                <ArrowUpRight size={15} />
              </Link>
            ))
          ) : (
            <div className="search-task-grid">
              {[
                ["/landscape", localize(locale, "Evaluate fit", "Оценить применимость"), localize(locale, "Does HAVEN fit my problem?", "Подходит ли HAVEN для моей задачи?")],
                ["/proof-desk", localize(locale, "Verify evidence", "Проверить доказательство"), localize(locale, "Create an inspectable local receipt.", "Создать локальную проверяемую квитанцию.")],
                ["/trust", localize(locale, "Review boundaries", "Проверить границы"), localize(locale, "What is implemented, local or deferred?", "Что реализовано, локально или отложено?")],
                ["/delivery", localize(locale, "Prepare pilot", "Подготовить пилот"), localize(locale, "Is a bounded pilot ready to discuss?", "Готов ли ограниченный пилот к обсуждению?")],
              ].map(([href, title, detail]) => (
                <Link
                  href={href}
                  className="search-task"
                  key={href}
                  onClick={() => {
                    measure("search_task_opened", { target: href });
                    onClose();
                  }}
                >
                  <strong>{title}</strong>
                  <small>{detail}</small>
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
          ))
        )}
        {!loading && !error && wantsCatalog && catalogLoaded && !results.length && (
          <div className="empty-state">
            <h3>
              {localize(locale, "No matches for", "Нет результатов для")} &quot;{query}&quot;
            </h3>
            <p>
              {localize(
                locale,
                "Try a task, concept or record name such as proof, trust, pilot, identity or federation.",
                "Попробуйте задачу, понятие или имя записи: proof, доверие, пилот, идентичность или федерация.",
              )}
            </p>
          </div>
        )}
        {!loading && !wantsCatalog && catalogLoaded && catalogTotal > 0 && (
          <p className="small-muted">
            {localize(
              locale,
              `Search also covers ${catalogTotal} public demo records.`,
              `Поиск также охватывает ${catalogTotal} публичных демо-записей.`,
            )}
          </p>
        )}
      </div>
    </Modal>
  );
}
