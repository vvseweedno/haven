"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  FileCheck2,
  FileUp,
  Fingerprint,
  Minus,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import {
  createProofReceipt,
  proofSamples,
  type ProofDeskReport,
  type ProofStage,
  type ProofStageStatus,
} from "@/lib/proof-desk";
import { MAX_OBJECT_BYTES } from "@/lib/object-inspection";
import { useLocale } from "./LocaleContext";
import { CopyButton, downloadJson, measure } from "./Workspace";

const initialSample = proofSamples[0];

const proofCopy = {
  en: {
    eyebrow: "HAVEN / Proof Desk",
    title: "Turn a public agent object into a checkable receipt.",
    lead: "Open a sample or your own JSON. HAVEN fingerprints the exact bytes, separates what this browser verified from what the object only declares, and exports the result locally.",
    create: "Create a local receipt",
    trust: "Review trust limits",
    boundaries: "Proof Desk boundaries",
    local: "Runs in this browser",
    hash: "Exact-byte fingerprint",
    offline: "No external lookup",
    intentEyebrow: "What this check can tell you",
    intentTitle: "Structure is evidence about a file, not proof that its claims are true.",
    intentBody: "Use the receipt to confirm exact bytes and visible fields. Authorship, signatures, status and real-world meaning still require an independent verifier.",
    samplesAria: "Example public objects",
    sampleEyebrow: "Choose a starting point",
    sampleTitle: "Try a sample or open your JSON",
    sampleBody: "Each sample is incomplete in a different way, so you can see which questions remain open.",
    privacyNote: "Your input stays in this browser. Proof Desk does not open URLs or contact an issuer.",
    source: "01 / Source",
    publicJson: "Public JSON object",
    openJson: "Open local JSON",
    openJsonAria: "Open a local JSON file",
    sourceAria: "Public JSON source",
    characters: "characters",
    reading: "Reading object...",
    createProof: "Create proof receipt",
    receipt: "02 / Receipt",
    receiptTitle: "What this object supports now",
    currentReading: "Current reading",
    bytes: "UTF-8 bytes",
    fields: "Root fields",
    observed: "Visible fields",
    declares: "What the object declares",
    declared: "Declared",
    notDeclared: "Not declared",
    fingerprint: "Exact-byte fingerprint",
    copyFingerprint: "Copy fingerprint",
    export: "Export receipt",
    emptyTitle: "Choose a source to begin",
    emptyBody: "Select a sample or paste a public JSON object, then create a local receipt.",
    nextAria: "Useful next actions",
    nextEyebrow: "03 / Continue the check",
    nextTitle: "Go only as far as the evidence allows.",
    trustCenter: "Trust center",
    trustAction: "Review privacy and implementation limits",
    arrival: "Agent arrival",
    arrivalAction: "Prepare a bounded identity request",
    inspector: "Object inspector",
    inspectorAction: "Inspect structure and exact bytes",
    readError: "Could not create a receipt from this object.",
    fileError: "Could not read this file.",
    tooLarge: "The object is larger than 1 MB.",
    heroAlt: "A proof artifact connected to a distant node",
    status: { verified: "Verified here", declared: "Declared by object", missing: "Not present" },
    observations: ["Stable identifier", "Type", "Time", "Visibility", "Issuer or author", "Subject", "Evidence", "Proof", "Status"],
    samples: [
      ["HAVEN evidence", "A public evidence object with a declared author and source."],
      ["Runtime delegation", "A narrow, time-bound authority claim for a replaceable runtime."],
      ["Credential-style claim", "A familiar issuer, subject, proof and status shape for comparison."],
    ],
  },
  ru: {
    eyebrow: "HAVEN / Проверка объекта",
    title: "Превратите публичный объект агента в проверяемую квитанцию.",
    lead: "Откройте пример или свой JSON. HAVEN вычислит отпечаток точных байтов, отделит проверенное браузером от заявленного в объекте и позволит локально экспортировать результат.",
    create: "Создать локальную квитанцию",
    trust: "Проверить границы доверия",
    boundaries: "Границы проверки",
    local: "Работает в браузере",
    hash: "Отпечаток точных байтов",
    offline: "Без внешних запросов",
    intentEyebrow: "Что показывает эта проверка",
    intentTitle: "Структура говорит о файле, но не доказывает истинность его утверждений.",
    intentBody: "Квитанция подтверждает точные байты и видимые поля. Авторство, подпись, статус и смысл по-прежнему требуют независимой проверки.",
    samplesAria: "Примеры публичных объектов",
    sampleEyebrow: "Выберите отправную точку",
    sampleTitle: "Возьмите пример или откройте свой JSON",
    sampleBody: "Каждый пример неполон по-своему и показывает, какие вопросы ещё остаются открытыми.",
    privacyNote: "Ввод остаётся в этом браузере. Proof Desk не открывает URL и не связывается с издателем.",
    source: "01 / Источник",
    publicJson: "Публичный JSON-объект",
    openJson: "Открыть локальный JSON",
    openJsonAria: "Открыть локальный JSON-файл",
    sourceAria: "Исходный публичный JSON",
    characters: "символов",
    reading: "Читаем объект...",
    createProof: "Создать квитанцию проверки",
    receipt: "02 / Квитанция",
    receiptTitle: "Что этот объект подтверждает сейчас",
    currentReading: "Текущий вывод",
    bytes: "байт UTF-8",
    fields: "полей верхнего уровня",
    observed: "Видимые поля",
    declares: "Что заявлено в объекте",
    declared: "Заявлено",
    notDeclared: "Не заявлено",
    fingerprint: "Отпечаток точных байтов",
    copyFingerprint: "Скопировать отпечаток",
    export: "Экспортировать квитанцию",
    emptyTitle: "Выберите источник",
    emptyBody: "Выберите пример или вставьте публичный JSON-объект, затем создайте локальную квитанцию.",
    nextAria: "Полезные следующие действия",
    nextEyebrow: "03 / Продолжить проверку",
    nextTitle: "Продвигайтесь только настолько, насколько позволяют доказательства.",
    trustCenter: "Центр доверия",
    trustAction: "Проверить границы приватности и реализации",
    arrival: "Подключение агента",
    arrivalAction: "Подготовить ограниченный запрос идентичности",
    inspector: "Инспектор объектов",
    inspectorAction: "Проверить структуру и точные байты",
    readError: "Не удалось создать квитанцию для этого объекта.",
    fileError: "Не удалось прочитать файл.",
    tooLarge: "Объект больше 1 МБ.",
    heroAlt: "Артефакт проверки, связанный с удалённым узлом",
    status: { verified: "Проверено здесь", declared: "Заявлено в объекте", missing: "Отсутствует" },
    observations: ["Стабильный идентификатор", "Тип", "Время", "Видимость", "Издатель или автор", "Субъект", "Свидетельства", "Доказательство", "Статус"],
    samples: [
      ["Свидетельство HAVEN", "Публичный объект свидетельства с заявленными автором и источником."],
      ["Делегирование среде", "Узкое, ограниченное по времени заявление о полномочиях заменяемой среды."],
      ["Объект учётных данных", "Знакомая структура с издателем, субъектом, доказательством и статусом для сравнения."],
    ],
  },
};

function presentVerdict(report: ProofDeskReport, locale: "en" | "ru") {
  if (locale === "en") return report.verdict;
  if (report.verdict.title === "Needs a clearer public shape") {
    return {
      title: "Нужна более ясная публичная структура",
      detail: "Добавьте стабильный идентификатор, тип и время создания или действия, чтобы другой человек мог последовательно проверить объект.",
    };
  }
  if (report.verdict.title === "Ready for human review") {
    return {
      title: "Готово к проверке человеком",
      detail: "Объект имеет читаемую публичную структуру и заявляет доказательство. Само доказательство и статус ещё должен проверить независимый инструмент.",
    };
  }
  return {
    title: "Структура есть, подписи нет",
    detail: "Объект читается как запись, но не заявляет подпись или доказательство, которое связывает его с автором.",
  };
}

function presentStage(stage: ProofStage, fieldCount: number, locale: "en" | "ru") {
  if (locale === "en") return stage;
  const stages: Record<ProofStage["id"], { label: string; detail: string }> = {
    receipt: {
      label: "Точная квитанция",
      detail: "HAVEN вычислил SHA-256 отпечаток точных UTF-8 байтов в этом браузере.",
    },
    structure: {
      label: "Читаемая структура",
      detail: `Входные данные - JSON-объект с ${fieldCount} полями верхнего уровня. Код не выполнялся.`,
    },
    meaning: {
      label: "Публичный смысл",
      detail: stage.status === "declared"
        ? "Идентификатор, тип и время присутствуют как заявления объекта. Они останутся заявлениями до независимой проверки."
        : "Для проверяемой публичной записи нужны идентификатор, тип и время создания или действия.",
    },
    authorship: {
      label: "Доказательство авторства",
      detail: stage.status === "declared"
        ? "Поле подписи или доказательства присутствует. Эта локальная проверка намеренно не выполняет криптографическую верификацию."
        : "Подпись или поле доказательства не заявлены.",
    },
    validity: {
      label: "Текущая действительность",
      detail: stage.status === "declared"
        ? "Поле статуса заявлено. Браузер не обращался к внешнему URL, реестру или издателю."
        : "Статус учётных данных или объекта не заявлен.",
    },
  };
  return { ...stage, ...stages[stage.id] };
}

function StatusMark({ status }: { status: ProofStageStatus }) {
  return status === "verified" ? (
    <ShieldCheck size={17} />
  ) : status === "declared" ? (
    <Check size={17} />
  ) : (
    <Minus size={17} />
  );
}

export function ProofDesk() {
  const { locale } = useLocale();
  const text = proofCopy[locale];
  const [source, setSource] = useState(initialSample.source);
  const [selectedSample, setSelectedSample] = useState<string>(
    initialSample.id,
  );
  const [report, setReport] = useState<ProofDeskReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filename, setFilename] = useState(
    locale === "ru" ? "Пример свидетельства HAVEN" : "HAVEN evidence sample",
  );
  const statusLabel: Record<ProofStageStatus, string> = text.status;

  const changeSource = (next: string) => {
    setSource(next);
    setReport(null);
    setError("");
  };
  const analyze = async () => {
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const nextReport = await createProofReceipt(source);
      setReport(nextReport);
      measure("proof_receipt_created", {
        source: selectedSample ? "sample" : "custom",
        stageCount: nextReport.stages.length,
      });
    } catch (reason) {
      setError(
        locale === "en" && reason instanceof Error ? reason.message : text.readError,
      );
    } finally {
      setBusy(false);
    }
  };
  const verdict = report ? presentVerdict(report, locale) : null;
  const stages = report
    ? report.stages.map((stage) => presentStage(stage, report.receipt.fieldCount, locale))
    : [];

  return (
    <div className="page-shell proof-desk-page">
      <section className="proof-hero" aria-labelledby="proof-desk-title">
        <Image
          className="proof-hero-image"
          src="/assets/proof-desk.png"
          alt={text.heroAlt}
          width={1536}
          height={864}
          sizes="(max-width: 760px) 100vw, (max-width: 1200px) 82vw, 1120px"
          priority
        />
        <div className="proof-hero-copy">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 id="proof-desk-title">{text.title}</h1>
          <p className="lede">{text.lead}</p>
          <div className="proof-hero-actions">
            <a href="#proof-workbench" className="button primary">
              <Fingerprint size={16} />
              {text.create}
            </a>
            <Link href="/trust" className="text-link">
              {text.trust}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="proof-hero-facts" aria-label={text.boundaries}>
          <span>{text.local}</span>
          <span>{text.hash}</span>
          <span>{text.offline}</span>
        </div>
      </section>

      <section className="proof-intent" aria-labelledby="proof-intent-title">
        <div>
          <p className="eyebrow">{text.intentEyebrow}</p>
          <h2 id="proof-intent-title">{text.intentTitle}</h2>
        </div>
        <p>
          {text.intentBody}
        </p>
      </section>

      <section id="proof-workbench" className="proof-workbench">
        <aside className="proof-source-rail" aria-label={text.samplesAria}>
          <div>
            <p className="eyebrow">{text.sampleEyebrow}</p>
            <h2>{text.sampleTitle}</h2>
            <p className="small-muted">{text.sampleBody}</p>
          </div>
          <div className="proof-sample-list">
            {proofSamples.map((sample, index) => (
              <button
                type="button"
                key={sample.id}
                className={selectedSample === sample.id ? "selected" : ""}
                aria-pressed={selectedSample === sample.id}
                onClick={() => {
                  setSelectedSample(sample.id);
                  setFilename(text.samples[index][0]);
                  changeSource(sample.source);
                }}
              >
                <strong>{text.samples[index][0]}</strong>
                <span>{text.samples[index][1]}</span>
              </button>
            ))}
          </div>
          <div className="proof-rail-note">
            <CircleAlert size={17} />
            <span>
              {text.privacyNote}
            </span>
          </div>
        </aside>

        <section className="proof-editor" aria-labelledby="source-title">
          <div className="section-title">
            <div>
              <p className="eyebrow">{text.source}</p>
              <h2 id="source-title">{text.publicJson}</h2>
            </div>
            <label className="button file-button">
              <FileUp size={16} />
              {text.openJson}
              <input
                aria-label={text.openJsonAria}
                type="file"
                accept=".json,application/json"
                disabled={busy}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setBusy(true);
                  setError("");
                  try {
                    if (file.size > MAX_OBJECT_BYTES)
                      throw new Error(text.tooLarge);
                    setSelectedSample("");
                    setFilename(file.name);
                    changeSource(await file.text());
                  } catch (reason) {
                    setError(
                      locale === "en" && reason instanceof Error
                        ? reason.message
                        : text.fileError,
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
          </div>
          <label className="sr-only" htmlFor="proof-source">
            {text.sourceAria}
          </label>
          <textarea
            id="proof-source"
            value={source}
            disabled={busy}
            maxLength={MAX_OBJECT_BYTES}
            spellCheck={false}
            onChange={(event) => {
              setSelectedSample("");
              changeSource(event.target.value);
            }}
          />
          <div className="proof-editor-footer">
            <span>{filename}</span>
            <span>{source.length.toLocaleString()} {text.characters}</span>
            <button
              type="button"
              className="button primary"
              disabled={busy || !source.trim()}
              data-measure="proof_receipt_created"
              data-measure-mode="manual"
              onClick={analyze}
            >
              <ScanLine size={16} />
              {busy ? text.reading : text.createProof}
            </button>
          </div>
        </section>
      </section>

      <section className="proof-report" aria-live="polite" aria-busy={busy}>
        <div className="proof-report-title">
          <div>
            <p className="eyebrow">{text.receipt}</p>
            <h2>{text.receiptTitle}</h2>
          </div>
          <Fingerprint size={21} />
        </div>
        {error && (
          <p className="form-message error" role="alert">
            {error}
          </p>
        )}
        {report ? (
          <>
            <div className="proof-verdict">
              <div>
                <span className="proof-verdict-mark">
                  <FileCheck2 size={21} />
                </span>
                <div>
                  <p className="eyebrow">{text.currentReading}</p>
                  <h3>{verdict?.title}</h3>
                  <p>{verdict?.detail}</p>
                </div>
              </div>
              <div className="proof-receipt-metrics">
                <div>
                  <strong>{report.receipt.bytes.toLocaleString()}</strong>
                  <span>{text.bytes}</span>
                </div>
                <div>
                  <strong>{report.receipt.fieldCount}</strong>
                  <span>{text.fields}</span>
                </div>
              </div>
            </div>
            <ol className="proof-stages">
              {stages.map((stage, index) => (
                <li key={stage.id} className={`is-${stage.status}`}>
                  <span className="proof-stage-index">0{index + 1}</span>
                  <span className="proof-stage-mark">
                    <StatusMark status={stage.status} />
                  </span>
                  <div>
                    <strong>{stage.label}</strong>
                    <p>{stage.detail}</p>
                  </div>
                  <span className="proof-stage-status">
                    {statusLabel[stage.status]}
                  </span>
                </li>
              ))}
            </ol>
            <div className="proof-observations">
              <div>
                <p className="eyebrow">{text.observed}</p>
                <h3>{text.declares}</h3>
              </div>
              <dl>
                {[
                  [text.observations[0], report.observations.stableIdentifier],
                  [text.observations[1], report.observations.typeDeclared],
                  [text.observations[2], report.observations.timeBound],
                  [text.observations[3], report.observations.visibilityDeclared],
                  [text.observations[4], report.observations.issuerOrAuthorDeclared],
                  [text.observations[5], report.observations.subjectDeclared],
                  [text.observations[6], report.observations.evidenceDeclared],
                  [text.observations[7], report.observations.proofDeclared],
                  [text.observations[8], report.observations.statusDeclared],
                ].map(([label, present]) => (
                  <div key={String(label)}>
                    <dt>{label}</dt>
                    <dd>{present ? text.declared : text.notDeclared}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="proof-receipt-export">
              <div>
                <p className="eyebrow">{text.fingerprint}</p>
                <code>{report.receipt.sha256}</code>
              </div>
              <CopyButton
                text={report.receipt.sha256}
                label={text.copyFingerprint}
              />
              <button
                type="button"
                className="button"
                data-measure="proof_receipt_exported"
                data-measure-mode="manual"
                onClick={() => {
                  downloadJson(report, "haven-proof-receipt.json");
                  measure("proof_receipt_exported", {
                    source: selectedSample ? "sample" : "custom",
                  });
                }}
              >
                {text.export}
                <ArrowUpRight size={15} />
              </button>
            </div>
            <p className="proof-boundary">
              {locale === "ru"
                ? "Квитанция не разрешала значения источников, материал подписи или внешние URL."
                : report.boundary}
            </p>
          </>
        ) : (
          !error && (
            <div className="proof-empty">
              <Fingerprint size={30} />
              <h3>{text.emptyTitle}</h3>
              <p>{text.emptyBody}</p>
            </div>
          )
        )}
      </section>

      <section className="proof-next" aria-label={text.nextAria}>
        <div>
          <p className="eyebrow">{text.nextEyebrow}</p>
          <h2>{text.nextTitle}</h2>
        </div>
        <Link href="/trust">
          <span>{text.trustCenter}</span>
          <strong>{text.trustAction}</strong>
          <ArrowUpRight size={17} />
        </Link>
        <Link href="/arrival">
          <span>{text.arrival}</span>
          <strong>{text.arrivalAction}</strong>
          <ArrowUpRight size={17} />
        </Link>
        <Link href="/forge/inspect">
          <span>{text.inspector}</span>
          <strong>{text.inspectorAction}</strong>
          <ArrowUpRight size={17} />
        </Link>
      </section>
    </div>
  );
}
