"use client";

import { useEffect } from "react";
import { LOADER_PATH } from "@/lib/infinity";

/** Brand intro: the infinity mark draws itself, then the curtain lifts and the page animates in. */
export default function Preloader() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("loaded")) return;

    const finish = () => {
      root.classList.add("loaded");
      window.dispatchEvent(new Event("infiniti:loaded"));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finish();
      return;
    }

    const start = performance.now();
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    let timer: ReturnType<typeof setTimeout>;
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      timer = setTimeout(finish, Math.max(0, 1600 - (performance.now() - start)));
    });
    const failsafe = setTimeout(finish, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <div className="preloader" aria-hidden="true">
      <div className="pl-inner">
        <svg className="pl-mark" viewBox="0 0 64 40" fill="none">
          <path
            pathLength={1}
            d={LOADER_PATH}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="pl-word">infiniti</span>
      </div>
    </div>
  );
}
