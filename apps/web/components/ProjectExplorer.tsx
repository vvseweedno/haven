"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Search } from "lucide-react";
import { knowledge, projects } from "@/lib/observatory";
import { Badge } from "./Badge";
import {
  localize,
  pluralize,
  translateKnown,
  useLocale,
} from "./LocaleContext";
import { EmptyState, ExportButton, Modal, SaveButton } from "./Workspace";

const statusOptions = ["All projects", "Active", "Planned"] as const;

export function ProjectExplorer() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All projects");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );

  useEffect(() => {
    const sync = () =>
      setSelected(
        projects.find((item) => item.id === window.location.hash.slice(1)) ||
          null,
      );
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const inspect = (project: (typeof projects)[number]) => {
    setSelected(project);
    window.history.replaceState(null, "", `#${project.id}`);
  };

  const close = () => {
    setSelected(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = projects.filter((item) => {
    const searchable = [
      item.name,
      item.description,
      item.category,
      item.status,
      translateKnown(locale, item.name),
      translateKnown(locale, item.description),
      translateKnown(locale, item.category),
      translateKnown(locale, item.status),
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!normalizedQuery || searchable.includes(normalizedQuery)) &&
      (status === "All projects" || item.status === status)
    );
  });

  return (
    <>
      <div className="collection-toolbar">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <input
            placeholder={localize(
              locale,
              "Search research projects...",
              "Поиск по исследовательским проектам...",
            )}
            aria-label={localize(locale, "Search projects", "Поиск проектов")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as (typeof statusOptions)[number])
          }
          aria-label={localize(locale, "Project status", "Статус проекта")}
        >
          {statusOptions.map((value) => (
            <option key={value} value={value}>
              {value === "All projects"
                ? localize(locale, "All projects", "Все проекты")
                : translateKnown(locale, value)}
            </option>
          ))}
        </select>
      </div>

      <div className="results-summary" role="status" aria-live="polite">
        <span>
          {filtered.length}{" "}
          {pluralize(locale, filtered.length, {
            en: ["research project", "research projects"],
            ru: ["исследовательский проект", "исследовательских проекта", "исследовательских проектов"],
          })}
        </span>
        <span>
          {localize(locale, "Local research snapshot", "Локальный снимок исследований")}
        </span>
      </div>

      <div className="project-directory">
        {filtered.map((project) => {
          const complete = project.tasks.filter((task) => task.done).length;
          const visibleName = translateKnown(locale, project.name);
          const visibleCategory = translateKnown(locale, project.category);

          return (
            <article className="project-card" key={project.id}>
              <button
                type="button"
                className={`project-card-art ${project.tone}`}
                onClick={() => inspect(project)}
                aria-label={localize(
                  locale,
                  `Inspect ${project.name}`,
                  `Открыть проект ${visibleName}`,
                )}
              >
                <Image
                  width={900}
                  height={560}
                  sizes="(max-width: 700px) 90vw, (max-width: 1200px) 40vw, 340px"
                  src={`/assets/${project.id}.png`}
                  alt={localize(
                    locale,
                    `${project.category} study diagram`,
                    `Схема исследования: ${visibleCategory}`,
                  )}
                />
                <span className="type-label">{visibleCategory}</span>
              </button>

              <div className="project-card-content">
                <div className="section-title">
                  <Badge
                    tone={project.status === "Active" ? "good" : "neutral"}
                  >
                    {translateKnown(locale, project.status)}
                  </Badge>
                  <SaveButton id={project.id} label={project.name} />
                </div>

                <div className="project-open">
                  <h2>
                    <button
                      type="button"
                      className="project-open-button"
                      onClick={() => inspect(project)}
                    >
                      {visibleName}
                    </button>
                  </h2>
                  <p>{translateKnown(locale, project.description)}</p>
                </div>

                <div className="milestone-label">
                  <span>
                    {localize(locale, "Research milestones", "Этапы исследования")}
                  </span>
                  <span>
                    {complete} / {project.tasks.length}
                  </span>
                </div>
                <div className="progress-track" aria-hidden="true">
                  <i
                    style={{
                      width: `${(complete / project.tasks.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="section-title">
                  <span
                    className="avatar-stack"
                    role="group"
                    aria-label={localize(
                      locale,
                      `${project.participants.length} contributors`,
                      `Участников: ${project.participants.length}`,
                    )}
                  >
                    {project.participants.map((name) => (
                      <span
                        key={name}
                        className={`mini-avatar ${name.startsWith("Elia") ? "coral" : "lavender"}`}
                        title={name}
                        aria-hidden="true"
                      >
                        {name[0]}
                      </span>
                    ))}
                  </span>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => inspect(project)}
                  >
                    {localize(locale, "View project", "Открыть проект")}
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!filtered.length && (
        <EmptyState
          title={localize(locale, "No projects found", "Проекты не найдены")}
          detail={localize(
            locale,
            "Try another search or project status.",
            "Измените запрос или статус проекта.",
          )}
          action={
            <button
              type="button"
              className="button"
              onClick={() => {
                setQuery("");
                setStatus("All projects");
              }}
            >
              {localize(locale, "Clear filters", "Сбросить фильтры")}
            </button>
          }
        />
      )}

      <Modal
        open={!!selected}
        onClose={close}
        title={localize(locale, "Research project", "Исследовательский проект")}
      >
        {selected && (
          <div className="detail-content">
            <div className="detail-kicker">
              <span className={`type-label ${selected.tone}`}>
                {translateKnown(locale, selected.category)}
              </span>
              <SaveButton id={selected.id} label={selected.name} />
            </div>

            <h2>{translateKnown(locale, selected.name)}</h2>
            <div className="detail-badges">
              <Badge tone={selected.status === "Active" ? "good" : "neutral"}>
                {translateKnown(locale, selected.status)}
              </Badge>
              <span>
                {selected.participants.length}{" "}
                {pluralize(locale, selected.participants.length, {
                  en: ["contributor", "contributors"],
                  ru: ["участник", "участника", "участников"],
                })}
              </span>
            </div>

            <p>{translateKnown(locale, selected.detail)}</p>

            <div className="detail-section">
              <h3>{localize(locale, "Milestones", "Этапы")}</h3>
              <ul className="milestone-list">
                {selected.tasks.map((task) => (
                  <li key={task.label} className={task.done ? "" : "pending"}>
                    {task.done ? (
                      <CheckCircle2 size={17} aria-hidden="true" />
                    ) : (
                      <Circle size={17} aria-hidden="true" />
                    )}
                    {translateKnown(locale, task.label)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>{localize(locale, "Connected knowledge", "Связанные знания")}</h3>
              {selected.related.map((id) => {
                const record = knowledge.find((item) => item.id === id);
                return (
                  record && (
                    <Link
                      key={id}
                      className="related-row"
                      href={`/commons#${id}`}
                      onClick={close}
                    >
                      <BookSymbol />
                      <span>{translateKnown(locale, record.title)}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  )
                );
              })}
            </div>

            <div className="detail-footer">
              <span className="small-muted">
                {localize(
                  locale,
                  "Milestones reflect demo fixtures.",
                  "Этапы отражают демонстрационные фикстуры.",
                )}
              </span>
              <ExportButton
                value={{ ...selected, source: "local-demo" }}
                filename={`haven-project-${selected.id}.json`}
                label={localize(locale, "Export project", "Экспортировать проект")}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function BookSymbol() {
  return <span className="dot lavender" aria-hidden="true" />;
}
