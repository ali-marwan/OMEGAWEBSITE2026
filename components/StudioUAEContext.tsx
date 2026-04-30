import { Fragment } from "react";

/**
 * `/studio` — Section 05: UAE Context.
 *
 * Establishes that OMEGA is built specifically for UAE property
 * conditions — without overclaiming authority approvals or naming
 * specific authorities (per the brief).
 *
 * Layout:
 *   - Heading + lede paragraph (left)
 *   - Three context columns (right): Property Types · Common Issues
 *     · Client Expectations
 *
 * The context columns use the same chip vocabulary as /service-hub
 * filter labels, so a returning visitor recognizes the language
 * immediately. Authority context is intentionally phrased as
 * "authority-sensitive works where applicable" — never as a claim
 * of approvals delivered.
 */

type ContextColumn = {
  index: string;
  title: string;
  items: readonly string[];
};

const columns: readonly ContextColumn[] = [
  {
    index: "01",
    title: "Property types",
    items: ["Villas", "Apartments", "Townhouses", "Offices", "Retail", "Commercial units"],
  },
  {
    index: "02",
    title: "Common issues",
    items: [
      "AC and cooling",
      "Water leakage",
      "Finishes",
      "Access coordination",
      "MEP-heavy faults",
      "Authority-sensitive works (where applicable)",
    ],
  },
  {
    index: "03",
    title: "Client expectations",
    items: ["Speed", "Clarity", "Reliability", "Single point of contact", "Clean documentation"],
  },
] as const;

export function StudioUAEContext() {
  return (
    <section
      id="uae-context"
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
          <span>UAE Context</span>
        </div>

        {/* Headline + lede */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            Designed for UAE properties.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            UAE properties have a specific operational profile —
            MEP-heavy, climate-driven, and tenanted under expectations
            for speed and clarity. OMEGA's structure is built around
            that reality, not retrofitted to it.
          </p>
        </div>

        {/* Three context columns */}
        <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {columns.map((c, i) => (
            <Fragment key={c.index}>
              {i > 0 && " "}
              <li className="rounded-[20px] border border-line/80 bg-warmwhite/80 p-6 md:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_14px_36px_-24px_rgba(30,30,30,0.16)]">
                {/* Column heading */}
                <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                  />
                  {" "}
                  <span>{c.index}</span>
                  {" "}
                  <span aria-hidden className="h-3 w-px bg-line" />
                  {" "}
                  <span>{c.title}</span>
                </div>

                {/* Chip strip */}
                <ul className="mt-5 flex flex-wrap items-center gap-2">
                  {c.items.map((item, j) => (
                    <Fragment key={item}>
                      {j > 0 && " "}
                      <li className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-warmwhite/80 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/85">
                        <span
                          aria-hidden
                          className="inline-block h-1 w-1 rounded-full bg-omega"
                        />
                        {" "}
                        <span className="normal-case tracking-[0.02em]">
                          {item}
                        </span>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
