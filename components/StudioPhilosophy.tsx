import { Fragment } from "react";

/**
 * `/studio` — Section 02: Philosophy.
 *
 * Establishes the operating principle of OMEGA — one company, one
 * property system — with a longer paragraph followed by four
 * principle cards. Mirrors the architectural treatment used on
 * /service-hub's "Service System" section so the page reads as
 * peer content rather than a separate marketing voice.
 *
 * Principle cards:
 *   1. Engineering-led decisions
 *   2. Clear service routing
 *   3. UAE authority awareness
 *   4. Long-term property value
 */

type Principle = {
  index: string;
  title: string;
  body: string;
};

const principles: readonly Principle[] = [
  {
    index: "01",
    title: "Engineering-led decisions",
    body: "Technical judgment leads the work — diagnosis, scope, and execution are guided by engineers, not by guesswork.",
  },
  {
    index: "02",
    title: "Clear service routing",
    body: "Every issue lands on the right path the first time — care, repair, assessment, renovation, or engineering — without bouncing between vendors.",
  },
  {
    index: "03",
    title: "UAE authority awareness",
    body: "Where works touch structure, MEP, or facade, OMEGA understands what the local authority context requires before scope is committed.",
  },
  {
    index: "04",
    title: "Long-term property value",
    body: "Decisions are made with the property's lifespan in mind — clean documentation, preventive thinking, and finishes that hold up.",
  },
] as const;

export function StudioPhilosophy() {
  return (
    <section
      id="philosophy"
      className="relative bg-warmwhite pt-12 pb-12 md:pt-16 md:pb-16"
    >
      {/* Subtle architectural micro-grid — quieter than the hero */}
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
          <span>Philosophy</span>
        </div>

        {/* Headline + supporting paragraph row.
            12-col grid keeps headline and paragraph at editorial
            ratios on desktop while collapsing cleanly on mobile. */}
        <div className="mt-6 grid grid-cols-12 items-start gap-x-6 gap-y-7">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            One company. One property system.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base md:text-[1.05rem] text-muted leading-[1.75]">
            Property issues rarely exist in isolation. A leak can
            affect finishes. An AC issue can affect comfort, energy
            use, and complaints. A renovation may require engineering
            coordination. OMEGA connects these needs through one
            operating structure.
          </p>
        </div>

        {/* Principle cards — 4 across on desktop, 2 on tablet, 1 on
            mobile. Uses `module-card module-card--quiet` finish so
            the cards inherit the soft top-edge highlight + baseline
            shadow defined globally. */}
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {principles.map((p, i) => (
            <Fragment key={p.index}>
              {i > 0 && " "}
              <li className="module-card module-card--quiet rounded-[20px] border border-line/80 bg-warmwhite/85 p-6 md:p-7">
                {/* Index strip + title */}
                <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-technical text-muted">
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                  />
                  {" "}
                  <span>{p.index}</span>
                </div>
                <h3 className="mt-4 text-[1.1rem] md:text-[1.15rem] font-semibold leading-[1.25] text-graphite">
                  {p.title}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-[1.65] text-muted">
                  {p.body}
                </p>
              </li>
            </Fragment>
          ))}
        </ul>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}
