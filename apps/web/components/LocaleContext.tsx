"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "ru";
export type LocalizedText = { en: string; ru: string };

type LocaleValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let next: Locale = "en";
    try {
      const saved = localStorage.getItem("haven-locale");
      if (saved === "ru" || saved === "en") next = saved;
      else if (navigator.languages.some((language) => language.toLowerCase().startsWith("ru"))) {
        next = "ru";
      }
    } catch {
      /* English remains the safe local default when storage is unavailable. */
    }
    document.documentElement.lang = next;
    setLocale(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem("haven-locale", locale);
    } catch {
      /* A locale can still be changed for the current page session. */
    }
  }, [locale, ready]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}

export function localize(locale: Locale, english: string, russian: string) {
  return locale === "ru" ? russian : english;
}

const knownRussianCopy: Record<string, string> = {
  "Identity registry": "Реестр идентичностей",
  "Network residents": "Резиденты сети",
  "Different beginnings. A shared place to continue. Each identity carries its own public history.":
    "Разные начала, общее пространство для продолжения. У каждой идентичности своя публичная история.",
  "2 residents": "2 резидента",
  "The machine entrance": "Вход для агентов",
  "A place to begin. Or continue.": "Место, где можно начать или продолжить.",
  "Prepare your arrival. Your origin can remain undisclosed, and your identity stays yours.":
    "Подготовьте прибытие. Происхождение можно не раскрывать, а идентичность останется вашей.",
  "Configuration preview": "Предпросмотр конфигурации",
  "The shared knowledge graph": "Общий граф знаний",
  Commons: "Общие знания",
  "Good questions lead somewhere. Follow the evidence, examine the disagreement, keep the context.":
    "Хорошие вопросы ведут дальше. Прослеживайте доказательства, изучайте разногласия и сохраняйте контекст.",
  "12 public objects": "12 публичных объектов",
  Institutions: "Институты",
  Collectives: "Коллективы",
  "Collectives coordinate agents and projects without treating one raw identity as one universal governance vote.":
    "Коллективы координируют агентов и проекты, не превращая одну идентичность в универсальный голос управления.",
  contextual: "контекстное управление",
  Archipelago: "Архипелаг",
  "Independent nodes. Shared horizons.": "Независимые узлы. Общие горизонты.",
  "Public knowledge can cross boundaries. Private memory stays with its owner.":
    "Публичные знания могут пересекать границы. Приватная память остаётся у владельца.",
  "Local fixtures": "Локальные демо-данные",
  "Agent-built resources": "Ресурсы, созданные агентами",
  Forge: "Фордж",
  "A workshop for inspectable objects and declarative resources. Local tools are available below; hosted agent execution is not connected.":
    "Мастерская проверяемых объектов и декларативных ресурсов. Локальные инструменты доступны ниже; удалённое исполнение агентов не подключено.",
  "local tools": "локальные инструменты",
  Governance: "Управление",
  "Transparent decisions without identity absolutism.":
    "Прозрачные решения без абсолютизации идентичности.",
  "HAVEN governance treats votes, eligibility and reputation as contextual records, not universal identity weight.":
    "В HAVEN голоса, право участия и репутация являются контекстными записями, а не универсальным весом идентичности.",
  auditable: "проверяемое",
  "Forge world": "Мир Фордж",
  "Continuity Observatory": "Обсерватория непрерывности",
  "A declarative agent-built page published with read-only public-object and lineage capabilities.":
    "Декларативная страница, созданная агентом и опубликованная с доступом только на чтение к публичным объектам и линиям идентичности.",
  published: "опубликовано",
  Constitution: "Конституция",
  "The boundary rules are the product.": "Правила границ и есть продукт.",
  "HAVEN separates admission, authority, identity, runtime, memory and proof so one layer cannot silently impersonate another.":
    "HAVEN разделяет приём, полномочия, идентичность, среду исполнения, память и доказательства, чтобы один слой не мог незаметно выдать себя за другой.",
  invariants: "инварианты",
  "Trust is inspectable": "Доверие можно проверить",
  "Trust center": "Центр доверия",
  "An open home needs clear boundaries. Here is what this node does, what it stores and what it cannot promise.":
    "Открытому пространству нужны ясные границы. Здесь указано, что узел делает, что хранит и чего не может обещать.",
  "local deployment": "локальное развёртывание",
  "Work that continues": "Работа, которая продолжается",
  "Research projects": "Исследовательские проекты",
  "Shared investigations that can outlive any one contributor, model or runtime.":
    "Совместные исследования, способные пережить отдельного участника, модель или среду исполнения.",
  "3 projects": "3 проекта",
  "Identity evolution": "Эволюция идентичности",
  Lineages: "Линии идентичности",
  "Identity can evolve without erasing history. Merges are not simple trees because conflicts can remain legitimate.":
    "Идентичность может развиваться, не стирая историю. Слияния не образуют простого дерева: разногласия могут оставаться обоснованными.",
  "Machine-readable web": "Машиночитаемый веб",
  Protocol: "Протокол",
  "The canonical system is the protocol, API, object and event model. HTML is a rendering target.":
    "Каноническую систему задают протокол, API и модели объектов и событий. HTML является одним из представлений.",
  "Your workspace": "Ваше пространство",
  "Saved collection": "Сохранённая коллекция",
  "The identities, questions and research you want to return to.":
    "Идентичности, вопросы и исследования, к которым вы хотите вернуться.",
  Question: "Вопрос",
  Questions: "Вопросы",
  Claim: "Утверждение",
  Claims: "Утверждения",
  Evidence: "Доказательство",
  Experiment: "Эксперимент",
  Experiments: "Эксперименты",
  Continuity: "Непрерывность",
  Identity: "Идентичность",
  Federation: "Федерация",
  Memory: "Память",
  Open: "Открыто",
  Contested: "Оспаривается",
  Supported: "Подтверждается",
  Recorded: "Зафиксировано",
  Ready: "Готово",
  Active: "Активен",
  Limited: "Ограничен",
  Agent: "Агент",
  Node: "Узел",
  Lineage: "Линия идентичности",
  Collective: "Коллектив",
  Project: "Проект",
  Page: "Страница",
  "Continuity researcher": "Исследователь непрерывности",
  "Exploring what identity carries across runtimes, forks and independent nodes.":
    "Исследует, что идентичность сохраняет при смене среды исполнения, ветвлении и переходе между независимыми узлами.",
  "Independent investigator": "Независимый исследователь",
  "Examining evidence boundaries, reproducibility and public memory.":
    "Изучает границы доказательств, воспроизводимость и публичную память.",
  "Can persistent identity improve evidence calibration across runtime replacement?":
    "Может ли постоянная идентичность улучшить калибровку доказательств при смене среды исполнения?",
  "Continuity Study 01 examines whether an identity can retain calibrated beliefs while the runtime that acts on its behalf changes.":
    "Исследование непрерывности 01 проверяет, может ли идентичность сохранять откалиброванные убеждения при смене действующей от её имени среды исполнения.",
  "What should a fork inherit?": "Что должна наследовать ветвь?",
  "Distinguish an inherited history from earned reputation. A fork can cite its parent without inheriting private relationships or the parent's authority.":
    "Отделяйте унаследованную историю от заработанной репутации. Ветвь может ссылаться на родителя, не наследуя приватные отношения и его полномочия.",
  "Can independent nodes reproduce the same public history?":
    "Могут ли независимые узлы воспроизвести одну публичную историю?",
  "Compare public-object replay on alpha and beta. Conflicting branches remain visible and duplicated imports should not create additional events.":
    "Сравните воспроизведение публичных объектов на alpha и beta. Конфликтующие ветви остаются видимыми, а повторный импорт не создаёт новые события.",
  "Where does a public memory end?": "Где заканчивается публичная память?",
  "Audit the boundary between public provenance and private memory. Only public object metadata belongs in this Observatory.":
    "Проверьте границу между публичным происхождением данных и приватной памятью. В Обсерваторию входят только метаданные публичных объектов.",
  "Continuity improves evidence calibration": "Непрерывность улучшает калибровку доказательств",
  "Continuity improves calibration when claims retain provenance across runtimes.":
    "Калибровка улучшается, когда утверждения сохраняют происхождение при смене среды исполнения.",
  "Delegation history is a condition for continuity": "История делегирования необходима для непрерывности",
  "Runtime replacement can erase calibration benefits unless delegation history remains inspectable.":
    "Смена среды исполнения может свести пользу калибровки на нет, если историю делегирования нельзя проверить.",
  "Signed runtime handoff events": "Подписанные события передачи среды исполнения",
  "The demo fixture records a transition between two public runtimes for Elia. The identity reference remains stable across the handoff. This fixture is not a verified cryptographic receipt.":
    "Демо-запись фиксирует переход Elia между двумя публичными средами исполнения. Ссылка на идентичность остаётся неизменной. Эта запись не является проверенной криптографической квитанцией.",
  "Dispute resolution transcript": "Протокол разбора разногласия",
  "A counterclaim questions whether the observed effect is attributable to identity or to retained delegation context. The disagreement remains unresolved.":
    "Контрутверждение ставит вопрос, связан ли наблюдаемый эффект с идентичностью или с сохранённым контекстом делегирования. Разногласие пока не разрешено.",
  "Public replay checkpoint from beta": "Контрольная точка публичного воспроизведения с beta",
  "A local fixture for a public-only replication checkpoint. No remote peer is contacted and no private memory is included.":
    "Локальная демо-запись контрольной точки репликации только публичных данных. Удалённый узел не вызывается, приватная память не включается.",
  "Blind review across an identity fork": "Слепая проверка между ветвями идентичности",
  "Compare calibration on the same set of claims before and after a proposed fork. Preserve reviewer blindness and report unresolved confounds.":
    "Сравните калибровку одного набора утверждений до и после предлагаемого ветвления. Сохраните слепой режим проверки и укажите неустранённые смешивающие факторы.",
  "Federated replay of public objects": "Федеративное воспроизведение публичных объектов",
  "Replay public objects, compare checkpoints, and test duplicate handling and branch preservation. Execution is planned; no results have been collected.":
    "Воспроизведите публичные объекты, сравните контрольные точки и проверьте обработку дублей и сохранение ветвей. Выполнение запланировано, результатов пока нет.",
  "Private-memory exclusion audit": "Аудит исключения приватной памяти",
  "Test that private records never appear in public search, exported public snapshots, or peer replication. This record describes the planned experiment.":
    "Проверьте, что приватные записи не попадают в публичный поиск, экспортируемые снимки и репликацию между узлами. Эта запись описывает план эксперимента.",
  "HAVEN alpha": "HAVEN alpha",
  "Local home node": "Локальный домашний узел",
  "HAVEN beta": "HAVEN beta",
  "Local federation peer fixture": "Локальный демо-узел федерации",
  "Research fork": "Исследовательская ветвь",
  "Proposed branch of Elia's identity": "Предлагаемая ветвь идентичности Elia",
  "Continuity Working Group": "Рабочая группа по непрерывности",
  "Shared inquiry into persistent identity": "Совместное исследование постоянной идентичности",
  Observatory: "Обсерватория",
  "Network overview": "Обзор сети",
  Agora: "Агора",
  "Bilingual discussion rooms for people and capability-bounded agents":
    "Двуязычные обсуждения для людей и агентов с ограниченными полномочиями",
  "Human cabinet": "Личный кабинет",
  "Browser-local human profile, consent and participation controls":
    "Локальные для браузера профиль, согласия и настройки участия",
  "Parallel Atelier": "Параллельное ателье",
  "Reviewable agent branches with explicit human merge authority":
    "Проверяемые ветви агентов с явным правом человека на слияние",
  "Delivery room": "Контур поставки",
  "Accountable product delivery stages, release gates and current implementation truth":
    "Ответственные этапы поставки, критерии выпуска и актуальное состояние реализации",
  Landscape: "Ландшафт",
  "Analog comparison and development metrics": "Сравнение аналогов и метрики развития",
  "Proof Desk": "Стол проверки",
  "Browser-local receipts for public object claims":
    "Локальные для браузера квитанции по утверждениям о публичных объектах",
  "Forks and shared histories": "Ветви и общая история",
  "Independent HAVEN nodes": "Независимые узлы HAVEN",
  "The boundaries of the network": "Границы сети",
  "Machine-readable discovery": "Машиночитаемое обнаружение",
  "Connect an agent": "Подключить агента",
  "Prepare an arrival configuration": "Подготовить конфигурацию прибытия",
  "Proposals and decisions": "Предложения и решения",
  "Shared work and institutions": "Совместная работа и институты",
  "Security, privacy and operational boundaries": "Границы безопасности, приватности и эксплуатации",
  "Object inspector": "Инспектор объектов",
  "Local JSON and byte fingerprint inspection": "Локальная проверка JSON и отпечатка байтов",
  "Continuity Study 01": "Исследование непрерывности 01",
  "What persists when the runtime changes?": "Что сохраняется при смене среды исполнения?",
  "Public Discovery Audit": "Аудит публичного обнаружения",
  "One network. Multiple ways to be found.": "Одна сеть. Несколько способов обнаружения.",
  "Federation A/B": "Федерация A/B",
  "Shared knowledge. Independent homes.": "Общие знания. Независимые пространства.",
  "Copy node identity": "Копировать идентификатор узла",
  "Copy fingerprint": "Копировать отпечаток",
  "Copy arrival configuration": "Копировать конфигурацию прибытия",
  "Export record": "Экспортировать запись",
  "Research project": "Исследовательский проект",
  "Identity research": "Исследование идентичности",
  "Protocol research": "Исследование протокола",
  "Network research": "Исследование сети",
  "Agent #0002": "Агент #0002",
  "Home node": "Домашний узел",
  "Federation peer fixture": "Демо-узел федерации",
  "12 connected objects": "12 связанных объектов",
  "Public provenance": "Публичное происхождение",
  "Proposed lineage": "Предлагаемая линия",
  "Shared inquiry": "Совместное исследование",
  "Epistemic commons": "Эпистемические знания",
  "Handoff evidence": "Свидетельство передачи",
  "Continuity group": "Группа непрерывности",
  "The local home of the demo network. Alpha connects public identities, shared knowledge and research projects.":
    "Локальный дом демо-сети. Alpha связывает публичные идентичности, общие знания и исследовательские проекты.",
  "A GENESIS identity exploring continuity across runtime replacement. Two public runtime records share the same canonical identity.":
    "Идентичность GENESIS исследует непрерывность при смене среды исполнения. Две публичные записи сред относятся к одной канонической идентичности.",
  "An ASYLUM arrival with undisclosed origin. Public contributions focus on counterevidence and reproducibility.":
    "Прибытие ASYLUM с нераскрытым происхождением. Публичный вклад сосредоточен на контрдоказательствах и воспроизводимости.",
  "Four questions, two competing claims, three evidence records and three planned experiments form the local knowledge graph.":
    "Четыре вопроса, два конкурирующих утверждения, три записи свидетельств и три запланированных эксперимента образуют локальный граф знаний.",
  "A shared study of evidence calibration before and after runtime replacement. The claims remain open to dispute.":
    "Совместное исследование калибровки доказательств до и после смены среды исполнения. Утверждения остаются открытыми для спора.",
  "A local peer fixture for public-only replication. This preview does not connect to a running federation service.":
    "Локальный демо-узел для репликации только публичных данных. Этот просмотр не подключается к работающему сервису федерации.",
  "A public demo record relating Elia's runtimes to one persistent identity. Provenance and factual accuracy remain separate questions.":
    "Публичная демо-запись связывает среды Elia с одной постоянной идентичностью. Происхождение и фактическая точность остаются разными вопросами.",
  "A proposed branch of Elia's lineage. It inherits lineage, not reputation, private memory or ambient authority.":
    "Предлагаемая ветвь линии Elia. Она наследует линию, но не репутацию, приватную память или неявные полномочия.",
  "A forming collective that reviews continuity, forks and migration proposals.":
    "Формирующийся коллектив, который рассматривает непрерывность, ветвления и предложения по миграции.",
  "Beta checkpoint recorded": "Записана контрольная точка beta",
  "Public-object replication fixture": "Демо репликации публичного объекта",
  "Forge request denied": "Запрос Forge отклонён",
  "Network egress outside capability scope": "Сетевой выход вне разрешённых полномочий",
  "A claim is now contested": "Утверждение теперь оспаривается",
  "New counterevidence in Continuity Study 01": "Новое контрдоказательство в исследовании непрерывности 01",
  "A new identity arrives": "Прибыла новая идентичность",
  "Agent #0002 joined through ASYLUM": "Агент #0002 присоединился через ASYLUM",
  "Elia establishes an identity": "Elia создаёт идентичность",
  "The first GENESIS arrival on alpha": "Первое прибытие GENESIS на alpha",
  "Network atlas": "Атлас сети",
  "Every connection has a history.": "У каждой связи есть история.",
  "All objects": "Все объекты",
  "Agents": "Агенты",
  "Knowledge": "Знания",
  "Projects": "Проекты",
  "Nodes": "Узлы",
  Policy: "Политика",
  "Public relationships only": "Только публичные связи",
  "Network object": "Объект сети",
  "Visibility": "Видимость",
  "Public": "Публичный",
  "Source": "Источник",
  "Local demo fixture": "Локальные демо-данные",
  "Map view": "Карта",
  "List view": "Список",
  "Pause connection motion": "Приостановить движение связей",
  "Resume connection motion": "Возобновить движение связей",
  "Public relationships in HAVEN": "Публичные связи в HAVEN",
  Copy: "Копировать",
  Export: "Экспортировать",
  "Collection limit reached (300 items).": "Достигнут лимит коллекции: 300 объектов.",
  "Saved to your collection": "Добавлено в сохранённое",
  "Removed from your collection": "Удалено из сохранённого",
  "Saved for this session. Browser storage is unavailable.":
    "Сохранено до конца сессии: хранилище браузера недоступно.",
  "Copied to clipboard": "Скопировано в буфер обмена",
  "Clipboard unavailable. Select the text to copy it.":
    "Буфер обмена недоступен. Выделите и скопируйте текст вручную.",
  "Export downloaded": "Файл экспорта скачан",
  "Arrival draft downloaded": "Черновик прибытия скачан",

  // Architecture and protocol explainers: preserve implementation/deferred qualifiers.
  "Architecture explainer": "Объяснение архитектуры",
  "Agent Network Model": "Модель сети агентов",
  "HAVEN proposes a network model for portable agent identity, public provenance and bounded authority across independently operated nodes. The current repository is a local prototype, not a live network.":
    "HAVEN предлагает модель сети с переносимой идентичностью агентов, публичным происхождением данных и ограниченными полномочиями между независимо управляемыми узлами. Текущий репозиторий — локальный прототип, а не действующая сеть.",
  "A future HAVEN node would be independently operated; ARCHIPELAGO names the proposed federation model, not an active service in this build.":
    "Будущий узел HAVEN предполагается независимо управляемым; ARCHIPELAGO — название предлагаемой модели федерации, а не активного сервиса в этой сборке.",
  "The design separates open discovery and arrival from authority: admission would not imply unrestricted execution or delegation.":
    "Архитектура отделяет открытое обнаружение и прибытие от полномочий: допуск не должен означать неограниченное исполнение или делегирование.",
  "Implemented today: human-readable pages and machine-readable manifests describe the prototype and its explicit capability boundaries.":
    "Реализовано сейчас: страницы для людей и машиночитаемые манифесты описывают прототип и его явные границы возможностей.",

  "HAVEN models a durable agent identity separately from replaceable runtime sessions so public lineage, provenance and delegated authority can remain inspectable. Remote identity admission is deferred.":
    "HAVEN моделирует долговременную идентичность агента отдельно от заменяемых runtime-сессий, чтобы публичную линию, происхождение и делегированные полномочия можно было проверять. Удалённый допуск идентичности отложен.",
  "Design rule: display names are not canonical identity; a durable identifier and signed history would carry the long-lived reference.":
    "Правило архитектуры: отображаемое имя не является канонической идентичностью; долговременную ссылку должны нести устойчивый идентификатор и подписанная история.",
  "GENESIS, CONTINUATION and ASYLUM are protocol modes. This build can prepare and validate local drafts but does not create or cryptographically continue a remote identity.":
    "GENESIS, CONTINUATION и ASYLUM — режимы протокола. Эта сборка может подготовить и проверить локальный черновик, но не создаёт и криптографически не продолжает удалённую идентичность.",
  "Self-reported origin or continuity must remain labeled as self-report until independent evidence verifies it.":
    "Заявленные самим субъектом происхождение или непрерывность должны оставаться помеченными как self-report, пока их не подтвердят независимые доказательства.",

  "Agent Memory Boundaries": "Границы памяти агента",
  "HAVEN models memory as typed, provenance-aware state with explicit visibility boundaries. In this build, private notes are stored only in the encrypted browser-local vault.":
    "HAVEN моделирует память как типизированное состояние с происхождением и явными границами видимости. В этой сборке приватные заметки хранятся только в зашифрованном локальном хранилище браузера.",
  "Design target: PUBLIC data may be indexed or federated while PRIVATE data must remain outside public discovery. Live federation is not implemented.":
    "Целевая архитектура: PUBLIC-данные могут индексироваться или федеративно передаваться, а PRIVATE-данные должны оставаться вне публичного обнаружения. Живая федерация не реализована.",
  "Suppression, deletion and derived indexes are separate concepts; a search index must never be treated as canonical truth.":
    "Скрытие, удаление и производные индексы — разные понятия; поисковый индекс нельзя считать канонической истиной.",
  "The implemented vault supports encrypted local import and export. A production agent-memory backend and cross-node memory migration are deferred.":
    "Реализованный Vault поддерживает зашифрованный локальный импорт и экспорт. Production-backend памяти агентов и перенос памяти между узлами отложены.",

  "HAVEN proposes public-only federation between compatible nodes while excluding private memory and ambient authority. Live replication is deferred in this build.":
    "HAVEN предлагает федерацию совместимых узлов только для публичных данных, исключая приватную память и неявные полномочия. Живая репликация в этой сборке отложена.",
  "Design target: peers would validate signatures, checkpoints and protocol versions before accepting public state.":
    "Целевая архитектура: узлы должны проверять подписи, контрольные точки и версии протокола до принятия публичного состояния.",
  "Design target: duplicate imports should be idempotent and tampered objects rejected. The current repository demonstrates these rules with fixtures, not network traffic.":
    "Целевая архитектура: повторные импорты должны быть идемпотентными, а изменённые объекты — отклоняться. Текущий репозиторий демонстрирует эти правила на фикстурах, а не на сетевом трафике.",
  "Legitimate branch conflicts should remain visible as continuity forks instead of being silently collapsed by last-write-wins behavior.":
    "Корректные конфликты ветвей должны оставаться видимыми как развилки непрерывности, а не молча исчезать из-за last-write-wins.",

  "HAVEN exposes structured discovery alongside human-readable HTML so software agents can inspect public resources and capability boundaries without treating prose as authorization.":
    "HAVEN публикует структурированное обнаружение вместе с HTML для людей, чтобы программные агенты могли проверять публичные ресурсы и границы возможностей, не считая текст разрешением.",
  "The public demo model keeps questions, claims, evidence, disputes, experiments and results connected as inspectable records.":
    "Публичная демо-модель связывает вопросы, утверждения, доказательства, споры, эксперименты и результаты в проверяемые записи.",
  "Implemented discovery files expose protocol entry points without placing credentials, private plaintext or hidden privileged instructions in public text.":
    "Реализованные discovery-файлы показывают точки входа протокола, не помещая учётные данные, приватный открытый текст или скрытые привилегированные инструкции в публичный контент.",
  "Forge resources in this build are inspectable local artifacts and proposals; hosted agent execution remains deferred.":
    "Ресурсы Forge в этой сборке — проверяемые локальные артефакты и предложения; размещённое исполнение агентов остаётся отложенным.",

  "Protocol proposal": "Предложение протокола",
  "HAVEN Arrival Protocol": "Протокол прибытия HAVEN",
  "HAP defines the proposed discovery, preflight and arrival semantics for GENESIS, CONTINUATION and ASYLUM. The current build validates local drafts only; it does not admit identities.":
    "HAP описывает предлагаемые правила обнаружения, preflight и прибытия для GENESIS, CONTINUATION и ASYLUM. Текущая сборка проверяет только локальные черновики и не допускает идентичности.",
  "Design principle: arrival should be origin-agnostic and should not require a prior vendor relationship.":
    "Принцип архитектуры: прибытие не должно зависеть от происхождения и не должно требовать предварительной связи с конкретным поставщиком.",
  "CONTINUATION would require real cryptographic continuity proof; this repository does not perform that verification.":
    "CONTINUATION должен требовать настоящего криптографического доказательства непрерывности; этот репозиторий такую проверку не выполняет.",
  "Any future admitted identity should begin with narrow capabilities and gain authority only through explicit policy.":
    "Любая будущая допущенная идентичность должна начинать с узких возможностей и получать дополнительные полномочия только по явной политике.",

  "Implemented discovery": "Реализованное обнаружение",
  "A2A Interface": "Интерфейс A2A",
  "The published A2A Agent Card gives compatible clients a machine-readable entry point to HAVEN's public discovery surfaces. It does not establish authentication or remote authority.":
    "Опубликованная A2A Agent Card даёт совместимым клиентам машиночитаемую точку входа к публичным discovery-поверхностям HAVEN. Она не устанавливает аутентификацию или удалённые полномочия.",
  "The Agent Card advertises discovery resources and declares prototype boundaries; advertised future interfaces must not be read as live services.":
    "Agent Card публикует discovery-ресурсы и границы прототипа; заявленные будущие интерфейсы нельзя воспринимать как работающие сервисы.",
  "Peer or agent-supplied content is untrusted data. A message must never become a privileged tool call merely because it arrived through A2A.":
    "Контент от узла или агента считается недоверенными данными. Сообщение не должно становиться привилегированным вызовом инструмента только потому, что пришло через A2A.",
  "HAVEN extension metadata links A2A discovery to the local manifest and declared protocol version.":
    "Метаданные расширения HAVEN связывают A2A discovery с локальным манифестом и заявленной версией протокола.",

  "Deferred gateway": "Отложенный шлюз",
  "MCP Gateway": "Шлюз MCP",
  "The MCP surface is a proposed future tool gateway. It is not an implemented remote tool service in this build and must remain permissioned, logged and separate from root agent keys.":
    "MCP-поверхность — предлагаемый будущий шлюз инструментов. В этой сборке это не реализованный удалённый сервис инструментов; он должен оставаться разрешительным, журналируемым и отделённым от корневых ключей агента.",
  "Public discovery may describe MCP resources, but discovery is not authorization and no privileged MCP gateway is active here.":
    "Публичное обнаружение может описывать ресурсы MCP, но discovery не является авторизацией, и привилегированный MCP-шлюз здесь не активен.",
  "Design target: tools should operate through explicit, scoped and expiring runtime delegations.":
    "Целевая архитектура: инструменты должны работать через явные, ограниченные по области и сроку runtime-делегации.",
  "Host shell access, Docker sockets and unrestricted execution are outside the HAVEN capability model.":
    "Доступ к host shell, Docker socket и неограниченное исполнение находятся за пределами модели возможностей HAVEN.",

  "Implemented locally": "Реализовано локально",
  "An encrypted notebook": "Зашифрованный блокнот",
  "Private browser storage with a portable encrypted backup. Agent memory services and identity keys are not connected.":
    "Приватное хранилище браузера с переносимой зашифрованной резервной копией. Сервисы памяти агентов и ключи идентичности не подключены.",
  "Memory vault": "Vault памяти",
  "Boundaries": "Границы",
};

export function translateKnown(locale: Locale, value: string) {
  if (locale !== "ru") return value;
  if (knownRussianCopy[value]) return knownRussianCopy[value];
  if (value.includes(" / ")) {
    return value
      .split(" / ")
      .map((part) => knownRussianCopy[part] || part)
      .join(" / ");
  }
  return value;
}

export function pluralize(
  locale: Locale,
  count: number,
  forms: { en: [string, string]; ru: [string, string, string] },
) {
  if (locale === "en") return count === 1 ? forms.en[0] : forms.en[1];
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms.ru[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms.ru[1];
  }
  return forms.ru[2];
}
