"use client";

import { useEffect } from "react";

export function PointerAura() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const aura = document.createElement("div");
    aura.className = "pointer-aura";
    document.body.appendChild(aura);

    let frame = 0;
    let running = false;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let hideTimer = 0;
    let downTimer = 0;

    const tick = () => {
      if (document.hidden) {
        running = false;
        return;
      }
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      aura.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.25;
      if (moving || aura.classList.contains("is-visible")) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      aura.classList.add("is-visible");
      aura.classList.toggle(
        "is-link",
        Boolean((event.target as Element | null)?.closest?.("a,button,summary")),
      );
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        aura.classList.remove("is-visible", "is-link");
      }, 1200);
      start();
    };

    const down = () => {
      aura.classList.add("is-down");
      window.clearTimeout(downTimer);
      downTimer = window.setTimeout(() => aura.classList.remove("is-down"), 120);
      start();
    };

    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        running = false;
      } else if (aura.classList.contains("is-visible")) {
        start();
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(downTimer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.removeEventListener("visibilitychange", visibility);
      aura.remove();
    };
  }, []);

  return null;
}
