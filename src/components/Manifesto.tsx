"use client";

import { useRef } from "react";
import { STATS } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Reveal } from "./Reveal";
import { splitNodes } from "./Split";

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: to,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return <span ref={ref}>{to}</span>;
}

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  // words light up one by one as you scroll through the statement
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>(".manifesto-text .sw");
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".manifesto-text", start: "top 82%", end: "bottom 50%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const text = (
    <>
      We don&apos;t just fill seats. We build the <mark>teams</mark> that make ambitious businesses{" "}
      <mark>unstoppable</mark>, one great hire after another, <mark>endlessly.</mark>
    </>
  );

  return (
    <section className="manifesto" id="manifesto" aria-labelledby="manifesto-label" ref={root}>
      <div className="container">
        <p className="eyebrow" id="manifesto-label">Our belief</p>
        <p className="manifesto-text">{splitNodes(text, "scrub")}</p>

        <Reveal className="stats-band">
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat glass-dark" key={s.label}>
                <b>
                  <CountUp to={s.value} />
                  <em>{s.suffix}</em>
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <p className="stat-note">Sample figures shown for illustration.</p>
      </div>
    </section>
  );
}
