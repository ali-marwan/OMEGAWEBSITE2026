"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type Path = {
  code: string;
  title: string;
  description: string;
  cta: string;
  href: string;
};

/**
 * Three "next steps" the visitor can take after the AI section. Each
 * card is a deliberate route, not a generic CTA — Service Hub for
 * structured browsing, AI Diagnostics for understanding, direct team
 * contact for hands-on support.
 */
const paths: Path[] = [
  {
    code: "01",
    title: "OMEGA AI Property Scan",
    description:
      "Photograph the issue. Get a structured assessment before you act.",
    cta: "Start Property Scan",
    href: "/diagnosis",
  },
  {
    code: "02",
    title: "Request OMEGA Inspection",
    description:
      "Move from AI assessment to a UAE site visit, BOQ, and quotation.",
    cta: "Request OMEGA Inspection",
    href: "/contact",
  },
  {
    code: "03",
    title: "Generate Property Assessment",
    description:
      "Produce a shareable, PDF-ready report for owners, tenants, or PM.",
    cta: "Generate Property Assessment",
    href: "/diagnosis",
  },
];

/** Outer container — staggers the three cards on scroll-in. */
const cardContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

/**
 * Closing-CTA section — the final block of the landing page before
 * the footer. Presents three premium "paths" (Property Scan, OMEGA
 * Inspection, Property Assessment) so the page resolves into a clear
 * next action rather than dropping straight into the footer.
 *
 * Design language matches the rest of the page exactly:
 *   - same eyebrow row composition (orange dot + mono label, plus a
 *     muted right-side technical caption on md+)
 *   - same two-line block headline with `block` spans + `mt-X`
 *   - same architectural hairline rules at top + bottom of the block
 *   - same `.module-card` finish on each card so the closing cards
 *     feel like a continuation of the Service System modules without
 *     repeating the asymmetric grid
 *
 * The section's `id="hub"` matches the existing `#hub` anchors used
 * by the floating dock and footer.
 */
export function ClosingPaths() {
  return (
    <section
      id="hub"
      className="relative overflow-hidden bg-warmwhite py-28 md:py-36"
    >
      {/* Subtle architectural micro-grid — same treatment used in the
          AI section so the two sections share atmosphere. */}
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      {/* Soft warm radial accent at the section top — gentle ambient
          orange glow that ties the page back to the brand. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.08) 0%, rgba(242,106,27,0.03) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural hairline */}
        <div className="h-px arch-rule" />

        {/* Eyebrow row */}
        <Reveal>
          <div className="mt-6 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
              />
              {" "}
              <span>Section 08 — Choose Your Path</span>
            </div>
            {" "}
            <span className="hidden md:inline">3 Routes · OMEGA Start</span>
          </div>
        </Reveal>

        {/* Headline + supporting copy — mirrors the Service System
            rhythm (8 / 4 split on lg). The two block spans plus a
            literal whitespace text node between them keep the
            sentence visually broken across two lines without joining
            in flat textContent. */}
        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-7 text-[2rem] md:text-[3rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">
              From assessment
            </span>
            {" "}
            <span className="mt-1.5 md:mt-2 block font-light text-muted">
              to OMEGA execution.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
          >
            Start with an AI property scan, request a UAE site
            inspection, or generate a structured property assessment —
            every route resolves through OMEGA execution.
          </Reveal>
        </div>

        {/* Three premium path cards — single row on desktop,
            stacked vertically on tablet + mobile. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={cardContainer}
          className="mt-16 grid grid-cols-1 gap-6 md:gap-7 md:grid-cols-3"
        >
          {paths.map((path) => (
            <PathCard key={path.code} path={path} />
          ))}
        </motion.div>

        {/* Bottom architectural hairline — closes the section visually
            before handing off to the footer. */}
        <div className="mt-20 h-px arch-rule" />
      </div>
    </section>
  );
}

/**
 * Single path card.
 *
 * Visual language:
 *   - PATH 0X mono label in OMEGA orange + a 6 px orange indicator
 *     dot that brightens (and gets a soft glow halo) on hover
 *   - thin orange accent line that grows from 24 px → 48 px on hover
 *     (echoes the hover state of the Operating Principles section)
 *   - architectural corner ticks at top-left + bottom-right
 *   - title shifts +0.5 px right on hover (very subtle, no bounce)
 *   - hairline rule above the CTA so the action sits in its own row
 *   - CTA is a refined link with a small bordered arrow disc that
 *     tints orange on hover
 *
 * The .module-card class supplies the soft inset top-light and the
 * lift / shadow elevation on hover — same finish as the Service
 * System cards so the page reads as one continuous design system.
 */
function PathCard({ path }: { path: Path }) {
  return (
    <motion.article
      variants={cardItem}
      className="group module-card relative flex flex-col overflow-hidden rounded-[20px] border border-line/85 bg-warmwhite p-8 md:p-10 hover:border-graphite/25"
    >
      {/* Architectural corner ticks */}
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

      {/* Top label row — orange indicator + PATH 0X + accent line */}
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

      {/* Title */}
      <h3 className="mt-6 text-[1.35rem] md:text-[1.5rem] font-semibold leading-tight tracking-tight text-graphite transition-transform duration-500 ease-elegant group-hover:translate-x-0.5">
        {path.title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-[0.95rem] leading-[1.7] text-muted">
        {path.description}
      </p>

      {/* Spacer pushes the CTA to the bottom regardless of card height */}
      <div className="flex-1" />

      {/* Hairline rule above CTA */}
      <div className="mt-8 h-px w-full bg-line" />

      {/* CTA row */}
      <a
        href={path.href}
        className="mt-5 inline-flex items-center justify-between gap-3 text-[0.93rem] font-medium text-graphite transition-colors duration-500 ease-elegant group-hover:text-omega"
      >
        <span>{path.cta}</span>
        {" "}
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full border border-graphite/20 transition-all duration-500 ease-elegant group-hover:border-omega/60 group-hover:bg-omega/5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7h8m0 0L7 3m4 4-4 4" />
          </svg>
        </span>
      </a>
    </motion.article>
  );
}
