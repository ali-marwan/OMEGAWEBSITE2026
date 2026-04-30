"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ease, heroTimeline } from "@/lib/motion";

/**
 * Service Hub hero — practical, premium, no 3D.
 *
 * Mirrors the landing-page hero's eyebrow + headline + paragraph +
 * CTA-row composition so the two pages read as part of the same
 * design system, but drops the right-column 3D logo because the
 * hub is meant to feel usable, not cinematic. The headline lands
 * on a single line ("OMEGA Service Hub.") rather than the
 * landing page's two-line split — a focused page treatment vs the
 * exploratory landing rhythm.
 */
export function ServiceHubHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-14 md:pt-32 md:pb-16"
    >
      {/* Architectural micro-grid behind the hero */}
      <div className="pointer-events-none absolute inset-0 arch-grid opacity-70" />

      {/* Soft warm radial — gentle ambient orange tone at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.08) 0%, rgba(242,106,27,0.03) 40%, transparent 75%)",
        }}
      />

      {/* Top hairline — single architectural horizon, matches landing */}
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto max-w-page px-6 lg:px-10">
        <div className="h-px arch-rule" />
      </div>

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: heroTimeline.eyebrow, ease }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Service Hub / UAE / Property Solutions</span>
          </div>
          {" "}
          <div className="hidden md:flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
            <span>v1.0 · Service Hub</span>
            {" "}
            <span aria-hidden className="h-3 w-px bg-line" />
            {" "}
            <span>5 Modules</span>
          </div>
        </motion.div>
        {/*
          Real newline between the eyebrow row and the headline so
          flat-text reads as two separate lines, not "Modules OMEGA…".
        */}
        {"\n"}

        {/* Headline — single bold line on this page (focused module
            treatment) rather than the landing's two-line rhythm. */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: heroTimeline.headlineLine1,
            ease,
          }}
          className="mt-8 md:mt-10 max-w-3xl font-sans font-bold text-[2.4rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[1.04] tracking-tightest text-graphite"
        >
          OMEGA Service Hub.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: heroTimeline.paragraph,
            ease,
          }}
          className="mt-6 max-w-2xl text-base md:text-lg leading-[1.75] text-muted"
        >
          Browse structured property services, understand what you
          need, and move into the right OMEGA path.
        </motion.p>

        {/* Primary actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: heroTimeline.ctaGroup,
                staggerChildren: 0.08,
              },
            },
          }}
          className="mt-9 flex flex-wrap items-stretch gap-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease },
              },
            }}
          >
            <Link
              href="/diagnosis"
              data-action="START_DIAGNOSIS"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
            >
              Start Diagnosis
              {" "}
              <Arrow />
            </Link>
          </motion.div>
          {" "}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease },
              },
            }}
          >
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
            >
              Speak to Our Team
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h8m0 0L7 3m4 4-4 4" />
    </svg>
  );
}
