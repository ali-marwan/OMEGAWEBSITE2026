"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OmegaLogo3D, type OmegaLogo3DHandle } from "./OmegaLogo3D";

// Register the plugin once on the client.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroJourney — fixed-position 3D overlay that renders the OMEGA GLB
 * logo and choreographs its travel from hero → operating principles →
 * service system intro → first part of the service cards, then
 * gracefully exits before the AI section. Built on GSAP ScrollTrigger
 * with `scrub: 0.6` for a calm, controlled scrub.
 *
 * The journey is bound to a finite scroll range — from the top of the
 * page (`#top top top`) to the bottom of the Service System section
 * (`#services bottom top`). Past that range, opacity is already zero
 * AND a separate ScrollTrigger unmounts the entire R3F Canvas so the
 * GPU stops rendering frames during the AI section, footer, and any
 * scroll position past services.
 *
 * Five-stage timeline (driven by `progress` 0 → 1 across the journey
 * range, all values lerped within their segment, no bounce):
 *
 *   stage  progress     position (vw / vh)  scale  opacity  explode  recede
 *   ─────  ───────────  ──────────────────  ─────  ───────  ───────  ──────
 *   1      0.00–0.20    x +20→+8,  y  0     1.00→0.95   1.00    0.00     0.00
 *   2      0.20–0.45    x +8 →0,   y 0→-3   0.95→0.75   1.00→0.85   0.00     0.00→0.20
 *   3      0.45–0.65    x  0,      y -3→-7  0.75→0.50   0.85→0.55   0.00→0.30   0.20→0.55
 *   4      0.65–0.90    x  0,      y -7→-9  0.50→0.42   0.55→0.25   0.30→0.55   0.55→0.85
 *   5      0.90–1.00    x  0,      y -9→-10 0.42→0.40   0.25→0.00   0.55→0.60   0.85→1.00
 *
 * Stages 1–2 keep the logo visible and primary. Stages 3–4 settle it
 * into a quiet system object behind the cards. Stage 5 fades it out
 * completely so it's invisible by the time the AI section starts.
 *
 * Layering: `mix-blend-mode: multiply` on the Canvas blends the dark
 * logo with whatever sits beneath it (section backgrounds, card
 * surfaces, text), so the logo reads as a behind-content watermark
 * rather than as an opaque object covering UI. Card text — already
 * dark — stays fully legible because dark × dark = dark.
 *
 * The overlay only mounts on lg+ desktop with normal motion. On
 * tablet, mobile, or `prefers-reduced-motion`, the component returns
 * `null` and <Hero> falls back to its inline static OmegaMark.
 */
export function HeroJourney() {
  const innerRef = useRef<HTMLDivElement>(null);
  const logoHandle = useRef<OmegaLogo3DHandle>(null);
  const [enabled, setEnabled] = useState(false);
  // Whether the R3F Canvas should be mounted at all. Set to false once
  // the user has scrolled past the journey range so the GPU is free
  // for the rest of the page.
  const [canvasMounted, setCanvasMounted] = useState(true);

  // Decide whether to mount the heavy R3F canvas at all.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(desktop.matches && !reduce.matches);
    sync();
    desktop.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  // Set up the ScrollTriggers that drive the journey + the
  // mount/unmount lifecycle.
  useEffect(() => {
    if (!enabled) return;
    const inner = innerRef.current;
    if (!inner) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    /**
     * Apply visual values to the inner wrapper. We write directly to
     * `style.transform` / `style.opacity` so vw/vh units are
     * recomputed by the browser on viewport resize without any extra
     * JS work.
     */
    const apply = (
      posXVw: number,
      posYVh: number,
      scale: number,
      opacity: number,
      explode: number,
      recede: number
    ) => {
      inner.style.transform = `translate(-50%, -50%) translate(${posXVw}vw, ${posYVh}vh) scale(${scale})`;
      inner.style.opacity = String(opacity);
      logoHandle.current?.setExplode(explode);
      logoHandle.current?.setRecede(recede);
    };

    // Initial state (before any scroll has happened).
    apply(20, 0, 1, 1, 0, 0);

    /**
     * Primary scrub trigger — drives every visual property across
     * the bounded range hero-top → services-bottom.
     */
    const journeyTrigger = ScrollTrigger.create({
      trigger: "#top",
      start: "top top",
      endTrigger: "#services",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        let posXVw: number;
        let posYVh: number;
        let scale: number;
        let opacity: number;
        let explode: number;
        let recede: number;

        if (p < 0.2) {
          // Stage 1 — Hero. Stays clearly on the right of the viewport
          // at full size and full opacity.
          const lp = p / 0.2;
          posXVw = lerp(20, 8, lp);
          posYVh = 0;
          scale = lerp(1, 0.95, lp);
          opacity = 1;
          explode = 0;
          recede = 0;
        } else if (p < 0.45) {
          // Stage 2 — Operating Principles. Drifts to centre at scale
          // ~0.75, dim slightly. Recede begins so materials soften.
          const lp = (p - 0.2) / 0.25;
          posXVw = lerp(8, 0, lp);
          posYVh = lerp(0, -3, lp);
          scale = lerp(0.95, 0.75, lp);
          opacity = lerp(1, 0.85, lp);
          explode = 0;
          recede = lerp(0, 0.2, lp);
        } else if (p < 0.65) {
          // Stage 3 — Service System intro. Slight upward drift,
          // quieter, scale ~0.5. The deconstruction begins gently.
          const lp = (p - 0.45) / 0.2;
          posXVw = 0;
          posYVh = lerp(-3, -7, lp);
          scale = lerp(0.75, 0.5, lp);
          opacity = lerp(0.85, 0.55, lp);
          explode = lerp(0, 0.3, lp);
          recede = lerp(0.2, 0.55, lp);
        } else if (p < 0.9) {
          // Stage 4 — Service Cards. Continues the deconstruction
          // very subtly while the cards are read. Opacity tapers down
          // to ~0.25 so the logo reads as a quiet system imprint.
          const lp = (p - 0.65) / 0.25;
          posXVw = 0;
          posYVh = lerp(-7, -9, lp);
          scale = lerp(0.5, 0.42, lp);
          opacity = lerp(0.55, 0.25, lp);
          explode = lerp(0.3, 0.55, lp);
          recede = lerp(0.55, 0.85, lp);
        } else {
          // Stage 5 — Exit fade. Opacity rolls to zero before the
          // user has reached the AI section. Position barely moves —
          // the model just dissolves where it sat.
          const lp = (p - 0.9) / 0.1;
          posXVw = 0;
          posYVh = lerp(-9, -10, lp);
          scale = lerp(0.42, 0.4, lp);
          opacity = lerp(0.25, 0, lp);
          explode = lerp(0.55, 0.6, lp);
          recede = lerp(0.85, 1, lp);
        }

        apply(posXVw, posYVh, scale, opacity, explode, recede);
      },
    });

    /**
     * Lifecycle trigger — mounts/unmounts the Canvas based on whether
     * we're inside the journey range. Once the user scrolls past the
     * end of Services, the entire R3F Canvas is unmounted: rendering
     * stops, the GPU is freed, and the AI section / footer scroll
     * with no 3D overhead. Scrolling back up remounts cleanly because
     * `useGLTF.preload` keeps the GLB warm in the browser cache.
     */
    const lifecycleTrigger = ScrollTrigger.create({
      trigger: "#top",
      start: "top top",
      endTrigger: "#services",
      // A small buffer (-2 %) so unmount happens just *after* the
      // exit-fade is complete, not at the same instant.
      end: "bottom-=2% top",
      onEnter: () => setCanvasMounted(true),
      onEnterBack: () => setCanvasMounted(true),
      onLeave: () => setCanvasMounted(false),
      onLeaveBack: () => setCanvasMounted(true),
    });

    return () => {
      journeyTrigger.kill();
      lifecycleTrigger.kill();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[15]"
    >
      <div
        ref={innerRef}
        className="absolute left-1/2 top-1/2"
        style={{
          width: "min(34vw, 500px)",
          height: "min(34vw, 500px)",
          transform: "translate(-50%, -50%) translate(20vw, 0vh) scale(1)",
          opacity: 1,
          willChange: "transform, opacity",
        }}
      >
        {/* Soft warm radial halo — environmental depth */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, rgba(242,106,27,0.10) 0%, rgba(242,106,27,0.03) 22%, rgba(232,222,208,0.16) 42%, rgba(232,222,208,0) 78%)",
          }}
        />

        {/* Faint architectural orbit lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
          <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/15" />
        </div>

        {/* R3F canvas — alpha so the page background shows through.
            `mix-blend-mode: multiply` makes the dark graphite logo
            blend with whatever sits beneath the overlay (section
            backgrounds, card surfaces, page text) so the logo reads
            as a behind-content watermark rather than an opaque
            element covering UI. Mounted only while the user is
            within the journey scroll range — `canvasMounted` is
            toggled by a dedicated ScrollTrigger so the GPU is free
            during the AI section, footer, and any scroll past
            Service System. */}
        {canvasMounted && (
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 4], fov: 35 }}
            className="absolute inset-0"
            style={{
              background: "transparent",
              mixBlendMode: "multiply",
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.45} />
              <directionalLight position={[3, 5, 4]} intensity={1.0} />
              <directionalLight position={[-4, 2, -3]} intensity={0.3} />
              <Environment preset="studio" />
              <OmegaLogo3D ref={logoHandle} />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
}
