"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays perfectly in sync.
 * Also upgrades in-page #anchor links to animated scrolls.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // hold scrolling until the intro animation is done
      if (!document.documentElement.classList.contains("loaded")) lenis.stop();
    }

    const onLoaded = () => lenis?.start();
    window.addEventListener("infiniti:loaded", onLoaded);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      if (hash.length < 2) return;

      e.preventDefault();
      if (hash === "#top") {
        lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      // pinned sections live inside a ScrollTrigger pin-spacer — scroll to the spacer's start
      const target = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
      lenis ? lenis.scrollTo(target, { duration: 1.6 }) : target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("infiniti:loaded", onLoaded);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
