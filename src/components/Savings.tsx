"use client";

import { useEffect, useRef, useState } from "react";
import { css, usd } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Split } from "./Split";
import { Icon } from "./Sprite";

const INFINITI_RATE = 0.12; // illustrative effective cost, as a share of first-year salary

/** Eases a displayed number toward its target (rAF tween). */
function useTween(target: number, ms = 650) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      current.current = from + (target - from) * eased;
      setValue(current.current);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

function Range(props: {
  id: string;
  label: string;
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((props.value - props.min) / (props.max - props.min)) * 100;
  return (
    <div className="field-range">
      <label htmlFor={props.id}>
        {props.label} <output htmlFor={props.id}>{props.display}</output>
      </label>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        style={css({ "--p": `${pct}%` })}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function Savings() {
  const [hires, setHires] = useState(40);
  const [salary, setSalary] = useState(60000);
  const [fee, setFee] = useState(20);

  const agency = hires * salary * (fee / 100);
  const infiniti = hires * salary * INFINITI_RATE;
  const saving = Math.max(agency - infiniti, 0);
  const base = Math.max(agency, infiniti, 1);

  const shownSaving = useTween(saving);
  const shownAgency = useTween(agency);
  const shownInfiniti = useTween(infiniti);

  return (
    <section className="section savings" id="savings" aria-labelledby="savings-title">
      <div className="aurora hot" aria-hidden="true">
        <i className="orb o1" />
        <i className="orb o2" />
        <i className="orb o3" />
      </div>
      <div className="rings" aria-hidden="true">
        <i /><i /><i />
      </div>

      <div className="container">
        <Reveal as="header" className="section-head">
          <p className="eyebrow on-red">Savings estimator</p>
          <Split id="savings-title">
            See what you could <em>keep.</em>
          </Split>
          <p className="sub">Move the sliders to match your hiring plan and compare against typical agency fees.</p>
        </Reveal>

        <Reveal className="calc">
          <div className="calc-inputs glass-dark">
            <Range id="hires" label="Hires per year" display={String(hires)} min={5} max={500} step={5} value={hires} onChange={setHires} />
            <Range id="salary" label="Average annual salary" display={usd.format(salary)} min={20000} max={200000} step={5000} value={salary} onChange={setSalary} />
            <Range id="fee" label="Typical agency fee" display={`${fee}%`} min={10} max={30} step={1} value={fee} onChange={setFee} />
            <p className="fine">
              Assumes an effective infiniti cost of {INFINITI_RATE * 100}% of first-year salary. This is an illustrative
              estimate; your actual savings depend on your plan.
            </p>
          </div>

          <div className="calc-result clay" aria-live="polite">
            <p className="calc-kicker">Estimated yearly savings</p>
            <p className="calc-big">{usd.format(shownSaving)}</p>
            <div className="cmp">
              <div className="cmp-row"><span>Traditional agencies</span><b>{usd.format(shownAgency)}</b></div>
              <div className="cmp-bar"><i style={css({ "--w": `${(agency / base) * 100}%` })} /></div>
              <div className="cmp-row"><span>With infiniti</span><b>{usd.format(shownInfiniti)}</b></div>
              <div className="cmp-bar alt"><i style={css({ "--w": `${(infiniti / base) * 100}%` })} /></div>
            </div>
            <a className="btn btn-clay magnetic" href="#contact">
              Get a real quote <Icon name="arrow" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
