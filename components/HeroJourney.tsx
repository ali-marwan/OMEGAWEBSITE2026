"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OmegaLogo3D, type OmegaLogo3DHandle } from "./OmegaLogo3D";

// Register the plugin once on the client. ScrollTrigger lives in the
// free GSAP tier and registering more than once is a no-op, but the
// guard avoids touching `window` on the server during module init.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroJourney — fixed-position 3D overlay that renders the OMEGA GLB
 * logo and choreographs its travel from hero → operating principles
 * → top of the Service System using GSAP ScrollTrigger.
 *
 * The overlay is `position: fixed` (lives outside the page document
 * flow) and its inner wrapper's transform is updated on every scroll
 * scrub frame. Because we are NOT pinning a section, the rest of the
 * page scrolls normally underneath; only the logo moves on top of it.
 *
 * Scroll keyframes (driven by `ScrollTrigger.progress` over the range
 * `#top top top` → `#services top+=10% top` — roughly the height of
 * Hero + Operating Principles, ≈ 220 % of viewport on desktop):
 *
 *   progress  position (vw / vh)  scale   opacity   explode  recede
 *   ─────────  ──────────────────  ──────  ────────  ───────  ───────
 *   0.00      x +20vw,  y +0vh    1.00    1.00      0.00     0.00
 *   0.35      x   0vw,  y +0vh    0.90    1.00      0.00     0.00
 *   0.70      x   0vw,  y −5vh    0.72    0.85      0.45     0.40
 *   1.00      x   0vw,  y −8vh    0.50    0.55      1.00     1.00
 *
 * The explode/recede scalars are forwarded to the imperative handle
 * exposed by <OmegaLogo3D>, which translates them into per-mesh
 * radial displacement and material softening.
 *
 * The overlay only renders on lg+ desktops with normal motion. On
 * tablet, mobile, or `prefers-reduced-motion: reduce`, this returns
 * `null` and <Hero> falls back to its inline static OmegaMark.
 */
export function HeroJourney() {
  const innerRef = useRef<HTMLDivElement>(null);
  const logoHandle = useRef<OmegaLogo3DHandle>(null);
  const [enabled, setEnabled] = useState(false);

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

  // Set up the ScrollTrigger that drives the journey.
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

    const trigger = ScrollTrigger.create({
      trigger: "#top",
      start: "top top",
      endTrigger: "#services",
      end: "top+=10% top",
      // Scrub with a tiny lag for premium feel — the logo eases toward
      // its target rather than snapping. No bounce, no elastic.
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        // Three-segment journey, all values lerped within their segment.
        let posXVw: number;
        let posYVh: number;
        let scale: number;
        let opacity: number;
        let explode: number;
        let recede: number;

        if (p < 0.35) {
          // Hero (right of viewport → drifts toward center)
          const lp = p / 0.35;
          posXVw = lerp(20, 0, lp);
          posYVh = 0;
          scale = lerp(1, 0.9, lp);
          opacity = 1;
          explode = 0;
          recede = 0;
        } else if (p < 0.7) {
          // Operating Principles (settled at center, beginning to lift)
          const lp = (p - 0.35) / 0.35;
          posXVw = 0;
          posYVh = lerp(0, -5, lp);
          scale = lerp(0.9, 0.72, lp);
          opacity = lerp(1, 0.85, lp);
          explode = lerp(0, 0.45, lp);
          recede = lerp(0, 0.4, lp);
        } else {
          // Service System intro (smaller, exploded, receded — guides
          // the eye into the section without competing with it)
          const lp = (p - 0.7) / 0.3;
          posXVw = 0;
          posYVh = lerp(-5, -8, lp);
          scale = lerp(0.72, 0.5, lp);
          opacity = lerp(0.85, 0.55, lp);
          explode = lerp(0.45, 1, lp);
          recede = lerp(0.4, 1, lp);
        }

        apply(posXVw, posYVh, scale, opacity, explode, recede);
      },
    });

    return () => {
      trigger.kill();
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
          // Initial transform — keeps the layout stable until the
          // ScrollTrigger has measured and applied its first frame.
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

        {/* R3F canvas — alpha so the page background shows through */}
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 4], fov: 35 }}
          className="absolute inset-0"
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            {/* Ambient + key + fill — controlled architectural lighting.
                The studio HDRI environment supplies subtle reflections
                without baking a literal cube into the background. */}
            <ambientLight intensity={0.45} />
            <directionalLight position={[3, 5, 4]} intensity={1.0} />
            <directionalLight position={[-4, 2, -3]} intensity={0.3} />
            <Environment preset="studio" />
            <OmegaLogo3D ref={logoHandle} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
