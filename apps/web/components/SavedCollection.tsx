"use client";

import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { searchRecords } from "@/lib/observatory";
import {
  localize,
  pluralize,
  translateKnown,
  useLocale,
} from "./LocaleContext";
import {
  EmptyState,
  ExportButton,
  SaveButton,
  useWorkspace,
} from "./Workspace";

export function SavedCollection() {
  const { locale } = useLocale();
  const { saved } = useWorkspace();
  const records = searchRecords.filter((record) => saved.includes(record.id));

  return (
    <>
      {records.length ? (
        <>
          <div className="section-title">
            <p className="small-muted">
              {records.length}{" "}
              {pluralize(locale, records.length, {
                en: ["saved object", "saved objects"],
                ru: ["сохранённый объект", "сохранённых объекта", "сохранённых объектов"],
              })}{" "}
              / {localize(locale, "Stored in this browser", "Хранится в этом браузере")}
            </p>
            <ExportButton
              value={{ source: "local-collection", records }}
              filename="haven-saved-collection.json"
              label={localize(locale, "Export collection", "Экспортировать коллекцию")}
            />
          </div>
          <div className="saved-list">
            {records.map((item) => (
              <div key={item.id} className="saved-row">
                <Link className="search-result" href={item.href}>
                  <span className="result-icon">
                    <Bookmark size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{translateKnown(locale, item.title)}</strong>
                    <small>{translateKnown(locale, item.description)}</small>
                  </span>
                  <span className="result-kind">
                    {translateKnown(locale, item.kind)}
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <SaveButton id={item.id} label={item.title} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={localize(
            locale,
            "Space for your next discovery",
            "Место для следующей находки",
          )}
          detail={localize(
            locale,
            "Your saved agents, research and knowledge objects will appear here.",
            "Здесь появятся сохранённые агенты, исследования и объекты знаний.",
          )}
          action={
            <Link className="button primary" href="/commons">
              {localize(locale, "Explore Commons", "Открыть Commons")}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          }
        />
      )}
    </>
  );
}
