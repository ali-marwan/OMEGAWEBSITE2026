import Link from "next/link";
import { Fragment } from "react";

/**
 * `/studio` — Section 01: Hero.
 *
 * Mirrors the architectural language of every other OMEGA hero
 * (mono eyebrow row, large display headline, descriptor strap,
 * supporting paragraph + secondary line, CTA row, top + bottom
 * arch-rule) so the Studio page reads as a peer of /service-hub and
 * /diagnosis — not a different marketing layer.
 *
 * The two CTAs match the brief: "Open Service Hub" routes to the
 * catalog and "Start Diagnosis" routes to /diagnosis (the OMEGA AI
 * Property Diagnostics module). Both are real Next.js routes — the
 * Diagnosis CTA does NOT use a hash anchor here because there is no
 * in-page diagnosis experience on the Studio page.
 */
export function StudioHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-10 md:pt-32 md:pb-14"
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
          <span className="text-omega">Studio</span>
        </nav>

        {/* Eyebrow row — instrument-panel cue per the brief */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Studio</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>OMEGA</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>UAE</span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2.2rem] md:text-[2.9rem] lg:text-[3.5rem] leading-[1.04] tracking-tightest text-graphite">
          Engineering-led property solutions.
        </h1>

        {/* Descriptor — mono caps */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          One coordinated system · UAE
        </p>

        {/* Subtitle + supporting line */}
        <div className="mt-6 max-w-3xl space-y-4 text-base md:text-lg leading-[1.7] text-muted">
          <p>
            OMEGA brings property care, home services, assessments,
            renovation, and engineering support into one coordinated
            system for UAE properties.
          </p>
          {"\n"}
          <p>
            Built for clients who need clear responsibility, technical
            judgment, and organized execution.
          </p>
        </div>

        {/* What-you-get strip — quiet trust cues, mono chips. Mirrors
            the chip strip on /service-hub and /diagnosis so the page
            inherits the same product family. */}
        <div className="mt-7">
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
            How OMEGA Operates
          </div>
          {" "}
          <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
            {[
              "Engineering-led",
              "Coordinated execution",
              "Clear responsibility",
              "Long-term value",
            ].map((c, i) => (
              <Fragment key={c}>
                {i > 0 && " "}
                <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/70 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/80">
                  <span
                    aria-hidden
                    className="inline-block h-1 w-1 rounded-full bg-omega"
                  />
                  {" "}
                  <span>{c}</span>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>

        {/* CTA row — Open Service Hub (primary) + Start Diagnosis */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          <Link
            href="/service-hub"
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
