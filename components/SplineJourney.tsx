"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { SplineScene } from "./SplineScene";
import { ease, easeAtmospheric, heroTimeline } from "@/lib/motion";

const SPLINE_SCENE =
  "https://prod.spline.design/cjB0KO5ofNFuzIAU/scene.splinecode";

/**
 * Pinned 3D-logo journey across Hero → Operating Principles → start of
 * Service System.
 *
 * The Spline scene is rendered in a `position: fixed` overlay that sits
 * above page content but below the navigation/dock chrome. Pointer
 * events are disabled so it never intercepts clicks on the page.
 *
 * Scroll progress is computed from `scrollY` against the offset of the
 * `#services` section (plus a small settle margin). That gives us a
 * scroll length equal to the height of Hero + SystemBand combined —
 * naturally ~220% of viewport on a desktop layout — without hardcoding
 * any pixel values.
 *
 * Path keyframes (driven by `progress` 0 → 1):
 *
 *   progress  position             scale  opacity
 *   ─────────  ───────────────────  ─────  ───────
 *   0.00      right of hero         1.00   1.00
 *   0.35      drifts to center      0.90   1.00
 *   0.70      slightly upward       0.75   0.90
 *   1.00      settles at services   0.55   0.75
 *
 * Past `progress = 1`, the overlay fades out over ~50vh of additional
 * scroll so the Spline doesn't linger over the Service System cards.
 *
 * The overlay only mounts on lg+ (≥1024px). On tablet and mobile we let
 * the `<Hero>` component own the inline render — the spec asks for a
 * "simple fade/scale" mobile fallback, no pinning. Reduced-motion users
 * also get the inline version (no fixed overlay, no scroll choreography).
 */
export function SplineJourney() {
  const reduceMotion = useReducedMotion();
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsLargeDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /**
   * The scroll length of the journey. We measure it as the offsetTop of
   * the #services section, plus a small settle margin so the logo
   * arrives at its final position once the Service System headline is
   * actually visible (rather than the moment its <section> starts).
   */
  const journeyEnd = useMotionValue(1);

  useLayoutEffect(() => {
    const sync = () => {
      const services = document.getElementById("services");
      if (!services) return;
      const settle = services.offsetTop + Math.round(window.innerHeight * 0.08);
      journeyEnd.set(Math.max(settle, 1));
    };
    sync();
    // Re-measure when layout shifts (fonts loading, images sizing,
    // breakpoint changes). Observing body catches all of those.
    const ro = new ResizeObserver(sync);
    ro.observe(document.body);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [journeyEnd]);

  const { scrollY } = useScroll();

  // Clamped 0 → 1 over the journey range.
  const progress = useTransform<number, number>(
    [scrollY, journeyEnd],
    ([y, end]) => {
      if (end <= 0) return 0;
      const p = y / end;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }
  );

  // ── Path keyframes ──────────────────────────────────────────────────
  // x is the desired viewport-x of the logo center, in vw.
  // y is the desired viewport-y of the logo center, in vh.
  const posX = useTransform(progress, [0, 0.35, 0.7, 1], [76, 50, 50, 50]);
  const posY = useTransform(progress, [0, 0.35, 0.7, 1], [50, 50, 40, 30]);
  const scale = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    [1.0, 0.9, 0.75, 0.55]
  );

  // Opacity stays high through the journey — never below 0.75 on the
  // way through. The user must always see the logo as a guide.
  const journeyOpacity = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    [1.0, 1.0, 0.9, 0.75]
  );

  /**
   * Tail fade — runs *after* the journey completes. Computed from raw
   * scrollY against journeyEnd so it isn't constrained by the clamped
   * `progress` value. We fade from 1 → 0 over ~50% of viewport height
   * past the settle point. By the time the user is reading the service
   * cards, the overlay is fully invisible.
   */
  const tailOpacity = useTransform<number, number>(
    [scrollY, journeyEnd],
    ([y, end]) => {
      if (end <= 0) return 1;
      const past = y - end;
      if (past <= 0) return 1;
      const fadePx =
        typeof window !== "undefined" ? window.innerHeight * 0.5 : 600;
      const t = past / fadePx;
      return t > 1 ? 0 : 1 - t;
    }
  );

  const opacity = useTransform<number, number>(
    [journeyOpacity, tailOpacity],
    ([a, b]) => a * b
  );

  const left = useMotionTemplate`${posX}vw`;
  const top = useMotionTemplate`${posY}vh`;

  // Only render the overlay on lg+ desktops. Tablet/mobile keep the
  // simple inline render that lives in <Hero>. Wait until mounted so
  // the matchMedia query has settled — prevents an SSR/CSR mismatch.
  if (!mounted || !isLargeDesktop || reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[15]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
          delay: heroTimeline.splineStage,
          ease,
        }}
        // Position is driven by motion templates on `left` / `top`.
        // We center the box on (left, top) using x/y = -50%. Scale and
        // opacity ride on top of the entrance animation via styles.
        style={{
          position: "absolute",
          left,
          top,
          x: "-50%",
          y: "-50%",
          scale,
          opacity,
          width: "min(34vw, 500px)",
          height: "min(34vw, 500px)",
          willChange: "transform, opacity",
        }}
      >
        {/* Inner continuous float — atmospheric drift, doesn't fight the
            scroll-driven transform composition above it. */}
        <motion.div
          className="relative h-full w-full"
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: easeAtmospheric,
            delay: heroTimeline.splineStage + 1.0,
          }}
        >
          {/* Soft warm radial halo */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(closest-side, rgba(242,106,27,0.09) 0%, rgba(242,106,27,0.03) 22%, rgba(232,222,208,0.16) 42%, rgba(232,222,208,0) 78%)",
            }}
          />

          {/* Faint technical circular linework */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
            <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/15" />
          </div>

          {/* Outer orbit ring — slow continuous rotation with a single
              orange satellite tick. Reads as "live system in motion"
              without competing with the Spline. ~36s per revolution. */}
          <motion.div
            className="pointer-events-none absolute -inset-[6%]"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{
              duration: 36,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-line/18" />
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-omega/55 shadow-[0_0_10px_rgba(242,106,27,0.45)]" />
          </motion.div>

          {/* Live Spline scene */}
          <SplineScene
            scene={SPLINE_SCENE}
            className="absolute inset-0"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
