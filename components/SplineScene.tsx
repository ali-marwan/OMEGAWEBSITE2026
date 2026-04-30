"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";

const Spline = dynamic(
  () => import("@splinetool/react-spline").then((m) => m.default),
  { ssr: false, loading: () => null }
);

type SplineSceneProps = {
  /** `.splinecode` asset URL from `prod.spline.design/<id>/scene.splinecode`. */
  scene: string;
  className?: string;
  /**
   * Block wheel events from reaching the Spline canvas so page scroll
   * cannot drive the scene's camera or zoom. Mouse hover, click, and
   * touch still pass through, so the scene's own hover / look-at-cursor
   * / click animations keep working. Defaults to true.
   */
  blockScrollCamera?: boolean;
  /**
   * CSS filter applied to the rendered scene — used to lift pure black
   * to a warm graphite tone so the 3D object reads as a premium
   * engineered material rather than flat ink.
   */
  filter?: string;
  /** CSS clip-path applied to the canvas wrapper. Defaults to "none". */
  clipPath?: string;
  onLoad?: (app: Application) => void;
};

/**
 * Loads a Spline runtime scene with a transparent background that blends
 * cleanly with the page. The render loop runs normally so the scene's
 * own animations and mouse-driven interactions stay live, but page
 * scroll is prevented from driving the camera.
 *
 * Cache-busting strategy:
 *   We append a `?v=<base36 timestamp>` query string to the `.splinecode`
 *   URL on every page load (computed in a client-only effect to avoid
 *   SSR/CSR hydration mismatch). Combined with `key={src}` on the Spline
 *   element, this guarantees a fresh fetch — browsers, the Spline CDN,
 *   and any intermediate caches cannot serve a stale published scene.
 */
export function SplineScene({
  scene,
  className,
  blockScrollCamera = true,
  filter = "contrast(0.82) brightness(1.13) saturate(0.88) sepia(0.05)",
  clipPath = "none",
  onLoad,
}: SplineSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Defer the cache-busted URL to a client-only effect so SSR HTML is
  // identical to the first hydrated render (no `Date.now()` mismatch).
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    const sep = scene.includes("?") ? "&" : "?";
    setSrc(`${scene}${sep}v=${Date.now().toString(36)}`);
  }, [scene]);

  const handleLoad = useCallback(
    (app: Application) => {
      try {
        app.setBackgroundColor("transparent");
      } catch {
        /* runtime version variance — ignore */
      }
      onLoad?.(app);
    },
    [onLoad]
  );

  useEffect(() => {
    if (!blockScrollCamera) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Capture-phase wheel listener on the wrapper. Fires before the
    // canvas's bubble-phase wheel listener, so Spline's wheel handler
    // never sees the event. We pass the event through (no preventDefault)
    // so the browser performs its native scroll on the page.
    const onWheel = (event: Event) => {
      event.stopImmediatePropagation();
    };
    wrapper.addEventListener("wheel", onWheel, {
      capture: true,
      passive: true,
    });

    return () => {
      wrapper.removeEventListener("wheel", onWheel, {
        capture: true,
      } as EventListenerOptions);
    };
  }, [blockScrollCamera]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        background: "transparent",
        filter,
        clipPath,
      }}
    >
      {src && (
        <Spline
          // `key={src}` forces a clean remount when the cache-buster
          // changes, so the runtime fetches a fresh `.splinecode` rather
          // than reusing the previously parsed scene.
          key={src}
          scene={src}
          onLoad={handleLoad}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      )}
    </div>
  );
}
