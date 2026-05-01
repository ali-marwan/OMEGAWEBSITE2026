"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type UseCase = {
  category: string;
  title: string;
  hint: string;
};

const cases: UseCase[] = [
  { category: "MEP", title: "AC Not Cooling / AC Leakage", hint: "Drain blockages, gas issues, and unit-level diagnostics." },
  { category: "WATER", title: "Ceiling or Bathroom Leak", hint: "Source, extent, and waterproofing exposure." },
  { category: "STRUCTURAL", title: "Wall Cracks / Gypsum Damage", hint: "Cosmetic vs. settlement vs. movement-related causes." },
  { category: "ELECTRICAL", title: "Tripping / Burning Smell", hint: "Circuit overload and life-safety risk classification." },
  { category: "WATERPROOFING", title: "Waterproofing Failure", hint: "Membrane, slope, and drain-flashing diagnostics." },
  { category: "RENOVATION", title: "Renovation Planning", hint: "Scope, BOQ draft, and authority impact ahead of work." },
  { category: "FIT-OUT", title: "Fit-Out Modification", hint: "Tenant fit-out scope, NOCs, and execution risks." },
  { category: "TENANCY", title: "Move-In / Move-Out Condition Report", hint: "Documented baseline for owners and tenants." },
  { category: "HANDOVER", title: "Snagging & Handover Report", hint: "Defect lists, severity, and developer-side responsibility." },
  { category: "DOCUMENTATION", title: "Landlord / Tenant Documentation", hint: "Shareable property reports for disputes and approvals." },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/**
 * "Use OMEGA AI for…" — Property Intelligence use cases.
 *
 * Concrete scenarios where OMEGA AI Property Scan applies. Cards are
 * intentionally tight (small grid, dense per-card info) so the
 * section reads as a capability map, not a marketing wall.
 */
export function PropertyUseCases() {
  return (
    <section
      id="use-cases"
      className="relative overflow-hidden bg-warmwhite py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <div className="h-px arch-rule" />

        <Reveal>
          <div className="mt-6 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
              <span>Section 06 — Property Intelligence Use Cases</span>
            </div>
            <span className="hidden md:inline">Residential · Commercial · Tenant · Owner</span>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-7 text-[2rem] md:text-[3rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">Use OMEGA AI</span>
            <span className="mt-1.5 md:mt-2 block font-light text-muted">
              for any property scenario.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
          >
            From a leaking AC to a snagging handover, from a fit-out
            scope to a move-out condition report — OMEGA AI assesses
            the issue, classifies the risk, and routes the case into
            the right OMEGA execution path.
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardContainer}
          className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {cases.map((c) => (
            <motion.article
              key={c.title}
              variants={cardItem}
              className="group module-card relative flex flex-col rounded-[14px] border border-line/85 bg-warmwhite p-5 hover:border-graphite/25"
            >
              <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                <span className="text-omega">·</span>
                <span>{c.category}</span>
              </div>
              <h3 className="mt-3 text-[0.95rem] font-semibold leading-snug tracking-tight text-graphite">
                {c.title}
              </h3>
              <p className="mt-2 text-[0.8rem] leading-[1.55] text-muted">
                {c.hint}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-20 h-px arch-rule" />
      </div>
    </section>
  );
}
