"use client";

import { useEffect } from "react";

/**
 * Pointer-driven micro-interactions via event delegation (no per-element listeners):
 *  .spot     → radial spotlight follows the cursor
 *  .magnetic → element is gently pulled toward the cursor
 *  .tilt     → 3D tilt toward the cursor
 */
export default function Interactions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mag: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const resetMag = () => {
      if (!mag) return;
      mag.style.setProperty("--tx", "0px");
      mag.style.setProperty("--ty", "0px");
      mag = null;
    };
    const resetTilt = () => {
      if (!tilt) return;
      tilt.style.transform = "";
      tilt = null;
    };

    const onMove = (e: PointerEvent) => {
      const t = e.target as Element;

      const spot = t.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (reduce) return;

      const m = t.closest<HTMLElement>(".magnetic");
      if (m !== mag) resetMag();
      if (m) {
        mag = m;
        const r = m.getBoundingClientRect();
        m.style.setProperty("--tx", `${(e.clientX - (r.left + r.width / 2)) * 0.28}px`);
        m.style.setProperty("--ty", `${(e.clientY - (r.top + r.height / 2)) * 0.4}px`);
      }

      const tl = t.closest<HTMLElement>(".tilt");
      if (tl !== tilt) resetTilt();
      if (tl) {
        tilt = tl;
        const r = tl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tl.style.transform = `perspective(900px) rotateX(${-py * 10}deg) rotateY(${px * 12}deg) translateY(-4px)`;
      }
    };

    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        resetMag();
        resetTilt();
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return null;
}
