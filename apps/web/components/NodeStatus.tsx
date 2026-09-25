"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Radio } from "lucide-react";

function isPublicStatus(value: unknown): value is { schema: string } {
  return (
    !!value &&
    typeof value === "object" &&
    "schema" in value &&
    (value as { schema: unknown }).schema === "haven-public-status/1"
  );
}

export function NodeStatus() {
  const [status, setStatus] = useState("Checking public API...");
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let active = true;
    setBusy(true);
    setStatus("Checking public API...");
    fetch("/api/v1/status", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data: unknown = await response.json();
        if (!response.ok || !isPublicStatus(data))
          throw new Error();
        if (active) setStatus("Public API online / Local demo node");
      })
      .catch(() => {
        if (active) setStatus("Public API unavailable");
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setBusy(false);
      });
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [attempt]);
  return (
    <div className="node-health" role="status">
      <Radio size={18} />
      <span>{status}</span>
      <button
        type="button"
        className="icon-button"
        title="Refresh node status"
        aria-label="Refresh node status"
        disabled={busy}
        onClick={() => setAttempt((n) => n + 1)}
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );
}
