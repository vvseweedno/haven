"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ContinuumScene = dynamic(
  () => import("./ContinuumScene").then((module) => module.ContinuumScene),
  { ssr: false },
);

type IdleCapableWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function DeferredContinuumScene({
  className = "",
  delay = 120,
}: {
  className?: string;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);
  const placeholder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = placeholder.current;
    if (!element) return;

    const idleWindow = window as IdleCapableWindow;
    let timer = 0;
    let idleHandle: number | undefined;
    let started = false;

    const schedule = () => {
      if (started) return;
      started = true;

      const reveal = () => {
        timer = window.setTimeout(() => setReady(true), Math.max(0, delay));
      };

      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(reveal, { timeout: 450 });
      } else {
        reveal();
      }
    };

    if (!("IntersectionObserver" in window)) {
      schedule();
      return () => {
        window.clearTimeout(timer);
        if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        schedule();
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
    };
  }, [delay]);

  if (!ready) {
    return (
      <div
        ref={placeholder}
        className={`continuum-scene continuum-scene-loading ${className}`.trim()}
        aria-hidden="true"
      />
    );
  }

  return <ContinuumScene className={className} />;
}
