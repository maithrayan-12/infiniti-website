"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MARK_PATH, infinityPath } from "@/lib/infinity";
import { css } from "@/lib/utils";
import { Split } from "./Split";
import { Icon } from "./Sprite";

// the loading-screen infinity, scaled up for the hero
const INFINITY_PATH = infinityPath(300, 150, 14.1);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);

  // scroll-linked depth: every floating layer drifts at its own speed
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // scroll parallax only on tablet+ — phones get a calm, perfectly centred static layout
      mm.add("(min-width: 621px) and (prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.utils.toArray<HTMLElement>(".layer").forEach((el) => {
          gsap.to(el, { yPercent: -Number(el.dataset.speed ?? 10) * 1.4, ease: "none", scrollTrigger: st });
        });
        gsap.to(".infinity", { scale: 1.22, rotate: -5, ease: "none", scrollTrigger: st });
        gsap.to(".hero-copy", { yPercent: -10, opacity: 0.15, ease: "none", scrollTrigger: { ...st, end: "bottom 25%" } });
        gsap.to(".hero .orb.o1", { y: 200, x: -90, ease: "none", scrollTrigger: st });
        gsap.to(".hero .orb.o2", { y: -120, x: 80, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root },
  );

  // pointer-linked depth
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !art.current) return;
    const r = art.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    art.current.querySelectorAll<HTMLElement>(".layer").forEach((l) => {
      const d = Number(l.dataset.speed ?? 10);
      l.style.setProperty("--px", `${x * d * 1.6}px`);
      l.style.setProperty("--py", `${y * d * 1.6}px`);
    });
  };
  const onLeave = () =>
    art.current?.querySelectorAll<HTMLElement>(".layer").forEach((l) => {
      l.style.setProperty("--px", "0px");
      l.style.setProperty("--py", "0px");
    });

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title" ref={root}>
      <div className="aurora" aria-hidden="true">
        <i className="orb o1" />
        <i className="orb o2" />
        <i className="orb o3" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="pill" data-in style={css({ "--d": ".1s" })}>
            <span className="pill-orb clay-red" aria-hidden="true">
              <svg viewBox="12 22 40 20"><path d={MARK_PATH} /></svg>
            </span>
            <span className="pill-text">
              Recruitment Process <em>Outsourcing</em>
            </span>
          </p>
          <Split as="h1" id="hero-title" eager>
            Your hiring engine, <em>always on.</em>
          </Split>
          <p className="lead" data-in style={css({ "--d": ".55s" })}>
            infiniti takes over sourcing, screening, interviewing and onboarding, so your team gets exceptional people
            without the hiring overhead.
          </p>
          <div className="hero-actions" data-in style={css({ "--d": ".7s" })}>
            <a className="btn btn-clay btn-lg magnetic" href="#contact">
              Book a free consultation <Icon name="arrow" />
            </a>
            <a className="btn btn-glass btn-lg magnetic" href="#process">See how it works</a>
          </div>
          <div className="proof" data-in style={css({ "--d": ".85s" })}>
            <div className="avatars" aria-hidden="true">
              <i>A</i><i>R</i><i>S</i><i>M</i>
            </div>
            <p>
              <strong>Dedicated recruiters</strong> embedded in your team,
              <br />
              scaling up or down as you grow.
            </p>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true" ref={art} onPointerMove={onMove} onPointerLeave={onLeave}>
          <div className="infinity">
          <svg viewBox="0 0 600 300" fill="none">
            <defs>
              <linearGradient id="g-inf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff6f80" />
                <stop offset="1" stopColor="#b80f26" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
            </defs>
            <path d={INFINITY_PATH} stroke="#ff4d63" strokeOpacity=".45" strokeWidth="30" filter="url(#glow)" />
            <path d={INFINITY_PATH} stroke="#fff" strokeOpacity=".9" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
            <path id="inf-path" className="inf-line" pathLength={1} d={INFINITY_PATH} stroke="url(#g-inf)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <circle r="12" fill="#fff" stroke="#dc1a31" strokeWidth="5">
              <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                <mpath href="#inf-path" />
              </animateMotion>
            </circle>
          </svg>
          </div>

          <div className="layer la" data-speed="14">
            <div className="float-card glass fc-a">
              <span className="fc-ico clay-red"><Icon name="check" /></span>
              <div><strong>Shortlist delivered</strong><small>Senior Backend Engineer · 48 hrs</small></div>
            </div>
          </div>

          <div className="layer lb" data-speed="26">
            <div className="float-card glass fc-b">
              <div className="cand">
                <span className="avatar clay-red">AR</span>
                <div><strong>Aarav R.</strong><small>Product Designer</small></div>
                <span className="match">94% match</span>
              </div>
              <div className="bar"><i style={css({ "--w": "94%" })} /></div>
              <div className="tags"><span>Figma</span><span>Systems</span><span>B2B SaaS</span></div>
            </div>
          </div>

          <div className="layer lc" data-speed="8">
            <div className="float-card glass fc-c">
              <strong className="fc-title">Live pipeline</strong>
              {[
                ["Sourced", 100, 128],
                ["Screened", 62, 46],
                ["Interview", 28, 12],
                ["Offered", 12, 3],
              ].map(([label, w, n]) => (
                <div className="pipe" key={label}>
                  <span>{label}</span>
                  <div className="bar"><i style={css({ "--w": `${w}%` })} /></div>
                  <b>{n}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="layer ld" data-speed="20">
            <div className="float-card glass fc-d">
              <span className="fc-ico clay-red"><Icon name="award" /></span>
              <div><strong>Offer accepted</strong><small>Starts Monday</small></div>
            </div>
          </div>

          <div className="layer lg" data-speed="32">
            <div className="badge clay-red">
              <svg viewBox="0 0 120 120" className="badge-ring">
                <defs>
                  <path id="circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
                </defs>
                <text>
                  <textPath href="#circ">RECRUIT • SCALE • RETAIN • REPEAT •</textPath>
                </text>
              </svg>
              <Icon name="arrow" className="badge-ico" />
            </div>
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#manifesto" aria-label="Scroll to next section">
        <span className="mouse"><i /></span>
        <span>Scroll</span>
      </a>
    </section>
  );
}
