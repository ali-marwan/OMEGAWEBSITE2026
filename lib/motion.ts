/**
 * OMEGA motion system — single source of truth for easing, duration,
 * and reusable variants. Keep curves smooth and slow; no bounce, no
 * elastic, no playful overshoot.
 */
import type { Variants } from "framer-motion";

/** Cubic-bezier ease used across the entire site — calm, engineered. */
export const ease = [0.22, 1, 0.36, 1] as const;

/** Slightly slower curve for atmospheric continuous motion. */
export const easeAtmospheric = [0.42, 0, 0.58, 1] as const;

export const duration = {
  micro: 0.4,
  short: 0.6,
  base: 0.9,
  long: 1.2,
} as const;

/** Page-load timeline for the hero (in seconds). Total under 1.5s. */
export const heroTimeline = {
  eyebrow: 0.0,
  headlineLine1: 0.1,
  headlineLine2: 0.22,
  paragraph: 0.4,
  ctaGroup: 0.58,
  splineStage: 0.7,
  dockFollows: 1.05,
} as const;

/** Standard fade-up reveal — used for almost every element on scroll. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease },
  },
};

/** Quieter fade-up for inline / smaller items (descriptions, ticks). */
export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

/** Pure fade with no displacement — for canvases, large surfaces. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.long, ease },
  },
};

/**
 * Container variant that staggers children — pair with a child variant
 * (fadeUp / fadeUpSmall). Use `delayChildren` to gate the cascade.
 */
export const stagger = (
  staggerChildren = 0.08,
  delayChildren = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Common viewport options for whileInView reveals. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
