"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Lazy chunk loader for the Spline canvas.
 *
 * Why split this out:
 *   `@splinetool/react-spline` + `@splinetool/runtime` is a multi-
 *   hundred-KB dependency graph. Shipping it in the initial homepage
 *   bundle would inflate Time-to-Interactive for every visitor —
 *   including mobile and reduced-motion users who never see the scene.
 *   `next/dynamic({ ssr: false })` here means the chunk is only ever
 *   fetched on the client, after the page has rendered, and only
 *   when this component decides to mount the inner module.
 */
const Scene = dynamic(() => import("./SplineFeatureScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Mounts the lazy Spline scene only when ALL of these are true:
 *   - viewport is ≥ md (768 px) — the cursor-following light effect
 *     is pointer-driven and looks weak on touch; we keep mobile on the
 *     static dark fallback for performance + cleaner UX.
 *   - the user has NOT requested `prefers-reduced-motion: reduce`.
 *   - the section's container has reached within 200 px of the
 *     viewport (IntersectionObserver), so the chunk only fetches when
 *     the user is actually about to see it.
 *
 * In any of the gating cases the static dark fallback layer behind
 * this component (a radial-glow + faint architectural grid rendered
 * by the parent section) carries the visual on its own — the section
 * never appears empty.
 *
 * Static fallback discipline:
 *   This component renders ONLY the Spline canvas (or null). The
 *   surrounding dark surface, glow, grid, vignette, and content
 *   overlay live in `SplineFeatureSection.tsx` so they SSR for SEO
 *   and first-paint, and so reduced-motion / mobile users get a
 *   complete, intentional-looking visual without ever loading the
 *   3D runtime.
 */
export function SplineFeatureSceneClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const mqAtLeastMd = window.matchMedia("(min-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqAtLeastMd.matches || mqReduce.matches) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 transition-opacity duration-700 ease-elegant"
      style={{ opacity: shouldRender ? 1 : 0 }}
    >
      {shouldRender ? <Scene /> : null}
    </div>
  );
}
