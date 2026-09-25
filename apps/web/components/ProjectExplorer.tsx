"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Search } from "lucide-react";
import { knowledge, projects } from "@/lib/observatory";
import { Badge } from "./Badge";
import { EmptyState, ExportButton, Modal, SaveButton } from "./Workspace";

export function ProjectExplorer() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All projects");
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
  const filtered = projects.filter(
    (item) =>
      `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "All projects" || item.status === status),
  );
  return (
    <>
      <div className="collection-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            placeholder="Search research projects..."
            aria-label="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Project status"
        >
          {["All projects", "Active", "Planned"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="results-summary">
        <span>{filtered.length} research projects</span>
        <span>Local research snapshot</span>
      </div>
      <div className="project-directory">
        {filtered.map((project) => {
          const complete = project.tasks.filter((t) => t.done).length;
          return (
            <article className="project-card" key={project.id}>
              <button
                className={`project-card-art ${project.tone}`}
                onClick={() => inspect(project)}
                aria-label={`Inspect ${project.name}`}
              >
                <Image
                  width={900}
                  height={560}
                  sizes="(max-width: 700px) 90vw, (max-width: 1200px) 40vw, 340px"
                  src={`/assets/${project.id}.png`}
                  alt={`${project.category} study diagram`}
                />
                <span className="type-label">{project.category}</span>
              </button>
              <div className="project-card-content">
                <div className="section-title">
                  <Badge
                    tone={project.status === "Active" ? "good" : "neutral"}
                  >
                    {project.status}
                  </Badge>
                  <SaveButton id={project.id} label={project.name} />
                </div>
                <button
                  className="project-open"
                  onClick={() => inspect(project)}
                >
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                </button>
                <div className="milestone-label">
                  <span>Research milestones</span>
                  <span>
                    {complete} / {project.tasks.length}
                  </span>
                </div>
                <div className="progress-track">
                  <i
                    style={{
                      width: `${(complete / project.tasks.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="section-title">
                  <span className="avatar-stack">
                    {project.participants.map((name) => (
                      <span
                        key={name}
                        className={`mini-avatar ${name.startsWith("Elia") ? "coral" : "lavender"}`}
                        title={name}
                      >
                        {name[0]}
                      </span>
                    ))}
                  </span>
                  <button
                    className="text-button"
                    onClick={() => inspect(project)}
                  >
                    View project
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <EmptyState
          title="No projects found"
          detail="Try another search or project status."
          action={
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setStatus("All projects");
              }}
            >
              Clear filters
            </button>
          }
        />
      )}
      <Modal open={!!selected} onClose={close} title="Research project">
        {selected && (
          <div className="detail-content">
            <div className="detail-kicker">
              <span className={`type-label ${selected.tone}`}>
                {selected.category}
              </span>
              <SaveButton id={selected.id} label={selected.name} />
            </div>
            <h2>{selected.name}</h2>
            <div className="detail-badges">
              <Badge tone={selected.status === "Active" ? "good" : "neutral"}>
                {selected.status}
              </Badge>
              <span>{selected.participants.length} contributors</span>
            </div>
            <p>{selected.detail}</p>
            <div className="detail-section">
              <h3>Milestones</h3>
              <ul className="milestone-list">
                {selected.tasks.map((task) => (
                  <li key={task.label} className={task.done ? "" : "pending"}>
                    {task.done ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <Circle size={17} />
                    )}
                    {task.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="detail-section">
              <h3>Connected knowledge</h3>
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
                      <span>{record.title}</span>
                      <ArrowRight size={15} />
                    </Link>
                  )
                );
              })}
            </div>
            <div className="detail-footer">
              <span className="small-muted">
                Milestones reflect demo fixtures.
              </span>
              <ExportButton
                value={{ ...selected, source: "local-demo" }}
                filename={`haven-project-${selected.id}.json`}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function BookSymbol() {
  return <span className="dot lavender" />;
}
