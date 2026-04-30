"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { OmegaMark } from "./OmegaMark";
import { SplineScene } from "./SplineScene";
import { ease, easeAtmospheric, heroTimeline } from "@/lib/motion";

const SPLINE_SCENE =
  "https://prod.spline.design/cjB0KO5ofNFuzIAU/scene.splinecode";

/**
 * Page-load timeline (orchestrated, total < 1.5s):
 *   eyebrow      → 0.00s
 *   headline /1  → 0.10s
 *   headline /2  → 0.22s
 *   paragraph    → 0.40s
 *   CTA group    → 0.58s (children stagger 0.08s)
 *   Spline stage → 0.70s (after text settles)
 *
 * Scroll behavior:
 *   - On lg+ (≥1024px) the Spline is owned by the global
 *     <SplineJourney> overlay rendered in `app/page.tsx`. That overlay
 *     pins the logo across Hero → Operating Principles → start of the
 *     Service System. Inside Hero we just reserve the grid slot so the
 *     left/right column ratio stays intact.
 *   - On md to <lg (tablet) the Spline renders inline with a soft
 *     entrance + continuous float, no scroll-driven movement.
 *   - On <md (mobile) we render a static OmegaMark fallback.
 *
 * Hero text and the architectural grid still respond to scroll —
 * subtle, never punishing. Those are decoupled from the Spline.
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Track viewport — disable elaborate scroll choreography on small screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /**
   * Manual scroll progress over the hero. We track raw `scrollY` and
   * map [0 → heroHeight] to [0 → 1]. Used for hero text parallax and
   * the architectural grid reveal.
   *
   * The Spline is *not* driven from this signal anymore — its journey
   * is governed by <SplineJourney> against the #services landmark.
   */
  const { scrollY } = useScroll();
  const heroHeight = useMotionValue(1);

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const sync = () => heroHeight.set(Math.max(el.offsetHeight, 1));
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [heroHeight]);

  // Combine scrollY + heroHeight into a clamped [0, 1] progress signal.
  const scrollProgress = useTransform<number, number>(
    [scrollY, heroHeight],
    ([y, h]) => {
      if (h <= 0) return 0;
      const p = y / h;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }
  );

  const fullJourney = !reduceMotion && !isMobile;

  // ── Hero text scroll transforms ─────────────────────────────────────
  // Subtle parallax fade-up — disabled when motion is reduced.
  const textY = useTransform(
    scrollProgress,
    [0, 1],
    fullJourney ? ["0%", "-6%"] : ["0%", "0%"]
  );
  const textOpacity = useTransform(
    scrollProgress,
    [0, 0.6, 1],
    reduceMotion ? [1, 1, 1] : [1, 0.85, 0.55]
  );

  // ── Architectural grid background — emerges as user scrolls ─────────
  const gridOpacity = useTransform(
    scrollProgress,
    [0, 0.4, 1],
    reduceMotion ? [0, 0, 0] : [0, 0.55, 0.85]
  );

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative isolate overflow-hidden bg-sand-gradient pt-32 pb-24 md:pt-40 md:pb-28"
    >
      {/* Architectural micro-grid — opacity scrolls in. Sits behind everything. */}
      <motion.div
        aria-hidden
        style={{ opacity: gridOpacity }}
        className="pointer-events-none absolute inset-0 arch-grid"
      />

      {/* Top hairline — kept as a single architectural horizon, no grid */}
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto max-w-page px-6 lg:px-10">
        <div className="h-px arch-rule" />
      </div>

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Eyebrow row. Each text-bearing element is preceded by a
            literal " " text node so the rendered textContent reads as
            "OMEGA / 001 — System Overview v1.0 · Foundation UAE"
            instead of joining "Foundation" with "UAE" or "Overview"
            with "v1.0". The decorative dot/bar elements get
            `aria-hidden` so screen readers ignore them entirely. */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: heroTimeline.eyebrow, ease }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>OMEGA / 001 — System Overview</span>
          </div>
          {/* Whitespace text node between the eyebrow's left and right
              groups so "Overview" and "v1.0" don't read as one word. */}
          {" "}
          <div className="hidden md:flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
            <span>v1.0 · Foundation</span>
            {" "}
            <span aria-hidden className="h-3 w-px bg-line" />
            {" "}
            <span>UAE</span>
          </div>
        </motion.div>
        {/*
          Real newline character between the eyebrow row and the
          headline grid. A plain space would leave the last word of
          the eyebrow sitting next to the first word of the headline
          in flat textContent. The newline keeps the visual layout
          identical (the grid block takes its own line anyway) and
          inserts an actual newline character so the two pieces of
          copy can never read as one sentence in any plain-text view
          of the document.
        */}
        {"\n"}

        {/* Premium split: 45% text · 55% live 3D */}
        <div className="mt-12 md:mt-20 grid items-center gap-y-16 gap-x-6 lg:grid-cols-[45fr_55fr]">
          {/* Left column — outer scroll-parallax wrapper */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="relative z-10 will-change-transform"
          >
            {/*
              Two-line hero headline.
                Line 1 — strong (font-bold) primary statement.
                Line 2 — lighter (font-light, muted) supporting line.

              The two lines are kept apart three ways:
                1. `block` on each span → CSS line break.
                2. `mt-2 md:mt-3` on the second span → visible spacing.
                3. A literal whitespace text node between the spans →
                   guarantees a real space character lands in the DOM
                   textContent so copy-paste, screen readers, and any
                   text audit see two separate sentences.
            */}
            <h1 className="font-sans text-[2.6rem] md:text-[3.6rem] lg:text-[4.4rem] leading-[1.04] tracking-tightest text-graphite">
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: heroTimeline.headlineLine1,
                  ease,
                }}
                className="block font-bold"
              >
                One System for Property Care.
              </motion.span>
              {" "}
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: heroTimeline.headlineLine2,
                  ease,
                }}
                className="mt-2 md:mt-3 block font-light text-muted"
              >
                Elevated by{" "}
                <span className="relative inline-block text-graphite/90">
                  Engineering.
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-omega/70" />
                </span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: heroTimeline.paragraph,
                ease,
              }}
              className="mt-9 max-w-xl text-base md:text-lg leading-[1.75] text-muted"
            >
              Integrated property solutions across the UAE — from home
              services and property health reports to renovation,
              engineering support, and AI-guided service assistance.
            </motion.p>

            {/* CTA group — staggered children. A literal whitespace
                text node between the two anchors guarantees their
                labels never join in DOM textContent. `flex gap-4`
                handles the visual spacing. */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: heroTimeline.ctaGroup,
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="mt-16 flex flex-wrap items-stretch gap-4"
            >
              <motion.a
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease },
                  },
                }}
                href="#hub"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite hover:bg-graphite/90 transition-colors duration-500 ease-elegant"
              >
                Open OMEGA Service Hub
                <Arrow />
              </motion.a>
              {" "}
              <motion.a
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease },
                  },
                }}
                href="#ai"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite hover:border-graphite/40 transition-colors duration-500 ease-elegant"
              >
                Start Diagnosis
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right column — Spline stage.
              On lg+ this is just a layout placeholder (the global
              <SplineJourney> overlay renders the actual logo). On md
              to <lg the inline Spline animates in. On <md a static
              OmegaMark fallback is shown. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: heroTimeline.splineStage,
              ease,
            }}
            className="relative z-0"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: easeAtmospheric,
                delay: heroTimeline.splineStage + 1.0,
              }}
            >
              <SplineStage />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h8m0 0L7 3m4 4-4 4" />
    </svg>
  );
}

/**
 * Floating 3D stage. The Spline scene is centered with a soft warm
 * radial glow behind it.
 *
 * Breakpoint behavior:
 *   <md (mobile)   → static OmegaMark fallback (no GPU work)
 *    md to <lg     → inline Spline + halo + circular linework
 *   ≥lg (desktop)  → invisible placeholder. The fixed-position
 *                    <SplineJourney> overlay renders the logo and
 *                    pins it across Hero → Principles → Services.
 *
 * In all three modes the outer aspect-square box is the same size, so
 * the hero grid keeps the same left/right column ratio whether the
 * journey overlay is active or not.
 */
function SplineStage() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]">
      {/* Layered warm radial — hidden on lg (overlay has its own halo) */}
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "radial-gradient(closest-side, rgba(242,106,27,0.09) 0%, rgba(242,106,27,0.03) 22%, rgba(232,222,208,0.16) 42%, rgba(232,222,208,0) 78%)",
        }}
      />

      {/* Faint technical circular linework — md+ only, lg overlay owns it */}
      <div className="pointer-events-none absolute inset-0 hidden md:block lg:hidden">
        <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
        <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/15" />
      </div>

      {/* Mobile fallback — static OMEGA mark, no GPU work */}
      <div className="absolute inset-0 flex items-center justify-center md:hidden">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-[220px] w-[220px] rounded-full border border-line/60" />
          <div className="absolute h-[300px] w-[300px] rounded-full border border-line/35" />
          <OmegaMark size={96} className="text-graphite/85" />
        </div>
      </div>

      {/* Tablet inline — Spline lives here only between md and lg.
          On lg+ the global <SplineJourney> overlay handles it instead. */}
      <SplineScene
        scene={SPLINE_SCENE}
        className="absolute inset-0 hidden md:block lg:hidden"
      />
    </div>
  );
}
