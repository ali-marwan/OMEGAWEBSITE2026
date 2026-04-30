import Link from "next/link";
import { Fragment } from "react";

/**
 * `/contact` — Section 01: Hero.
 *
 * Mirrors the architectural language of every other OMEGA hero
 * (mono eyebrow row, large display headline, descriptor strap,
 * supporting paragraph, chip strip, CTA row, top + bottom arch-rule)
 * so the contact page reads as a peer of Service Hub / Diagnosis /
 * Studio — not a generic contact form.
 *
 * Both CTAs route to in-page anchors:
 *   - "Start enquiry"  → #contact-form (scrolls to the form below)
 *   - "Start Diagnosis" → /diagnosis (separate route)
 *
 * Plain `<a>` is used for the in-page anchor so the global smooth
 * scroll + 140px scroll-margin-top resolves cleanly without Next's
 * Link swallowing the hashchange.
 */
export function ContactHero() {
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
          <span className="text-omega">Contact</span>
        </nav>

        {/* Eyebrow row — instrument-panel cue per the brief */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Contact</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>UAE</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>Property Solutions</span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2.2rem] md:text-[2.9rem] lg:text-[3.5rem] leading-[1.04] tracking-tightest text-graphite">
          Speak to the right OMEGA team.
        </h1>

        {/* Descriptor — mono caps */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          Operational intake · Routed to the right specialist
        </p>

        {/* Subheadline */}
        <p className="mt-6 max-w-3xl text-base md:text-lg leading-[1.7] text-muted">
          Tell us what you need — care, repair, assessment, renovation,
          or engineering support. We route the request to the right
          team.
        </p>

        {/* Trust strip — what happens after the form */}
        <div className="mt-7">
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
            What Happens Next
          </div>
          {" "}
          <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
            {[
              "Routed to the right team",
              "Reviewed by OMEGA",
              "Site visit if required",
              "Direct response",
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

        {/* CTA row — Start enquiry (primary, in-page) + Start Diagnosis */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          <a
            href="#contact-form"
            data-action="START_ENQUIRY"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            <span>Start enquiry</span>
            {" "}
            <Arrow />
          </a>
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
