"use client";

import { Fragment, useRef } from "react";
import { MARQUEE_ROWS } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MARK_PATH } from "@/lib/infinity";

/** Giant type ticker. Scroll velocity boosts its speed. */
export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let boost = 0;
        const rows = Array.from(root.current?.querySelectorAll<HTMLElement>(".mq-row") ?? []);
        const setRate = (rate: number) =>
          rows.forEach((r) => r.getAnimations().forEach((a) => a.updatePlaybackRate(rate)));
        const tick = () => {
          boost *= 0.92;
          if (boost < 0.02) {
            boost = 0;
            setRate(1);
            gsap.ticker.remove(tick); // settled: stop running every frame
            return;
          }
          setRate(1 + boost);
        };

        // only react while the marquee is on screen; the ticker runs only while it is boosted
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.min(Math.abs(self.getVelocity()) / 350, 9);
            if (v > boost) boost = v;
            if (boost > 0.02) gsap.ticker.add(tick);
          },
        });
        return () => {
          st.kill();
          gsap.ticker.remove(tick);
        };
      });
    },
    { scope: root },
  );

  return (
    <section className="marquee" aria-label="Roles we hire for" ref={root}>
      {MARQUEE_ROWS.map((row, r) => (
        <div className={`mq-row${row.reverse ? " rev" : ""}`} key={r}>
          {[0, 1].map((copy) => (
            <div className="mq-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {row.items.map((item, i) => (
                <Fragment key={item}>
                  <span className={i % 2 === 1 ? "o" : undefined}>{item}</span>
                  <i className="mq-inf" aria-hidden="true">
                    <svg viewBox="12 22 40 20">
                      <path d={MARK_PATH} />
                    </svg>
                  </i>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
