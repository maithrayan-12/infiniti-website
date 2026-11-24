"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_LINKS, SECTION_DOTS } from "@/lib/content";
import { MARK_PATH, infinityPath } from "@/lib/infinity";
import { lenisRef } from "@/lib/lenis";
import { css } from "@/lib/utils";
import { Icon } from "./Sprite";

const RING = 2 * Math.PI * 24; // circumference of the progress ring around the logo orb

const MENU_RING = infinityPath(300, 150, 14.1);

/**
 * Split "island" navigation:
 *  - logo orb ringed by a scroll-progress arc
 *  - link pill with a sliding red lens that follows the hovered / current section
 *  - after scrolling, the whole bar compacts (island shows the current section, expands on hover)
 *  - full-screen numbered menu on small screens
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [peek, setPeek] = useState(false);
  const [active, setActive] = useState("hero");
  const [hover, setHover] = useState<number | null>(null);

  const island = useRef<HTMLDivElement>(null);
  const links = useRef<HTMLElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const els = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIdx = NAV_LINKS.findIndex((l) => l.href === `#${active}`);
  const lensIdx = hover ?? activeIdx;
  const label = SECTION_DOTS.find((d) => d.id === active)?.label ?? "Menu";

  // scroll progress ring + compact state
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setCompact(y > 140);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      ring.current?.setAttribute("stroke-dashoffset", String(RING * (1 - p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // which section is on screen
  useEffect(() => {
    const sections = SECTION_DOTS.map((d) => document.getElementById(d.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // position the sliding lens behind the hovered / current link
  const measure = useCallback(() => {
    const wrap = links.current;
    if (!wrap) return;
    const el = lensIdx >= 0 ? els.current[lensIdx] : null;
    if (!el) {
      wrap.style.setProperty("--lo", "0");
      return;
    }
    wrap.style.setProperty("--lx", `${el.offsetLeft}px`);
    wrap.style.setProperty("--lw", `${el.offsetWidth}px`);
    wrap.style.setProperty("--lo", "1");
  }, [lensIdx]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // tapping outside the compact island closes it again
  useEffect(() => {
    if (!peek) return;
    const onDown = (e: PointerEvent) => {
      if (!island.current?.contains(e.target as Node)) setPeek(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [peek]);

  // mobile menu: lock scroll, close on Escape
  useEffect(() => {
    if (open) {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`site-header${compact ? " is-compact" : ""}`} id="top">
        <div className="nav-shell">
          <a className="nav-logo glass" href="#hero" aria-label="infiniti home" onClick={() => setOpen(false)}>
            <span className="logo-orb">
              <svg className="logo-ring" viewBox="0 0 56 56" aria-hidden="true">
                <circle className="ring-bg" cx="28" cy="28" r="24" />
                <circle ref={ring} className="ring-prog" cx="28" cy="28" r="24" strokeDasharray={RING} strokeDashoffset={RING} />
              </svg>
              <span className="brand-mark clay-red" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <path d={MARK_PATH} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            <span className="brand-word">infiniti</span>
          </a>

          <div
            className={`nav-island glass${compact ? " is-compact" : ""}${peek ? " is-open" : ""}`}
            ref={island}
            onMouseLeave={() => setHover(null)}
          >
            <button className="nav-peek" type="button" aria-expanded={peek} onClick={() => setPeek((p) => !p)}>
              <span className="pulse" aria-hidden="true" />
              <span className="nav-peek-label">{label}</span>
              <span className="peek-dots" aria-hidden="true"><i /><i /><i /></span>
            </button>

            <nav className="nav-links" ref={links} aria-label="Primary">
              <span className="nav-lens clay-red" aria-hidden="true" />
              {NAV_LINKS.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  ref={(el) => {
                    els.current[i] = el;
                  }}
                  className={i === lensIdx ? "on" : undefined}
                  aria-current={i === activeIdx ? "true" : undefined}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => setPeek(false)}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <a className="nav-cta magnetic" href="#contact">
            <span>Talk to us</span>
            <span className="cta-knob"><Icon name="arrow" /></span>
          </a>

          <button
            className="menu-btn glass"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-menu${open ? " open" : ""}`} id="mobile-menu" inert={!open} onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}>
        <ul className="mm-list">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} style={css({ "--i": i })}>
                <span className="mm-n">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn-clay btn-lg mm-cta" href="#contact">
          Talk to us <Icon name="arrow" />
        </a>
        <svg className="mm-ring" viewBox="0 0 600 300" fill="none" aria-hidden="true">
          <path d={MENU_RING} stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}
