"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { OmegaMark } from "./OmegaMark";
import { ease, easeAtmospheric, viewportOnce } from "@/lib/motion";

const steps = [
  {
    code: "I",
    label: "diagnose",
    title: "Diagnose",
    body: "Describe the issue in plain language — the model interprets it through OMEGA service taxonomy.",
  },
  {
    code: "II",
    label: "understand",
    title: "Understand",
    body: "Receive a clear, engineering-informed explanation of likely causes and the right intervention.",
  },
  {
    code: "III",
    label: "act",
    title: "Act",
    body: "Move directly into the right OMEGA service — care, repair, assessment, renovation or engineering.",
  },
];

/** Cascade for the steps column. Canvas reveals first, then steps follow. */
const stepsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

const stepItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

export function AISystem() {
  return (
    <section
      id="intelligence"
      className="relative overflow-hidden bg-warmwhite py-32 md:py-44 text-graphite"
    >
      {/* Subtle architectural grid */}
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      {/* Soft orange radial highlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.10) 0%, rgba(242,106,27,0.04) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <Reveal className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
          <span>Section 03 — Intelligence Layer</span>
        </Reveal>

        <div className="mt-7 grid grid-cols-12 items-end gap-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-8 text-[2rem] md:text-[3.2rem] leading-[1.05] tracking-tightest text-graphite font-semibold"
          >
            OMEGA AI Property Intelligence System.
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-4 text-base text-muted leading-relaxed"
          >
            Diagnose issues. Understand solutions. Take the right action
            — guided by OMEGA expertise in the UAE.
          </Reveal>
        </div>

        {/* Canvas + steps — stretched to align */}
        <div className="mt-20 grid grid-cols-12 items-stretch gap-6 lg:gap-8">
          {/* Diagnostic canvas — reveals first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1.15, ease }}
            className="col-span-12 lg:col-span-7 flex"
          >
            <div
              data-spline-slot="ai-orb"
              className="relative w-full overflow-hidden rounded-[24px] border border-line/90 bg-warmwhite hairline"
            >
              {/* Internal subtle grid */}
              <div className="absolute inset-0 arch-grid-tight" />

              {/* Soft orange radial inside the frame */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(45% 50% at 50% 50%, rgba(242,106,27,0.10) 0%, transparent 70%)",
                }}
              />

              {/* radial structure */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute h-[42%] aspect-square rounded-full border border-line/70" />
                <div className="absolute h-[62%] aspect-square rounded-full border border-line/50" />
                <div className="absolute h-[82%] aspect-square rounded-full border border-line/30" />

                {/* Center diagnostic node — gentle continuous pulse */}
                <motion.div
                  className="absolute h-2 w-2 rounded-full bg-omega"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.25, 1],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: easeAtmospheric,
                  }}
                />
                {/* Outer ping ring — slower, fainter pulse */}
                <motion.div
                  className="absolute h-3.5 w-3.5 rounded-full border border-omega/60"
                  animate={{
                    opacity: [0.5, 0, 0.5],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: easeAtmospheric,
                  }}
                />

                <OmegaMark size={120} className="text-graphite/30" />
              </div>

              {/* scan lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-line/80" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-line/80" />

              {/* corner labels */}
              <div className="absolute top-5 left-5 font-mono text-[0.65rem] uppercase tracking-technical text-muted">
                AI · Reserved Canvas
              </div>
              <div className="absolute top-5 right-5 font-mono text-[0.65rem] uppercase tracking-technical text-muted">
                model · omega-1
              </div>
              <div className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-technical text-muted">
                lat · 25.2048° N
              </div>
              <div className="absolute bottom-5 right-5 font-mono text-[0.65rem] uppercase tracking-technical text-muted">
                lon · 55.2708° E
              </div>
            </div>
          </motion.div>

          {/* Step column — canvas-gated cascade */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stepsContainer}
            className="col-span-12 lg:col-span-5 flex flex-col gap-2.5"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.code}
                variants={stepItem}
                className="group relative rounded-2xl border border-line/90 bg-warmwhite/85 p-7 backdrop-blur-sm transition-colors duration-500 ease-elegant hover:border-line"
              >
                {/* Step technical label row */}
                <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-technical text-muted">
                  <div className="flex items-baseline gap-3">
                    <span className="text-omega">[{step.code}]</span>
                    <span>step · {step.label}</span>
                  </div>
                  <span className="opacity-70">0{i + 1} / 03</span>
                </div>

                <div className="mt-4 h-px w-10 bg-graphite/30" />

                <h3 className="mt-5 text-xl md:text-[1.35rem] font-semibold text-graphite leading-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {step.body}
                </p>
              </motion.div>
            ))}

            <motion.a
              href="#diagnose"
              variants={stepItem}
              className="group mt-1.5 inline-flex items-center justify-between rounded-full bg-omega px-6 py-4 text-sm font-medium text-warmwhite hover:bg-omega/90 transition-colors duration-500 ease-elegant"
            >
              <span>Start Diagnosis</span>
              <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-technical opacity-90">
                begin
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 7h8m0 0L7 3m4 4-4 4" />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
