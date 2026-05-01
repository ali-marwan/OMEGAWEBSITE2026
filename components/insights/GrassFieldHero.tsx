import Link from "next/link";
import { GrassFieldCanvasClient } from "./GrassFieldCanvasClient";

/**
 * `/insights` — Sandbox immersive hero.
 *
 * Replaces the standard `<InsightsHero />` on /insights only (no
 * other route is touched). Used to evaluate the "Verdana-style"
 * WebGPU grass background ported into OMEGA's warm palette
 * (graphite base · sand tip · omega-orange highlight).
 *
 * Visual stack (back → front):
 *   1. `bg-[#0c0b0a]` outer surface — what shows on mobile, in
 *      reduced-motion mode, on browsers without WebGPU, and during
 *      the brief moment before the canvas hydrates.
 *   2. Static fallback gradient + faint architectural grid + warm
 *      horizon glow — covers SSR, mobile, and unsupported browsers
 *      so the hero never appears blank.
 *   3. `<GrassFieldCanvasClient />` — lazy-loaded WebGPU grass field
 *      with mouse-bend physics. Only mounts on md+ desktop, with
 *      normal motion preferences, on a WebGPU-capable browser, and
 *      only when the section is near the viewport.
 *   4. Bottom-up readability scrim (`from-[#0c0b0a]` → transparent)
 *      so the headline + CTAs always meet contrast targets regardless
 *      of where the cursor lands in the field.
 *   5. Content overlay — eyebrow, italic-emphasis headline, subtitle,
 *      CTAs, breadcrumb. Server-rendered for SEO + LCP.
 *
 * Accessibility:
 *   - The canvas + every decorative gradient is `aria-hidden`.
 *   - Headline uses a real `<h1 id="insights-hero-heading">` and the
 *     section is labelled by it.
 *   - Both CTAs are real `<Link>` to the existing routes.
 *   - Anchor `id="top"` matches what `<InsightsHero />` exposed so
 *     the breadcrumb / floating dock targets continue to work.
 */
export function GrassFieldHero() {
  return (
    <section
      id="top"
      aria-labelledby="insights-hero-heading"
      className="relative isolate overflow-hidden bg-[#0c0b0a]"
    >
      {/* Static fallback layer — base gradient + warm horizon glow.
          Always painted (SSR), so the section is never blank. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(242,106,27,0.18) 0%, rgba(242,106,27,0.05) 35%, rgba(12,11,10,0) 65%), linear-gradient(180deg, #050505 0%, #0c0b0a 55%, #1a120a 100%)",
        }}
      />

      {/* Faint architectural grid — white-on-dark to keep the OMEGA
          grid language alive against the dark hero. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 35%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 35%, black 45%, transparent 100%)",
        }}
      />

      {/* Lazy WebGPU grass field — desktop + WebGPU + normal motion only. */}
      <GrassFieldCanvasClient />

      {/* Bottom-up readability scrim so headline + CTAs stay legible
          over any frame of the canvas. Strong at the bottom (where
          the text sits), fades to transparent toward the sky. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,11,10,0.55) 0%, rgba(12,11,10,0.25) 35%, rgba(12,11,10,0.55) 65%, rgba(12,11,10,0.92) 100%)",
        }}
      />

      {/* Content overlay — server-rendered for SEO + LCP. */}
      <div className="relative mx-auto flex min-h-[88svh] max-w-page flex-col px-6 pt-32 pb-16 md:min-h-[92svh] md:pt-40 md:pb-24 lg:px-10">
        {/* Top hairline — same architectural cue as the rest of OMEGA. */}
        <div
          aria-hidden
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(216,207,194,0.35) 18%, rgba(216,207,194,0.35) 82%, transparent 100%)",
          }}
        />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-warmwhite/55"
        >
          <Link
            href="/"
            className="text-warmwhite/65 transition-colors duration-500 ease-elegant hover:text-omega"
          >
            Home
          </Link>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-omega">Insights</span>
        </nav>

        {/* Eyebrow */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-warmwhite/55">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Insights</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-warmwhite/20" />
          {" "}
          <span>UAE Property Systems</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-warmwhite/20" />
          {" "}
          <span>Editorial</span>
        </div>

        {/* Push the headline + supporting block toward the bottom of
            the hero so the canvas dominates the upper field. */}
        <div className="mt-auto pt-12 md:pt-16">
          {/* Italic-emphasis headline — the typographic move from the
              Verdana demo, mapped to OMEGA's bold/light split.
              "OMEGA Insights" stays as the H1 plain title; the
              follow-up line carries the italic accent. */}
          <h1
            id="insights-hero-heading"
            className="max-w-4xl font-sans text-[2.4rem] leading-[1.04] tracking-tightest text-warmwhite md:text-[3.2rem] lg:text-[3.9rem]"
          >
            <span className="block font-bold">OMEGA Insights</span>
            {" "}
            <span className="mt-2 block font-light text-warmwhite/75 md:mt-3">
              Built on{" "}
              <em
                className="not-italic font-serif italic text-omega"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                engineering
              </em>
              , written for owners.
            </span>
          </h1>

          {/* Mono descriptor */}
          <p className="mt-5 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-warmwhite/50">
            Practical Property Guidance · UAE
          </p>

          {/* Subtitle */}
          <p className="mt-6 max-w-3xl text-base leading-[1.7] text-warmwhite/65 md:text-lg">
            Practical guidance for property care, maintenance,
            renovation, diagnostics, and engineering decisions in the
            UAE.
          </p>

          {/* CTAs — primary warmwhite-on-graphite, ghost outlined */}
          <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
            <Link
              href="/service-hub"
              data-action="OPEN_SERVICE_HUB"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-warmwhite px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-warmwhite/90"
            >
              <span>Open Service Hub</span>
              {" "}
              <Arrow />
            </Link>
            {" "}
            <Link
              href="/diagnosis"
              data-action="START_DIAGNOSIS"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-warmwhite/25 bg-transparent px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-warmwhite/55"
            >
              <span>Start Diagnosis</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Inner-edge premium catch-light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.03]"
      />
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
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
