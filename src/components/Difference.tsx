"use client";

import { useState } from "react";
import { COMPARE } from "@/lib/content";
import { infinityPath } from "@/lib/infinity";
import { Reveal } from "./Reveal";
import { Split } from "./Split";
import { Icon } from "./Sprite";

type Mode = "inhouse" | "infiniti";

export default function Difference() {
  const [mode, setMode] = useState<Mode>("inhouse");
  const list = COMPARE[mode];

  return (
    <section className="section difference" id="difference" aria-labelledby="diff-title">
      <div className="container diff-grid">
        <Reveal as="header">
          <p className="eyebrow">Why infiniti</p>
          <Split id="diff-title">
            Hiring shouldn&apos;t pull you away from <em>the business.</em>
          </Split>
          <p className="sub">
            Flip the switch to see what changes when recruitment is handled by people who do nothing else.
          </p>

          <div className="toggle clay-inset" role="group" aria-label="Compare approaches" data-mode={mode}>
            {(["inhouse", "infiniti"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`toggle-btn${mode === m ? " is-on" : ""}`}
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
              >
                {m === "inhouse" ? "In-house only" : "With infiniti"}
              </button>
            ))}
            <span className="toggle-thumb clay-red" aria-hidden="true" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="compare glass" data-mode={mode}>
            <div className="compare-visual" aria-hidden="true">
              <svg viewBox="0 0 600 200" fill="none">
                <path className="cv-broken" d="M20 100 H150 M190 100 H280 M320 100 H400 M440 100 H580" strokeWidth="10" strokeLinecap="round" />
                <path
                  className="cv-loop"
                  pathLength={1}
                  d={infinityPath(300, 100, 10.6)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <ul className={`compare-list ${mode === "inhouse" ? "c-in" : "c-inf"}`} key={mode}>
              {list.map(([title, text]) => (
                <li key={title}>
                  <Icon name={mode === "inhouse" ? "x" : "check"} />
                  <div>
                    <b>{title}</b>
                    <span>{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
