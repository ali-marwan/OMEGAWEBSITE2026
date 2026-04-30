import Link from "next/link";
import { Fragment } from "react";
import type { Service } from "@/lib/services";

/**
 * Detail-page hero for a single service. Reads everything from the
 * passed-in `Service` object — there is no hardcoded copy here.
 *
 * Layout (top → bottom):
 *
 *   ──── arch-rule ────
 *   breadcrumb       (Service Hub · {category} · {index})
 *   eyebrow          (●  {index} | {category} | {appActionType})
 *   title            (h1 — service.title)
 *   descriptor       (mono caps — service.descriptor)
 *   description      (paragraph — service.description)
 *   use-cases row    (mono chips — service.useCases)
 *   CTA row          (Request Service · Start Diagnosis · Speak to Team)
 *   ──── arch-rule ────
 *
 * The three CTAs are deliberately in-page anchors to the Embedded
 * Action Centre on this same page (`#request`, `#diagnosis`,
 * `#contact-panel`). They never navigate away — the action-centre
 * component watches the URL hash and activates the matching tab.
 *
 * Each CTA carries `data-action="<CODE>"` so the future analytics /
 * mobile-app router can hand off without parsing the href.
 *
 * Spacing was tightened relative to the previous version:
 *   - `pt-28 pb-14` → keeps the hero compact, no excessive blank zone
 *   - tighter title→descriptor and descriptor→description gaps
 *   - use-cases row sits between description and CTA row so the hero
 *     reads as a single continuous block instead of an empty stack
 */
export function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section
      id="top"
      // Bottom padding tightened (`pb-10 md:pb-12`) so the hero
      // hands off cleanly to the next section without a dead zone.
      className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-10 md:pt-32 md:pb-12"
    >
      {/* Architectural micro-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-70"
      />

      {/* Soft warm radial accent at the top */}
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

        {/*
          Breadcrumb row. Each text-bearing child is preceded by a
          literal `{" "}` text node so the rendered DOM textContent
          reads as
            "Service Hub · Property Care · 01"
          rather than
            "Service Hub·Property Care·01".
          The decorative dots are aria-hidden so screen readers ignore
          them.
        */}
        <nav
          aria-label="Breadcrumb"
          className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
        >
          <Link
            href="/service-hub"
            className="text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
          >
            Service Hub
          </Link>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-graphite/85">{service.category}</span>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-omega">{service.index}</span>
        </nav>

        {/* Eyebrow row — index | category | appActionType (mono caps) */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>{service.index}</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>{service.category}</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>{service.appActionType}</span>
        </div>

        {/* Headline — service title */}
        <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2.2rem] md:text-[2.9rem] lg:text-[3.5rem] leading-[1.04] tracking-tightest text-graphite">
          {service.title}
        </h1>

        {/* Descriptor (mono caps) */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          {service.descriptor}
        </p>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-base md:text-lg leading-[1.7] text-muted">
          {service.description}
        </p>

        {/*
          Use-cases row — mono chip strip pulled from `service.useCases`.
          A literal whitespace text node between every chip pair so the
          labels never join in flat textContent.
        */}
        <div className="mt-7">
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
            Use Cases
          </div>
          {" "}
          <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
            {service.useCases.map((c, i) => (
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

        {/*
          CTA row — three in-page anchors. The Embedded Action Centre
          listens for the matching hash and activates the right tab.
          Literal `{" "}` between each Link so labels never join.
        */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          <Link
            href="#request"
            data-action="SERVICE_REQUEST"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            <span>Request Service</span>
            {" "}
            <Arrow />
          </Link>
          {" "}
          <Link
            href="#diagnosis"
            data-action="START_DIAGNOSIS"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Start Diagnosis</span>
          </Link>
          {" "}
          <Link
            href="#contact"
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
