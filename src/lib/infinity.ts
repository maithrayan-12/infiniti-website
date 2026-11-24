/**
 * One infinity shape for the whole site: the loading-screen mark.
 * Four relative cubic segments around a centre point; `scale` resizes it, so every
 * animated loop (hero, process, comparison, menu) is the exact same symbol.
 */
const SEGMENTS: number[][] = [
  [4, -9, 15, -11, 17, 0],
  [2, 11, -13, 11, -17, 0],
  [-4, -11, -15, -11, -17, 0],
  [-2, 11, 13, 11, 17, 0],
];

export function infinityPath(cx: number, cy: number, scale = 1): string {
  const f = (n: number) => +(n * scale).toFixed(2);
  return `M${cx} ${cy}${SEGMENTS.map((s) => `c${s.map(f).join(" ")}`).join("")}z`;
}

/** Brand mark for 64×64 icons (logo, footer). */
export const MARK_PATH = infinityPath(32, 32, 1);

/** Loader mark for the 64×40 intro viewBox. */
export const LOADER_PATH = infinityPath(32, 20, 1);
