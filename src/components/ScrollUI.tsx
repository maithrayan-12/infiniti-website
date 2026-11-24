"use client";

import { useEffect, useState } from "react";
import { SECTION_DOTS } from "@/lib/content";

/** Fixed section indicator on the right edge (large desktop screens only). */
export function SectionDots() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = SECTION_DOTS.map((d) => document.getElementById(d.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="dots" aria-label="Page sections">
      {SECTION_DOTS.map((d) => (
        <a key={d.id} href={`#${d.id}`} className={active === d.id ? "on" : ""} aria-current={active === d.id ? "true" : undefined}>
          <span>{d.label}</span>
        </a>
      ))}
    </nav>
  );
}
