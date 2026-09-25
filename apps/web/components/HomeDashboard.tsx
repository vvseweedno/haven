"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { ExperienceHero } from "./ExperienceHero";
import { useLocale } from "./LocaleContext";

export function HomeDashboard() {
  const { locale } = useLocale();
  const steps = [
    {
      number: "01",
      href: "/landscape",
      icon: BookOpen,
      title: locale === "ru" ? "Сначала — применимость" : "Start with fit",
      body:
        locale === "ru"
          ? "Поймите, решает ли HAVEN вашу задачу и где продукт не подходит, прежде чем углубляться в архитектуру."
          : "Decide whether HAVEN addresses your problem and where it does not fit before diving into architecture.",
      action: locale === "ru" ? "Оценить применимость" : "Evaluate fit",
    },
    {
      number: "02",
      href: "/proof-desk#proof-workbench",
      icon: Fingerprint,
      title: locale === "ru" ? "Проверьте доказательство" : "Verify evidence",
      body:
        locale === "ru"
          ? "Создайте локальную proof-квитанцию и отделите проверяемые байты от заявленного смысла."
          : "Create a local proof receipt and separate verifiable bytes from declared meaning.",
      action: locale === "ru" ? "Открыть Proof Desk" : "Open Proof Desk",
    },
    {
      number: "03",
      href: "/trust",
      icon: ShieldCheck,
      title: locale === "ru" ? "Проверьте границы" : "Review boundaries",
      body:
        locale === "ru"
          ? "Сверьте реализованные, локальные, демонстрационные и отложенные возможности до любого решения о внедрении."
          : "Compare implemented, local, fixture and deferred capabilities before making an adoption decision.",
      action: locale === "ru" ? "Открыть Trust Center" : "Open Trust Center",
    },
    {
      number: "04",
      href: "/delivery#pilot-readiness",
      icon: ClipboardCheck,
      title: locale === "ru" ? "Только затем — пилот" : "Then consider a pilot",
      body:
        locale === "ru"
          ? "Зафиксируйте владельцев, границы данных, доказательство успеха и условия остановки до передачи контакта."
          : "Make owners, data boundaries, success evidence and stop conditions explicit before any contact handoff.",
      action: locale === "ru" ? "Проверить готовность" : "Review readiness",
    },
  ];

  return (
    <div className="dashboard page-shell dashboard-home">
      <ExperienceHero />
      <section className="decision-overview" aria-labelledby="decision-overview-title">
        <div className="decision-overview-heading">
          <div>
            <p className="eyebrow">
              {locale === "ru"
                ? "Один путь вместо лабиринта разделов"
                : "One path instead of a maze of features"}
            </p>
            <h2 id="decision-overview-title">
              {locale === "ru"
                ? "Четыре шага от первого вопроса до обоснованного решения."
                : "Four steps from first question to an evidence-based decision."}
            </h2>
            <p className="lede">
              {locale === "ru"
                ? "Глубокие разделы HAVEN остаются доступны как справочные материалы, но для оценки продукта не нужно изучать их все."
                : "Deep HAVEN areas remain available as reference material, but you do not need to understand all of them to evaluate the product."}
            </p>
          </div>
          <Link href="/observatory" className="text-link" prefetch={false}>
            {locale === "ru" ? "Изучить демо-доказательства" : "Explore demo evidence"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="decision-overview-grid">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                href={step.href}
                className="decision-overview-card"
                key={step.number}
              >
                <div className="decision-overview-card-top">
                  <span className="mono">{step.number}</span>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <span className="text-link">
                  {step.action}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="decision-boundary-summary">
        <div>
          <p className="eyebrow">
            {locale === "ru" ? "Что можно проверить сейчас" : "What you can verify now"}
          </p>
          <h2>
            {locale === "ru" ? "Рабочие локальные доказательства" : "Working local evidence"}
          </h2>
          <p>
            {locale === "ru"
              ? "Proof receipts, read-only status/catalog APIs, локальные черновики, зашифрованные заметки и машиночитаемые discovery-контракты можно проверить в этой сборке."
              : "Proof receipts, read-only status/catalog APIs, local drafts, encrypted notes and machine-readable discovery contracts can be exercised in this build."}
          </p>
          <Link href="/trust" className="text-link">
            {locale === "ru" ? "Проверить реальный статус" : "Check current capability status"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div>
          <p className="eyebrow">
            {locale === "ru" ? "Что остаётся архитектурой" : "What remains architecture"}
          </p>
          <h2>
            {locale === "ru"
              ? "Не путать с работающим сервисом"
              : "Do not mistake design for a live service"}
          </h2>
          <p>
            {locale === "ru"
              ? "Удалённый identity admission, живая федерация, много-пользовательские сервисы и удалённое исполнение агентов пока не реализованы."
              : "Remote identity admission, live federation, multi-user services and remote agent execution are not implemented yet."}
          </p>
          <Link href="/protocol" className="text-link" prefetch={false}>
            {locale === "ru" ? "Изучить архитектуру" : "Explore the architecture"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
