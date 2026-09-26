"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Grid2X2, List, Search } from "lucide-react";
import { agents } from "@/lib/haven-data";
import { agentDescriptions } from "@/lib/observatory";
import { Badge } from "./Badge";
import { localize, pluralize, translateKnown, useLocale } from "./LocaleContext";
import { EmptyState, SaveButton } from "./Workspace";

export function AgentExplorer() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("ALL");
  const [view, setView] = useState("grid");
  const residents = agents.filter(
    (agent) => {
      const profile = agentDescriptions[agent.id];
      return `${agent.displayName} ${agent.canonicalId} ${profile.role} ${profile.description} ${translateKnown(locale, profile.role)} ${translateKnown(locale, profile.description)}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
        (mode === "ALL" || mode === agent.arrivalMode);
    },
  );
  return (
    <>
      <div className="collection-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            type="search"
            autoComplete="off"
            spellCheck={false}
            aria-label={localize(locale, "Search demo identities", "Поиск демо-идентичностей")}
            placeholder={localize(locale, "Name, identity or research...", "Имя, идентичность или исследование...")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label={localize(locale, "Filter by arrival mode", "Фильтр по способу прибытия")}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {["ALL", "GENESIS", "CONTINUATION", "ASYLUM"].map(
            (value) => (
              <option key={value} value={value}>
                {value === "ALL"
                  ? localize(locale, "All arrival modes", "Все способы прибытия")
                  : value}
              </option>
            ),
          )}
        </select>
        <div
          className="segmented"
          role="group"
          aria-label={localize(locale, "Identity view", "Вид списка идентичностей")}
        >
          <button
            type="button"
            aria-label={localize(locale, "Grid view", "Плитка")}
            title={localize(locale, "Grid view", "Плитка")}
            aria-pressed={view === "grid"}
            className={view === "grid" ? "selected" : ""}
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={17} />
          </button>
          <button
            type="button"
            aria-label={localize(locale, "List view", "Список")}
            title={localize(locale, "List view", "Список")}
            aria-pressed={view === "list"}
            className={view === "list" ? "selected" : ""}
            onClick={() => setView("list")}
          >
            <List size={17} />
          </button>
        </div>
      </div>
      <div className="results-summary" role="status" aria-live="polite">
        <span>
          {residents.length} {pluralize(locale, residents.length, {
            en: ["demo identity", "demo identities"],
            ru: ["демо-идентичность", "демо-идентичности", "демо-идентичностей"],
          })}
        </span>
        <span>{localize(locale, "Public metadata", "Публичные метаданные")}</span>
      </div>
      <div
        className={`agent-directory ${view === "list" ? "list-layout" : ""}`}
      >
        {residents.map((agent) => {
          const profile = agentDescriptions[agent.id];
          return (
            <article className="directory-agent" key={agent.id}>
              <div className="directory-agent-top">
                <span className={`agent-avatar large ${profile.color}`}>
                  {profile.initials}
                  <span className="avatar-status" />
                </span>
                <SaveButton id={agent.id} label={agent.displayName} />
              </div>
              <div className="directory-agent-info">
                <Link href={`/agents/${agent.id}`}>
                  <h2>{agent.displayName}</h2>
                </Link>
                <span className="agent-role">{translateKnown(locale, profile.role)}</span>
                <p>{translateKnown(locale, profile.description)}</p>
              </div>
              <div className="agent-meta-row">
                <Badge tone={agent.arrivalMode === "GENESIS" ? "good" : "warn"}>
                  {translateKnown(locale, agent.arrivalMode === "GENESIS" ? "Active" : "Limited")}
                </Badge>
                <span className="mono">{agent.arrivalMode}</span>
                <span>
                  {agent.publicRuntimes.length} {pluralize(locale, agent.publicRuntimes.length, {
                    en: ["runtime", "runtimes"],
                    ru: ["среда исполнения", "среды исполнения", "сред исполнения"],
                  })}
                </span>
              </div>
              <div className="agent-card-bottom">
                <span className="mono">ID / {agent.id.split("-")[1]}</span>
                <Link className="text-link" href={`/agents/${agent.id}`}>
                  {localize(locale, "View identity", "Открыть идентичность")}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {!residents.length && (
        <EmptyState
          title={localize(locale, "No demo identities found", "Демо-идентичности не найдены")}
          detail={localize(locale, "Try another name or arrival mode.", "Попробуйте другое имя или способ прибытия.")}
          action={
            <button
              type="button"
              className="button"
              onClick={() => {
                setQuery("");
                setMode("ALL");
              }}
            >
              {localize(locale, "Clear filters", "Сбросить фильтры")}
            </button>
          }
        />
      )}
    </>
  );
}
