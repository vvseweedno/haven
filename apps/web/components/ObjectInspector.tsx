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
import { PageHeader } from "./PageHeader";
import { CopyButton, downloadJson } from "./Workspace";
import { inspectObject, MAX_OBJECT_BYTES } from "@/lib/object-inspection";
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
export default function ObjectInspector() {
  const [source, setSource] = useState(sample);
  const [report, setReport] = useState<Awaited<
    ReturnType<typeof inspectObject>
  > | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("Untitled object");
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
        <Braces size={18} />
        <span>JSON only</span>
        <span>1 MB maximum</span>
        <span>No upload or persistence</span>
      </div>
      <div className="inspector-workspace">
        <section className="inspector-source">
          <div className="section-title">
            <h2>Source object</h2>
            <label className="button file-button">
              <FileUp size={16} />
              Open JSON
              <input
                aria-label="Open JSON file"
                type="file"
                accept=".json,application/json"
                disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setBusy(true);
                  setError("");
                  try {
                    if (file.size > MAX_OBJECT_BYTES)
                      throw new Error("Object exceeds 1 MB.");
                    change(await file.text());
                    setFilename(file.name);
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : "Could not read file.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
          </div>
          <label className="sr-only" htmlFor="object-source">
            JSON source
          </label>
          <textarea
            id="object-source"
            spellCheck={false}
            maxLength={MAX_OBJECT_BYTES}
            disabled={busy}
            value={source}
            onChange={(e) => change(e.target.value)}
          />
          <div className="inspector-source-footer">
            <small>{filename}</small>
            <button
              className="button primary"
              disabled={busy || !source.trim()}
              onClick={async () => {
                setBusy(true);
                setError("");
                setReport(null);
                try {
                  setReport(await inspectObject(source));
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "Inspection failed.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              <ScanLine size={16} />
              {busy ? "Inspecting..." : "Inspect object"}
            </button>
          </div>
        </section>
        <section className="inspection-result" aria-live="polite">
          <div className="section-title">
            <h2>Inspection</h2>
            <Hash size={19} />
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
                  <strong>{report.bytes.toLocaleString()}</strong>
                  <span>UTF-8 bytes</span>
                </div>
                <div>
                  <strong>{report.fieldCount}</strong>
                  <span>Root fields</span>
                </div>
              </div>
              <div className="inspection-checks">
                {[
                  ["JSON object", report.checks.jsonObject],
                  ["Schema declaration present", report.checks.schemaDeclared],
                  [
                    "Recognized visibility declaration",
                    report.checks.visibilityRecognized,
                  ],
                  [
                    "Declares PUBLIC visibility",
                    report.checks.declaresPublicVisibility,
                  ],
                ].map(([label, ok]) => (
                  <div key={String(label)}>
                    {ok ? <Check size={17} /> : <Minus size={17} />}
                    <span>{label}</span>
                    <small>{ok ? "Yes" : "No"}</small>
                  </div>
                ))}
              </div>
              <div className="fingerprint">
                <div className="section-title">
                  <span className="eyebrow">SHA-256 / Exact input bytes</span>
                  <CopyButton text={report.sha256} label="Copy fingerprint" />
                </div>
                <code>{report.sha256}</code>
              </div>
              <p className="muted">
                Whitespace changes this fingerprint. It is not a canonical
                object ID, proof of authorship, signature check or protocol
                approval.
              </p>
              <button
                className="button"
                onClick={() =>
                  downloadJson(report, "haven-object-inspection.json")
                }
              >
                <Download size={16} />
                Export report
              </button>
            </>
          ) : (
            !error && (
              <div className="empty-state">
                <ScanLine size={32} />
                <h3>Awaiting inspection</h3>
              </div>
            )
          )}
          <div className="inspection-boundary">
            <strong>Trust remains unverified</strong>
            <p>
              Visibility is a declaration made by the input. Signature
              verification and protocol validation are not implemented here. No
              input code is evaluated.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
