import Link from "next/link";

/**
 * Closing CTA on the diagnosis page.
 *
 * Three roles:
 *
 *   1. Surfaces the safety / accuracy note required by the brief —
 *      makes it explicit that this is preliminary guidance and does
 *      not replace site inspection or technical verification where
 *      required. This appears as a quiet, prominent panel; it does
 *      not need to compete with the suggested-path card.
 *
 *   2. Offers a final pair of routes for users who have either
 *      finished the flow or scrolled past it:
 *        - Speak to Team    → /#contact
 *        - Open Service Hub → /service-hub
 *
 *   3. Closes the page architectural rhythm with a top + bottom
 *      arch-rule and a soft warm radial accent, matching every
 *      other section's closing layer.
 */
export function DiagnosisCTA() {
  return (
    <section
      id="diagnosis-cta"
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
          <span>Initial guidance. Confirmed by OMEGA.</span>
        </div>

        {/* Headline + supporting paragraph row.
            Headline mirrors the eyebrow's positioning ("OMEGA AI
            helps route the issue. People confirm the scope.") so
            the visitor reads one consistent message about what the
            tool is — and is not. */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite">
            <span className="block font-semibold">
              OMEGA AI helps route the issue.
            </span>
            {" "}
            <span className="mt-1.5 block font-light text-muted">
              People confirm the scope.
            </span>
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            OMEGA AI Property Diagnostics gives an initial route
            based on your answers and photos. Where required, OMEGA
            confirms the condition, scope, and technical solution
            before work begins.
          </p>
        </div>

        {/* Safety note — explicit panel per the brief. Tightened
            margin (`mt-8`) so the panel sits closer to the
            headline + paragraph row above. */}
        <div className="mt-8 rounded-[18px] border border-line/80 bg-warmwhite/80 p-5 md:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_14px_36px_-24px_rgba(30,30,30,0.18)]">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-omega/40 bg-omega/10 text-omega"
            >
              <InfoGlyph />
            </span>
            {" "}
            <div>
              <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/80">
                Safety Note
              </div>
              <p className="mt-1.5 text-[0.95rem] leading-[1.7] text-muted">
                For active leaks, electrical hazards, AC shutdowns,
                structural concerns, or anything that may damage
                property or affect safety, contact OMEGA directly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-8 flex flex-wrap items-stretch gap-3 md:gap-4">
          <a
            href="/#contact"
            data-action="CONTACT_TEAM"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            <span>Speak to Our Team</span>
            {" "}
            <Arrow />
          </a>
          {" "}
          <Link
            href="/service-hub"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Open Service Hub</span>
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

function InfoGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M7 6.2v3.6M7 4.6v.05" />
    </svg>
  );
}
