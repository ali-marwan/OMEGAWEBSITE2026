"use client";

import Link from "next/link";
import { Fragment } from "react";
import { OmegaMark } from "./OmegaMark";

/**
 * Footer — the closing layer of every page (landing, /service-hub,
 * and every /service-hub/[slug] detail page).
 *
 * Anchor strategy:
 *   - The Studio column wrapper carries `id="studio"` so the
 *     Navigation's `/#studio` link lands on it.
 *   - The Connect column wrapper carries `id="contact"` so every
 *     `#contact` (and `/#contact`) link in the codebase — Hero
 *     CTAs, Floating Dock, Service Hub Hero / CTA, Closing Paths
 *     "Speak to Our Team" path card, and the footer's own "Speak
 *     to Our Team" item — resolves to a real element.
 *   - Items inside each column ship with real per-item hrefs; the
 *     System column items route to the matching service detail
 *     page, the Connect column items route to /service-hub or to
 *     mailto / column-self anchors as appropriate.
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

type FooterLink = { label: string; href: string };

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

      {/* Bottom padding keeps the copyright row clear of the floating
          dock — the dock sits ~74 px from the page edge (24 px offset
          + ~50 px pill height). On mobile the previous `pb-32` (128
          px) created ~54 px of dead space below the copyright; `pb-20`
          (80 px) gives the dock a clean ~6 px buffer with no excess.
          Desktop keeps `pb-32` for editorial comfort under wider
          line-lengths. */}
      <div className="relative mx-auto max-w-page px-6 lg:px-10 pt-16 pb-20 md:pt-20 md:pb-32">
        {/* Top architectural rule — sets the closing layer apart from
            the ClosingPaths section without shouting. */}
        <div className="h-px arch-rule" />

        <div className="mt-14 grid grid-cols-12 gap-x-8 gap-y-12 md:gap-y-10">
          {/* ── Brand column ───────────────────────────────────────── */}
          <div className="col-span-12 md:col-span-5">
            <Link
              href="/#top"
              className="flex items-center gap-3 text-graphite"
            >
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
            </Link>

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
              {
                label: "OMEGA Property Care System",
                href: "/service-hub/property-care-system",
              },
              {
                label: "OMEGA Home Services",
                href: "/service-hub/home-services",
              },
              {
                label: "OMEGA Property Health Report",
                href: "/service-hub/property-health-report",
              },
              {
                label: "OMEGA Renovation",
                href: "/service-hub/renovation",
              },
              {
                label: "OMEGA Engineering Solutions",
                href: "/service-hub/engineering-solutions",
              },
            ]}
            className="col-span-6 md:col-span-3"
          />

          {/* ── Studio column ──────────────────────────────────────── */}
          {/*
            id="studio" makes Navigation's `/#studio` link resolve to a
            real element. The studio sub-pages (About OMEGA, Engineering
            Practice, etc.) don't exist as routes yet, so each item
            self-anchors back to the column for now — clicking does NOT
            jump the user to the top of the page (the previous broken
            `href="#"` behaviour).
          */}
          <FooterCol
            id="studio"
            label="Studio"
            items={[
              { label: "About OMEGA", href: "#studio" },
              { label: "Engineering Practice", href: "#studio" },
              { label: "Press", href: "#studio" },
              { label: "Careers", href: "#studio" },
            ]}
            className="col-span-6 md:col-span-2"
          />

          {/* ── Connect column ─────────────────────────────────────── */}
          {/*
            id="contact" makes every `#contact` link in the codebase
            (Floating Dock, Service Hub Hero / CTA, Closing Paths,
            ServiceDetailHero / DetailCTA) resolve to this column.
          */}
          <FooterCol
            id="contact"
            label="Connect"
            items={[
              { label: "Speak to Our Team", href: "/contact" },
              { label: "OMEGA Service Hub", href: "/service-hub" },
              { label: "WhatsApp", href: "/contact" },
              { label: "Email", href: "/contact" },
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
 *   - `id` (optional) is set on the column wrapper so the column
 *     itself can be a same-page anchor target (Studio + Connect use
 *     this for `/#studio` and `/#contact` resolution).
 *   - Heading row: small orange indicator dot + mono uppercase label
 *     in graphite/85 (subtle bump from the previous muted treatment
 *     so the heading reads as a heading)
 *   - Each list item is a real link with its own `href` — internal
 *     routes use Next.js `<Link>` for soft transitions; in-page
 *     anchors and external schemes (mailto:, tel:) use plain `<a>`.
 *   - Each item gets a tiny orange hairline indicator that fades in
 *     on hover and a +0.5 px nudge to the right. The text colour
 *     also tints to OMEGA orange. No bounce, no playful animation —
 *     calm 500 ms `ease-elegant` curve.
 *
 * `<Fragment>` separators between mapped `<li>` items insert a
 * literal whitespace text node between siblings so the rendered DOM
 * textContent never joins.
 */
function FooterCol({
  id,
  label,
  items,
  className = "",
}: {
  id?: string;
  label: string;
  items: FooterLink[];
  className?: string;
}) {
  return (
    <div id={id} className={className}>
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
          <Fragment key={it.label}>
            {i > 0 && " "}
            <li>
              <FooterLinkItem href={it.href}>{it.label}</FooterLinkItem>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders the right element for the given href:
 *   - leading "/" or starts with the site path → Next.js `<Link>`
 *     for soft client-side transitions (covers `/service-hub`,
 *     `/service-hub/{slug}`, `/#top`, etc.)
 *   - "mailto:" / "tel:" / "https?://" → plain `<a>` (no router
 *     interception)
 *   - same-page hash ("#contact", "#studio") → plain `<a>` so the
 *     browser fires a real `hashchange` event (Next's `<Link>` can
 *     swallow it for hash-only navigation)
 *
 * Visual treatment is identical across all three branches.
 */
function FooterLinkItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const linkClass =
    "group/link relative inline-flex items-center gap-2 text-[0.92rem] text-graphite/80 transition-all duration-500 ease-elegant hover:translate-x-0.5 hover:text-omega";

  const inner = (
    <>
      <span
        aria-hidden
        className="inline-block h-px w-2 bg-omega opacity-0 transition-opacity duration-500 ease-elegant group-hover/link:opacity-100"
      />
      {" "}
      <span>{children}</span>
    </>
  );

  // External schemes + same-page anchors → plain <a>
  const isExternalScheme =
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    /^https?:\/\//.test(href);
  const isHashOnly = href.startsWith("#");

  if (isExternalScheme || isHashOnly) {
    return (
      <a href={href} className={linkClass}>
        {inner}
      </a>
    );
  }

  // Internal route → Next.js Link
  return (
    <Link href={href} className={linkClass}>
      {inner}
    </Link>
  );
}
