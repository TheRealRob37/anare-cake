// ─── Shared Framer Motion constants ──────────────────────────────────────────

/** Smooth custom ease — use for most entrances / layout changes */
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

/** Spring-like ease for poppy micro-interactions */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

/** Standard whileTap scale for interactive chips / buttons */
export const TAP_SCALE = 0.95;

/** Reusable fade-up entrance variant factory */
export const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  animate:   { opacity: 1, y: 0  },
  transition: { delay, duration: 0.6, ease: EASE_SMOOTH },
});

/** Reusable fade-in-from-side variant */
export const fadeX = (x: number, delay = 0) => ({
  initial:   { opacity: 0, x },
  animate:   { opacity: 1, x: 0 },
  transition: { delay, duration: 0.7, ease: EASE_SMOOTH },
});

/** Tab panel slide — used in CakeConfigurator tabs */
export const TAB_PANEL = {
  initial:    { opacity: 0, x: -12 },
  animate:    { opacity: 1, x: 0   },
  exit:       { opacity: 0, x: 12  },
  transition: { duration: 0.25     },
} as const;

/** Stagger children */
export const staggerChild = (i: number, base = 0.12) => ({
  initial:    { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true, margin: "-60px" as const },
  transition: { delay: i * base, duration: 0.6, ease: EASE_SMOOTH },
});
