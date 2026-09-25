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
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let hideTimer = 0;
    let downTimer = 0;

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      aura.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      aura.classList.add("is-visible");
      aura.classList.toggle(
        "is-link",
        Boolean((event.target as Element | null)?.closest?.("a,button")),
      );
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        aura.classList.remove("is-visible", "is-link");
      }, 1800);
    };
    const down = () => {
      aura.classList.add("is-down");
      window.clearTimeout(downTimer);
      downTimer = window.setTimeout(() => aura.classList.remove("is-down"), 140);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(downTimer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      aura.remove();
    };
  }, []);

  return null;
}
