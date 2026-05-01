"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type ReportField = {
  code: string;
  label: string;
  hint: string;
};

const reportFields: ReportField[] = [
  { code: "01", label: "Issue Summary", hint: "What was observed and where." },
  { code: "02", label: "Possible Cause", hint: "Likely root causes ranked by confidence." },
  { code: "03", label: "Severity Level", hint: "Categorised on a 1–5 OMEGA risk scale." },
  { code: "04", label: "Risk if Ignored", hint: "What happens if no action is taken." },
  { code: "05", label: "Required Trade", hint: "AC, plumbing, electrical, civil, MEP, or engineering." },
  { code: "06", label: "Site Inspection Checklist", hint: "What the OMEGA team will verify on-site." },
  { code: "07", label: "Compliance Flags", hint: "UAE approval, NOC, and authority-impact items." },
  { code: "08", label: "Suggested Scope", hint: "Preliminary scope and BOQ-ready line items." },
  { code: "09", label: "Recommended OMEGA Route", hint: "Repair, renovation, engineering, or care path." },
  { code: "10", label: "PDF-Ready Report", hint: "Structured document for owners, tenants, or PM." },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/**
 * "From Photo to Property Report" — the report-output section.
 *
 * Reframes OMEGA AI's output as a structured property report, not a
 * chat reply. Reports are the monetisable, defensible artefact: a PDF
 * a landlord, tenant, PM, or engineer can act on or share.
 */
export function PhotoToReport() {
  return (
    <section
      id="report"
      className="relative overflow-hidden bg-warmwhite py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <div className="h-px arch-rule" />

        <Reveal>
          <div className="mt-6 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
              <span>Section 04 — From Photo to Property Report</span>
            </div>
            <span className="hidden md:inline">PDF-ready · Owner / Tenant / PM</span>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-7 text-[2rem] md:text-[3rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">From a single photo</span>
            <span className="mt-1.5 md:mt-2 block font-light text-muted">
              to a structured property report.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
          >
            Every OMEGA AI scan produces a structured property report —
            shareable, monetisable, and defensible. Designed for owners,
            tenants, landlords, and property managers who need
            documentation, not just an opinion.
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardContainer}
          className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {reportFields.map((f) => (
            <motion.article
              key={f.code}
              variants={cardItem}
              className="group module-card relative flex flex-col rounded-[16px] border border-line/85 bg-warmwhite p-5 hover:border-graphite/25"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
                  {f.code}
                </span>
                <span
                  aria-hidden
                  className="h-px w-4 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-7 group-hover:bg-omega/70"
                />
              </div>
              <h3 className="mt-3 text-[0.98rem] font-semibold leading-snug tracking-tight text-graphite">
                {f.label}
              </h3>
              <p className="mt-2 text-[0.82rem] leading-[1.55] text-muted">
                {f.hint}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-16 flex flex-wrap items-center gap-4">
          <a
            href="/diagnosis"
            data-action="START_DIAGNOSIS"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite hover:bg-graphite/90 transition-colors duration-500 ease-elegant"
          >
            Generate Property Assessment
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite hover:border-graphite/40 transition-colors duration-500 ease-elegant"
          >
            Request OMEGA Inspection
          </a>
        </div>

        <div className="mt-20 h-px arch-rule" />
      </div>
    </section>
  );
}
