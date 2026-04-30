import Link from "next/link";

/**
 * `/studio` — Section 06: OMEGA AI Connection.
 *
 * Positions OMEGA AI Property Diagnostics as part of the same
 * operating system, not a separate assistant. Single CTA routes to
 * `/diagnosis`.
 *
 * Visual treatment: a single quiet panel (similar to the safety
 * panel on /diagnosis) with eyebrow + heading + body + CTA, set
 * inside the section's standard top + bottom arch-rule. Keeps the
 * page rhythm consistent.
 */
export function StudioAIConnection() {
  return (
    <section
      id="ai-connection"
      className="relative bg-warmwhite pt-12 pb-12 md:pt-16 md:pb-16"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-50"
      />

      {/* Soft warm radial accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(242,106,27,0.06) 0%, rgba(242,106,27,0.015) 40%, transparent 75%)",
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
          <span>OMEGA AI</span>
        </div>

        {/* Two-column body — heading on the left, body + CTA right */}
        <div className="mt-6 grid grid-cols-12 items-start gap-x-8 gap-y-7">
          <h2 className="col-span-12 lg:col-span-6 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            OMEGA AI is part of the system.
          </h2>

          <div className="col-span-12 lg:col-span-6">
            <p className="max-w-2xl text-base md:text-[1.05rem] text-muted leading-[1.75]">
              OMEGA AI Property Diagnostics helps clients describe
              issues, upload photos, and get routed to the right
              OMEGA path. It is not a separate assistant — it is a
              structured intake and routing layer connected to OMEGA's
              service logic.
            </p>

            {/* CTA — routes to /diagnosis (the OMEGA AI Property
                Diagnostics module). Single CTA only, per the brief. */}
            <div className="mt-7">
              <Link
                href="/diagnosis"
                data-action="START_DIAGNOSIS"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
              >
                <span>Start Diagnosis</span>
                {" "}
                <Arrow />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
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
