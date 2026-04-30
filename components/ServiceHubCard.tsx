"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { ease, viewportOnce } from "@/lib/motion";
import type { Service } from "@/lib/services";

type Props = {
  service: Service;
  /** Stagger index in the parent grid (used to delay the entrance). */
  index?: number;
};

/**
 * Premium Service Hub card.
 *
 * Visual structure (top → bottom):
 *
 *   ●  01 / Property Care                               view →
 *   ──────────
 *
 *   OMEGA Property Care System                          ← title
 *   ANNUAL MAINTENANCE & ONGOING PROPERTY SUPPORT       ← descriptor
 *
 *   Structured annual maintenance and ongoing property
 *   care for residential and commercial properties.     ← description
 *
 *   USE CASES
 *   · Annual maintenance     · Preventive checks
 *   · Ongoing support        · Property performance
 *
 *   ──────────
 *
 *   AVAILABLE ACTIONS
 *   View Details · Start Diagnosis · Request Service · Speak to Team
 *
 *   ──────────
 *
 *   View Property Care                                       →
 *
 * Hover state: lift via `.module-card:hover`, border tightens, the
 * orange status dot saturates, the accent line grows, the title
 * shifts +0.5 px right, and the arrow disc tints orange. All
 * transitions on the shared 500 ms `ease-elegant` curve.
 */
export function ServiceHubCard({ service, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.85, delay: 0.08 * index, ease }}
      className="group module-card relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line/85 bg-warmwhite p-8 md:p-10 hover:border-graphite/25"
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

      {/* Top row: indicator dot + index + category label, plus a
          quiet "view →" affordance that brightens on hover. */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega group-hover:shadow-[0_0_10px_rgba(242,106,27,0.55)]"
          />
          {" "}
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-omega">
            {service.index}
          </span>
          {" "}
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
            / {service.category}
          </span>
        </div>
        {" "}
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-omega opacity-0 -translate-x-1 transition-all duration-500 ease-elegant group-hover:opacity-100 group-hover:translate-x-0">
          view →
        </span>
      </div>

      {/* Index baseline rule — subtly grows on hover */}
      <div
        aria-hidden
        className="mt-4 h-px w-10 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-16 group-hover:bg-omega/70"
      />

      {/* Title */}
      <h3 className="mt-6 text-[1.35rem] md:text-[1.5rem] font-semibold leading-tight tracking-tight text-graphite transition-transform duration-500 ease-elegant group-hover:translate-x-0.5">
        {service.title}
      </h3>

      {/* Descriptor (mono, uppercase, muted) */}
      <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted/90">
        {service.descriptor}
      </p>

      {/* Description */}
      <p className="mt-4 text-[0.95rem] leading-[1.7] text-muted">
        {service.description}
      </p>

      {/* Use cases */}
      <div className="mt-6">
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
          Use Cases
        </div>
        {" "}
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[0.88rem] text-graphite/80">
          {service.useCases.map((c, i) => (
            <Fragment key={c}>
              {i > 0 && " "}
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 rounded-full bg-graphite/35"
                />
                {" "}
                <span>{c}</span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>

      {/* Hairline */}
      <div className="mt-7 h-px w-full bg-line" />

      {/* Available actions — informational mono-text row, not a row of
          buttons (kept minimal so the primary CTA stays dominant).
          The list comes from service.availableActions so a future
          mobile app and the web both render the same flow names. */}
      <div className="mt-5">
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
          Available Actions
        </div>
        {" "}
        <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
          {service.availableActions.map((a, i) => (
            <Fragment key={a.code}>
              {i > 0 && " · "}
              <span>{a.label}</span>
            </Fragment>
          ))}
        </p>
      </div>

      {/* Spacer so the primary CTA always sits at the bottom of the
          card regardless of how long the description / use cases run. */}
      <div className="flex-1" />

      {/* Hairline above the primary CTA */}
      <div className="mt-7 h-px w-full bg-line" />

      {/* Primary CTA */}
      <Link
        href={service.primaryCta.href}
        data-action={service.appActionType}
        className="mt-5 inline-flex items-center justify-between gap-3 text-[0.93rem] font-medium text-graphite transition-colors duration-500 ease-elegant group-hover:text-omega"
      >
        <span>{service.primaryCta.label}</span>
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
      </Link>
    </motion.article>
  );
}
