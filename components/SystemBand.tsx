"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type Principle = {
  code: string;
  title: string;
  description: string;
};

const principles: Principle[] = [
  {
    code: "01",
    title: "Engineering-led",
    description:
      "Every service is supported by technical judgment, not guesswork.",
  },
  {
    code: "02",
    title: "UAE-wide coverage",
    description:
      "Structured support across residential and commercial properties.",
  },
  {
    code: "03",
    title: "AI-guided service",
    description: "Diagnosis and routing supported by OMEGA service logic.",
  },
  {
    code: "04",
    title: "One continuous system",
    description:
      "Care, repair, assessment, renovation, and engineering connected together.",
  },
];

/** Per-principle internal cascade: number → title → description. */
const itemContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemPart = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

/** Outer container staggers across the four principles. */
const rowStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export function SystemBand() {
  return (
    <section
      id="system"
      className="relative overflow-hidden bg-warmwhite py-20 md:py-28"
    >
      {/* Faint technical linework — horizontal hairline + sparse ticks */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-line/35" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(216,207,194,0.18) 1px, transparent 1px)",
            backgroundSize: "240px 100%",
            backgroundPosition: "center",
            maskImage:
              "radial-gradient(ellipse 70% 90% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 90% at 50% 50%, black 30%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top divider hairline */}
        <div className="h-px arch-rule" />

        {/* Eyebrow row */}
        <Reveal>
          <div className="mt-6 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
              <span>OMEGA · Operating Principles</span>
            </div>
            <span className="hidden md:inline-block">
              §01 · Credibility Layer
            </span>
          </div>
        </Reveal>

        {/* Principles row — staggered cascade */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={rowStagger}
          className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0"
        >
          {principles.map((p, i) => (
            <PrincipleItem key={p.code} principle={p} index={i} />
          ))}
        </motion.div>

        {/* Bottom divider hairline */}
        <div className="mt-16 h-px arch-rule" />
      </div>
    </section>
  );
}

function PrincipleItem({
  principle,
  index,
}: {
  principle: Principle;
  index: number;
}) {
  // Column divider — vertical hairline between principles on lg.
  const dividerClass =
    index === 0
      ? ""
      : "lg:before:absolute lg:before:left-0 lg:before:top-2 lg:before:bottom-2 lg:before:w-px lg:before:bg-line/70 lg:before:content-['']";

  return (
    <motion.div
      variants={itemContainer}
      className={`group relative ${dividerClass} lg:px-6 lg:first:pl-0 lg:last:pr-0`}
    >
      {/* Number row — small omega code + faint tick mark */}
      <motion.div
        variants={itemPart}
        className="flex items-center gap-2.5"
      >
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-omega">
          {principle.code}
        </span>
        <span className="h-px w-5 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-8 group-hover:bg-omega/70" />
      </motion.div>

      {/* Title — slightly stronger, transforms quietly on hover */}
      <motion.h3
        variants={itemPart}
        className="mt-4 text-[1.05rem] md:text-[1.15rem] font-semibold leading-snug tracking-tight text-graphite transition-transform duration-500 ease-elegant group-hover:translate-x-0.5"
      >
        {principle.title}
      </motion.h3>

      {/* Supporting line — smaller, restrained */}
      <motion.p
        variants={itemPart}
        className="mt-2 max-w-[28ch] text-[0.86rem] leading-[1.6] text-muted"
      >
        {principle.description}
      </motion.p>
    </motion.div>
  );
}
