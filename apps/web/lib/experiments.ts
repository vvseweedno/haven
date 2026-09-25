export const CTA_EXPERIMENT_ID = "hero-cta-order-v1";
export const CTA_EXPERIMENT_QUERY_KEY = "haven_exp_cta";
export const CTA_EXPERIMENT_STORAGE_KEY = "haven-experiment-hero-cta-order-v1";
export const HAVEN_MEASURE_EVENT = "haven:measure";

export type ExperimentVariant = "a" | "b";
export type ExperimentAssignmentSource = "control" | "qa_override";

export type ExperimentAssignment = {
  variant: ExperimentVariant;
  source: ExperimentAssignmentSource;
  eligibleForInference: false;
};

export const heroCtaExperiment = {
  id: CTA_EXPERIMENT_ID,
  status: "qa-only",
  hypothesis:
    "Putting the audience-specific evaluation route first may increase completion of a verifiable evaluation step without increasing failed or abandoned pilot handoffs.",
  primaryMetric: "proof_receipt_exported",
  guardrails: ["proof_receipt_failed", "pilot_request_failed"],
  unitOfRandomization: "eligible_session",
  eligibility:
    "Not active for inference in this build. Query overrides exist only for deterministic UI QA.",
  decisionRule:
    "Do not declare a winner from browser-local data. Activate random assignment only after consented aggregate analytics, a required sample size and a stopping rule exist.",
} as const;

export type HavenMeasureDetail = {
  measure: string;
  surface: string;
  experiment?: string;
  variant?: ExperimentVariant;
  mode?: ExperimentAssignmentSource;
  audience?: string;
  target?: string;
  outcome?: string;
};

function isExperimentVariant(value: unknown): value is ExperimentVariant {
  return value === "a" || value === "b";
}

export function resolveCtaExperiment(search = ""): ExperimentAssignment {
  const override = new URLSearchParams(search).get(CTA_EXPERIMENT_QUERY_KEY);
  if (isExperimentVariant(override)) {
    return {
      variant: override,
      source: "qa_override",
      eligibleForInference: false,
    };
  }
  return {
    variant: "a",
    source: "control",
    eligibleForInference: false,
  };
}

export function assignCtaExperiment(
  search = typeof window === "undefined" ? "" : window.location.search,
): ExperimentAssignment {
  const assignment = resolveCtaExperiment(search);

  if (typeof window !== "undefined") {
    try {
      if (assignment.source === "qa_override") {
        window.sessionStorage.setItem(
          CTA_EXPERIMENT_STORAGE_KEY,
          assignment.variant,
        );
      } else {
        window.sessionStorage.removeItem(CTA_EXPERIMENT_STORAGE_KEY);
      }
    } catch {
      /* QA remains deterministic even when session storage is unavailable. */
    }
  }

  return assignment;
}

export function emitHavenMeasure(detail: HavenMeasureDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<HavenMeasureDetail>(HAVEN_MEASURE_EVENT, { detail }),
  );
}
