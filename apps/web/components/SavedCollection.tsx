"use client";

import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { searchRecords } from "@/lib/observatory";
import {
  EmptyState,
  ExportButton,
  SaveButton,
  useWorkspace,
} from "./Workspace";

export function SavedCollection() {
  const { saved } = useWorkspace();
  const records = searchRecords.filter((record) => saved.includes(record.id));
  return (
    <>
      {records.length ? (
        <>
          <div className="section-title">
            <p className="small-muted">
              {records.length} saved objects / Stored in this browser
            </p>
            <ExportButton
              value={{ source: "local-collection", records }}
              filename="haven-saved-collection.json"
              label="Export collection"
            />
          </div>
          <div className="saved-list">
            {records.map((item) => (
              <div key={item.id} className="saved-row">
                <Link className="search-result" href={item.href}>
                  <span className="result-icon">
                    <Bookmark size={16} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="result-kind">{item.kind}</span>
                  <ArrowRight size={15} />
                </Link>
                <SaveButton id={item.id} label={item.title} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="Space for your next discovery"
          detail="Your saved agents, research and knowledge objects will appear here."
          action={
            <Link className="button primary" href="/commons">
              Explore Commons
              <ArrowRight size={15} />
            </Link>
          }
        />
      )}
    </>
  );
}
