"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  as?: "div" | "li" | "header" | "section" | "p" | "ul";
  className?: string;
  delay?: number; // seconds
  children: ReactNode;
};

/** Fades + lifts its children into view once they enter the viewport. */
export function Reveal({ as = "div", className = "", delay = 0, children }: RevealProps) {
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className} ${seen ? "in" : ""}`.trim()}
      style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
