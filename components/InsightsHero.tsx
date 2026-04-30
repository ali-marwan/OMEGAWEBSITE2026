import Link from "next/link";

/**
 * `/insights` — Section 01: Hero.
 *
 * Compact editorial hero aligned with `<ServiceHubHero />`:
 *   - Single eyebrow row (no secondary chip strip)
 *   - Large display headline
 *   - Mono descriptor strap (one line, contextual)
 *   - Single supporting paragraph (the brief's subtitle verbatim)
 *   - CTA row (Open Service Hub primary, Start Diagnosis ghost)
 *   - Top + bottom arch-rule for closing rhythm
 *
 * Earlier versions carried a four-chip "Inside Insights" strip
 * below the subtitle. Removed for editorial restraint — the brief
 * asks the hero to feel compact and aligned with the Service Hub
 * page style, which uses a single eyebrow + h1 + paragraph + CTAs
 * pattern.
 */
export function InsightsHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-8 md:pt-32 md:pb-10"
    >
      {/* Architectural micro-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-70"
      />

      {/* Soft warm radial accent — top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.08) 0%, rgba(242,106,27,0.02) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Breadcrumb row */}
        <nav
          aria-label="Breadcrumb"
          className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
        >
          <Link
            href="/"
            className="text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
          >
            Home
          </Link>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-omega">Insights</span>
        </nav>

        {/* Eyebrow row — instrument-panel cue per the brief */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Insights</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>UAE Property Systems</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>Editorial</span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2.2rem] md:text-[2.9rem] lg:text-[3.5rem] leading-[1.04] tracking-tightest text-graphite">
          OMEGA Insights
        </h1>

        {/* Descriptor — mono caps */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          Practical Property Guidance · UAE
        </p>

        {/* Subtitle */}
        <p className="mt-6 max-w-3xl text-base md:text-lg leading-[1.7] text-muted">
          Practical guidance for property care, maintenance, renovation,
          diagnostics, and engineering decisions in the UAE.
        </p>

        {/* CTA row — Open Service Hub (primary) + Start Diagnosis */}
        <div className="mt-8 flex flex-wrap items-stretch gap-3 md:gap-4">
          <Link
            href="/service-hub"
            data-action="OPEN_SERVICE_HUB"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            <span>Open Service Hub</span>
            {" "}
            <Arrow />
          </Link>
          {" "}
          <Link
            href="/diagnosis"
            data-action="START_DIAGNOSIS"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Start Diagnosis</span>
          </Link>
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-8 h-px arch-rule" />
      </div>
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
