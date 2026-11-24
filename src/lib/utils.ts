import type { CSSProperties } from "react";

/** Typed helper for inline CSS custom properties: style={css({ "--w": "50%" })} */
export const css = (vars: Record<string, string | number>) => vars as CSSProperties;

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
