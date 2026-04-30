"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type GuidedPath = {
  code: string;
  question: string;
  route: string;
  cta: string;
  href: string;
};

/**
 * Three quick-routing options for visitors who don't yet know
 * which service module to pick. Each card answers a starting
 * intent in plain language and points to the most relevant flow.
 *
 * Rendered before the closing CTA on /service-hub so the catalog
 * is always one step away from a guided next action.
 */
const guidedPaths: GuidedPath[] = [
  {
    code: "01",
    question: "I have an urgent issue.",
    route: "Start Diagnosis · Home Services",
    cta: "Start Diagnosis",
    href: "/#ai",
  },
  {
    code: "02",
    question: "I want annual support.",
    route: "Property Care System",
    cta: "View Property Care",
    href: "/service-hub/property-care-system",
  },
  {
    code: "03",
    question: "I need renovation or technical review.",
    route: "Renovation · Engineering Solutions",
    cta: "View Renovation",
    href: "/service-hub/renovation",
  },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

export function GuidedPathSection() {
  return (
    <section
      id="guided"
      className="relative overflow-hidden bg-warmwhite pt-16 pb-20 md:pt-20 md:pb-24"
    >
      {/* Subtle architectural grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-60"
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Eyebrow */}
        <Reveal>
          <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Section 03 — Guided Path</span>
          </div>
        </Reveal>

        {/* Title row + AI Diagnostics primary CTA */}
        <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.8rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">
              Not sure where to start?
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
          >
            Use OMEGA AI Property Diagnostics to understand the issue
            before choosing a service.
          </Reveal>
        </div>

        {/* Lead diagnosis CTA */}
        <Reveal delay={0.2} className="mt-8">
          <Link
            href="/#ai"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            Start Diagnosis
            {" "}
            <Arrow />
          </Link>
        </Reveal>

        {/* Three quick path cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardContainer}
          className="mt-10 grid grid-cols-1 gap-6 md:gap-7 md:grid-cols-3"
        >
          {guidedPaths.map((p, i) => (
            <Fragment key={p.code}>
              {i > 0 && " "}
              <PathCard path={p} />
            </Fragment>
          ))}
        </motion.div>

        {/* Bottom architectural rule */}
        <div className="mt-16 h-px arch-rule" />
      </div>
    </section>
  );
}

function PathCard({ path }: { path: GuidedPath }) {
  return (
    <motion.article
      variants={cardItem}
      className="group module-card relative flex flex-col overflow-hidden rounded-[20px] border border-line/85 bg-warmwhite p-8 md:p-10 hover:border-graphite/25"
    >
      {/* corner ticks */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-px w-8 bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-8 w-px bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-px w-8 bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-8 w-px bg-graphite/15"
      />

      {/* PATH 0X label */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega group-hover:shadow-[0_0_10px_rgba(242,106,27,0.55)]"
        />
        {" "}
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-omega">
          PATH {path.code}
        </span>
        {" "}
        <span
          aria-hidden
          className="h-px w-6 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-12 group-hover:bg-omega/70"
        />
      </div>

      {/* Question */}
      <h3 className="mt-6 text-[1.25rem] md:text-[1.4rem] font-semibold leading-tight tracking-tight text-graphite">
        {path.question}
      </h3>

      {/* Route description */}
      <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
        Route · {path.route}
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Hairline */}
      <div className="mt-8 h-px w-full bg-line" />

      {/* CTA */}
      <Link
        href={path.href}
        className="mt-5 inline-flex items-center justify-between gap-3 text-[0.93rem] font-medium text-graphite transition-colors duration-500 ease-elegant group-hover:text-omega"
      >
        <span>{path.cta}</span>
        {" "}
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full border border-graphite/20 transition-all duration-500 ease-elegant group-hover:border-omega/60 group-hover:bg-omega/5"
        >
          <Arrow />
        </span>
      </Link>
    </motion.article>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
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
