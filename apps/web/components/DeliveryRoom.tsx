"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Boxes,
  BrushCleaning,
  CheckCircle2,
  Code2,
  FileDown,
  FileText,
  Gauge,
  Send,
  MousePointer2,
  RadioTower,
  Scale,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  deliveryGates,
  deliveryRoles,
  experimentGates,
  type DeliveryState,
} from "@/lib/delivery";
import { buildAnalysisBrief, buildPilotBrief, pilotReadiness } from "@/lib/adoption";
import { useLocale } from "./LocaleContext";
import { downloadJson, measure } from "./Workspace";

const icons: Record<string, LucideIcon> = {
  product: Boxes,
  art: BrushCleaning,
  experience: MousePointer2,
  frontend: Sparkles,
  protocol: Code2,
  security: ShieldCheck,
  quality: Gauge,
  operations: RadioTower,
  governance: Scale,
  growth: Activity,
  cro: Gauge,
  "content-seo": FileText,
};

const states: Record<DeliveryState, { en: string; ru: string }> = {
  implemented: { en: "Available in this build", ru: "Доступно в этой сборке" },
  active: { en: "Being verified", ru: "На проверке" },
  next: { en: "Required next", ru: "Следующий обязательный шаг" },
};

const copy = {
  en: {
    eyebrow: "HAVEN / Delivery evidence",
    title: "Decide whether HAVEN is ready for a bounded design-partner pilot.",
    lead: "Use this room to turn product interest into a qualified decision. A pilot is only ready when the problem, owner, data boundary, success evidence, integration surface and stop conditions are explicit. The current build remains a local prototype, not a staffed network service.",
    disciplines: "Accountable areas",
    gates: "Release checks",
    local: "Where changes are saved",
    localValue: "this browser",
    submission: "Data sent",
    submissionValue: "explicit only",
    viewAll: "Show all",
    roleMap: "Who owns each decision",
    handoff: "Ownership and evidence",
    artifact: "Inspect evidence",
    gate: "Before release",
    truth: "What is true now",
    delivery: "Release path",
    note: "Prepare a pilot only after fit, owners, data boundaries, success evidence and stop conditions are explicit. Downloads stay in this browser. A sales handoff happens only when a visitor explicitly submits the qualified pilot form.",
    atelier: "Review agent-proposed branches",
    documentation: "Open the machine-readable delivery record",
    pilotBrief: "Export qualified pilot brief",
    pilotRequest: "Submit qualified pilot request",
    analysisBrief: "Export the experiment template",
    experiments: "Rules for responsible experiments",
    experimentKicker: "Experiments / Evidence first",
    noConclusion: "This build records browser-local signals only. It cannot support a claim about population conversion, uplift or a winning variant.",
    noConclusionLabel: "no conclusion",
    requiredLabel: "required",
    available: "inspectable now",
    required: "input still required",
    carry: "Add this evidence to the evaluation record.",
    resolve: "Resolve this item and name an owner before discussing a pilot.",
    pilotTitle: "Qualify a bounded pilot before asking for implementation",
    ownersAria: "Accountable roles",
  },
  ru: {
    eyebrow: "HAVEN / Доказательства готовности",
    title: "Решите, готов ли HAVEN к ограниченному design-partner пилоту.",
    lead: "Используйте этот экран, чтобы превратить интерес к продукту в квалифицированное решение. Пилот готов только тогда, когда явно заданы проблема, владелец, границы данных, доказательства успеха, поверхность интеграции и условия остановки. Текущая сборка остаётся локальным прототипом, а не сетевым сервисом с командой поддержки.",
    disciplines: "Области ответственности",
    gates: "Проверки перед релизом",
    local: "Где сохраняются изменения",
    localValue: "этот браузер",
    submission: "Отправка данных",
    submissionValue: "только явно",
    viewAll: "Показать всё",
    roleMap: "Кто отвечает за каждое решение",
    handoff: "Ответственность и доказательства",
    artifact: "Проверить доказательство",
    gate: "До релиза",
    truth: "Что верно сейчас",
    delivery: "Путь к релизу",
    note: "Готовьте пилот только после явной проверки соответствия задаче, владельцев, границ данных, доказательств успеха и условий остановки. Файлы остаются в браузере. Передача в продажи происходит только после явной отправки квалифицированной формы пилота.",
    atelier: "Проверить ветки, предложенные агентами",
    documentation: "Открыть машиночитаемую запись поставки",
    pilotBrief: "Экспортировать квалифицированный бриф пилота",
    pilotRequest: "Отправить квалифицированный запрос на пилот",
    analysisBrief: "Экспортировать шаблон эксперимента",
    experiments: "Правила ответственных экспериментов",
    experimentKicker: "Эксперименты / Сначала доказательства",
    noConclusion: "Эта сборка фиксирует только локальные сигналы браузера. По ним нельзя заявлять конверсию всей аудитории, эффект варианта или победителя.",
    noConclusionLabel: "вывода нет",
    requiredLabel: "обязательно",
    available: "можно проверить сейчас",
    required: "нужны входные данные",
    carry: "Добавьте это доказательство в запись оценки.",
    resolve: "Закройте этот вопрос и назначьте владельца до обсуждения пилота.",
    pilotTitle: "Квалифицируйте ограниченный пилот до обсуждения внедрения",
    ownersAria: "Ответственные роли",
  },
};

export function DeliveryRoom() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [filter, setFilter] = useState<DeliveryState | "all">("all");
  const roles = useMemo(
    () => deliveryRoles.filter((role) => filter === "all" || role.state === filter),
    [filter],
  );

  return (
    <div className="delivery-page page-shell">
      <section className="delivery-hero">
        <div className="delivery-hero-copy">
          <p className="signal-kicker"><UsersRound size={14} /> {text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p>{text.lead}</p>
        </div>
        <div className="delivery-hero-art" aria-hidden="true">
          <Image src="/assets/signal-ribbon.png" alt="" fill priority sizes="(max-width: 760px) 100vw, 52vw" />
        </div>
        <div className="delivery-metrics" aria-label={text.delivery}>
          <div><strong>{deliveryRoles.length}</strong><span>{text.disciplines}</span></div>
          <div><strong>{deliveryGates.length}</strong><span>{text.gates}</span></div>
          <div><strong>{text.localValue}</strong><span>{text.local}</span></div>
          <div><strong>{text.submissionValue}</strong><span>{text.submission}</span></div>
        </div>
      </section>

      <section className="delivery-section" aria-labelledby="experiment-gates">
        <div className="delivery-section-heading">
          <div>
            <p className="signal-kicker"><Gauge size={14} /> {text.experimentKicker}</p>
            <h2 id="experiment-gates">{text.experiments}</h2>
          </div>
        </div>
        <div className="delivery-role-list">
          {experimentGates.map((gate, index) => (
            <article className={`delivery-role ${gate.state === "blocked" ? "next" : "active"}`} key={gate.id}>
              <div className="delivery-order">{String(index + 1).padStart(2, "0")}</div>
              <div className="delivery-role-icon"><Gauge size={20} /></div>
              <header>
                <div><p>{gate.id}</p><h3>{gate.title[locale]}</h3></div>
                <span className={`delivery-state ${gate.state === "blocked" ? "next" : "active"}`}>
                  {gate.state === "blocked" ? text.noConclusionLabel : text.requiredLabel}
                </span>
              </header>
              <p className="delivery-responsibility">{gate.rule[locale]}</p>
              <div className="delivery-truth"><span>{text.truth}</span><p>{text.noConclusion}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="delivery-gate-strip" aria-label={text.delivery}>
        {deliveryGates.map((gate, index) => (
          <article className={`delivery-gate ${gate.state}`} key={gate.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{gate.title[locale]}</strong><p>{gate.detail[locale]}</p></div>
            {gate.state === "implemented" ? <CheckCircle2 size={17} /> : <Bot size={17} />}
          </article>
        ))}
      </section>

      <section className="delivery-section" aria-labelledby="pilot-readiness">
        <div className="delivery-section-heading">
          <div>
            <p className="signal-kicker"><CheckCircle2 size={14} /> {text.delivery}</p>
            <h2 id="pilot-readiness">{text.pilotTitle}</h2>
          </div>
        </div>
        <div className="delivery-role-list">
          {pilotReadiness.map((check, index) => (
            <article className={`delivery-role ${check.state === "available" ? "implemented" : "next"}`} key={check.id}>
              <div className="delivery-order">{String(index + 1).padStart(2, "0")}</div>
              <div className="delivery-role-icon">{check.state === "available" ? <CheckCircle2 size={20} /> : <Bot size={20} />}</div>
              <header>
                <div><p>{check.state === "available" ? text.available : text.required}</p><h3>{check.label[locale]}</h3></div>
              </header>
              <p className="delivery-responsibility">{check.evidence[locale]}</p>
              <div className="delivery-gates">
                <div className="delivery-detail">
                  <span>{text.gate}</span>
                  <p>{check.state === "available" ? text.carry : text.resolve}</p>
                </div>
              </div>
              <div className="delivery-truth"><span>{text.truth}</span><p>{check.state === "available" ? text.available : text.required}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="delivery-section" aria-labelledby="responsibility-map">
        <div className="delivery-section-heading">
          <div><p className="signal-kicker"><Scale size={14} /> {text.handoff}</p><h2 id="responsibility-map">{text.roleMap}</h2></div>
          <div className="delivery-filter" aria-label={text.roleMap}>
            {(["all", "implemented", "active", "next"] as const).map((state) => (
              <button
                className={filter === state ? "active" : ""}
                key={state}
                onClick={() => setFilter(state)}
                aria-pressed={filter === state}
              >
                {state === "all" ? text.viewAll : states[state][locale]}
              </button>
            ))}
          </div>
        </div>
        <div className="delivery-role-list">
          {roles.map((role) => {
            const Icon = icons[role.id];
            return (
              <article className={`delivery-role ${role.state}`} key={role.id}>
                <div className="delivery-order">{String(role.order).padStart(2, "0")}</div>
                <div className="delivery-role-icon"><Icon size={20} /></div>
                <header>
                  <div><p>{states[role.state][locale]}</p><h3>{role.role[locale]}</h3></div>
                  <span className={`delivery-state ${role.state}`}>{states[role.state][locale]}</span>
                </header>
                <p className="delivery-responsibility">{role.responsibility[locale]}</p>
                {role.owners ? (
                  <div className="delivery-owners" aria-label={text.ownersAria}>
                    {role.owners.map((owner) => <span key={owner.en}>{owner[locale]}</span>)}
                  </div>
                ) : null}
                <div className="delivery-gates">
                  <div className="delivery-detail"><span>{text.artifact}</span><Link href={role.artifactHref} data-measure={`delivery_artifact_opened.${role.id}`}>{role.artifact[locale]} <ArrowUpRight size={15} /></Link></div>
                  <div className="delivery-detail"><span>{text.gate}</span><p>{role.gate[locale]}</p></div>
                </div>
                <div className="delivery-truth"><span>{text.truth}</span><p>{role.currentTruth[locale]}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="delivery-footer-band">
        <div className="delivery-decision-mark" aria-hidden="true"><i /><i /><i /></div>
        <div><p className="signal-kicker"><FileDown size={14} /> {text.delivery}</p><p>{text.note}</p></div>
        <div className="delivery-actions">
          <Link href="/pilot" data-measure="pilot_request_opened">
            {text.pilotRequest}<Send size={16} />
          </Link>
          <a
            href="#pilot-readiness"
            data-measure="pilot_brief_exported"
            data-measure-mode="manual"
            onClick={(event) => {
              event.preventDefault();
              downloadJson(buildPilotBrief(locale), `haven-pilot-brief.${locale}.json`);
              measure("pilot_brief_exported", { source: "delivery" });
            }}
          >
            {text.pilotBrief}<ArrowUpRight size={16} />
          </a>
          <a
            href="#experiment-gates"
            data-measure="analysis_brief_exported"
            onClick={(event) => {
              event.preventDefault();
              downloadJson(buildAnalysisBrief(locale), `haven-cro-analysis-brief.${locale}.json`);
            }}
          >
            {text.analysisBrief}<ArrowUpRight size={16} />
          </a>
          <Link href="/atelier" data-measure="atelier_opened">{text.atelier}<ArrowUpRight size={16} /></Link>
          <a href="/delivery.json" target="_blank" rel="noreferrer" data-measure="delivery_contract_opened">{text.documentation}<ArrowUpRight size={16} /></a>
        </div>
      </section>
    </div>
  );
}
