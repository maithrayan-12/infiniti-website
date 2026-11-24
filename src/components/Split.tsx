"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";

type Mode = "word" | "scrub";

/**
 * Recursively wraps every word of a React tree in spans (keeps inline elements such as <em> / <mark>).
 * "word"  → masked words for slide-up reveals
 * "scrub" → plain .sw spans that GSAP scrubs on scroll
 */
export function splitNodes(node: ReactNode, mode: Mode = "word", counter = { i: 0 }): ReactNode {
  if (typeof node === "string") {
    return node
      .split(/(\s+)/)
      .filter(Boolean)
      .map((part) => {
        if (/^\s+$/.test(part)) return " ";
        const i = counter.i++;
        return mode === "scrub" ? (
          <span className="sw" key={`s${i}`}>{part}</span>
        ) : (
          <span className="w" key={`w${i}`}>
            <span className="wi" style={{ "--i": i } as CSSProperties}>{part}</span>
          </span>
        );
      });
  }
  if (Array.isArray(node)) return node.map((n) => splitNodes(n, mode, counter));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(
      el,
      undefined,
      ...Children.toArray(el.props.children).map((c) => splitNodes(c, mode, counter)),
    );
  }
  return node;
}

type SplitProps = {
  as?: "h1" | "h2" | "h3" | "p";
  eager?: boolean; // reveal when the page has finished loading (hero) instead of on scroll
  className?: string;
  id?: string;
  children: ReactNode;
};

export function Split({ as = "h2", eager = false, className = "", id, children }: SplitProps) {
  const Tag = as as "h2";
  const ref = useRef<HTMLHeadingElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (eager) return;
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  const counter = { i: 0 };
  return (
    <Tag
      ref={ref}
      id={id}
      className={`${className} ${seen ? "in" : ""}`.trim() || undefined}
      data-split=""
      {...(eager ? { "data-eager": "" } : {})}
    >
      {Children.toArray(children).map((c) => splitNodes(c, "word", counter))}
    </Tag>
  );
}
