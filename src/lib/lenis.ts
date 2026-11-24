import type Lenis from "lenis";

/** Shared handle to the Lenis instance so any component can scroll programmatically. */
export const lenisRef: { current: Lenis | null } = { current: null };
