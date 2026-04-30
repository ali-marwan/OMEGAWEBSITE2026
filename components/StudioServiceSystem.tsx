import Link from "next/link";
import { Fragment } from "react";

/**
 * `/studio` — Section 03: What OMEGA Does.
 *
 * Five service cards with the brief's exact descriptions. Each card
 * links to the matching `/service-hub/[slug]` detail route so the
 * Studio page surfaces every service catalog entry one click away.
 *
 * Layout:
 *   - sm:        single column
 *   - md:        two columns (2 + 2 + 1 stacked layout)
 *   - lg:        the first card spans the full row, the remaining
 *                four sit as a 2×2 grid below — gives Property Care
 *                visual primacy as the flagship offering without
 *                cramming five equal columns at narrow widths.
 *
 * Wording is intentionally Studio-specific (matches the brief
 * verbatim) rather than pulled from `lib/services`, so this page's
 * voice stays editorial. Routes still go to the same detail pages.
 */

type StudioService = {
  index: string;
  title: string;
  body: string;
  href: string;
};

const studioServices: readonly StudioService[] = [
  {
    index: "01",
    title: "Property Care System",
    body: "Annual maintenance and ongoing property support.",
    href: "/service-hub/property-care-system",
  },
  {
    index: "02",
    title: "Home Services",
    body: "On-demand repairs and technician-led response.",
    href: "/service-hub/home-services",
  },
  {
    index: "03",
    title: "Property Health Report",
    body: "Condition assessment, risk identification, and recommended action.",
    href: "/service-hub/property-health-report",
  },
  {
    index: "04",
    title: "Renovation",
    body: "Fit-out, upgrades, and property transformation.",
    href: "/service-hub/renovation",
  },
  {
    index: "05",
    title: "Engineering Solutions",
    body: "Drawings, design coordination, technical review, MEP coordination, and authority-related support where applicable.",
    href: "/service-hub/engineering-solutions",
  },
] as const;

export function StudioServiceSystem() {
  const [primary, ...rest] = studioServices;

  return (
    <section
      id="services"
      className="relative bg-warmwhite pt-8 pb-9 md:pt-12 md:pb-12"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>What OMEGA Does</span>
        </div>

        {/* Headline + supporting paragraph */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            From urgent repairs to technical execution.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            One coordinated system. Five services that work together —
            so the right path is always one route away, not a phone
            call to a different vendor.
          </p>
        </div>

        {/*
          Primary card — full row on lg+. Visually larger than the
          remaining cards to mark Property Care as the flagship
          ongoing programme. Anchor-wrapped so the entire surface is
          clickable, not just the "Open" affordance.
        */}
        <div className="mt-10">
          <Link
            href={primary.href}
            aria-label={`Open ${primary.title}`}
            className="module-card group block rounded-[24px] border border-line/80 bg-warmwhite/90 p-6 md:p-9 transition-all duration-500 ease-elegant hover:-translate-y-0.5"
          >
            <div className="grid grid-cols-12 gap-x-6 gap-y-4 items-start">
              <div className="col-span-12 lg:col-span-7">
                <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-technical text-muted">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                  />
                  {" "}
                  <span>{primary.index}</span>
                  {" "}
                  <span aria-hidden className="h-3 w-px bg-line" />
                  {" "}
                  <span>Flagship Programme</span>
                </div>
                <h3 className="mt-4 text-[1.6rem] md:text-[2rem] font-semibold leading-[1.1] tracking-tightest text-graphite">
                  {primary.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[0.98rem] md:text-[1.02rem] leading-[1.7] text-muted">
                  {primary.body}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5 flex lg:justify-end items-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-graphite/15 bg-warmwhite/70 px-5 py-2.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant group-hover:-translate-y-px group-hover:border-graphite/40">
                  <span>Open Service</span>
                  {" "}
                  <Arrow />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Remaining four — 2×2 on lg, 2 cols on md, single col on sm */}
        <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {rest.map((s, i) => (
            <Fragment key={s.index}>
              {i > 0 && " "}
              <li>
                <Link
                  href={s.href}
                  aria-label={`Open ${s.title}`}
                  className="module-card module-card--quiet group flex h-full flex-col justify-between gap-5 rounded-[20px] border border-line/80 bg-warmwhite/85 p-6 md:p-7 transition-all duration-500 ease-elegant hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                      />
                      {" "}
                      <span>{s.index}</span>
                    </div>
                    <h3 className="mt-4 text-[1.2rem] md:text-[1.3rem] font-semibold leading-[1.2] text-graphite">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-[1.65] text-muted">
                      {s.body}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 self-start rounded-full border border-graphite/15 bg-warmwhite/70 px-4 py-2 text-[0.82rem] font-medium text-graphite transition-all duration-500 ease-elegant group-hover:-translate-y-px group-hover:border-graphite/40">
                    <span>View Details</span>
                    {" "}
                    <Arrow />
                  </span>
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>
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
