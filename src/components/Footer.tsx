"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MARK_PATH } from "@/lib/infinity";

/** Footer with a giant wordmark that fills with red as you scroll to the bottom. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // scrubbing a CSS variable repaints the huge wordmark every frame — mouse devices only;
      // touch devices keep the (already filled) final state, which keeps phone scrolling light
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".foot-word",
          { "--f": "0%" },
          {
            "--f": "100%",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom bottom", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <footer className="site-footer" ref={root}>
      <div className="container foot">
        <div className="foot-brand">
          <a className="brand" href="#hero" aria-label="infiniti home">
            <span className="brand-mark clay-red" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <path d={MARK_PATH} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="brand-word">infiniti</span>
          </a>
          <p>Recruitment process outsourcing for teams that want great people, without the hiring overhead.</p>
        </div>
        <nav aria-label="Footer">
          <b>Company</b>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#savings">Savings</a>
          <a href="#faq">FAQ</a>
        </nav>
        <nav aria-label="Solutions">
          <b>Solutions</b>
          <a href="#services">Full-cycle RPO</a>
          <a href="#services">Volume hiring</a>
          <a href="#services">Executive search</a>
          <a href="#services">Analytics</a>
        </nav>
        <div>
          <b>Get in touch</b>
          <a href="mailto:hello@infiniti.com">hello@infiniti.com</a>
          <a href="#contact">Book a consultation</a>
        </div>
      </div>

      <div className="foot-word" aria-hidden="true">infiniti</div>

      <div className="container foot-bottom">
        <span>© {new Date().getFullYear()} infiniti. All rights reserved.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
