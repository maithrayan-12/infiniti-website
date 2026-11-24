import { FAQ, INDUSTRIES } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Split } from "./Split";
import { Icon } from "./Sprite";

export function Industries() {
  return (
    <section className="section industries-sec" id="industries" aria-labelledby="ind-title">
      <div className="container">
        <Reveal as="header" className="section-head">
          <p className="eyebrow">Industries</p>
          <Split id="ind-title">
            Deep benches across <em>every sector.</em>
          </Split>
          <p className="sub">Specialist recruiters who know the roles, the talent and the market.</p>
        </Reveal>

        <ul className="industries">
          {INDUSTRIES.map((it, i) => (
            <Reveal as="li" key={it.title} delay={(i % 4) * 0.06}>
              <div className="tile clay tilt spot">
                <span className="clay-ico sm"><Icon name={it.icon} /></span>
                <b>{it.title}</b>
                <span>{it.text}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section faq-sec" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <Reveal as="header">
          <p className="eyebrow">FAQ</p>
          <Split id="faq-title">
            Questions, <em>answered.</em>
          </Split>
          <p className="sub">Can&apos;t find what you need? Drop us a message and we&apos;ll reply within one business day.</p>
          <a className="btn btn-clay magnetic" href="#contact">
            Ask us anything <Icon name="arrow" />
          </a>
        </Reveal>

        <Reveal className="faq" delay={0.1}>
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
