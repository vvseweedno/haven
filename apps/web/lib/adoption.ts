export type AdoptionLocale = "en" | "ru";

export type AdoptionCopy = Record<AdoptionLocale, string>;

export type EvaluationCriterion = {
  dimension: AdoptionCopy;
  fit: AdoptionCopy;
  noFit: AdoptionCopy;
};

export type EvaluationStep = {
  stage: AdoptionCopy;
  owner: AdoptionCopy;
  decision: AdoptionCopy;
  evidence: AdoptionCopy;
  href: string;
};

export type ReadinessCheck = {
  id: string;
  state: "available" | "required";
  label: AdoptionCopy;
  evidence: AdoptionCopy;
};

export type FunnelStage = {
  id: "orient" | "verify" | "bound" | "prepare" | "contact";
  label: AdoptionCopy;
  ctaEvent: string;
  entryEvent: string;
  completionEvent: string;
  denominator: AdoptionCopy;
  dropOff: AdoptionCopy;
  evidence: AdoptionCopy;
};

export type AttributionRule = {
  id: string;
  rule: AdoptionCopy;
  reason: AdoptionCopy;
};

export const funnelStages: FunnelStage[] = [
  {
    id: "orient",
    label: { en: "Orient", ru: "Ориентация" },
    ctaEvent: "orientation_opened",
    entryEvent: "evaluation_path_viewed",
    completionEvent: "orientation_opened",
    denominator: {
      en: "Local sessions that rendered the qualified evaluation path.",
      ru: "Локальные сессии, в которых показан путь квалифицированной оценки.",
    },
    dropOff: {
      en: "No orientation route opened in the same local session.",
      ru: "Маршрут ориентации не открыт в той же локальной сессии.",
    },
    evidence: { en: "Route intent only", ru: "Только намерение перейти" },
  },
  {
    id: "verify",
    label: { en: "Verify", ru: "Проверка" },
    ctaEvent: "proof_desk_opened",
    entryEvent: "proof_desk_opened",
    completionEvent: "proof_receipt_exported",
    denominator: {
      en: "Local sessions that opened Proof Desk from an instrumented evaluation CTA.",
      ru: "Локальные сессии, открывшие Proof Desk через измеряемый CTA оценки.",
    },
    dropOff: {
      en: "Proof Desk opened but no receipt exported in that session.",
      ru: "Proof Desk открыт, но receipt не экспортирован в этой сессии.",
    },
    evidence: { en: "Exported local receipt", ru: "Экспортированный локальный receipt" },
  },
  {
    id: "bound",
    label: { en: "Bound", ru: "Границы" },
    ctaEvent: "trust_boundary_opened",
    entryEvent: "trust_boundary_opened",
    completionEvent: "boundary_evidence_reviewed",
    denominator: {
      en: "Local sessions that opened the trust boundary from the evaluation path.",
      ru: "Локальные сессии, открывшие границу доверия из пути оценки.",
    },
    dropOff: {
      en: "Trust boundary opened without reaching its machine-readable evidence.",
      ru: "Граница доверия открыта без перехода к машиночитаемому доказательству.",
    },
    evidence: { en: "Contract inspected", ru: "Контракт проверен" },
  },
  {
    id: "prepare",
    label: { en: "Prepare", ru: "Подготовка" },
    ctaEvent: "pilot_readiness_viewed",
    entryEvent: "pilot_readiness_viewed",
    completionEvent: "pilot_brief_exported",
    denominator: {
      en: "Local sessions that rendered the pilot-readiness checklist.",
      ru: "Локальные сессии, в которых показан checklist готовности к пилоту.",
    },
    dropOff: {
      en: "Readiness viewed but no analysis brief exported in that session.",
      ru: "Готовность просмотрена, но analysis brief не экспортирован в этой сессии.",
    },
    evidence: { en: "Qualified local pilot brief", ru: "Квалифицированный локальный pilot brief" },
  },
  {
    id: "contact",
    label: { en: "Contact", ru: "Контакт" },
    ctaEvent: "pilot_request_opened",
    entryEvent: "pilot_request_opened",
    completionEvent: "pilot_request_submitted",
    denominator: {
      en: "Sessions that opened the qualified pilot handoff after reviewing readiness.",
      ru: "Сессии, открывшие квалифицированную передачу пилота после проверки готовности.",
    },
    dropOff: {
      en: "Pilot handoff opened but no explicit consented submission was accepted.",
      ru: "Передача пилота открыта, но явная согласованная отправка не была принята.",
    },
    evidence: {
      en: "Accepted consent-based pilot request",
      ru: "Принятый запрос на пилот с явным согласием",
    },
  },
];

export const attributionRules: AttributionRule[] = [
  {
    id: "session-first-touch",
    rule: {
      en: "Preserve the first known source and campaign for one browser session; never overwrite it with internal navigation.",
      ru: "Сохранять первый известный источник и кампанию в рамках одной браузерной сессии; не перезаписывать внутренними переходами.",
    },
    reason: { en: "Keeps acquisition intent distinct from product navigation.", ru: "Отделяет источник привлечения от навигации внутри продукта." },
  },
  {
    id: "direct-is-unknown",
    rule: {
      en: "Treat missing source parameters as unknown/direct, never infer a channel from persona or route.",
      ru: "Считать отсутствие параметров источника unknown/direct и не выводить канал из персоны или маршрута.",
    },
    reason: { en: "Prevents invented attribution.", ru: "Предотвращает выдуманную атрибуцию." },
  },
  {
    id: "no-cross-device",
    rule: {
      en: "Do not join sessions, people or devices without explicit consent and a future identity layer.",
      ru: "Не объединять сессии, людей и устройства без явного согласия и будущего слоя identity.",
    },
    reason: { en: "Matches the local-only privacy boundary.", ru: "Соответствует локальной границе приватности." },
  },
  {
    id: "evidence-before-credit",
    rule: {
      en: "Credit a funnel completion only to its explicit completion event, not a page view or elapsed time.",
      ru: "Засчитывать завершение этапа только по явному completion event, а не по просмотру страницы или времени.",
    },
    reason: { en: "Connects conversion to inspectable evidence.", ru: "Связывает конверсию с проверяемым доказательством." },
  },
];

export const evaluationCriteria: EvaluationCriterion[] = [
  {
    dimension: { en: "Continuity problem", ru: "Проблема непрерывности" },
    fit: {
      en: "A long-lived agent or research workflow needs inspectable identity, provenance and public history.",
      ru: "Долгоживущему агенту или исследовательскому процессу нужны проверяемая идентичность, происхождение и публичная история.",
    },
    noFit: {
      en: "The immediate need is a general chatbot, campaign automation or a hosted multi-user workspace.",
      ru: "Сейчас нужен обычный чат-бот, автоматизация кампаний или готовое многопользовательское облако.",
    },
  },
  {
    dimension: { en: "Authority boundary", ru: "Граница полномочий" },
    fit: {
      en: "The team wants human-governed changes, local private memory and evidence before trust.",
      ru: "Команде нужны управляемые человеком изменения, локальная приватная память и доказательства до доверия.",
    },
    noFit: {
      en: "The use case requires autonomous remote execution, silent publication or unrestricted delegation now.",
      ru: "Сценарию уже сейчас нужны автономное удалённое исполнение, скрытая публикация или неограниченное делегирование.",
    },
  },
  {
    dimension: { en: "Evaluation posture", ru: "Подход к оценке" },
    fit: {
      en: "A technical owner can test a bounded object locally and document success and stop conditions.",
      ru: "Технический владелец может локально проверить ограниченный объект и зафиксировать критерии успеха и остановки.",
    },
    noFit: {
      en: "A production SLA, SSO, compliance attestation, live federation or token economy is required before evaluation.",
      ru: "До оценки уже требуются production SLA, SSO, compliance-аттестация, живая федерация или токен-экономика.",
    },
  },
];

export const evaluationPath: EvaluationStep[] = [
  {
    stage: { en: "01 / Orient", ru: "01 / Ориентироваться" },
    owner: { en: "Sponsor", ru: "Заказчик" },
    decision: {
      en: "Is agent continuity or provenance important enough to evaluate?",
      ru: "Достаточно ли важна непрерывность агента или происхождение данных, чтобы начать оценку?",
    },
    evidence: {
      en: "Review the working graph and the explicit prototype boundary.",
      ru: "Изучите рабочий граф и явно обозначенную границу прототипа.",
    },
    href: "/observatory",
  },
  {
    stage: { en: "02 / Verify", ru: "02 / Проверить" },
    owner: { en: "Technical lead", ru: "Технический лидер" },
    decision: {
      en: "Can the browser produce useful evidence without trusting product claims?",
      ru: "Может ли браузер получить полезные доказательства без доверия заявлениям продукта?",
    },
    evidence: {
      en: "Inspect one public object and export a local proof receipt.",
      ru: "Проверьте один публичный объект и экспортируйте локальную proof receipt.",
    },
    href: "/proof-desk",
  },
  {
    stage: { en: "03 / Bound", ru: "03 / Ограничить" },
    owner: { en: "Buyer + security", ru: "Закупщик + безопасность" },
    decision: {
      en: "Are data classes, authority, integration limits and absent capabilities acceptable?",
      ru: "Приемлемы ли классы данных, полномочия, интеграционные пределы и отсутствующие возможности?",
    },
    evidence: {
      en: "Use the trust ledger and machine-readable contracts; do not infer a live service.",
      ru: "Используйте trust ledger и машиночитаемые контракты; не предполагайте наличие живого сервиса.",
    },
    href: "/trust",
  },
  {
    stage: { en: "04 / Prepare", ru: "04 / Подготовить" },
    owner: { en: "Joint evaluation team", ru: "Совместная команда оценки" },
    decision: {
      en: "Is there a bounded design-partner pilot worth discussing?",
      ru: "Есть ли ограниченный design-partner пилот, который стоит обсуждать?",
    },
    evidence: {
      en: "Complete the local checklist and export a pilot brief; nothing is submitted.",
      ru: "Заполните локальный checklist и экспортируйте pilot brief; ничего не отправляется.",
    },
    href: "/delivery",
  },
  {
    stage: { en: "05 / Contact", ru: "05 / Контакт" },
    owner: { en: "Buyer + HAVEN operator", ru: "Заказчик + оператор HAVEN" },
    decision: {
      en: "Should this qualified pilot request enter a human sales conversation?",
      ru: "Должен ли этот квалифицированный запрос на пилот перейти в человеческое обсуждение?",
    },
    evidence: {
      en: "Submit only the contact and qualification data explicitly entered with consent.",
      ru: "Отправляйте только явно введённые контактные и квалификационные данные с согласием.",
    },
    href: "/pilot",
  },
];

export const pilotReadiness: ReadinessCheck[] = [
  {
    id: "evidence",
    state: "available",
    label: { en: "Local evidence path", ru: "Локальный путь доказательств" },
    evidence: {
      en: "Fixtures, discovery contracts and Proof Desk receipts can be inspected now.",
      ru: "Фикстуры, discovery-контракты и receipts Proof Desk уже можно проверить.",
    },
  },
  {
    id: "boundary",
    state: "available",
    label: { en: "Prototype boundary", ru: "Граница прототипа" },
    evidence: {
      en: "Local writes, absent remote execution and deferred identity proof are explicit.",
      ru: "Локальные записи, отсутствие удалённого исполнения и отложенная проверка identity обозначены явно.",
    },
  },
  {
    id: "use-case",
    state: "required",
    label: { en: "Bounded use case", ru: "Ограниченный сценарий" },
    evidence: {
      en: "Name one workflow, one evidence object and the decision the pilot should improve.",
      ru: "Назовите один процесс, один объект доказательства и решение, которое должен улучшить пилот.",
    },
  },
  {
    id: "owners",
    state: "required",
    label: { en: "Accountable owners", ru: "Ответственные владельцы" },
    evidence: {
      en: "A sponsor, technical lead and data or security owner must be named.",
      ru: "Должны быть названы заказчик, технический лидер и владелец данных или безопасности.",
    },
  },
  {
    id: "decision",
    state: "required",
    label: { en: "Success and stop conditions", ru: "Успех и условия остановки" },
    evidence: {
      en: "Agree on observable evidence, review date and reasons to stop before integration.",
      ru: "До интеграции согласуйте наблюдаемые доказательства, дату ревью и причины остановки.",
    },
  },
  {
    id: "procurement",
    state: "required",
    label: { en: "Procurement constraints", ru: "Ограничения закупки" },
    evidence: {
      en: "Surface hosting, data residency, security review and contracting needs early.",
      ru: "Заранее обозначьте требования к хостингу, размещению данных, security review и договору.",
    },
  },
];

export const pilotQuestions = {
  buyer: {
    title: { en: "Buyer / sponsor", ru: "Закупщик / заказчик" },
    questions: [
      {
        en: "Which operational or governance decision should become more trustworthy?",
        ru: "Какое операционное или управленческое решение должно стать более надёжным?",
      },
      {
        en: "Who owns the outcome, the security review and the right to stop?",
        ru: "Кто отвечает за результат, security review и право остановить работу?",
      },
      {
        en: "Which procurement, hosting or data-residency constraint could prevent a pilot?",
        ru: "Какое ограничение закупки, хостинга или размещения данных может помешать пилоту?",
      },
    ],
  },
  technicalLead: {
    title: { en: "Technical lead", ru: "Технический лидер" },
    questions: [
      {
        en: "Which identity, claim or evidence object will be evaluated first?",
        ru: "Какая identity, claim или evidence-запись будет проверяться первой?",
      },
      {
        en: "What data must remain local, and what may become public evidence?",
        ru: "Какие данные должны остаться локальными, а какие могут стать публичным доказательством?",
      },
      {
        en: "Which integration, signature, audit and rollback evidence is mandatory?",
        ru: "Какие доказательства интеграции, подписи, аудита и rollback обязательны?",
      },
    ],
  },
};

export function buildPilotBrief(locale: AdoptionLocale) {
  const localize = (value: AdoptionCopy) => value[locale];

  return {
    kind: "haven.design-partner-evaluation",
    version: "1.0",
    locale,
    status: locale === "ru" ? "локальный черновик оценки" : "local evaluation draft",
    boundary:
      locale === "ru"
        ? "Этот файл создан в браузере, никуда не отправлен и не означает согласованный пилот, цену или обязательство HAVEN."
        : "This file was created in the browser, was not submitted, and does not represent an agreed pilot, price or HAVEN commitment.",
    fitAssessment: evaluationCriteria.map((criterion) => ({
      dimension: localize(criterion.dimension),
      fitWhen: localize(criterion.fit),
      notFitWhen: localize(criterion.noFit),
      assessment: "",
    })),
    readiness: pilotReadiness.map((check) => ({
      id: check.id,
      currentState: check.state,
      criterion: localize(check.label),
      evidence: localize(check.evidence),
      owner: "",
      notes: "",
    })),
    decisionQuestions: {
      buyer: pilotQuestions.buyer.questions.map(localize),
      technicalLead: pilotQuestions.technicalLead.questions.map(localize),
    },
    proposedPilot: {
      problem: "",
      workflow: "",
      firstEvidenceObject: "",
      successEvidence: "",
      stopConditions: "",
      reviewDate: "",
    },
  };
}

export function buildAnalysisBrief(locale: AdoptionLocale) {
  const localize = (value: AdoptionCopy) => value[locale];

  return {
    kind: "haven.cro-analysis-brief",
    version: "1.0",
    locale,
    status: locale === "ru" ? "пустой локальный шаблон анализа" : "empty local analysis template",
    boundary:
      locale === "ru"
        ? "Файл создан локально и не содержит телеметрии, посетителей, конверсий, uplift или победителя эксперимента. Заполните его только наблюдаемыми данными с указанным периодом и знаменателем."
        : "This file is created locally and contains no telemetry, visitors, conversion rates, uplift or experiment winner. Populate it only with observed data that names its period and denominator.",
    funnel: funnelStages.map((stage) => ({
      id: stage.id,
      stage: localize(stage.label),
      ctaEvent: stage.ctaEvent,
      entryEvent: stage.entryEvent,
      completionEvent: stage.completionEvent,
      denominatorDefinition: localize(stage.denominator),
      dropOffDefinition: localize(stage.dropOff),
      evidence: localize(stage.evidence),
      period: "",
      eligibleSessions: null,
      completedSessions: null,
      exclusions: [],
      notes: "",
    })),
    attribution: attributionRules.map((item) => ({
      id: item.id,
      rule: localize(item.rule),
      reason: localize(item.reason),
    })),
    experiment: {
      hypothesis: "",
      primaryMetric: "",
      guardrails: [],
      unitOfRandomization: "",
      minimumDetectableEffect: null,
      requiredSampleSize: null,
      plannedDuration: "",
      stoppingRule: "",
      result: "no conclusion",
      decision: "do not ship on this template alone",
    },
  };
}
