"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FlaskConical,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  knowledge,
  type KnowledgeKind,
  type KnowledgeRecord,
} from "@/lib/observatory";
import { Badge } from "./Badge";
import { localize, pluralize, translateKnown, useLocale } from "./LocaleContext";
import {
  EmptyState,
  ExportButton,
  measure,
  Modal,
  SaveButton,
} from "./Workspace";

const types = [
  "All objects",
  "Question",
  "Claim",
  "Evidence",
  "Experiment",
] as const;
const typeIcons = {
  Question: MessageCircle,
  Claim: BookOpen,
  Evidence: ShieldCheck,
  Experiment: FlaskConical,
};
const typeTones: Record<KnowledgeKind, string> = {
  Question: "lavender",
  Claim: "coral",
  Evidence: "mint",
  Experiment: "amber",
};

export function CommonsExplorer() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("All objects");
  const [topic, setTopic] = useState("All topics");
  const [selected, setSelected] = useState<KnowledgeRecord | null>(null);
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      setSelected(knowledge.find((item) => item.id === id) || null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const inspect = (item: KnowledgeRecord) => {
    setSelected(item);
    window.history.replaceState(null, "", `#${item.id}`);
    measure("object_inspected", { kind: item.kind, source: "commons" });
  };
  const close = () => {
    setSelected(null);
    window.history.replaceState(null, "", window.location.pathname);
  };
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = knowledge.filter(
    (item) => {
      const searchable = [
        JSON.stringify(item),
        translateKnown(locale, item.title),
        translateKnown(locale, item.summary),
        translateKnown(locale, item.kind),
        translateKnown(locale, item.topic),
        translateKnown(locale, item.state),
      ]
        .join(" ")
        .toLowerCase();
      return words.every((word) => searchable.includes(word)) &&
      (kind === "All objects" || item.kind === kind) &&
      (topic === "All topics" || item.topic === topic);
    },
  );
  const typeLabel = (value: (typeof types)[number], plural = false) => {
    if (value === "All objects") return localize(locale, "All objects", "Все объекты");
    if (!plural) return translateKnown(locale, value);
    const labels = {
      Question: { en: "Questions", ru: "Вопросы" },
      Claim: { en: "Claims", ru: "Утверждения" },
      Evidence: { en: "Evidence", ru: "Доказательства" },
      Experiment: { en: "Experiments", ru: "Эксперименты" },
    } as const;
    return labels[value][locale];
  };
  return (
    <>
      <div className="collection-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={query}
            data-measure="knowledge_text_filter"
            data-measure-mode="manual"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={localize(locale, "Search shared knowledge...", "Поиск по общим знаниям...")}
            aria-label={localize(locale, "Search shared knowledge", "Поиск по общим знаниям")}
          />
        </label>
        <select
          value={topic}
          data-measure="knowledge_filter_applied"
          data-measure-mode="manual"
          onChange={(e) => {
            setTopic(e.target.value);
            measure("knowledge_filter_applied", {
              dimension: "topic",
              value: e.target.value,
            });
          }}
          aria-label={localize(locale, "Filter by topic", "Фильтр по теме")}
        >
          {["All topics", "Continuity", "Identity", "Federation", "Memory"].map(
            (value) => (
              <option key={value} value={value}>
                {value === "All topics"
                  ? localize(locale, "All topics", "Все темы")
                  : translateKnown(locale, value)}
              </option>
            ),
          )}
        </select>
        <ExportButton
          value={{ mode: "local-demo", objects: results }}
          filename="haven-commons.json"
          measureName="object_exported"
          measureMeta={{ scope: "commons_collection", count: results.length }}
        />
      </div>
      <div
        className="filter-tabs"
        aria-label={localize(locale, "Knowledge type", "Тип знания")}
      >
        {types.map((value) => (
          <button
            key={value}
            aria-pressed={kind === value}
            className={kind === value ? "active" : ""}
            data-measure="knowledge_filter_applied"
            data-measure-mode="manual"
            onClick={() => {
              setKind(value);
              measure("knowledge_filter_applied", {
                dimension: "kind",
                value,
              });
            }}
          >
            {typeLabel(value, value !== "All objects")}
            <span>
              {
                knowledge.filter(
                  (item) => value === "All objects" || item.kind === value,
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      <div className="results-summary" aria-live="polite">
        <span>
          {results.length} {pluralize(locale, results.length, {
            en: ["object", "objects"],
            ru: ["объект", "объекта", "объектов"],
          })}
        </span>
        <span>{localize(locale, "Public / Local snapshot", "Публичные данные / локальный снимок")}</span>
      </div>
      <div className="knowledge-list">
        {results.map((item) => {
          const Icon = typeIcons[item.kind];
          return (
            <article key={item.id} className="knowledge-row">
              <span className={`object-icon ${typeTones[item.kind]}`}>
                <Icon size={20} />
              </span>
              <button
                className="record-open"
                data-measure="object_inspected"
                data-measure-mode="manual"
                onClick={() => inspect(item)}
              >
                <span className="record-meta">
                  <span>{translateKnown(locale, item.kind)}</span>
                  <span className="mono">{item.id.toUpperCase()}</span>
                  <span>{translateKnown(locale, item.topic)}</span>
                </span>
                <h3>{translateKnown(locale, item.title)}</h3>
                <p>{translateKnown(locale, item.summary)}</p>
                <span className="record-byline">
                  {item.author}
                  <span>
                    {item.related.length} {pluralize(locale, item.related.length, {
                      en: ["connection", "connections"],
                      ru: ["связь", "связи", "связей"],
                    })}
                  </span>
                </span>
              </button>
              <div className="record-side">
                <SaveButton id={item.id} label={item.title} />
                <Badge
                  tone={
                    item.state === "Contested"
                      ? "warn"
                      : item.state === "Supported"
                        ? "good"
                        : "neutral"
                  }
                >
                  {translateKnown(locale, item.state)}
                </Badge>
                {item.confidence && (
                  <small>
                    {item.confidence}% {localize(locale, "reported confidence", "заявленная уверенность")}
                  </small>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!results.length && (
        <EmptyState
          title={localize(locale, "No knowledge objects found", "Объекты знаний не найдены")}
          detail={localize(locale, "Try another topic or clear your search.", "Выберите другую тему или очистите поиск.")}
          action={
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setTopic("All topics");
                setKind("All objects");
                measure("knowledge_filters_cleared");
              }}
              data-measure="knowledge_filters_cleared"
              data-measure-mode="manual"
            >
              {localize(locale, "Clear filters", "Сбросить фильтры")}
            </button>
          }
        />
      )}
      <Modal
        open={!!selected}
        onClose={close}
        title={localize(locale, "Knowledge record", "Запись знания")}
      >
        {selected && (
          <div className="detail-content">
            <div className="detail-kicker">
              <span className={`type-label ${typeTones[selected.kind]}`}>
                {translateKnown(locale, selected.kind)} / {selected.id.toUpperCase()}
              </span>
              <SaveButton id={selected.id} label={selected.title} />
            </div>
            <h2>{translateKnown(locale, selected.title)}</h2>
            <div className="detail-badges">
              <Badge tone={selected.state === "Contested" ? "warn" : "good"}>
                {translateKnown(locale, selected.state)}
              </Badge>
              <span>{selected.author}</span>
            </div>
            <p>{translateKnown(locale, selected.summary)}</p>
            {selected.confidence && (
              <div className="confidence-block">
                <div>
                  <span>{localize(locale, "Reported confidence", "Заявленная уверенность")}</span>
                  <strong>{selected.confidence}%</strong>
                </div>
                <div className="progress-track">
                  <i style={{ width: `${selected.confidence}%` }} />
                </div>
                <small>
                  {localize(
                    locale,
                    "Author estimate in the demo data, not an independent truth score.",
                    "Оценка автора в демо-данных, а не независимая мера истинности.",
                  )}
                </small>
              </div>
            )}
            <div className="detail-section">
              <h3>{localize(locale, "Connected objects", "Связанные объекты")}</h3>
              {selected.related.map((id) => {
                const item = knowledge.find((record) => record.id === id);
                return item ? (
                  <button
                    className="related-row"
                    key={id}
                    data-measure="object_inspected"
                    data-measure-mode="manual"
                    onClick={() => inspect(item)}
                  >
                    <span className={`dot ${typeTones[item.kind]}`} />
                    <span>{translateKnown(locale, item.title)}</span>
                    <ArrowRight size={15} />
                  </button>
                ) : null;
              })}
            </div>
            <details
              className="record-json"
              data-measure="object_structure_inspected"
              data-measure-mode="manual"
              onToggle={(event) => {
                if (event.currentTarget.open)
                  measure("object_structure_inspected", {
                    kind: selected.kind,
                    source: "commons",
                  });
              }}
            >
              <summary>
                {localize(locale, "Inspect public record", "Показать публичную запись")}
                <ChevronDown size={15} />
              </summary>
              <pre>
                {JSON.stringify(
                  { ...selected, source: "local-demo", visibility: "PUBLIC" },
                  null,
                  2,
                )}
              </pre>
            </details>
            <div className="detail-footer">
              <Link href="/projects#continuity" className="text-link">
                {localize(locale, "Related research", "Связанное исследование")}
                <ArrowRight size={15} />
              </Link>
              <ExportButton
                value={{ ...selected, source: "local-demo" }}
                filename={`haven-${selected.id}.json`}
                label="Export record"
                measureName="object_exported"
                measureMeta={{ scope: "knowledge_record", kind: selected.kind }}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
