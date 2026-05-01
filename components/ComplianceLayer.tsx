"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type ComplianceItem = {
  code: string;
  title: string;
  hint: string;
};

const items: ComplianceItem[] = [
  { code: "01", title: "Building Management Approvals", hint: "Common-area, structural, and tower-rule impact flagged early." },
  { code: "02", title: "Landlord NOC", hint: "Tenant fit-outs and modifications that need landlord sign-off." },
  { code: "03", title: "DCD Impact", hint: "Dubai Civil Defence — fire, alarm, and life-safety considerations." },
  { code: "04", title: "DEWA Impact", hint: "Electrical and water authority touch-points before work begins." },
  { code: "05", title: "DDA / Trakhees / Dubai Municipality", hint: "Free-zone and municipality permit possibilities." },
  { code: "06", title: "Access Permits", hint: "Building access, work hours, and contractor entry rules." },
  { code: "07", title: "Work Timing Restrictions", hint: "Noise windows, weekend rules, and Ramadan considerations." },
  { code: "08", title: "Fire Alarm / Sprinkler Impact", hint: "Ceiling, partition, and MEP work that affects fire systems." },
  { code: "09", title: "Fit-Out NOC Risks", hint: "Scope items that typically trigger fit-out NOC requirements." },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

/**
 * "Built for UAE Property Execution" — UAE-specific compliance layer.
 *
 * Surfaces the authority and approval risks OMEGA AI can flag *before*
 * work begins. Important framing: AI does not replace authority
 * approval or engineering review — it surfaces likely execution risks
 * early. The disclaimer at the bottom makes that explicit.
 */
export function ComplianceLayer() {
  return (
    <section
      id="compliance"
      className="relative overflow-hidden bg-warmwhite py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <div className="h-px arch-rule" />

        <Reveal>
          <div className="mt-6 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
              <span>Section 05 — UAE Compliance Layer</span>
            </div>
            <span className="hidden md:inline">Authority-aware · Pre-execution</span>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-7 text-[2rem] md:text-[3rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">Built for UAE</span>
            <span className="mt-1.5 md:mt-2 block font-light text-muted">
              Property Execution.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
          >
            OMEGA AI surfaces authority, NOC, and approval-related risks
            early — so repairs, renovations, and fit-outs don't stall
            mid-execution. Built around how UAE properties actually
            operate.
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardContainer}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <motion.article
              key={item.code}
              variants={cardItem}
              className="group module-card relative flex flex-col rounded-[18px] border border-line/85 bg-warmwhite p-7 hover:border-graphite/25"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega group-hover:shadow-[0_0_10px_rgba(242,106,27,0.55)]"
                />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-omega">
                  COMPLIANCE {item.code}
                </span>
              </div>
              <h3 className="mt-5 text-[1.1rem] md:text-[1.18rem] font-semibold leading-snug tracking-tight text-graphite">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.92rem] leading-[1.6] text-muted">
                {item.hint}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-[16px] border border-line/70 bg-warmwhite/60 p-6 md:p-7">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-omega"
              />
              <p className="text-[0.9rem] md:text-[0.95rem] leading-[1.7] text-muted">
                <span className="font-medium text-graphite">Important.</span>{" "}
                OMEGA AI does not replace authority approval or
                engineering review. It helps identify possible execution
                risks early — before work begins — so OMEGA's UAE
                technical team can plan and approve the right path
                forward.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 h-px arch-rule" />
      </div>
    </section>
  );
}
