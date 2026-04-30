import { Fragment } from "react";

/**
 * `/studio` — Section 04: Why engineering-led matters.
 *
 * Editorial layout (not a dense paragraph) per the brief. Five
 * principles, each rendered as a numbered row with a short title +
 * one explanatory line. The 12-column grid keeps the lede column
 * separate from the principles list on desktop, so the section reads
 * as a thesis followed by evidence rather than a wall of text.
 */

type Principle = {
  index: string;
  title: string;
  body: string;
};

const principles: readonly Principle[] = [
  {
    index: "01",
    title: "Better diagnosis before action",
    body: "Issues are understood — not assumed — so the right scope is committed the first time.",
  },
  {
    index: "02",
    title: "Better coordination between disciplines",
    body: "MEP, finishes, structure, and authority context are looked at together, not handed across vendors.",
  },
  {
    index: "03",
    title: "Reduced guesswork",
    body: "Where engineering judgment matters, it is applied — not improvised on site.",
  },
  {
    index: "04",
    title: "Better documentation",
    body: "Decisions, condition, and works are tracked so the property's history stays clean and shareable.",
  },
  {
    index: "05",
    title: "Better long-term property decisions",
    body: "Choices are made with the property's lifespan and value in mind — not just the cheapest immediate fix.",
  },
] as const;

export function StudioWhyEngineering() {
  return (
    <section
      id="why-engineering"
      className="relative bg-warmwhite pt-12 pb-12 md:pt-16 md:pb-16"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-50"
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
          <span>Why Engineering-Led</span>
        </div>

        {/* Editorial body — lede on the left, numbered principles on
            the right. On lg+ the lede column is narrower so the
            principles get the visual weight they deserve. */}
        <div className="mt-6 grid grid-cols-12 gap-x-8 gap-y-10">
          {/* Lede column */}
          <div className="col-span-12 lg:col-span-5">
            <h2 className="text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
              Built around technical accountability.
            </h2>
            <p className="mt-5 max-w-md text-base md:text-[1.02rem] text-muted leading-[1.75]">
              An engineering-led approach changes how property issues
              are diagnosed, scoped, and executed. Five things shift
              when the discipline runs through the work.
            </p>
          </div>

          {/* Principles column */}
          <ol className="col-span-12 lg:col-span-7 space-y-0">
            {principles.map((p, i) => (
              <Fragment key={p.index}>
                {i > 0 && " "}
                <li className="grid grid-cols-12 items-start gap-x-5 gap-y-2 border-t border-line/60 py-6 first:border-t-0 first:pt-0">
                  {/* Index */}
                  <div className="col-span-2 sm:col-span-1 lg:col-span-2">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-omega">
                      {p.index}
                    </span>
                  </div>
                  {/* Title + body */}
                  <div className="col-span-10 sm:col-span-11 lg:col-span-10">
                    <h3 className="text-[1.05rem] md:text-[1.15rem] font-semibold leading-[1.3] text-graphite">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] md:text-[0.95rem] leading-[1.65] text-muted">
                      {p.body}
                    </p>
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}
