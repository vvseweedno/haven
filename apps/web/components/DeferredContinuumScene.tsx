"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ContinuumScene = dynamic(
  () => import("./ContinuumScene").then((module) => module.ContinuumScene),
  { ssr: false },
);

export function DeferredContinuumScene({
  className = "",
  delay = 160,
}: {
  className?: string;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  if (!ready)
    return (
      <div
        className={`continuum-scene continuum-scene-loading ${className}`}
        aria-hidden="true"
      />
    );

  return <ContinuumScene className={className} />;
}
