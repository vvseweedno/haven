export type LocaleCopy = { en: string; ru: string };

export type DeliveryState = "implemented" | "active" | "next";

export type DeliveryRole = {
  id: string;
  order: number;
  state: DeliveryState;
  role: LocaleCopy;
  responsibility: LocaleCopy;
  artifact: LocaleCopy;
  artifactHref: string;
  gate: LocaleCopy;
  currentTruth: LocaleCopy;
  owners?: LocaleCopy[];
};

export type ExperimentGate = {
  id: string;
  state: "required" | "blocked";
  title: LocaleCopy;
  rule: LocaleCopy;
};

export const croOwners: LocaleCopy[] = [
  { en: "CRO Strategist", ru: "CRO Strategist" },
  { en: "Conversion Analyst", ru: "Conversion Analyst" },
  { en: "Product Analyst", ru: "Product Analyst" },
  { en: "Web Analyst", ru: "Web Analyst" },
  { en: "Marketing Analyst", ru: "Marketing Analyst" },
  { en: "Funnel Analyst", ru: "Funnel Analyst" },
  { en: "Attribution Specialist", ru: "Attribution Specialist" },
  { en: "Experimentation Specialist", ru: "Experimentation Specialist" },
  { en: "A/B Testing Specialist", ru: "A/B Testing Specialist" },
  { en: "Behavioral Analyst", ru: "Behavioral Analyst" },
];

export const experimentGates: ExperimentGate[] = [
  {
    id: "pre-register",
    state: "required",
    title: { en: "Pre-register the decision", ru: "Предварительно зафиксировать решение" },
    rule: {
      en: "Name one hypothesis, one primary metric, guardrails, eligibility, exclusions and a stopping rule before exposure.",
      ru: "До показа зафиксировать одну гипотезу, основную метрику, guardrails, eligibility, исключения и правило остановки.",
    },
  },
  {
    id: "sample",
    state: "required",
    title: { en: "Size before launch", ru: "Рассчитать выборку до запуска" },
    rule: {
      en: "Set baseline, minimum detectable effect, power, alpha and required sample size before looking at outcomes.",
      ru: "До просмотра результатов задать baseline, минимально обнаружимый эффект, power, alpha и требуемый размер выборки.",
    },
  },
  {
    id: "integrity",
    state: "required",
    title: { en: "Protect assignment integrity", ru: "Защитить целостность распределения" },
    rule: {
      en: "Use a stable randomization unit, validate exposure logging and investigate sample-ratio mismatch.",
      ru: "Использовать стабильную единицу рандомизации, проверить exposure logging и исследовать sample-ratio mismatch.",
    },
  },
  {
    id: "conclusion",
    state: "blocked",
    title: { en: "No evidence, no winner", ru: "Нет данных — нет победителя" },
    rule: {
      en: "This build records browser-local exposure and outcomes, but has no eligible population dataset. The only valid current result is no conclusion.",
      ru: "Сборка фиксирует показы и исходы локально в браузере, но не имеет валидной выборки. Единственный допустимый результат — нет вывода.",
    },
  },
];

export const deliveryRoles: DeliveryRole[] = [
  {
    id: "product",
    order: 1,
    state: "implemented",
    role: { en: "Business and product council", ru: "Бизнес- и продуктовый совет" },
    responsibility: {
      en: "Own the market problem, product value, operating model, measurable outcome and non-goals before delivery begins.",
      ru: "Владеет рыночной проблемой, ценностью продукта, операционной моделью, измеримым результатом и явными нецелями до начала поставки.",
    },
    artifact: { en: "Business and product strategy", ru: "Бизнес- и продуктовая стратегия" },
    artifactHref: "/observatory",
    gate: {
      en: "ICP, JTBD, value exchange, north-star metric, offer and prototype boundary are explicit before a release passes.",
      ru: "ICP, JTBD, обмен ценностью, north-star metric, оффер и граница прототипа должны быть явными до выпуска релиза.",
    },
    currentTruth: {
      en: "The local product model is implemented. Market validation, a paid pilot and a live network service remain unproven.",
      ru: "Локальная модель продукта реализована. Рыночная валидация, платный пилот и живая сетевая служба ещё не доказаны.",
    },
    owners: [
      { en: "CEO / sponsor", ru: "CEO / заказчик" },
      { en: "Product Owner", ru: "Product Owner" },
      { en: "Product Manager", ru: "Product Manager" },
      { en: "Business Architect", ru: "Business Architect" },
      { en: "Business Analyst", ru: "Business Analyst" },
      { en: "Product Strategist", ru: "Product Strategist" },
      { en: "Digital Strategist", ru: "Digital Strategist" },
      { en: "Brand Strategist", ru: "Brand Strategist" },
      { en: "Go-to-Market Strategist", ru: "Go-to-Market Strategist" },
      { en: "Pricing / Monetization", ru: "Pricing / Monetization" },
    ],
  },
  {
    id: "art",
    order: 2,
    state: "active",
    role: { en: "Art direction", ru: "Арт-дирекшн" },
    responsibility: {
      en: "Keep the 1-bit dither, CRM and data-mosh language coherent across routes.",
      ru: "Сохраняет язык 1-bit dither, CRM и data-mosh цельным на всех маршрутах.",
    },
    artifact: { en: "Three-signal visual system", ru: "Трёхсигнальная визуальная система" },
    artifactHref: "/atelier",
    gate: {
      en: "Sol, Tide and Signal must carry hierarchy without becoming decoration-only.",
      ru: "Sol, Tide и Signal должны нести иерархию, а не быть только декором.",
    },
    currentTruth: {
      en: "Shared tokens, type and original bitmap works now reach the primary product routes.",
      ru: "Общие токены, типографика и оригинальная растровая графика уже доходят до основных маршрутов.",
    },
  },
  {
    id: "experience",
    order: 3,
    state: "active",
    role: { en: "Experience and localization", ru: "Опыт и локализация" },
    responsibility: {
      en: "Design the human journey, accessible control states and Russian-English meaning.",
      ru: "Проектирует путь человека, доступные состояния контролов и русский-английский смысл.",
    },
    artifact: { en: "Journey and language controls", ru: "Путь и языковые контролы" },
    artifactHref: "/cabinet",
    gate: {
      en: "A person can enter, orient, consent, discuss and leave with a readable record.",
      ru: "Человек может войти, сориентироваться, дать согласие, обсудить и выйти с читаемой записью.",
    },
    currentTruth: {
      en: "New participatory surfaces are bilingual; legacy seeded research copy is still being localized.",
      ru: "Новые участнические поверхности двуязычны; старые тестовые исследовательские тексты ещё локализуются.",
    },
  },
  {
    id: "frontend",
    order: 4,
    state: "active",
    role: { en: "Frontend and WebGL", ru: "Фронтенд и WebGL" },
    responsibility: {
      en: "Make navigation, motion, WebGL and local interaction resilient on real devices.",
      ru: "Делает навигацию, motion, WebGL и локальные взаимодействия устойчивыми на реальных устройствах.",
    },
    artifact: { en: "Interactive product surfaces", ru: "Интерактивные поверхности" },
    artifactHref: "/agora",
    gate: {
      en: "No essential action depends on animation, hover or an available GPU.",
      ru: "Ни одно существенное действие не зависит от анимации, hover или доступной GPU.",
    },
    currentTruth: {
      en: "WebGL scenes have fallbacks and reduced-motion behavior; visual iteration continues.",
      ru: "WebGL-сцены имеют fallback и режим reduced motion; визуальная итерация продолжается.",
    },
  },
  {
    id: "protocol",
    order: 5,
    state: "active",
    role: { en: "Protocol, backend and data", ru: "Протокол, бэкенд и данные" },
    responsibility: {
      en: "Define durable object shapes, discovery and capability boundaries before remote execution.",
      ru: "Определяет устойчивые формы объектов, discovery и границы возможностей до удалённого исполнения.",
    },
    artifact: { en: "Public object and capability manifest", ru: "Манифест публичных объектов и возможностей" },
    artifactHref: "/protocol",
    gate: {
      en: "Every remote mutation needs an authenticated actor, explicit scope and replay-safe audit trail.",
      ru: "Каждая удалённая мутация требует аутентифицированного актора, явного scope и журнала, устойчивого к replay.",
    },
    currentTruth: {
      en: "Discovery and public reads exist. Multi-user writes and remote agent dispatch are deliberately absent.",
      ru: "Discovery и публичное чтение существуют. Многопользовательских записей и удалённого agent dispatch намеренно нет.",
    },
  },
  {
    id: "security",
    order: 6,
    state: "implemented",
    role: { en: "Security and privacy", ru: "Безопасность и приватность" },
    responsibility: {
      en: "Own threat boundaries, browser data handling and content safety constraints.",
      ru: "Владеет границами угроз, обработкой данных браузера и ограничениями безопасности контента.",
    },
    artifact: { en: "CSP and local-data boundary", ru: "CSP и граница локальных данных" },
    artifactHref: "/trust",
    gate: {
      en: "Untrusted text remains text, private notes remain encrypted and public APIs stay read-only.",
      ru: "Недоверенный текст остаётся текстом, личные заметки остаются зашифрованными, публичные API остаются read-only.",
    },
    currentTruth: {
      en: "Implemented for this local deployment. Identity proof resolution and multi-user moderation require a later service layer.",
      ru: "Сделано для этого локального развёртывания. Проверка identity и многопользовательская модерация требуют следующего сервисного слоя.",
    },
  },
  {
    id: "quality",
    order: 7,
    state: "implemented",
    role: { en: "Quality, accessibility and performance", ru: "Качество, доступность и скорость" },
    responsibility: {
      en: "Verify behavior, keyboard paths, responsive layout and production build health.",
      ru: "Проверяет поведение, клавиатурные пути, адаптивную вёрстку и здоровье production-сборки.",
    },
    artifact: { en: "UI and security verification suite", ru: "Набор UI- и security-проверок" },
    artifactHref: "/proof-desk",
    gate: {
      en: "A release cannot pass with a blank canvas, overflow, blocked keyboard path or unsafe rendered text.",
      ru: "Релиз не проходит с пустым canvas, overflow, сломанным клавиатурным путём или небезопасным отображением текста.",
    },
    currentTruth: {
      en: "Browser, discovery, security and production-build checks run locally for this release.",
      ru: "Для этого релиза локально запускаются browser-, discovery-, security- и production-build проверки.",
    },
  },
  {
    id: "operations",
    order: 8,
    state: "implemented",
    role: { en: "Operations and observability", ru: "Операции и наблюдаемость" },
    responsibility: {
      en: "Own startup, readiness, release evidence and recoverable operating state.",
      ru: "Владеет запуском, готовностью, evidence релиза и восстанавливаемым рабочим состоянием.",
    },
    artifact: { en: "Health and readiness contract", ru: "Контракт health и readiness" },
    artifactHref: "/observatory",
    gate: {
      en: "The product must state when it is ready rather than imply that a demo is a network.",
      ru: "Продукт должен сообщать о готовности, а не выдавать демо за сеть.",
    },
    currentTruth: {
      en: "Local health and readiness endpoints are available; no production telemetry vendor is configured.",
      ru: "Локальные health и readiness endpoints доступны; production-провайдер телеметрии не подключён.",
    },
  },
  {
    id: "governance",
    order: 9,
    state: "active",
    role: { en: "Governance and release", ru: "Управление и релиз" },
    responsibility: {
      en: "Make proposals, dissent, approvals and rollback ownership visible before a shared change.",
      ru: "Делает предложения, несогласие, одобрения и владение rollback видимыми до общего изменения.",
    },
    artifact: { en: "Parallel review envelope", ru: "Конверт параллельного ревью" },
    artifactHref: "/atelier",
    gate: {
      en: "Agent work may propose, never silently merge, publish or delegate.",
      ru: "Работа агента может предлагать, но не может молча merge, публиковать или делегировать.",
    },
    currentTruth: {
      en: "The local proposal queue and human merge rule are implemented; signed council workflow is next.",
      ru: "Локальная очередь предложений и правило human merge сделаны; подписанный council workflow идёт следующим.",
    },
  },
  {
    id: "growth",
    order: 10,
    state: "next",
    role: { en: "Market adoption and design-partner learning", ru: "Рыночное принятие и design-partner обучение" },
    responsibility: {
      en: "Qualify fit, make buyer and technical evidence explicit, and turn evaluation learning into accountable product decisions without surveillance.",
      ru: "Квалифицирует fit, делает доказательства для закупщика и техлида явными и превращает выводы оценки в ответственные продуктовые решения без слежки.",
    },
    artifact: { en: "Evaluator-to-pilot brief", ru: "Brief от оценки к пилоту" },
    artifactHref: "/landscape",
    gate: {
      en: "A bounded use case, accountable owners, data boundary, success evidence and stop conditions are explicit before any pilot discussion advances.",
      ru: "Ограниченный сценарий, ответственные владельцы, граница данных, доказательство успеха и условия остановки явны до продолжения обсуждения пилота.",
    },
    currentTruth: {
      en: "A local evaluation path and exportable draft exist. No form submission, CRM, pipeline, market validation, customer or agreed pilot exists.",
      ru: "Есть локальный путь оценки и экспортируемый черновик. Нет отправки формы, CRM, pipeline, рыночной валидации, клиента или согласованного пилота.",
    },
    owners: [
      { en: "CMO", ru: "CMO" },
      { en: "Marketing Strategist", ru: "Marketing Strategist" },
      { en: "Growth Manager", ru: "Growth Manager" },
      { en: "Performance Marketer", ru: "Performance Marketer" },
      { en: "Demand Generation", ru: "Demand Generation" },
      { en: "Lead Generation", ru: "Lead Generation" },
      { en: "CRM Marketer", ru: "CRM Marketer" },
      { en: "Lifecycle Marketer", ru: "Lifecycle Marketer" },
      { en: "PR", ru: "PR" },
      { en: "SMM", ru: "SMM" },
      { en: "Reputation Manager", ru: "Reputation Manager" },
      { en: "Sales Strategist", ru: "Sales Strategist" },
    ],
  },
  {
    id: "cro",
    order: 11,
    state: "next",
    role: { en: "CRO, analytics and experimentation", ru: "CRO, аналитика и эксперименты" },
    responsibility: {
      en: "Define observable funnel behavior, trustworthy denominators, attribution boundaries and experiment decisions without manufacturing certainty.",
      ru: "Определяет наблюдаемое поведение воронки, надёжные знаменатели, границы атрибуции и решения экспериментов без искусственной уверенности.",
    },
    artifact: { en: "Measurement and experiment contract", ru: "Контракт измерений и экспериментов" },
    artifactHref: "/landscape",
    gate: {
      en: "Every conversion claim names its event, eligible denominator, period and exclusions; experiments cannot declare a winner before their pre-registered decision gate.",
      ru: "Каждое утверждение о конверсии указывает событие, eligible denominator, период и исключения; эксперимент не может объявить победителя до предварительно заданного decision gate.",
    },
    currentTruth: {
      en: "The measurement contract, bounded local ledger, session assignment and blank analysis export exist. Consented population collection and an eligible experiment sample do not.",
      ru: "Контракт измерений, ограниченный локальный журнал, распределение в сессии и пустой экспорт анализа существуют. Согласованный сбор по выборке и валидная выборка эксперимента отсутствуют.",
    },
    owners: croOwners,
  },
];

export const deliveryGates = [
  {
    id: "scope",
    state: "implemented" as const,
    title: { en: "Intent is bounded", ru: "Намерение ограничено" },
    detail: { en: "Product, visual and consent boundaries are named.", ru: "Названы границы продукта, визуала и согласия." },
  },
  {
    id: "build",
    state: "implemented" as const,
    title: { en: "Build is inspectable", ru: "Сборка проверяема" },
    detail: { en: "Routes, assets, discovery and build output are exercised.", ru: "Проверяются маршруты, ассеты, discovery и результат сборки." },
  },
  {
    id: "readiness",
    state: "implemented" as const,
    title: { en: "Readiness is explicit", ru: "Готовность явна" },
    detail: { en: "Fit, ownership, data boundaries and stop conditions are checked.", ru: "Проверяются fit, владельцы, границы данных и условия остановки." },
  },
  {
    id: "release",
    state: "active" as const,
    title: { en: "Human pilot decision", ru: "Решение человека о пилоте" },
    detail: { en: "A local brief informs discussion; it never submits or commits either side.", ru: "Локальный brief помогает обсуждению, но ничего не отправляет и никого не обязывает." },
  },
];
