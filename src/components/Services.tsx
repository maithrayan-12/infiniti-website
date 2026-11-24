"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { css } from "@/lib/utils";
import { Split } from "./Split";
import { Icon } from "./Sprite";

/**
 * Horizontal scroll showcase. On desktop the section pins and vertical scroll drives the cards sideways.
 * On touch / small screens it falls back to a native swipeable scroller.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const now = useRef<HTMLElement>(null);

  // arrow buttons for the swipe scroller (phones / tablets / touch): which card is current, and the scroll ends
  const [idx, setIdx] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });

  /** scrollLeft that centres each card in the track (clamped to the scrollable range) */
  const measure = () => {
    const track = root.current?.querySelector<HTMLElement>(".hs-track");
    if (!track) return null;
    const max = track.scrollWidth - track.clientWidth;
    const pos = Array.from(track.querySelectorAll<HTMLElement>(".svc")).map((c) =>
      Math.min(max, Math.max(0, c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2)),
    );
    return { track, max, pos };
  };

  useEffect(() => {
    const track = root.current?.querySelector<HTMLElement>(".hs-track");
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const m = measure();
      if (!m) return;
      const sl = track.scrollLeft;
      let best = 0;
      m.pos.forEach((x, i) => {
        if (Math.abs(x - sl) < Math.abs(m.pos[best] - sl)) best = i;
      });
      setIdx(best);
      setEdge({ start: sl < 4, end: sl > m.max - 4 });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const m = measure();
    if (!m) return;
    const sl = m.track.scrollLeft;
    const target =
      dir === 1 ? (m.pos.find((x) => x > sl + 8) ?? m.max) : ([...m.pos].reverse().find((x) => x < sl - 8) ?? 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    m.track.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // pinning only for mouse/trackpad desktops; touch devices keep the native swipe scroller (no scroll-jacking)
      mm.add("(min-width: 981px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const sec = root.current!;
        const track = sec.querySelector<HTMLElement>(".hs-track")!;
        sec.classList.add("hs-active");

        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: true, // Lenis already smooths the scroll; extra scrub easing only adds lag
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              if (now.current) now.current.textContent = `0${Math.min(SERVICES.length, Math.floor(self.progress * SERVICES.length) + 1)}`;
            },
          },
        });

        // each card rises and settles as it enters (transform-only, no rotation, so no re-rasterising)
        sec.querySelectorAll<HTMLElement>(".svc").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 60, scale: 0.95, force3D: true },
            {
              y: 0,
              scale: 1,
              ease: "none",
              force3D: true,
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 98%", end: "left 60%", scrub: true },
            },
          );
        });

        return () => sec.classList.remove("hs-active");
      });
    },
    { scope: root },
  );

  return (
    <section className="services" id="services" aria-labelledby="services-title" ref={root}>
      <div className="aurora soft" aria-hidden="true">
        <i className="orb o1" />
        <i className="orb o3" />
      </div>

      <div className="hs-pin">
        <div className="hs-track">
          <header className="hs-intro">
            <p className="eyebrow">What we do</p>
            <Split id="services-title">
              One partner for every kind of <em>hiring.</em>
            </Split>
            <p className="sub">
              From a single critical role to a thousand seasonal hires, pick the model that fits and change it any time.
            </p>
            <div className="hs-hint">
              <span className="hs-count"><b ref={now}>01</b> / 0{SERVICES.length}</span>
              <span className="hs-arrow">
                <span className="hint-desktop">Keep scrolling</span>
                <span className="hint-touch">Swipe to explore</span> <Icon name="arrow" />
              </span>
            </div>
          </header>

          {SERVICES.map((s) => (
            <article className={`svc clay spot${s.hot ? " hot" : ""}`} key={s.n}>
              <span className="svc-n" aria-hidden="true">{s.n}</span>
              <span className="clay-ico"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.tags && (
                <ul className="tags-list">
                  {s.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              )}
              {s.chart && (
                <div className="mini-chart" aria-hidden="true">
                  {s.chart.map((h, i) => <span key={i} style={css({ "--h": `${h}%` })} />)}
                </div>
              )}
              <a className="link-arrow" href="#contact">
                {s.cta} <Icon name="arrow" />
              </a>
            </article>
          ))}
        </div>

        <div className="hs-nav">
          <button type="button" className="hs-btn clay-red" aria-label="Previous service" onClick={() => go(-1)} disabled={edge.start}>
            <Icon name="arrow" className="flip" />
          </button>
          <span className="hs-nav-count" aria-live="polite">
            <b>0{idx + 1}</b> / 0{SERVICES.length}
          </span>
          <button type="button" className="hs-btn clay-red" aria-label="Next service" onClick={() => go(1)} disabled={edge.end}>
            <Icon name="arrow" />
          </button>
        </div>

        <div className="hs-progress" aria-hidden="true">
          <i ref={bar as React.RefObject<HTMLElement>} />
        </div>
      </div>
    </section>
  );
}
