import type { SessionAttribution } from "./measurement";

export type PilotFailureMode =
  | "continuity"
  | "provenance"
  | "authority"
  | "governance"
  | "other";

export type PilotRequest = {
  version: 1;
  locale: "en" | "ru";
  fullName: string;
  workEmail: string;
  organization: string;
  role: string;
  failureMode: PilotFailureMode;
  workflow: string;
  pilotGoal: string;
  dataBoundary: string;
  consent: true;
  attribution: SessionAttribution;
};

export type PilotIntakeResult =
  | { ok: true; value: PilotRequest }
  | { ok: false; errors: string[] };

const failureModes = new Set<PilotFailureMode>([
  "continuity",
  "provenance",
  "authority",
  "governance",
  "other",
]);

const attributionKeys = new Set(["utm_source", "utm_medium", "utm_campaign", "ref"]);
const attributionToken = /^[a-z0-9][a-z0-9._-]{0,63}$/;

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanLongText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

function cleanEmail(value: unknown) {
  const email = cleanText(value, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "";
  return email;
}

function cleanAttribution(value: unknown): SessionAttribution {
  if (!value || typeof value !== "object") return {};
  const input = value as Record<string, unknown>;
  return Object.entries(input).reduce<SessionAttribution>((result, [key, raw]) => {
    if (!attributionKeys.has(key) || typeof raw !== "string") return result;
    const normalized = raw.trim().toLowerCase();
    if (!attributionToken.test(normalized)) return result;
    (result as Record<string, string>)[key] = normalized;
    return result;
  }, {});
}

export function sanitizePilotRequest(value: unknown): PilotIntakeResult {
  if (!value || typeof value !== "object") {
    return { ok: false, errors: ["invalid_payload"] };
  }

  const input = value as Record<string, unknown>;
  const errors: string[] = [];

  if (cleanText(input.website, 200)) {
    return { ok: false, errors: ["bot_trap"] };
  }

  const locale = input.locale === "ru" ? "ru" : "en";
  const fullName = cleanText(input.fullName, 80);
  const workEmail = cleanEmail(input.workEmail);
  const organization = cleanText(input.organization, 120);
  const role = cleanText(input.role, 100);
  const failureMode = failureModes.has(input.failureMode as PilotFailureMode)
    ? (input.failureMode as PilotFailureMode)
    : "other";
  const workflow = cleanLongText(input.workflow, 1200);
  const pilotGoal = cleanLongText(input.pilotGoal, 1200);
  const dataBoundary = cleanLongText(input.dataBoundary, 800);
  const consent = input.consent === true;

  if (fullName.length < 2) errors.push("full_name_required");
  if (!workEmail) errors.push("work_email_required");
  if (organization.length < 2) errors.push("organization_required");
  if (role.length < 2) errors.push("role_required");
  if (workflow.length < 20) errors.push("workflow_required");
  if (pilotGoal.length < 20) errors.push("pilot_goal_required");
  if (!consent) errors.push("consent_required");

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      version: 1,
      locale,
      fullName,
      workEmail,
      organization,
      role,
      failureMode,
      workflow,
      pilotGoal,
      dataBoundary,
      consent: true,
      attribution: cleanAttribution(input.attribution),
    },
  };
}

export function pilotIntakeConfigured(env = process.env) {
  const webhook = env.HAVEN_PILOT_WEBHOOK_URL?.trim();
  if (!webhook) return false;
  try {
    const url = new URL(webhook);
    return url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function publicPilotContactUrl(env = process.env) {
  const raw = env.HAVEN_PILOT_CONTACT_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return ["https:", "mailto:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}
