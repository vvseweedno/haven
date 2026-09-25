"use client";

import { PageHeader } from "@/components/PageHeader";
import { localize, translateKnown, useLocale } from "@/components/LocaleContext";

export type InfoPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  sections: string[];
};

export function InfoPage({
  content,
  children,
}: {
  content: InfoPageContent;
  children?: React.ReactNode;
}) {
  const { locale } = useLocale();
  const principleLabels = [
    localize(locale, "System model", "Модель системы"),
    localize(locale, "Control boundary", "Граница управления"),
    localize(locale, "Evidence standard", "Стандарт доказательств"),
  ];

  return (
    <div
      className="page-shell info-page info-page--explainer"
      data-content-kind="explainer"
    >
      <PageHeader
        eyebrow={translateKnown(locale, content.eyebrow)}
        title={translateKnown(locale, content.title)}
        description={translateKnown(locale, content.description)}
      />
      <section className="text-grid info-page-principles">
        {content.sections.map((section, index) => {
          const headingId = `principle-${index + 1}-${content.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`;
          return (
          <article
            className="surface-panel info-page-principle"
            key={section}
            aria-labelledby={headingId}
          >
            <div className="info-page-principle-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="info-page-principle-copy">
              <h2 className="eyebrow" id={headingId}>
                {principleLabels[index] ??
                  localize(locale, "Operating principle", "Принцип работы")}
              </h2>
              <p>{translateKnown(locale, section)}</p>
            </div>
          </article>
          );
        })}
      </section>
      {children ? <div className="info-page-extension">{children}</div> : null}
    </div>
  );
}
