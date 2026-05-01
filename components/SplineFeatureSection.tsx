import { Reveal } from "./Reveal";
import { SplineFeatureSceneClient } from "./SplineFeatureSceneClient";

/**
 * Engineering-Led Experience — premium dark feature section.
 *
 * Position on the homepage:
 *   Sits between `<ServicePreview>` (Service System, light) and
 *   `<AISystem>` (AI Property Diagnostics, light). One controlled
 *   dark interruption in an otherwise light, architectural page —
 *   light → dark moment → light — without overriding OMEGA's main
 *   identity.
 *
 * Visual stack (back → front):
 *   1. Outer section: light `bg-warmwhite` with section eyebrow and
 *      hairline rule, matching every other landing-page section.
 *   2. Inner premium dark canvas (rounded-3xl, ring + soft elev
 *      shadow). Inside the canvas, in z-order:
 *        a. Static dark fill (radial warm-orange glow + base graphite
 *           gradient). Always rendered — covers SSR, mobile, reduced-
 *           motion users, and the moment before the Spline chunk
 *           hydrates.
 *        b. Faint architectural micro-grid (matches the OMEGA grid
 *           language, but white-on-dark instead of warm-on-light).
 *        c. Lazy Spline scene (cursor-following light wall) — only
 *           mounted on md+ desktops with normal motion preferences,
 *           and only when the section enters the viewport.
 *        d. Left-leaning vignette so headline + body text remain
 *           comfortably legible against any cursor position.
 *        e. Content layer: eyebrow, two-line headline, supporting
 *           paragraph, primary + secondary CTA — server-rendered for
 *           SEO and LCP.
 *        f. Inner-edge highlight ring for premium catch-light.
 *
 * Accessibility:
 *   - The decorative dark-canvas layers are all `aria-hidden`. The
 *     section has `aria-labelledby` pointing at the headline so it
 *     reads as one labelled landmark.
 *   - Anchor `id="engineering"` lets future links target this band.
 *   - Both CTAs are real `<a>` tags with descriptive labels and the
 *     same hover-affordance pattern as the rest of the homepage.
 *
 * Performance:
 *   - Section + headline render server-side (Server Component).
 *   - The Spline runtime is only fetched on the client, after first
 *     paint, behind a media-query gate (md+, no reduced motion) and
 *     an IntersectionObserver gate (within 200 px of viewport). On
 *     mobile and for reduced-motion users it never loads.
 *
 * Mobile fallback:
 *   On <md the Spline canvas is never mounted; the static dark
 *   fallback (radial glow + grid + vignette) carries the visual.
 *   The dark panel's min-height is reduced (440 px on mobile vs
 *   600 px on md+) so it never becomes an oversized dead zone, and
 *   the content overlay reflows to use the full width.
 */
export function SplineFeatureSection() {
  return (
    <section
      id="engineering"
      aria-labelledby="engineering-heading"
      className="relative bg-warmwhite py-20 md:py-28"
    >
      <div className="mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow row — same composition as every other
            landing-page band so the dark moment is announced, not
            dropped in. */}
        <Reveal>
          <div className="flex items-center justify-between gap-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
              />
              <span>OMEGA · Engineering-Led Experience</span>
            </div>
            <span className="hidden md:inline">§02b · Premium Moment</span>
          </div>
        </Reveal>

        {/* Top hairline — matches the architectural rule used in
            SystemBand / ClosingPaths. */}
        <div className="mt-6 h-px arch-rule" />

        <Reveal>
          <div className="relative mt-12 overflow-hidden rounded-3xl bg-[#0c0c0d] shadow-elev ring-1 ring-graphite/15">
            {/* Static dark fill — radial warm glow + base gradient.
                Always present (SSR-rendered) so the section never
                appears blank during chunk load or on mobile. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 70% 35%, rgba(242,106,27,0.18) 0%, rgba(242,106,27,0.06) 32%, rgba(12,12,13,0) 60%), linear-gradient(180deg, #101010 0%, #0a0a0b 100%)",
              }}
            />

            {/* Faint architectural grid — white-on-dark to keep the
                OMEGA grid language alive even in the dark moment. */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.35]"
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

            {/* Lazy Spline scene — desktop + normal motion only.
                Renders on top of the static layers above, beneath the
                vignette and content layers below. */}
            <SplineFeatureSceneClient />

            {/* Readability vignette — darkens the left half so the
                content overlay text always meets contrast targets
                regardless of where the cursor-following light lands. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(8,8,10,0.82) 0%, rgba(8,8,10,0.55) 32%, rgba(8,8,10,0.18) 60%, rgba(8,8,10,0) 80%)",
              }}
            />

            {/* Content overlay — server-rendered for SEO + LCP. */}
            <div className="relative z-10 grid min-h-[440px] grid-cols-1 md:min-h-[560px] lg:min-h-[620px] lg:grid-cols-12">
              <div className="lg:col-span-7 xl:col-span-6">
                <div className="px-7 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
                  <Reveal>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-omega">
                      Engineering-led experience
                    </p>
                  </Reveal>
                  <Reveal delay={0.08}>
                    <h2
                      id="engineering-heading"
                      className="mt-5 font-sans text-[2.1rem] leading-[1.06] tracking-tightest text-warmwhite md:text-[2.6rem] lg:text-[3.1rem]"
                    >
                      <span className="block font-bold">Built with depth.</span>
                      {" "}
                      <span className="mt-1 block font-light text-warmwhite/70 md:mt-2">
                        Guided by engineering.
                      </span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.16}>
                    <p className="mt-7 max-w-lg text-[0.95rem] leading-[1.7] text-warmwhite/65 md:text-base">
                      OMEGA combines diagnostics, repair, renovation,
                      and engineering into one coordinated property
                      system for the UAE.
                    </p>
                  </Reveal>
                  <Reveal delay={0.24}>
                    <div className="mt-10 flex flex-wrap items-stretch gap-3">
                      <a
                        href="/service-hub"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-warmwhite px-7 py-3.5 text-sm font-medium text-graphite transition-colors duration-500 ease-elegant hover:bg-warmwhite/90"
                      >
                        Open Service Hub
                        <Arrow />
                      </a>
                      {" "}
                      <a
                        href="/diagnosis"
                        data-action="START_DIAGNOSIS"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-warmwhite/25 px-7 py-3.5 text-sm font-medium text-warmwhite transition-colors duration-500 ease-elegant hover:border-warmwhite/55"
                      >
                        Start Diagnosis
                      </a>
                    </div>
                  </Reveal>
                </div>
              </div>
              {/* Right column intentionally blank on lg+ so the
                  cursor-following light can breathe without text
                  obstruction. */}
            </div>

            {/* Inner-edge premium catch-light. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.05]"
            />
          </div>
        </Reveal>

        {/* Bottom hairline — closes the band symmetrically, restoring
            the light architectural rhythm before the AI section. */}
        <div className="mt-12 h-px arch-rule" />
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
