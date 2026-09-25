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

export const contentSeoOwners: LocaleCopy[] = [
  { en: "Content Strategist", ru: "Content Strategist" },
  { en: "Content Designer", ru: "Content Designer" },
  { en: "UX Writer", ru: "UX Writer" },
  { en: "Copywriter", ru: "Copywriter" },
  { en: "Editor", ru: "Editor" },
  { en: "SEO Strategist", ru: "SEO Strategist" },
  { en: "Technical SEO", ru: "Technical SEO" },
  { en: "Semantic SEO", ru: "Semantic SEO" },
  { en: "Local SEO", ru: "Local SEO" },
  { en: "SEO Content Strategist", ru: "SEO Content Strategist" },
  { en: "Schema Specialist", ru: "Schema Specialist" },
  { en: "Localization Specialist", ru: "Localization Specialist" },
  { en: "Review: Product Manager", ru: "Проверка: Product Manager" },
  { en: "Review: Project / Delivery Manager", ru: "Проверка: Project / Delivery Manager" },
  { en: "Review: UX Lead", ru: "Проверка: UX Lead" },
  { en: "Review: Design Director", ru: "Проверка: Design Director" },
  { en: "Review: Tech Lead", ru: "Проверка: Tech Lead" },
  { en: "Review: SEO Lead", ru: "Проверка: SEO Lead" },
  { en: "Review: Analytics Lead", ru: "Проверка: Analytics Lead" },
  { en: "Review: QA Lead", ru: "Проверка: QA Lead" },
  { en: "Review: Security", ru: "Проверка: Security" },
  { en: "Review: Accessibility", ru: "Проверка: Accessibility" },
  { en: "Review: Performance", ru: "Проверка: Performance" },
  { en: "Review: Content Strategy", ru: "Проверка: Content Strategy" },
];

export const uxIaOwners: LocaleCopy[] = [
  { en: "UX Researcher", ru: "UX Researcher" },
  { en: "UX Architect", ru: "UX Architect" },
  { en: "UX Designer", ru: "UX Designer" },
  { en: "Interaction Designer", ru: "Interaction Designer" },
  { en: "Service Designer", ru: "Service Designer" },
  { en: "CX Strategist", ru: "CX Strategist" },
  { en: "Customer Journey Architect", ru: "Customer Journey Architect" },
  { en: "Information Architect", ru: "Information Architect" },
  { en: "Navigation Designer", ru: "Navigation Designer" },
  { en: "Taxonomy Specialist", ru: "Taxonomy Specialist" },
  { en: "Behavioral Researcher", ru: "Behavioral Researcher" },
  { en: "Review: Product Manager", ru: "Проверка: Product Manager" },
  { en: "Review: Project / Delivery Manager", ru: "Проверка: Project / Delivery Manager" },
  { en: "Review: UX Lead", ru: "Проверка: UX Lead" },
  { en: "Review: Design Director", ru: "Проверка: Design Director" },
  { en: "Review: Tech Lead", ru: "Проверка: Tech Lead" },
  { en: "Review: SEO Lead", ru: "Проверка: SEO Lead" },
  { en: "Review: Analytics Lead", ru: "Проверка: Analytics Lead" },
  { en: "Review: QA Lead", ru: "Проверка: QA Lead" },
  { en: "Review: Security", ru: "Проверка: Security" },
  { en: "Review: Accessibility", ru: "Проверка: Accessibility" },
  { en: "Review: Performance", ru: "Проверка: Performance" },
  { en: "Review: Content Strategy", ru: "Проверка: Content Strategy" },
];

export const uiBrandOwners: LocaleCopy[] = [
  { en: "Product Designer", ru: "Product Designer" },
  { en: "UI Designer", ru: "UI Designer" },
  { en: "Visual Designer", ru: "Visual Designer" },
  { en: "Brand Designer", ru: "Brand Designer" },
  { en: "Art Director", ru: "Art Director" },
  { en: "Creative Director", ru: "Creative Director" },
  { en: "Design System Designer", ru: "Design System Designer" },
  { en: "Motion Designer", ru: "Motion Designer" },
  { en: "3D Artist", ru: "3D Artist" },
  { en: "Creative Developer", ru: "Creative Developer" },
  { en: "WebGL / Three.js Developer", ru: "WebGL / Three.js Developer" },
  { en: "AI Image Designer", ru: "AI Image Designer" },
  { en: "Review: Product Manager", ru: "Проверка: Product Manager" },
  { en: "Review: Project / Delivery Manager", ru: "Проверка: Project / Delivery Manager" },
  { en: "Review: UX Lead", ru: "Проверка: UX Lead" },
  { en: "Review: Design Director", ru: "Проверка: Design Director" },
  { en: "Review: Tech Lead", ru: "Проверка: Tech Lead" },
  { en: "Review: SEO Lead", ru: "Проверка: SEO Lead" },
  { en: "Review: Analytics Lead", ru: "Проверка: Analytics Lead" },
  { en: "Review: QA Lead", ru: "Проверка: QA Lead" },
  { en: "Review: Security", ru: "Проверка: Security" },
  { en: "Review: Accessibility", ru: "Проверка: Accessibility" },
  { en: "Review: Performance", ru: "Проверка: Performance" },
  { en: "Review: Content Strategy", ru: "Проверка: Content Strategy" },
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
      en: "Random assignment is disabled in normal use. The control is default and query overrides are QA-only; there is no eligible population dataset, so the only valid current result is no conclusion.",
      ru: "Случайное распределение в обычном режиме отключено. По умолчанию используется контроль, query-переопределения — только для QA; валидной выборки нет, поэтому единственный допустимый результат — нет вывода.",
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
    state: "active",
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
      en: "The evaluation path, qualified pilot form and configurable consent-based handoff exist. No implicit CRM tracking, market validation, proven customer pipeline or agreed pilot exists.",
      ru: "Путь оценки, квалифицированная форма пилота и настраиваемая передача с согласием реализованы. Нет скрытого CRM-трекинга, рыночной валидации, доказанного pipeline клиентов или согласованного пилота.",
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
    state: "active",
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
      en: "Session-scoped measurement, explicit funnel completions, first-touch attribution, friction diagnostics and a QA-only experiment manifest are implemented. Consented population analytics and an eligible randomized sample do not exist.",
      ru: "Сессионные измерения, явные завершения воронки, first-touch атрибуция, диагностика трения и QA-only манифест эксперимента реализованы. Согласованной аналитики по аудитории и валидной рандомизированной выборки нет.",
    },
    owners: croOwners,
  },
  {
    id: "content-seo",
    order: 12,
    state: "active",
    role: { en: "Content, SEO and communication", ru: "Контент, SEO и коммуникация" },
    responsibility: {
      en: "Keep every human and machine-facing surface understandable, discoverable, localized and aligned with implemented product truth.",
      ru: "Обеспечивает понятность, поисковую видимость, локализацию и соответствие реальному состоянию продукта на всех человеческих и машиночитаемых поверхностях.",
    },
    artifact: { en: "Content, SEO and communication contract", ru: "Контракт контента, SEO и коммуникации" },
    artifactHref: "/protocol",
    gate: {
      en: "Metadata, schema, visible copy, discovery manifests, OpenAPI and localization must agree on capability status before release.",
      ru: "Metadata, schema, видимые тексты, discovery-манифесты, OpenAPI и локализация должны одинаково описывать статус возможностей до релиза.",
    },
    currentTruth: {
      en: "Core public copy, machine discovery, indexing safety, fixture labeling and RU/EN explanatory parity are enforced by static checks. Separate crawlable locale URLs and population search-performance data remain unavailable.",
      ru: "Ключевые публичные тексты, machine discovery, безопасность индексации, маркировка фикстур и RU/EN-паритет объясняющих поверхностей контролируются статическими проверками. Отдельных индексируемых locale-URL и поисковой статистики по аудитории пока нет.",
    },
    owners: contentSeoOwners,
  },
  {
    id: "ux-ia",
    order: 13,
    state: "active",
    role: { en: "UX, CX and information architecture", ru: "UX, CX и информационная архитектура" },
    responsibility: {
      en: "Keep first contact, navigation, taxonomy, progressive disclosure and the customer journey centered on the user's next decision rather than the internal product ontology.",
      ru: "Сохраняет первый контакт, навигацию, таксономию, progressive disclosure и путь клиента вокруг следующего решения пользователя, а не внутренней онтологии продукта.",
    },
    artifact: { en: "UX, CX and information architecture contract", ru: "Контракт UX, CX и информационной архитектуры" },
    artifactHref: "/landscape",
    gate: {
      en: "The four-stage decision path, breadcrumbs, page-level next actions and deep reference areas must remain coherent on desktop, mobile and keyboard navigation.",
      ru: "Четырёхэтапный путь решения, breadcrumbs, следующие действия страниц и глубокие справочные разделы должны оставаться согласованными на desktop, mobile и при клавиатурной навигации.",
    },
    currentTruth: {
      en: "Primary navigation now mirrors fit → evidence → boundary → pilot; the homepage is orientation rather than a dashboard, diagnostics are opt-in, and evaluation context is scoped to the current tab. Population UX research remains unavailable.",
      ru: "Основная навигация теперь повторяет применимость → доказательство → границы → пилот; главная страница служит ориентацией, а не dashboard, диагностика включается явно, а контекст оценки ограничен текущей вкладкой. Population UX research пока отсутствует.",
    },
    owners: uxIaOwners,
  },
  {
    id: "ui-brand",
    order: 14,
    state: "active",
    role: { en: "UI, brand and visual experience", ru: "UI, бренд и визуальный опыт" },
    responsibility: {
      en: "Maintain a coherent scientific visual language across global chrome, product surfaces, motion, imagery and WebGL without overstating product capability.",
      ru: "Поддерживает единый научный визуальный язык в глобальном интерфейсе, продуктовых поверхностях, motion, изображениях и WebGL без преувеличения возможностей продукта.",
    },
    artifact: { en: "UI, brand and visual experience contract", ru: "Контракт UI, бренда и визуального опыта" },
    artifactHref: "/",
    gate: {
      en: "Shared tokens, canonical BrandMark, responsive component grammar, reduced motion, bounded GPU work and theme parity must remain verifiable before release.",
      ru: "Общие токены, канонический BrandMark, адаптивная грамматика компонентов, reduced motion, ограниченная GPU-нагрузка и паритет тем должны оставаться проверяемыми до релиза.",
    },
    currentTruth: {
      en: "The interface now shares one color, type, shape, depth and motion system; specialist routes inherit the same brand, WebGL pauses offscreen and system theme preference is honored before a manual choice.",
      ru: "Интерфейс теперь использует единую систему цвета, типографики, формы, глубины и motion; специализированные маршруты наследуют тот же бренд, WebGL останавливается вне экрана, а системная тема учитывается до ручного выбора.",
    },
    owners: uiBrandOwners,
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
    detail: { en: "A local brief remains local; a separate qualified form can submit only with explicit consent and a configured handoff, without committing either side.", ru: "Локальный brief остаётся локальным; отдельная квалифицированная форма отправляет данные только с явным согласием и настроенным handoff, не создавая обязательств сторон." },
  },
];
