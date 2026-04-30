"use client";

import { Fragment } from "react";
import { OmegaMark } from "./OmegaMark";

/**
 * Footer — the closing layer of the landing page.
 *
 * Visual finish (matches the rest of the page's architectural
 * language so the footer reads as a continuation, not a separate UI):
 *
 *   - Faint `arch-grid` micro-grid behind the content (same as Hero,
 *     SystemBand, AISystem, ClosingPaths) for atmosphere
 *   - Soft warm radial glow at the section top
 *   - Architectural `arch-rule` hairline at the very top + above the
 *     copyright row, replacing the previous solid borders
 *   - Brand wordmark gets a thin orange accent line and a small
 *     mono metadata strip (v1.0 · Foundation · UAE) — same vocabulary
 *     used in the Hero eyebrow and the Service System primary card
 *   - Each column heading is preceded by a small orange indicator
 *     dot (echoes the eyebrow rows on every other section)
 *   - Each link gets a tiny orange hairline indicator that fades in
 *     on hover plus a +0.5 px nudge — quiet, never playful
 *   - Bottom copyright is two stacked lines on every breakpoint, with
 *     a real newline character between them so the DOM textContent
 *     never reads as one run-on sentence
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-warmwhite text-graphite">
      {/* Faint architectural micro-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-60"
      />

      {/* Soft warm radial — gentle ambient closer at the section top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.05) 0%, rgba(242,106,27,0.02) 35%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10 py-20 md:py-24">
        {/* Top architectural rule — sets the closing layer apart from
            the ClosingPaths section without shouting. */}
        <div className="h-px arch-rule" />

        <div className="mt-14 grid grid-cols-12 gap-x-8 gap-y-12 md:gap-y-10">
          {/* ── Brand column ───────────────────────────────────────── */}
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3 text-graphite">
              <OmegaMark size={28} />
              {" "}
              <span className="text-[1rem] tracking-[0.3em] font-medium">
                OMEGA
              </span>
              {" "}
              <span
                aria-hidden
                className="ml-1 inline-block h-px w-10 bg-omega/60"
              />
            </div>

            <p className="mt-7 max-w-md text-base leading-[1.7] text-muted">
              Engineering-led property solutions across the UAE —
              care, repair, assessment, renovation, and engineering,
              operating as one system.
            </p>

            {/* Mono metadata strip — instrument-panel style cue that
                ties the footer back to the Hero eyebrow. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega/70"
                />
                {" "}
                <span>v1.0 · Foundation</span>
              </span>
              {" "}
              <span aria-hidden className="h-2 w-px bg-graphite/20" />
              {" "}
              <span>UAE</span>
            </div>
          </div>

          {/* ── System column ──────────────────────────────────────── */}
          <FooterCol
            label="System"
            items={[
              "OMEGA Property Care System",
              "OMEGA Home Services",
              "OMEGA Property Health Report",
              "OMEGA Renovation",
              "OMEGA Engineering Solutions",
            ]}
            className="col-span-6 md:col-span-3"
          />

          {/* ── Studio column ──────────────────────────────────────── */}
          <FooterCol
            label="Studio"
            items={["About OMEGA", "Engineering Practice", "Press", "Careers"]}
            className="col-span-6 md:col-span-2"
          />

          {/* ── Connect column ─────────────────────────────────────── */}
          <FooterCol
            label="Connect"
            items={[
              "Speak to Our Team",
              "OMEGA Service Hub",
              "WhatsApp",
              "Email",
            ]}
            className="col-span-12 md:col-span-2"
          />
        </div>

        {/* Architectural rule above the copyright row */}
        <div className="mt-16 h-px arch-rule" />

        {/* Copyright — two stacked lines on every breakpoint. The
            literal `{"\n"}` text node between siblings keeps a real
            newline character in the DOM textContent so a flat-text
            audit never sees them as one run-on sentence. */}
        <div className="mt-7 flex flex-col items-start gap-2 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <p>© 2026 OMEGA · UAE</p>
          {"\n"}
          <p>One System for Property Care · Elevated by Engineering</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Single footer column.
 *
 *   - Heading row: small orange indicator dot + mono uppercase label
 *     in graphite/85 (subtle bump from the previous muted treatment
 *     so the heading reads as a heading)
 *   - Each list item is a link with a tiny orange hairline indicator
 *     that fades in on hover and a +0.5 px nudge to the right. The
 *     text colour also tints to OMEGA orange. No bounce, no playful
 *     animation — calm 500 ms `ease-elegant` curve.
 *
 * `<Fragment>` separators between mapped `<li>` items insert a
 * literal whitespace text node between siblings so the rendered DOM
 * textContent never joins (e.g. "OMEGA Home ServicesOMEGA Property
 * Health Report").
 */
function FooterCol({
  label,
  items,
  className = "",
}: {
  label: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {/* Column heading row */}
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-technical">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
        />
        {" "}
        <span className="text-graphite/85">{label}</span>
      </div>

      <ul className="mt-6 space-y-3.5">
        {items.map((it, i) => (
          <Fragment key={it}>
            {i > 0 && " "}
            <li>
              <a
                href="#"
                className="group/link relative inline-flex items-center gap-2 text-[0.92rem] text-graphite/80 transition-all duration-500 ease-elegant hover:translate-x-0.5 hover:text-omega"
              >
                {/* Orange hairline indicator that fades in on hover */}
                <span
                  aria-hidden
                  className="inline-block h-px w-2 bg-omega opacity-0 transition-opacity duration-500 ease-elegant group-hover/link:opacity-100"
                />
                {" "}
                <span>{it}</span>
              </a>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
