import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FloatingDock } from "@/components/FloatingDock";
import { buildPageMetadata } from "@/lib/seo";

/**
 * Custom 404 / not-found page.
 *
 * Triggered automatically by:
 *   - any unknown route on the site
 *   - `notFound()` calls inside dynamic routes:
 *       app/service-hub/[slug]/page.tsx → unknown service slug
 *       app/insights/[slug]/page.tsx → unknown article slug
 *
 * Composition matches every other route (Navigation, content,
 * Footer, FloatingDock) so the 404 reads as part of one continuous
 * product, not a default Next.js scaffold. Three forward CTAs make
 * sure the page is never a dead end:
 *
 *   1. Open Service Hub  → /service-hub
 *   2. Start Diagnosis   → /diagnosis
 *   3. Speak to Team     → /contact
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Page Not Found | OMEGA",
  description:
    "The page you requested could not be located. Return to the OMEGA system or start with the right service path.",
  // Path used for the canonical URL — kept generic so this 404
  // never gets indexed (it also carries `noindex: true` below).
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <main className="relative">
      <Navigation />

      <section
        id="top"
        className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-8 md:pt-32 md:pb-10"
      >
        {/* Architectural micro-grid — same as every hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 arch-grid opacity-70"
        />

        {/* Soft warm radial accent — top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.08) 0%, rgba(242,106,27,0.02) 40%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-page px-6 lg:px-10">
          {/* Top architectural rule */}
          <div className="h-px arch-rule" />

          {/* Breadcrumb-style status row */}
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <Link
              href="/"
              className="text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
            >
              Home
            </Link>
            {" "}
            <span aria-hidden>·</span>
            {" "}
            <span className="text-omega">404</span>
          </div>

          {/* Eyebrow row */}
          <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Status</span>
            {" "}
            <span aria-hidden className="h-3 w-px bg-line" />
            {" "}
            <span>404 · Page Not Available</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2.2rem] md:text-[2.9rem] lg:text-[3.5rem] leading-[1.04] tracking-tightest text-graphite">
            This page is not available.
          </h1>

          {/* Body paragraph */}
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-[1.7] text-muted">
            Return to the OMEGA system or start with the right service
            path. The page you requested may have been moved, or the
            link you followed may be incorrect.
          </p>

          {/* What you can do strip — same chip vocabulary as other heroes */}
          <div className="mt-7">
            <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
              From Here
            </div>
            {" "}
            <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
              {[
                "Browse the service system",
                "Start a guided diagnosis",
                "Speak to the OMEGA team",
              ].map((c, i) => (
                <Fragment key={c}>
                  {i > 0 && " "}
                  <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/70 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/80">
                    <span
                      aria-hidden
                      className="inline-block h-1 w-1 rounded-full bg-omega"
                    />
                    {" "}
                    <span>{c}</span>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          {/* Three forward CTAs — never a dead end. */}
          <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
            <Link
              href="/service-hub"
              data-action="OPEN_SERVICE_HUB"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
            >
              <span>Open Service Hub</span>
              {" "}
              <Arrow />
            </Link>
            {" "}
            <Link
              href="/diagnosis"
              data-action="START_DIAGNOSIS"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
            >
              <span>Start Diagnosis</span>
            </Link>
            {" "}
            <Link
              href="/contact"
              data-action="CONTACT_TEAM"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
            >
              <span>Speak to Team</span>
            </Link>
          </div>

          {/* Bottom architectural rule */}
          <div className="mt-8 h-px arch-rule" />
        </div>
      </section>

      <Footer />
      <FloatingDock />
    </main>
  );
}

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
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
