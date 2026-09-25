export const CTA_EXPERIMENT_ID = "hero-cta-order-v1";
export const CTA_EXPERIMENT_QUERY_KEY = "haven_exp_cta";
export const CTA_EXPERIMENT_STORAGE_KEY = "haven-experiment-hero-cta-order-v1";
export const HAVEN_MEASURE_EVENT = "haven:measure";

export type ExperimentVariant = "a" | "b";

export type HavenMeasureDetail = {
  measure: string;
  surface: string;
  experiment?: string;
  variant?: ExperimentVariant;
  audience?: string;
  target?: string;
};

function isExperimentVariant(value: unknown): value is ExperimentVariant {
  return value === "a" || value === "b";
}

function randomVariant(): ExperimentVariant {
  try {
    const value = new Uint32Array(1);
    window.crypto.getRandomValues(value);
    return value[0] % 2 === 0 ? "a" : "b";
  } catch {
    return Math.random() < 0.5 ? "a" : "b";
  }
}

export function assignCtaExperiment(search = window.location.search): ExperimentVariant {
  const override = new URLSearchParams(search).get(CTA_EXPERIMENT_QUERY_KEY);
  if (isExperimentVariant(override)) {
    try {
      window.sessionStorage.setItem(CTA_EXPERIMENT_STORAGE_KEY, override);
    } catch {
      /* The QA override still applies to the current render. */
    }
    return override;
  }

  try {
    const stored = window.sessionStorage.getItem(CTA_EXPERIMENT_STORAGE_KEY);
    if (isExperimentVariant(stored)) return stored;

    const assigned = randomVariant();
    window.sessionStorage.setItem(CTA_EXPERIMENT_STORAGE_KEY, assigned);
    return assigned;
  } catch {
    return randomVariant();
  }
}

export function emitHavenMeasure(detail: HavenMeasureDetail): void {
  window.dispatchEvent(
    new CustomEvent<HavenMeasureDetail>(HAVEN_MEASURE_EVENT, { detail }),
  );
}
