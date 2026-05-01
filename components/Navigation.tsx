"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { OmegaMark } from "./OmegaMark";
import { ease } from "@/lib/motion";

/**
 * Header navigation — five entries, the last is a styled action that
 * leads to the Service Hub.
 *
 * Hrefs use a leading "/" so they work cross-page: from "/" they
 * trigger an in-page hash scroll; from "/service-hub" they navigate
 * back to "/" and then scroll to the anchor. We use Next.js
 * `<Link>` for soft client-side transitions everywhere.
 *
 * Mobile behaviour:
 *   - Below `md` the inline nav row collapses behind a single
 *     hamburger button that opens an architectural drawer below the
 *     header pill. The drawer surfaces the same five links plus the
 *     Service Hub CTA, so mobile visitors retain full navigation.
 *   - The hamburger button is a real `<button>` with `aria-expanded`
 *     and `aria-controls`, the drawer is keyboard-focusable, and
 *     <Esc> + outside-click + nav-click all close the drawer.
 */
/**
 * Final header navigation:
 *   System    → /              (homepage)
 *   Services  → /service-hub   (service catalog — same destination
 *                               as the OMEGA Service Hub CTA)
 *   OMEGA AI  → /diagnosis     (single product layer; no separate
 *                               OMEGA AI page)
 *   Studio    → /studio
 *   Insights  → /insights
 *
 * Every entry resolves to a real route — no homepage hash anchors
 * in the primary nav anymore. The Service Hub CTA pill (rendered
 * separately below) shares Services' destination but reads
 * visually as a primary action; both surface as active when the
 * user is on /service-hub or any /service-hub/[slug] sub-route.
 */
const links = [
  { label: "System", href: "/" },
  { label: "Services", href: "/service-hub" },
  { label: "OMEGA AI", href: "/diagnosis" },
  { label: "Studio", href: "/studio" },
  { label: "Insights", href: "/insights" },
];

const SERVICE_HUB_HREF = "/service-hub";
const AI_SCAN_HREF = "/diagnosis";
const MOBILE_DRAWER_ID = "mobile-nav-drawer";

export function Navigation() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onAIScan =
    pathname === AI_SCAN_HREF ||
    pathname?.startsWith(`${AI_SCAN_HREF}/`);

  /**
   * Route-based active-state helper for the inline nav links.
   *
   * Hash-anchor entries (any `href` containing `#`) always return
   * false — they're scroll positions, not destinations the visitor
   * "is on". Route entries highlight when the user is on that
   * route or any sub-route.
   *
   * The homepage (`/`) is special-cased: a naive `pathname.startsWith("/")`
   * check would mark System as active on every route. We require an
   * exact match instead.
   */
  const isRouteActive = (href: string) => {
    if (!href.startsWith("/") || href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll(); // initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change so it doesn't linger across
  // navigation. `pathname` updates on every soft route transition.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on <Esc> for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="fixed top-0 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-page px-6 lg:px-10">
        <div
          className={`mt-5 flex items-center justify-between rounded-full border px-5 py-3 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-500 ease-elegant ${
            scrolled
              ? "border-line/80 bg-warmwhite/85 shadow-[0_1px_0_rgba(30,30,30,0.04),0_22px_46px_-28px_rgba(30,30,30,0.22)]"
              : "border-line/55 bg-warmwhite/60 shadow-[0_1px_0_rgba(30,30,30,0.03),0_18px_40px_-30px_rgba(30,30,30,0.14)]"
          }`}
        >
          <Link
            href="/#top"
            className="flex items-center gap-3 pl-1 pr-3 text-graphite"
          >
            <OmegaMark size={22} className="text-graphite" />
            <span className="text-[0.95rem] tracking-[0.32em] font-medium">
              OMEGA
            </span>
            {" "}
            {/*
              Strapline + separator only render on lg+ now (was md+).
              At md (768 px) the inline nav has 5 items + the OMEGA
              Service Hub CTA — adding a 200 px+ strapline would push
              the row past the available space. lg (1024 px) has
              comfortable room for both.
            */}
            <span
              aria-hidden
              className="hidden lg:inline-block h-3 w-px bg-line"
            />
            {" "}
            <span className="hidden lg:inline-block font-mono text-[0.68rem] uppercase tracking-technical text-muted">
              UAE · Engineering-led Property Solutions
            </span>
          </Link>
          {/* Whitespace separator so brand strapline doesn't join the
              first nav link in DOM textContent. */}
          {" "}
          {/*
            Inline primary nav. Tighter `gap-5` at md so the 5
            inline links (System / Services / OMEGA AI / Studio /
            Insights) plus the Service Hub CTA fit comfortably at
            768 px. Returns to `gap-7` at lg+ where there's room.
          */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Primary navigation">
            {links.map((l, i) => {
              // Route-based active-state for /studio and /diagnosis;
              // hash anchors stay muted regardless. Active state =
              // a small omega dot before the label + non-muted text,
              // mirroring the Service Hub CTA's active treatment so
              // the navigation reads consistently.
              const active = isRouteActive(l.href);
              return (
                <Fragment key={l.href}>
                  {i > 0 && " "}
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-1.5 text-[0.85rem] transition-colors duration-500 ease-elegant ${
                      active
                        ? "text-graphite"
                        : "text-muted hover:text-graphite"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="inline-block h-1 w-1 rounded-full bg-omega shadow-[0_0_6px_rgba(242,106,27,0.6)]"
                      />
                    )}
                    {active && " "}
                    <span>{l.label}</span>
                  </Link>
                </Fragment>
              );
            })}
            {" "}
            {/* Start OMEGA AI Scan CTA — primary action surfaced in
                the header so OMEGA AI reads as the entry point into
                every OMEGA service. Active-state dot when the user is
                on /diagnosis. */}
            <Link
              href={AI_SCAN_HREF}
              data-action="START_DIAGNOSIS"
              aria-current={onAIScan ? "page" : undefined}
              className={`group/cta inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-all duration-500 ease-elegant hover:-translate-y-px ${
                onAIScan
                  ? "border-omega/70 bg-graphite text-warmwhite shadow-[0_0_0_1px_rgba(242,106,27,0.18)]"
                  : "border-graphite/90 bg-graphite text-warmwhite hover:bg-graphite/90"
              }`}
            >
              {onAIScan && (
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.7)]"
                />
              )}
              {onAIScan && " "}
              <span>Start OMEGA AI Scan</span>
            </Link>
          </nav>

          {/*
            Mobile hamburger button — only renders below `md`. The
            inline `<nav>` above is `hidden md:flex`, this button is
            `md:hidden`, so the two are mutually exclusive. Real
            `<button>` element with `aria-expanded` + `aria-controls`
            so screen-reader / keyboard users can toggle the drawer.
          */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={MOBILE_DRAWER_ID}
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/80 bg-warmwhite/70 text-graphite transition-colors duration-500 ease-elegant hover:border-graphite/30"
          >
            <HamburgerGlyph open={open} />
          </button>
        </div>

        {/*
          Mobile drawer. Always rendered (so the open/close transition
          can animate via Framer's `animate` props) but visually
          collapsed when `open` is false. Only renders motion when the
          user hasn't requested reduced motion.
        */}
        <motion.nav
          id={MOBILE_DRAWER_ID}
          aria-label="Mobile navigation"
          aria-hidden={!open}
          initial={false}
          animate={
            reduceMotion
              ? { opacity: open ? 1 : 0 }
              : { opacity: open ? 1 : 0, y: open ? 0 : -6 }
          }
          transition={{ duration: 0.3, ease }}
          className={`md:hidden mt-3 origin-top overflow-hidden rounded-[20px] border border-line/80 bg-warmwhite/95 shadow-[0_22px_46px_-28px_rgba(30,30,30,0.22)] backdrop-blur-xl ${
            open ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <ul className="flex flex-col p-3">
            {links.map((l, i) => {
              // Same route-based active-state as the desktop bar —
              // mobile drawer entries surface a small omega dot when
              // the user is on the matching route.
              const active = isRouteActive(l.href);
              return (
                <Fragment key={l.href}>
                  {i > 0 && " "}
                  <li>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-[12px] px-4 py-3 text-[0.95rem] transition-colors duration-500 ease-elegant ${
                        active
                          ? "bg-warmwhite text-graphite"
                          : "text-graphite/85 hover:bg-warmwhite hover:text-graphite"
                      }`}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_6px_rgba(242,106,27,0.6)]"
                        />
                      )}
                      {active && " "}
                      <span>{l.label}</span>
                    </Link>
                  </li>
                </Fragment>
              );
            })}
            <li className="mt-2 border-t border-line/70 pt-3">
              <Link
                href={AI_SCAN_HREF}
                data-action="START_DIAGNOSIS"
                aria-current={onAIScan ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-2 rounded-full border px-4 py-3 text-[0.88rem] font-medium transition-all duration-500 ease-elegant ${
                  onAIScan
                    ? "border-omega/70 bg-graphite text-warmwhite shadow-[0_0_0_1px_rgba(242,106,27,0.18)]"
                    : "border-graphite/90 bg-graphite text-warmwhite"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {onAIScan && (
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.7)]"
                    />
                  )}
                  {" "}
                  <span>Start OMEGA AI Scan</span>
                </span>
                {" "}
                <ArrowGlyph />
              </Link>
            </li>
          </ul>
        </motion.nav>
      </div>
    </motion.header>
  );
}

function HamburgerGlyph({ open }: { open: boolean }) {
  // Two short stacked lines that morph into an X when open. Animated
  // via SVG transforms for crispness; no rotation jitter.
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
      className="transition-transform duration-300 ease-elegant"
    >
      <line
        x1="2"
        y1={open ? "8" : "5"}
        x2="14"
        y2={open ? "8" : "5"}
        className="transition-all duration-300 ease-elegant"
        style={open ? { transform: "rotate(45deg)", transformOrigin: "8px 8px" } : undefined}
      />
      <line
        x1="2"
        y1={open ? "8" : "11"}
        x2="14"
        y2={open ? "8" : "11"}
        className="transition-all duration-300 ease-elegant"
        style={open ? { transform: "rotate(-45deg)", transformOrigin: "8px 8px" } : undefined}
      />
    </svg>
  );
}

function ArrowGlyph() {
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
