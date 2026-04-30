import Link from "next/link";

/**
 * `/insights` — closing CTA.
 *
 * Three exits matching the OMEGA standard set:
 *   - Open Service Hub  → /service-hub          (primary)
 *   - Start Diagnosis   → /diagnosis            (ghost)
 *   - Speak to Team     → /contact              (ghost)
 *
 * Closes the page rhythm with a top + bottom arch-rule and a soft
 * warm radial accent — same closing layer used on every OMEGA page.
 */
export function InsightsCTA() {
  return (
    <section
      id="insights-cta"
      className="relative overflow-hidden bg-warmwhite pt-10 pb-14 md:pt-14 md:pb-16"
    >
      {/* Soft warm radial closing accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.07) 0%, rgba(242,106,27,0.02) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Section eyebrow */}
        <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Ready to act on what you read?</span>
        </div>

        {/* Headline + supporting paragraph */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            From insight to OMEGA path.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            Browse the service system, run a guided diagnosis, or
            speak directly with the team. Insights point readers
            toward the right OMEGA module.
          </p>
        </div>

        {/* Three CTAs */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
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
          {" "}
          <Link
            href="/contact"
            data-action="CONTACT_TEAM"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Speak to Team</span>
          </Link>
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-10 h-px arch-rule" />
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
