import { Fragment } from "react";
import { omegaProcess } from "@/lib/services";

/**
 * The OMEGA standard intake process — the same four steps for every
 * service module. Pulled from `omegaProcess` in `lib/services.ts` so
 * any future change to the platform's intake flow updates every detail
 * page from a single source.
 *
 * Layout:
 *   - mobile / tablet: stacked column of four numbered blocks
 *   - desktop (lg+): four columns side-by-side
 *
 * Each step renders as a `module-card--quiet` tile with:
 *   - mono caps step code (01/02/03/04) in OMEGA orange
 *   - growing accent rule (echoes Operating Principles + path cards)
 *   - title (semi-bold, graphite)
 *   - short description (muted)
 */
export function OmegaProcess() {
  return (
    <section
      id="process"
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
          <span>OMEGA Process</span>
        </div>

        {/* Section title */}
        <div className="mt-7 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] font-semibold leading-[1.08] tracking-tightest text-graphite">
            How a request moves through OMEGA.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base leading-[1.75] text-muted">
            The same four steps apply to every service — repair,
            assessment, renovation, or engineering input.
          </p>
        </div>

        {/* Four-step grid */}
        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {omegaProcess.map((step, i) => (
            <Fragment key={step.code}>
              {i > 0 && " "}
              <li className="module-card module-card--quiet group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line/85 bg-warmwhite p-6 md:p-7">
                {/* Architectural corner ticks (top-left only) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 h-px w-6 bg-graphite/15"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 h-6 w-px bg-graphite/15"
                />

                {/* Step code */}
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega"
                  />
                  {" "}
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-omega">
                    {step.code}
                  </span>
                  {" "}
                  <span
                    aria-hidden
                    className="h-px w-6 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-10 group-hover:bg-omega/70"
                  />
                </div>

                {/* Step title */}
                <h3 className="mt-5 text-[1.1rem] md:text-[1.18rem] font-semibold leading-tight tracking-tight text-graphite">
                  {step.title}
                </h3>

                {/* Step description */}
                <p className="mt-2.5 text-[0.9rem] leading-[1.65] text-muted">
                  {step.description}
                </p>
              </li>
            </Fragment>
          ))}
        </ol>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}
