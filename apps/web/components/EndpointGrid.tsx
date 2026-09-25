"use client";

import Link from "next/link";
import { ArrowUpRight, FileJson } from "lucide-react";
import { machineEndpoints } from "@/lib/haven-data";
import { Badge } from "@/components/Badge";
import { translateKnown, useLocale } from "./LocaleContext";

export function EndpointGrid() {
  const { locale } = useLocale();

  return (
    <div className="endpoint-grid">
      {machineEndpoints.map((endpoint) => (
        <Link prefetch={false} className="endpoint-card" href={endpoint.href} key={endpoint.href}>
          <div className="endpoint-icon">
            <FileJson size={18} aria-hidden="true" />
          </div>
          <div>
            <div className="endpoint-head">
              <strong>{translateKnown(locale, endpoint.label)}</strong>
              <ArrowUpRight size={15} aria-hidden="true" />
            </div>
            <p>{translateKnown(locale, endpoint.description)}</p>
            <Badge tone="blue">{endpoint.method}</Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
