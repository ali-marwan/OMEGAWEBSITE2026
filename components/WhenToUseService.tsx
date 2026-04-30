import { Fragment } from "react";
import type { Service } from "@/lib/services";

/**
 * Detail-page section: "When to use this service".
 *
 * Renders the 4–5 client-facing scenarios from `service.whenToUse` as
 * a quiet stack of statement rows. Each row gets:
 *   - a small mono caps "Case 0X" index
 *   - a left-side accent rule (omega orange at low opacity)
 *   - the situational sentence in graphite
 *
 * The intent is "scan-friendly" — the visitor reads the first row
 * that matches their situation and stops. No card chrome, no hover
 * animation; this is text-first content.
 */
export function WhenToUseService({ service }: { service: Service }) {
  return (
    <section
      id="when-to-use"
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
          <span>Decision Guide</span>
        </div>

        {/* Title row */}
        <div className="mt-7 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] font-semibold leading-[1.08] tracking-tightest text-graphite">
            When to use this service.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base leading-[1.75] text-muted">
            Real situations OMEGA clients in the UAE choose this
            module for. Read the row that matches you and start there.
          </p>
        </div>

        {/* Scenario stack — 1 column on mobile, 2 columns on lg */}
        <ol className="mt-10 grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
          {service.whenToUse.map((situation, i) => (
            <Fragment key={situation}>
              {i > 0 && " "}
              <li className="group relative flex items-start gap-5 rounded-[14px] border border-line/70 bg-warmwhite/70 p-5 md:p-6 transition-[border-color,background-color] duration-500 ease-elegant hover:border-graphite/25 hover:bg-warmwhite">
                {/* Left index column */}
                <div className="flex flex-col items-start gap-2.5 pt-0.5">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega"
                  />
                  {" "}
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
                    Case {(i + 1).toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Vertical divider — accent line */}
                <span
                  aria-hidden
                  className="mt-1 inline-block h-10 w-px bg-omega/30 transition-all duration-500 ease-elegant group-hover:bg-omega/60"
                />

                {/* Sentence */}
                <p className="flex-1 text-[0.98rem] leading-[1.65] text-graphite/85">
                  {situation}
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
