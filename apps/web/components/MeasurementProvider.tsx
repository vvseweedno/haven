"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  LEGACY_MEASUREMENT_ATTRIBUTION_KEY,
  LEGACY_MEASUREMENT_STORAGE_KEY,
  MEASUREMENT_ATTRIBUTION_KEY,
  MEASUREMENT_STORAGE_KEY,
  MEASUREMENT_UPDATE_EVENT,
  MEASURE_EVENT,
  appendMeasurement,
  appendRouteLifecycle,
  createFrictionSnapshot,
  createFunnelSnapshot,
  createMeasurementExport,
  createMeasurementLedger,
  parseAttribution,
  parseMeasurementLedger,
  readAttribution,
  sanitizeMeasurementDetail,
  type FrictionSnapshot,
  type FunnelSnapshot,
  type MeasurementLedger,
  type SessionAttribution,
} from "@/lib/measurement";

type MeasurementContextValue = {
  ledger: MeasurementLedger;
  attribution: SessionAttribution;
  funnel: FunnelSnapshot;
  friction: FrictionSnapshot;
  ready: boolean;
  exportMeasurement: () => void;
  resetMeasurement: () => void;
};

const MeasurementContext = createContext<MeasurementContextValue | null>(null);

export function MeasurementProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ledger, setLedger] = useState<MeasurementLedger>(
    createMeasurementLedger,
  );
  const [attribution, setAttribution] = useState<SessionAttribution>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let storedLedger = createMeasurementLedger();
    let storedAttribution: SessionAttribution = {};

    try {
      storedLedger = parseMeasurementLedger(
        window.sessionStorage.getItem(MEASUREMENT_STORAGE_KEY),
      );
      storedAttribution = parseAttribution(
        window.sessionStorage.getItem(MEASUREMENT_ATTRIBUTION_KEY),
      );

      if (Object.keys(storedAttribution).length === 0) {
        storedAttribution = readAttribution(window.location.search);
        if (Object.keys(storedAttribution).length > 0) {
          window.sessionStorage.setItem(
            MEASUREMENT_ATTRIBUTION_KEY,
            JSON.stringify(storedAttribution),
          );
        }
      }

      window.localStorage.removeItem(LEGACY_MEASUREMENT_STORAGE_KEY);
      window.sessionStorage.removeItem(LEGACY_MEASUREMENT_ATTRIBUTION_KEY);
    } catch {
      storedAttribution = readAttribution(window.location.search);
    }

    setAttribution(storedAttribution);
    setLedger(storedLedger);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setLedger((current) => appendRouteLifecycle(current, pathname));
  }, [pathname, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(
        MEASUREMENT_STORAGE_KEY,
        JSON.stringify(ledger),
      );
      window.dispatchEvent(new Event(MEASUREMENT_UPDATE_EVENT));
    } catch {
      /* Measurement remains available in memory for this tab session. */
    }
  }, [ledger, ready]);

  useEffect(() => {
    const record = (detail: unknown) => {
      setLedger((current) => appendMeasurement(current, detail, pathname));
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const measured = target.closest<HTMLElement>("[data-measure]");
      if (!measured || measured.dataset.measureMode === "manual") return;
      record({
        name: measured.dataset.measure,
        context: measured.dataset.measureContext,
        step: measured.dataset.measureStep,
        outcome: measured.dataset.measureOutcome,
      });
    };

    const handleCustom = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (sanitizeMeasurementDetail(detail)) record(detail);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener(MEASURE_EVENT, handleCustom);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener(MEASURE_EVENT, handleCustom);
    };
  }, [pathname]);

  const exportMeasurement = useCallback(() => {
    const payload = createMeasurementExport(ledger, attribution);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "haven-session-measurement.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [attribution, ledger]);

  const resetMeasurement = useCallback(() => {
    const freshAttribution =
      typeof window === "undefined" ? {} : readAttribution(window.location.search);
    setLedger(appendRouteLifecycle(createMeasurementLedger(), pathname));
    setAttribution(freshAttribution);
    try {
      window.sessionStorage.removeItem(MEASUREMENT_STORAGE_KEY);
      window.sessionStorage.removeItem(MEASUREMENT_ATTRIBUTION_KEY);
      window.sessionStorage.removeItem(LEGACY_MEASUREMENT_ATTRIBUTION_KEY);
      window.localStorage.removeItem(LEGACY_MEASUREMENT_STORAGE_KEY);
      if (Object.keys(freshAttribution).length > 0) {
        window.sessionStorage.setItem(
          MEASUREMENT_ATTRIBUTION_KEY,
          JSON.stringify(freshAttribution),
        );
      }
    } catch {
      /* In-memory state is reset even when storage is unavailable. */
    }
  }, [pathname]);

  const value = useMemo<MeasurementContextValue>(
    () => ({
      ledger,
      attribution,
      funnel: createFunnelSnapshot(ledger),
      friction: createFrictionSnapshot(ledger),
      ready,
      exportMeasurement,
      resetMeasurement,
    }),
    [attribution, exportMeasurement, ledger, ready, resetMeasurement],
  );

  return (
    <MeasurementContext.Provider value={value}>
      {children}
    </MeasurementContext.Provider>
  );
}

export function useMeasurement() {
  const value = useContext(MeasurementContext);
  if (!value) {
    throw new Error("useMeasurement must be used inside MeasurementProvider");
  }
  return value;
}
