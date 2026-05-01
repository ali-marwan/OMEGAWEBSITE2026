"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Lazy chunk loader for the WebGPU grass-field canvas.
 *
 * Why this exists:
 *   The grass canvas pulls `three/webgpu`, `three/tsl`, and a TSL
 *   shader graph — multi-hundred-KB of code that should never ship in
 *   the initial /insights bundle. `next/dynamic({ ssr: false })`
 *   keeps it in its own chunk, fetched only when this component
 *   actually decides to mount the inner module.
 *
 * Gating order (each gate must pass before the chunk is mounted):
 *   1. Browser supports WebGPU (`navigator.gpu`). Required by the
 *      Verdana-style runtime; without it the chunk would just throw.
 *   2. Viewport ≥ md (768 px). Mobile devices skip the heavy GPU
 *      compute and fall back to the parent's static dark fallback.
 *   3. `prefers-reduced-motion: reduce` is NOT set.
 *
 * If any gate fails, this component renders nothing — the parent
 * `GrassFieldHero`'s static dark gradient + grain layer carries the
 * visual intent on its own (and never downloads any 3D code).
 *
 * Note on IntersectionObserver:
 *   This component is used as the hero — it is in viewport from the
 *   first paint, so IO would just add latency. (For mid-page lazy
 *   sections like the Spline panel, IO does pull its weight.)
 */
const Canvas = dynamic(() => import("./GrassFieldCanvas"), {
  ssr: false,
  loading: () => null,
});

export function GrassFieldCanvasClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) return;

    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqMd.matches || mqReduce.matches) return;

    setShouldRender(true);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 transition-opacity duration-700 ease-elegant"
      style={{ opacity: shouldRender ? 1 : 0 }}
    >
      {shouldRender ? <Canvas /> : null}
    </div>
  );
}
