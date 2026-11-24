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

    // touch smoothing (syncTouch): Lenis drives touch scrolling on Android so it gets the same eased, inertial flow
    // as desktop. iOS (iPhone and iPadOS) keeps its native scrolling: it already has the best momentum there, keeps the
    // address bar collapsing, and JS-driven touch scrolling is unreliable on Safari.
    // Set NEXT_PUBLIC_SMOOTH_TOUCH=false to use native touch scrolling everywhere.
    const ua = navigator.userAgent;
    const isIOS = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const smoothTouch = process.env.NEXT_PUBLIC_SMOOTH_TOUCH !== "false" && !isIOS;

    // let horizontal swipe areas (service cards, step strip) and the menu keep native gestures
    const prevent = (node: HTMLElement) => {
      if (node.closest("[data-lenis-prevent]")) return true;
      const strip = node.closest<HTMLElement>(".hs-track, .steps");
      return !!strip && strip.scrollWidth > strip.clientWidth + 1 && getComputedStyle(strip).overflowX !== "visible";
    };

    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        syncTouch: smoothTouch,
        syncTouchLerp: 0.1,
        touchInertiaExponent: 1.8,
        prevent,
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
    // failsafe: never leave scrolling locked if the intro event doesn't arrive
    const unlock = setTimeout(() => lenis?.start(), 8000);

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
      clearTimeout(unlock);
      document.removeEventListener("click", onClick);
      window.removeEventListener("infiniti:loaded", onLoaded);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
