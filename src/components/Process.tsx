"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { STEPS } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { css } from "@/lib/utils";
import { Split } from "./Split";
import { Icon } from "./Sprite";

const N = STEPS.length;

/**
 * Six-step journey. On desktop the section pins: scrolling advances the steps while a giant
 * infinity loop draws itself behind. Elsewhere it works as a normal click / swipe tab list.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const stepsEl = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const curRef = useRef(0);
  const [cur, setCur] = useState(0);

  const setStep = (i: number) => {
    const n = (i + N) % N;
    curRef.current = n;
    setCur(n);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 981px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const sec = root.current!;
        sec.classList.add("pr-active");

        trigger.current = ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.75 * N}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(N - 1, Math.floor(self.progress * N));
            if (idx !== curRef.current) setStep(idx);
          },
        });

        return () => {
          trigger.current = null;
          sec.classList.remove("pr-active");
        };
      });
    },
    { scope: root },
  );

  // go to a step: scroll to its slot when pinned, otherwise just switch
  const go = (i: number) => {
    const st = trigger.current;
    if (!st) return setStep(i);
    const target = st.start + ((((i % N) + N) % N + 0.5) / N) * (st.end - st.start);
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.3 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  // keep the active step visible in the horizontal (mobile) tab strip
  useEffect(() => {
    const el = stepsEl.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const tab = el.children[cur] as HTMLElement | undefined;
    if (tab) el.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
  }, [cur]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in map) next = cur + map[e.key];
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = N - 1;
    if (next === null) return;
    e.preventDefault();
    go(next);
    document.getElementById(`tab-${((next % N) + N) % N + 1}`)?.focus();
  };

  return (
    <section className="process" id="process" aria-labelledby="process-title" ref={root}>
      <div className="container pr-wrap">
        <header className="pr-head">
          <p className="eyebrow">How it works</p>
          <Split id="process-title">
            Six steps. <em>Then it loops.</em>
          </Split>
          <p className="sub">
            Scroll through the journey, or click a step. Every hire feeds the next, which is why we&apos;re called infiniti.
          </p>
        </header>

        <div className="process-grid">
          <div className="steps" role="tablist" aria-label="Hiring process steps" aria-orientation="vertical" ref={stepsEl} onKeyDown={onKey}>
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                className={`step${i === cur ? " is-active" : ""}${i < cur ? " is-done" : ""}`}
                role="tab"
                id={`tab-${i + 1}`}
                aria-selected={i === cur}
                aria-controls={`panel-${i + 1}`}
                tabIndex={i === cur ? 0 : -1}
                onClick={() => go(i)}
              >
                <span className="step-n">{i + 1}</span>
                <span className="step-t">
                  <b>{s.title}</b>
                  <small>{s.short}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="panels glass">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className={`panel${i === cur ? " is-active" : ""}`}
                role="tabpanel"
                id={`panel-${i + 1}`}
                aria-labelledby={`tab-${i + 1}`}
                tabIndex={0}
                hidden={i !== cur}
              >
                <span className="ghost-n" aria-hidden="true">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="ticks">
                  {s.points.map((p) => (
                    <li key={p}><Icon name="check" /> {p}</li>
                  ))}
                </ul>
                <div className="chips">
                  <span><Icon name="clock" /> {s.time}</span>
                  <span>{s.effort}</span>
                </div>
              </div>
            ))}

            <div className="panel-foot">
              <div className="progress" aria-hidden="true">
                <i style={css({ width: `${((cur + 1) / N) * 100}%` })} />
              </div>
              <span className="progress-label">Step {cur + 1} of {N}</span>
              <button className="btn btn-clay btn-sm" type="button" onClick={() => go(cur + 1)}>
                {cur === N - 1 ? "Start over" : "Next step"} <Icon name="arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
