import Link from "next/link";
import { Fragment } from "react";

/**
 * Top hero for `/diagnosis`.
 *
 * Mirrors the visual language of every other OMEGA hero (mono
 * eyebrow, large display headline, descriptor strap, supporting
 * paragraph, CTA row) so the diagnostic experience reads as part of
 * the same product family — not a chatbot detour.
 *
 * The primary CTA is an in-page anchor to `#diagnosis-flow` so the
 * page scrolls down to the guided experience without ever leaving
 * the route. The secondary CTA opens the Service Hub for visitors who
 * already know what they want and just need the catalog.
 *
 * Plain `<a>` is used for `#diagnosis-flow` (not Next.js `<Link>`)
 * because Next's `<Link>` uses `history.pushState` for hash-only
 * navigation, which silently updates the URL without firing the
 * `hashchange` event the browser native scroll behaviour relies on.
 */
export function DiagnosisHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-8 md:pt-32 md:pb-10"
    >
      {/* Architectural micro-grid — same as every other hero */}
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
          <span className="text-graphite/85">OMEGA AI</span>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-omega">Diagnostics</span>
        </nav>

        {/* Eyebrow row — technical label per the brief */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>AI Diagnostics</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>UAE Property Support</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>Guided Intake</span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2.2rem] md:text-[2.9rem] lg:text-[3.5rem] leading-[1.04] tracking-tightest text-graphite">
          OMEGA AI Property Diagnostics
        </h1>

        {/* Descriptor — instrument-panel mono caps */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          Property Intelligence System · UAE
        </p>

        {/* Supporting paragraphs — primary subtitle + positioning line.
            Both reinforce that OMEGA AI Property Diagnostics is one
            structured intake (not a separate chatbot). */}
        <div className="mt-6 max-w-3xl space-y-4 text-base md:text-lg leading-[1.7] text-muted">
          <p>
            Describe the issue, upload photos, and get routed to the
            right OMEGA service — guided by OMEGA's UAE property
            experience.
          </p>
          {"\n"}
          <p>
            Not a generic chatbot. A structured property diagnosis
            flow built around real maintenance, renovation, and
            engineering cases.
          </p>
        </div>

        {/* What-you-get strip — quiet trust cues, mono chips */}
        <div className="mt-7">
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
            What You Get
          </div>
          {" "}
          <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
            {[
              "Guided diagnosis",
              "Photo-based intake",
              "Suggested OMEGA route",
              "Human review where needed",
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

        {/* CTA row — Primary scrolls to flow, secondary goes to hub */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          <a
            href="#diagnosis-flow"
            data-action="START_DIAGNOSIS"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            <span>Start Diagnosis</span>
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
