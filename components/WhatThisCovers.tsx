import { Fragment } from "react";
import type { Service } from "@/lib/services";

/**
 * Detail-page section: "What this covers".
 *
 * Renders the service's `whatThisCovers` array as a 4-card module
 * grid (2×2 on tablet, 4×1 on desktop, stacked on mobile). Each card
 * has:
 *   - small orange index pip
 *   - mono caps category line ("MODULE 0X")
 *   - growing accent rule (echoes the rest of the platform)
 *   - title (semi-bold)
 *   - one explanatory line
 *
 * Pure server component — no client state, no motion. Reads directly
 * from the centralized `Service` data model so adding a new service
 * automatically renders here without code changes.
 */
export function WhatThisCovers({ service }: { service: Service }) {
  return (
    <section
      id="covers"
      className="relative overflow-hidden bg-warmwhite pt-12 pb-12 md:pt-16 md:pb-16"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Section eyebrow */}
        <div className="mt-7 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Service Scope</span>
        </div>

        {/* Title row */}
        <div className="mt-7 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] font-semibold leading-[1.08] tracking-tightest text-graphite">
            What this covers.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base leading-[1.75] text-muted">
            Four core modules inside{" "}
            <span className="text-graphite/85">{service.title}</span>.
            Each one connects back into the same OMEGA service network.
          </p>
        </div>

        {/* Coverage card grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {service.whatThisCovers.map((item, i) => (
            <Fragment key={item.title}>
              {i > 0 && " "}
              <CoverageCard
                index={i + 1}
                title={item.title}
                summary={item.summary}
              />
            </Fragment>
          ))}
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}

/**
 * One coverage module card. Quiet variant of the platform card finish
 * (matches `module-card--quiet` so it sits below the catalog grid in
 * visual weight without being plain).
 */
function CoverageCard({
  index,
  title,
  summary,
}: {
  index: number;
  title: string;
  summary: string;
}) {
  const indexLabel = index.toString().padStart(2, "0");
  return (
    <article className="module-card module-card--quiet group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line/85 bg-warmwhite p-6 md:p-7 transition-[border-color,box-shadow,transform] duration-500 ease-elegant hover:border-graphite/25">
      {/* Architectural corner ticks (top-left only — quieter variant) */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-px w-6 bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-6 w-px bg-graphite/15"
      />

      {/* Module index */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega"
        />
        {" "}
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-omega">
          Module {indexLabel}
        </span>
        {" "}
        <span
          aria-hidden
          className="h-px w-5 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-9 group-hover:bg-omega/70"
        />
      </div>

      {/* Title */}
      <h3 className="mt-5 text-[1.1rem] md:text-[1.18rem] font-semibold leading-tight tracking-tight text-graphite">
        {title}
      </h3>

      {/* One-line summary */}
      <p className="mt-2.5 text-[0.92rem] leading-[1.65] text-muted">
        {summary}
      </p>
    </article>
  );
}
