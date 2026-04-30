"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { ease, heroTimeline } from "@/lib/motion";

/**
 * Variant of the FloatingDock used on `/diagnosis`.
 *
 * The standard dock surfaces (Hub, Diagnose, Contact). On the
 * diagnosis page itself, "Diagnose" would be circular — the user is
 * already there. This variant swaps in (Service Hub, Speak to Team,
 * Home) so the dock points to where the user can usefully *go next*
 * without re-entering the same flow.
 *
 * Visual / a11y treatment matches the standard dock exactly:
 *   - mobile label (≤ sm) shown alongside the icon, full label shown
 *     from `sm` and up
 *   - real `<nav aria-label="Quick actions">` wrapper
 *   - `aria-label` on every anchor so the icon-only mobile button is
 *     announced correctly to screen readers
 *   - same fade-in timeline as the rest of the page
 */
const items = [
  {
    aria: "Open OMEGA Service Hub",
    desktopLabel: "Open OMEGA Service Hub",
    mobileLabel: "Hub",
    href: "/service-hub",
    icon: HubIcon,
  },
  {
    aria: "Speak to Our Team",
    desktopLabel: "Speak to Our Team",
    mobileLabel: "Contact",
    href: "/contact",
    icon: TalkIcon,
  },
  {
    aria: "Return Home",
    desktopLabel: "Home",
    mobileLabel: "Home",
    href: "/",
    icon: HomeIcon,
  },
];

export function DiagnosisFloatingDock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, delay: heroTimeline.dockFollows, ease }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <nav
        aria-label="Quick actions"
        className="flex items-center gap-1.5 sm:gap-3 rounded-full border border-line/30 bg-warmwhite/45 px-1.5 py-1 shadow-dock backdrop-blur-3xl backdrop-saturate-150 transition-all duration-500 ease-elegant hover:-translate-y-0.5"
      >
        {items.map((item, i) => (
          <Fragment key={item.aria}>
            {i > 0 && " "}
            <a
              href={item.href}
              aria-label={item.aria}
              className="group relative flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.78rem] font-medium text-graphite/85 transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-warmwhite/70 hover:text-graphite sm:gap-2.5 sm:px-3.5"
            >
              <item.icon className="text-graphite/55 group-hover:text-graphite" />
              <span className="inline sm:hidden">{item.mobileLabel}</span>
              <span className="hidden sm:inline-block">{item.desktopLabel}</span>
            </a>
          </Fragment>
        ))}
      </nav>
    </motion.div>
  );
}

function HubIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="4" height="4" />
      <rect x="8" y="2" width="4" height="4" />
      <rect x="2" y="8" width="4" height="4" />
      <rect x="8" y="8" width="4" height="4" />
    </svg>
  );
}

function TalkIcon({ className = "" }: { className?: string }) {
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
      className={className}
      aria-hidden
    >
      <path d="M2 4.5C2 3.7 2.7 3 3.5 3h7C11.3 3 12 3.7 12 4.5V8c0 .8-.7 1.5-1.5 1.5H6L3 12V9.5h-.5C2.7 9.5 2 8.8 2 8V4.5Z" />
    </svg>
  );
}

function HomeIcon({ className = "" }: { className?: string }) {
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
      className={className}
      aria-hidden
    >
      <path d="M2 6l5-4 5 4v6H8V8H6v4H2V6Z" />
    </svg>
  );
}
