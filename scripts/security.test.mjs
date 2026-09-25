import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  createVault,
  unlockVault,
  encryptVault,
  parseEnvelope,
  validateNotes,
} from "../apps/web/lib/vault-crypto.ts";
import { parseCatalogQuery } from "../apps/web/lib/public-contract.ts";
import {
  contentSecurityPolicy,
  createRequestBudget,
} from "../apps/web/lib/security.ts";
import { inspectObject } from "../apps/web/lib/object-inspection.ts";
import {
  createProofReceipt,
  proofSamples,
} from "../apps/web/lib/proof-desk.ts";
import {
  createGrowthJourneyState,
  getGrowthRecommendation,
  parseGrowthJourneyState,
  recordGrowthVisit,
} from "../apps/web/lib/growth.ts";
import { buildAnalysisBrief, buildPilotBrief } from "../apps/web/lib/adoption.ts";
import { sanitizePilotRequest } from "../apps/web/lib/pilot-intake.ts";
import { resolveCtaExperiment } from "../apps/web/lib/experiments.ts";
import {
  MAX_MEASUREMENT_EVENTS,
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
} from "../apps/web/lib/measurement.ts";

const passphrase = "a long unique test passphrase";
const note = {
  id: "f2c545a7-3c86-45ec-8f53-0bdb9c7bf5e9",
  title: "Private title",
  body: "Private continuity record <script>alert(1)</script>",
  kind: "Research",
  createdAt: "2026-09-21T12:00:00.000Z",
  updatedAt: "2026-09-21T12:00:00.000Z",
};

test("growth journey keeps only bounded local route and audience state", () => {
  const parsed = parseGrowthJourneyState(
    JSON.stringify({
      version: 99,
      audience: "building",
      visitedRoutes: ["/observatory", "//remote.example", "/trust?leak=1"],
      visitedStages: ["observe", "verify", "unknown"],
    }),
  );
  assert.equal(parsed.version, 2);
  assert.equal(parsed.audience, "building");
  assert.deepEqual(parsed.visitedRoutes, ["/observatory"]);
  assert.deepEqual(parsed.observedSignals, ["context_selected", "evidence_opened"]);

  const visited = recordGrowthVisit(
    createGrowthJourneyState(),
    "/observatory",
    "observe",
  );
  assert.deepEqual(visited.visitedRoutes, ["/observatory"]);
  assert.equal(getGrowthRecommendation(visited).signal, "context_selected");
});

test("pilot brief is an unsubmitted local evaluation artifact", () => {
  const brief = buildPilotBrief("en");
  assert.equal(brief.kind, "haven.design-partner-evaluation");
  assert.match(brief.boundary, /not submitted/i);
  assert.equal(brief.readiness.length, 6);
  assert.ok(brief.readiness.every((item) => item.owner === ""));
  assert.equal(brief.proposedPilot.problem, "");
});

test("measurement ledger is bounded, semantic and excludes free-form data", () => {
  assert.equal(sanitizeMeasurementDetail({ name: "valid_event" }).name, "valid_event");
  assert.equal(sanitizeMeasurementDetail({ name: "user@example.com" }), null);
  const sanitized = sanitizeMeasurementDetail({
    name: "proof_receipt_created",
    meta: {
      source: "sample",
      count: 5,
      query: "private entered text",
      note: "secret",
    },
  });
  assert.deepEqual(sanitized.meta, { source: "sample", count: 5 });

  let ledger = createMeasurementLedger();
  for (let index = 0; index < MAX_MEASUREMENT_EVENTS + 8; index += 1) {
    ledger = appendMeasurement(ledger, { name: "route_view" }, `/route-${index}`);
  }
  assert.equal(ledger.events.length, MAX_MEASUREMENT_EVENTS);
  assert.equal(ledger.events.at(-1).route, `/route-${MAX_MEASUREMENT_EVENTS + 7}`);
  const parsed = parseMeasurementLedger(JSON.stringify({ ...ledger, nextSequence: 999999 }));
  assert.equal(parsed.nextSequence, ledger.events.at(-1).sequence + 1);
});

test("measurement attribution is allowlisted and funnel requires explicit ordered outcomes", () => {
  assert.deepEqual(
    readAttribution("?utm_source=Research_Lab&utm_medium=web&utm_content=hero_a&email=person%40example.com"),
    { utm_source: "research_lab", utm_medium: "web", utm_content: "hero_a" },
  );
  assert.deepEqual(parseAttribution('{"utm_campaign":"launch","email":"secret"}'), {
    utm_campaign: "launch",
  });

  const cta = sanitizeMeasurementDetail({
    name: "hero_cta_click",
    meta: { target: "/proof-desk", query: "private entered text" },
  });
  assert.deepEqual(cta.meta, { target: "/proof-desk" });

  let ledger = appendRouteLifecycle(createMeasurementLedger(), "/");
  assert.equal(createFunnelSnapshot(ledger).reached, 0);

  ledger = appendRouteLifecycle(ledger, "/landscape");
  assert.equal(createFunnelSnapshot(ledger).reached, 1);

  ledger = appendRouteLifecycle(ledger, "/proof-desk");
  assert.equal(createFunnelSnapshot(ledger).reached, 1);
  ledger = appendMeasurement(ledger, { name: "proof_receipt_exported" }, "/proof-desk");
  assert.equal(createFunnelSnapshot(ledger).reached, 2);

  ledger = appendRouteLifecycle(ledger, "/trust");
  ledger = appendMeasurement(ledger, { name: "boundary_evidence_reviewed" }, "/trust");
  assert.equal(createFunnelSnapshot(ledger).reached, 3);

  ledger = appendRouteLifecycle(ledger, "/delivery");
  ledger = appendMeasurement(ledger, { name: "pilot_brief_exported" }, "/delivery");
  assert.equal(createFunnelSnapshot(ledger).reached, 4);

  ledger = appendRouteLifecycle(ledger, "/pilot");
  ledger = appendMeasurement(ledger, { name: "pilot_request_submitted" }, "/pilot");
  const funnel = createFunnelSnapshot(ledger);
  assert.equal(funnel.reached, 5);
  assert.equal(funnel.observed, 5);
  assert.equal(funnel.nextStage, null);

  const exported = createMeasurementExport(ledger, { utm_source: "research_lab" });
  assert.equal(exported.schema, "haven.measurement.export.v2");
  assert.equal(exported.privacy.scope, "this-tab-session-only");
  assert.equal(exported.privacy.networkTransmission, false);
  assert.equal(exported.privacy.identifiers, false);
});

test("measurement friction counts failures without storing free-form input", () => {
  let ledger = createMeasurementLedger();
  ledger = appendMeasurement(ledger, { name: "proof_receipt_failed" }, "/proof-desk");
  ledger = appendMeasurement(ledger, { name: "pilot_request_failed", outcome: "validation_failed" }, "/pilot");
  ledger = appendMeasurement(ledger, { name: "growth_journey_reset" }, "/");
  assert.deepEqual(createFrictionSnapshot(ledger), {
    proofFailures: 1,
    pilotFailures: 1,
    journeyResets: 1,
    total: 3,
  });
});

test("hero CTA experiment is deterministic and QA-only", () => {
  assert.deepEqual(resolveCtaExperiment(""), {
    variant: "a",
    source: "control",
    eligibleForInference: false,
  });
  assert.deepEqual(resolveCtaExperiment("?haven_exp_cta=b"), {
    variant: "b",
    source: "qa_override",
    eligibleForInference: false,
  });
});

test("analysis brief cannot manufacture visitors, uplift or a winner", () => {
  const brief = buildAnalysisBrief("en");
  assert.equal(brief.experiment.result, "no conclusion");
  assert.equal(brief.experiment.status, "qa-only");
  assert.equal(brief.experiment.requiredSampleSize, null);
  assert.equal(brief.experiment.result, "no conclusion");
  assert.equal(brief.dataQuality.populationInferenceAllowed, false);
  assert.ok(brief.funnel.every((stage) => stage.eligibleSessions === null));
  assert.match(brief.boundary, /no telemetry/i);
});



test("pilot intake requires explicit consent and sanitizes submitted qualification data", () => {
  const rejected = sanitizePilotRequest({
    fullName: "A",
    workEmail: "not-an-email",
    organization: "",
    role: "",
    failureMode: "continuity",
    workflow: "short",
    pilotGoal: "short",
    consent: false,
  });
  assert.equal(rejected.ok, false);

  const accepted = sanitizePilotRequest({
    locale: "en",
    fullName: "  Ada <Admin>  ",
    workEmail: "ADA@EXAMPLE.COM",
    organization: "Research Lab",
    role: "Safety Lead",
    failureMode: "authority",
    workflow: "We need to preserve reviewable agent authority across runtime replacements.",
    pilotGoal: "A reviewer can trace each delegated action to its evidence and authority boundary.",
    dataBoundary: "Private notes must remain local.",
    consent: true,
    attribution: {
      utm_source: "Research_Lab",
      utm_campaign: "Pilot_2026",
      email: "secret@example.com",
    },
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.value.workEmail, "ada@example.com");
  assert.equal(accepted.value.fullName, "Ada Admin");
  assert.deepEqual(accepted.value.attribution, {
    utm_source: "research_lab",
    utm_campaign: "pilot_2026",
  });
});

test("vault encrypts all note fields and uses a nonextractable key", async () => {
  const { envelope, key } = await createVault(passphrase, [note]);
  const serialized = JSON.stringify(envelope);
  for (const secret of [note.title, note.body, note.id, note.createdAt])
    assert.ok(!serialized.includes(secret));
  assert.equal(key.extractable, false);
  assert.deepEqual((await unlockVault(envelope, passphrase)).notes, [note]);
  const next = await encryptVault([note], key, envelope.kdf);
  assert.notEqual(envelope.cipher.iv, next.cipher.iv);
  assert.notEqual(envelope.cipher.data, next.cipher.data);
  assert.deepEqual((await unlockVault(next, passphrase)).notes, [note]);
});
test("vault rejects wrong passphrases and tampering", async () => {
  const { envelope } = await createVault(passphrase, [note]);
  await assert.rejects(
    unlockVault(envelope, "this is the wrong passphrase"),
    /Could not unlock/,
  );
  const tampered = structuredClone(envelope);
  tampered.cipher.data =
    (tampered.cipher.data[0] === "A" ? "B" : "A") +
    tampered.cipher.data.slice(1);
  await assert.rejects(unlockVault(tampered, passphrase), /Could not unlock/);
  const changedSalt = structuredClone(envelope);
  changedSalt.kdf.salt = btoa("1234567890123456");
  await assert.rejects(
    unlockVault(changedSalt, passphrase),
    /Could not unlock/,
  );
});
test("vault rejects unbounded or unsupported archives before KDF", async () => {
  const { envelope } = await createVault(passphrase);
  assert.throws(() => parseEnvelope(" ".repeat(3_000_001)), /exceeds/);
  assert.throws(() => parseEnvelope("null"));
  assert.throws(() => parseEnvelope("not-json"));
  for (const iterations of [0, 1, 600001, 999999999]) {
    const candidate = structuredClone(envelope);
    candidate.kdf.iterations = iterations;
    assert.throws(
      () => parseEnvelope(JSON.stringify(candidate)),
      /Unsupported/,
    );
  }
  const candidate = structuredClone(envelope);
  candidate.cipher.iv = "abcd";
  assert.throws(() => parseEnvelope(JSON.stringify(candidate)));
  await assert.rejects(createVault("short"), /12 to 256/);
  await assert.rejects(createVault("x".repeat(257)), /12 to 256/);
});
test("vault bounds note count and content and preserves unicode", async () => {
  assert.throws(() => validateNotes([note, note]), /Invalid note/);
  assert.throws(() => validateNotes(Array(101).fill(note)), /100 notes/);
  for (const patch of [
    { title: "x".repeat(121) },
    { body: "x".repeat(20001) },
    { kind: "Execute" },
    { createdAt: "invalid" },
  ])
    assert.throws(() => validateNotes([{ ...note, ...patch }]));
  const unicode = {
    ...note,
    body: "\u043f\u0430\u043c\u044f\u0442\u044c ".repeat(2000),
  };
  const result = await createVault(passphrase, [unicode]);
  assert.deepEqual((await unlockVault(result.envelope, passphrase)).notes, [
    unicode,
  ]);
});
test("catalog contract bounds all query parameters", () => {
  assert.deepEqual(parseCatalogQuery(new URLSearchParams()), {
    q: "",
    kind: null,
    limit: 25,
    offset: 0,
  });
  assert.equal(
    parseCatalogQuery(new URLSearchParams("q=Elia&kind=Agent&limit=2&offset=1"))
      .limit,
    2,
  );
  for (const input of [
    "limit=0",
    "limit=101",
    "limit=-1",
    "limit=1e2",
    "offset=10001",
    "offset=1.2",
    "q=a&q=b",
    "unknown=x",
    "kind=Private",
    "q=%00",
    `q=${"x".repeat(121)}`,
  ])
    assert.throws(() => parseCatalogQuery(new URLSearchParams(input)), input);
});
test("request budget depletes, refills and tolerates a backwards clock", () => {
  let now = 1000;
  const allow = createRequestBudget(2, 1, () => now);
  assert.equal(allow(), true);
  assert.equal(allow(), true);
  assert.equal(allow(), false);
  now = 1500;
  assert.equal(allow(), false);
  now = 2000;
  assert.equal(allow(), true);
  now = 1000;
  assert.equal(allow(), false);
});
test("production CSP requires a nonce and disallows script attributes and eval", () => {
  const policy = contentSecurityPolicy("abcDEF12345678901234567890");
  const scripts = policy
    .split(";")
    .find((value) => value.trim().startsWith("script-src "));
  assert.ok(scripts.includes("'strict-dynamic'"));
  assert.ok(!scripts.includes("unsafe-inline"));
  assert.ok(!scripts.includes("unsafe-eval"));
  assert.ok(policy.includes("script-src-attr 'none'"));
  assert.ok(policy.includes("frame-ancestors 'none'"));
  assert.throws(() => contentSecurityPolicy("'unsafe-inline'"));
  assert.ok(
    contentSecurityPolicy("abcDEF12345678901234567890", true).includes(
      "'unsafe-eval'",
    ),
  );
});
test("inspector hashes exact bytes without exposing source values", async () => {
  const source = JSON.stringify({
    schema: "demo/1",
    visibility: "PRIVATE",
    content: "secret",
    signature: "untrusted",
  });
  const report = await inspectObject(source);
  assert.equal(
    report.sha256,
    createHash("sha256").update(source).digest("hex"),
  );
  assert.equal(report.checks.declaresPublicVisibility, false);
  assert.equal(report.signatureVerification, "not-performed");
  assert.ok(!JSON.stringify(report).includes("secret"));
  assert.notEqual(report.sha256, (await inspectObject(source + " ")).sha256);
  for (const value of ["null", "[]", "5", "alert(1)", "x".repeat(1_000_001)])
    await assert.rejects(inspectObject(value));
});
test("proof desk separates local verification from object declarations", async () => {
  const report = await createProofReceipt(proofSamples[1].source);
  assert.equal(report.schema, "haven-proof-receipt/1");
  assert.equal(report.stages[0].status, "verified");
  assert.equal(report.stages[1].status, "verified");
  assert.equal(report.stages[2].status, "declared");
  assert.equal(report.stages[3].status, "declared");
  assert.equal(report.stages[4].status, "missing");
  assert.equal(report.observations.proofDeclared, true);
  assert.ok(!JSON.stringify(report).includes("demo-not-verified"));
  await assert.rejects(
    createProofReceipt("not json"),
    /Invalid JSON/,
  );
});
