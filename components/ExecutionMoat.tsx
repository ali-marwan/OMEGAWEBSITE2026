"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type Layer = {
  code: string;
  title: string;
  hint: string;
};

const layers: Layer[] = [
  { code: "01", title: "OMEGA Technical Review", hint: "Engineering review of every AI-generated assessment before execution." },
  { code: "02", title: "UAE Site Inspection", hint: "On-site verification by OMEGA's UAE technical team." },
  { code: "03", title: "BOQ & Quotation Preparation", hint: "Scoped, costed, and ready for client approval." },
  { code: "04", title: "Verified Execution Teams", hint: "Vetted contractors and trades aligned with OMEGA standards." },
  { code: "05", title: "Before / After Documentation", hint: "Photo, video, and report records of every job." },
  { code: "06", title: "Warranty-Backed Work", hint: "OMEGA-backed warranty across executed scope." },
  { code: "07", title: "Long-Term Property History", hint: "Every report and job feeds the property's intelligence record." },
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
 * "AI is only the starting point. Execution is the advantage."
 *
 * The defensibility section. Counters the "this is just a chatbot"
 * reading by stacking the seven execution layers OMEGA owns
 * downstream of the AI scan.
 */
export function ExecutionMoat() {
  return (
    <section
      id="execution"
      className="relative overflow-hidden bg-warmwhite py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 0%, rgba(242,106,27,0.08) 0%, rgba(242,106,27,0.03) 40%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <div className="h-px arch-rule" />

        <Reveal>
          <div className="mt-6 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
              <span>Section 07 — Execution Layer</span>
            </div>
            <span className="hidden md:inline">7 Layers · OMEGA Owned</span>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-8 text-[2rem] md:text-[3rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">AI is only the starting point.</span>
            <span className="mt-1.5 md:mt-2 block font-light text-muted">
              Execution is the advantage.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-4 text-base text-muted leading-[1.75]"
          >
            Anyone can build a chatbot. OMEGA owns the seven execution
            layers downstream of the AI scan — review, inspection,
            quotation, delivery, documentation, warranty, and history.
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardContainer}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {layers.map((layer, i) => (
            <motion.article
              key={layer.code}
              variants={cardItem}
              className={`group module-card relative flex flex-col rounded-[18px] border border-line/85 bg-warmwhite p-7 hover:border-graphite/25 ${
                i === 6 ? "lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-omega">
                  LAYER {layer.code}
                </span>
                <span
                  aria-hidden
                  className="h-px w-6 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-12 group-hover:bg-omega/70"
                />
              </div>
              <h3 className="mt-5 text-[1.08rem] md:text-[1.18rem] font-semibold leading-snug tracking-tight text-graphite">
                {layer.title}
              </h3>
              <p className="mt-3 text-[0.92rem] leading-[1.6] text-muted">
                {layer.hint}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-20 h-px arch-rule" />
      </div>
    </section>
  );
}
