"use client";

import { useEffect, useRef } from "react";

/**
 * WaveCanvas — fixed full-viewport background of slow, layered
 * sine-wave bands. Pure 2D canvas, no dependencies.
 *
 * What's different from the original Verdana demo:
 *   - The canvas paints its own warmwhite background every frame
 *     (not a transparent canvas), so the page reads as flat white.
 *   - Palette is mapped to OMEGA's warm tokens (sand-ochre · amber ·
 *     omega-orange) instead of the demo's blue/purple/magenta.
 *   - Density (lines × segments) is roughly a quarter of the demo
 *     and the loop is throttled to ~30 fps so it stays cheap on
 *     mid-tier laptops.
 *
 * How it composes with the page:
 *   - `position: fixed; inset: 0; z-index: 0; pointer-events: none;`
 *     so it's a viewport-locked background that never intercepts
 *     clicks, scroll, or hover.
 *   - The page is wrapped in `<main className="relative z-10">`, so
 *     all sections paint above the canvas.
 *   - Top-level light sections (`bg-warmwhite`, `bg-sand-gradient`)
 *     are made fully transparent via the `[data-wave-bg] > section`
 *     rule in `globals.css` so the canvas's white + waves IS the
 *     page background. Dark sections (the inner Spline panel, the
 *     Footer's inner content layer) carry their own opaque dark
 *     surface on top, so they're unaffected.
 *
 * Performance / accessibility gates (enforced inside useEffect):
 *   - `prefers-reduced-motion: reduce` → renderer never starts;
 *     the page falls back to the static warmwhite body color.
 *   - Mobile (<768 px) → renderer never starts. Mobile devices get
 *     the static warmwhite body color, no canvas cost.
 *   - DevicePixelRatio capped at 1.5 to keep the buffer small.
 *   - Page Visibility API → animation loop pauses while the tab is
 *     hidden (and resumes on return).
 *   - 30 fps throttle (timestamp-based) → roughly half the per-second
 *     work vs an unthrottled rAF loop.
 *   - Resize is rAF-debounced.
 *
 * Cleanup discipline:
 *   On unmount the rAF is cancelled and every listener (mousemove,
 *   touchmove, resize, visibilitychange) is removed. Safe to mount/
 *   unmount across route transitions or React strict-mode double-
 *   invocation.
 */
export function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    if (window.innerWidth < 768) return; // mobile skip — keep phones cheap

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const NUM_BANDS = 3;
    const LINES_PER_BAND = 22;
    const STEPS = 72;
    const FRAME_MIN_MS = 1000 / 30; // 30fps cap

    function resizeNow() {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeNow();

    let resizeRaf = 0;
    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resizeNow);
    }

    const targetMouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };
    let time = 0;

    function onMouseMove(e: MouseEvent) {
      targetMouse.x = (e.clientX / W - 0.5) * 2;
      targetMouse.y = (e.clientY / H - 0.5) * 2;
    }
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      targetMouse.x = (t.clientX / W - 0.5) * 2;
      targetMouse.y = (t.clientY / H - 0.5) * 2;
    }

    // ── OMEGA warm palette
    //   Band 0 — closest, sand-ochre
    //   Band 1 — mid, deeper amber
    //   Band 2 — farthest, omega-orange
    const bandColors: Array<{ r: number; g: number; b: number }> = [
      { r: 168, g: 130, b: 70 },
      { r: 196, g: 122, b: 50 },
      { r: 242, g: 106, b: 27 },
    ];

    const bandConfig = [
      { yBase: 0.22, amp1: 0.22, amp2: 0.13, freq1: 0.8, freq2: 1.5, phase: 0.0, spread: 0.38, speed: 1.0 },
      { yBase: 0.52, amp1: 0.16, amp2: 0.18, freq1: 1.6, freq2: 0.7, phase: 2.1, spread: 0.3, speed: 0.61 },
      { yBase: 0.78, amp1: 0.28, amp2: 0.1, freq1: 1.1, freq2: 3.1, phase: 4.4, spread: 0.36, speed: 0.38 },
    ];
    const depthFactors = [1.0, 0.55, 0.25];
    const horizShifts = [38, 18, 7];

    // Pure white background fill — maximum contrast for the warm
    // wave bands and the cleanest possible page surface.
    const BG_FILL = "#ffffff";

    function getWaveY(
      band: number,
      lineIdx: number,
      x: number,
      t: number,
      mx: number,
      my: number
    ): number {
      const progress = lineIdx / (LINES_PER_BAND - 1);
      const cfg = bandConfig[band];
      const depthFactor = depthFactors[band];
      const mouseInfluenceX = mx * 0.04 * depthFactor;
      const mouseInfluenceY = my * 0.06 * depthFactor;
      const horizShift = mx * horizShifts[band];
      const normX = (x - horizShift) / W;
      const baseY = cfg.yBase + progress * cfg.spread - cfg.spread * 0.5;
      const bandExtra =
        band === 0
          ? Math.sin(normX * Math.PI * 5.1 + t * 0.31 + progress * 2.5) * 0.055 * H
          : band === 1
          ? Math.cos(normX * Math.PI * 2.4 - t * 0.44 + progress * 0.8) * 0.085 * H
          : Math.sin(normX * Math.PI * 4.2 + t * 0.22 - progress * 3.1) * 0.065 * H;
      const bt = t * cfg.speed;
      const wave =
        Math.sin(normX * Math.PI * 2 * cfg.freq1 + bt * 0.4 + cfg.phase) *
          cfg.amp1 *
          H +
        Math.sin(
          normX * Math.PI * 2 * cfg.freq2 - bt * 0.25 + cfg.phase * 0.5
        ) *
          cfg.amp2 *
          H +
        Math.sin(normX * Math.PI * 3.3 + bt * 0.18 + progress * 1.2) * 0.03 * H +
        Math.sin(normX * Math.PI * 7.7 - bt * 0.55 + progress * 4.3) *
          0.018 *
          H *
          cfg.speed +
        bandExtra;
      const distortion =
        Math.sin(normX * Math.PI + mouseInfluenceX * 3 + t * 0.1) *
        mouseInfluenceY *
        H *
        1.2;
      return (baseY + mouseInfluenceY * 0.5) * H + wave + distortion;
    }

    function drawBand(band: number, t: number) {
      const col = bandColors[band];
      ctx!.lineWidth = 0.8;
      const horizShift = smoothMouse.x * horizShifts[band];
      for (let li = 0; li < LINES_PER_BAND; li++) {
        const prog = li / (LINES_PER_BAND - 1);
        // Low alpha range — waves should read as a faint "premium
        // breath" against the warmwhite, never compete with body
        // copy or the orange brand mark.
        const alpha = 0.05 + (1 - Math.abs(prog - 0.5) * 2) * 0.09;
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
        for (let s = 0; s <= STEPS; s++) {
          const x = (s / STEPS) * W + horizShift;
          const y = getWaveY(
            band,
            li,
            x,
            t,
            smoothMouse.x,
            smoothMouse.y
          );
          if (s === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
    }

    let rafId = 0;
    let running = false;
    let lastFrame = 0;
    function frame(now: number) {
      if (!running) return;
      rafId = requestAnimationFrame(frame);
      if (now - lastFrame < FRAME_MIN_MS) return;
      lastFrame = now;
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.05;
      time += 0.016; // step roughly matches 30fps
      ctx!.fillStyle = BG_FILL;
      ctx!.fillRect(0, 0, W, H);
      for (let b = 0; b < NUM_BANDS; b++) drawBand(b, time);
    }
    function start() {
      if (running) return;
      running = true;
      lastFrame = 0;
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ display: "block", background: "#ffffff" }}
    />
  );
}
