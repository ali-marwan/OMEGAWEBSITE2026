"use client";

import Link from "next/link";
import { Fragment } from "react";
import type { Service } from "@/lib/services";

/**
 * Per-card display state driven by the active filter:
 *   - "normal":   filter === "All"; baseline appearance
 *   - "featured": a category is selected and this card matches; gets
 *                 a subtly stronger border + soft omega ring
 *   - "dimmed":   a category is selected and this card doesn't match;
 *                 reduced to ~30% opacity, hover lift suppressed
 */
export type ServiceCardState = "normal" | "featured" | "dimmed";

type Props = {
  service: Service;
  state?: ServiceCardState;
  className?: string;
};

/**
 * Premium Service Hub card.
 *
 * Composition (top → bottom):
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
 * Hover: lift via `.module-card:hover`, border tightens, the
 * orange status dot saturates, the accent line grows, the title
 * shifts +0.5 px, and the arrow disc tints orange. Dimmed cards
 * suppress the lift via `hover:!translate-y-0` so they stay
 * passive in a filtered view but remain clickable.
 */
export function ServiceHubCard({
  service,
  state = "normal",
  className = "",
}: Props) {
  const stateClasses =
    state === "dimmed"
      ? // Quiet but still visible — non-matching card in a filtered view.
        "opacity-30 hover:opacity-55 hover:!translate-y-0 border-line/85"
      : state === "featured"
      ? // Active match — slightly stronger border + soft omega ring.
        "border-graphite/30 ring-1 ring-omega/15 hover:border-graphite/40"
      : // Default — base border + normal hover.
        "border-line/85 hover:border-graphite/25";

  return (
    <article
      className={`group module-card relative flex h-full flex-col overflow-hidden rounded-[20px] border bg-warmwhite p-7 md:p-9 transition-[opacity,border-color,box-shadow,transform] duration-500 ease-elegant ${stateClasses} ${className}`}
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

      {/* Top row */}
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
      <h3 className="mt-5 text-[1.25rem] md:text-[1.4rem] font-semibold leading-tight tracking-tight text-graphite transition-transform duration-500 ease-elegant group-hover:translate-x-0.5">
        {service.title}
      </h3>

      {/* Descriptor */}
      <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted/90">
        {service.descriptor}
      </p>

      {/* Description */}
      <p className="mt-4 text-[0.92rem] leading-[1.65] text-muted">
        {service.description}
      </p>

      {/* Use cases */}
      <div className="mt-6">
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
          Use Cases
        </div>
        {" "}
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[0.86rem] text-graphite/80">
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
      <div className="mt-6 h-px w-full bg-line" />

      {/* Available actions — informational mono-text row */}
      <div className="mt-4">
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
          Available Actions
        </div>
        {" "}
        <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
          {service.availableActions.map((a, i) => (
            <Fragment key={a.code}>
              {i > 0 && " · "}
              <span>{a.label}</span>
            </Fragment>
          ))}
        </p>
      </div>

      {/* Spacer pushes the primary CTA to the bottom of the card */}
      <div className="flex-1" />

      {/* Hairline above the primary CTA */}
      <div className="mt-6 h-px w-full bg-line" />

      {/* Primary CTA */}
      <Link
        href={service.primaryCta.href}
        data-action={service.appActionType}
        className="mt-4 inline-flex items-center justify-between gap-3 text-[0.93rem] font-medium text-graphite transition-colors duration-500 ease-elegant group-hover:text-omega"
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
    </article>
  );
}
