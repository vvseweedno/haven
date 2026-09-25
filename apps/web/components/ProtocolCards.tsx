"use client";

import type { LucideIcon } from "lucide-react";
import { translateKnown, useLocale } from "./LocaleContext";

export function ProtocolCards({
  cards,
}: {
  cards: Array<{ title: string; body: string; icon: LucideIcon }>;
}) {
  const { locale } = useLocale();

  return (
    <section className="protocol-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="protocol-card" key={card.title}>
            <Icon size={20} aria-hidden="true" />
            <h3>{translateKnown(locale, card.title)}</h3>
            <p>{translateKnown(locale, card.body)}</p>
          </article>
        );
      })}
    </section>
  );
}
