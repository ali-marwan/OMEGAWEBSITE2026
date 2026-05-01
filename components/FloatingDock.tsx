"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { ease, heroTimeline } from "@/lib/motion";

/**
 * Floating dock — pinned bottom-center action rail.
 *
 * Each item carries:
 *   - `href`: cross-page-safe URL (leading "/" so navigation works
 *     from /, /service-hub, and /service-hub/[slug] alike)
 *   - `mobileLabel`: short label shown on the smallest viewports
 *     (≤ sm) so the dock stays compact next to its icon
 *   - `desktopLabel`: full label shown from `sm` and up
 *   - `aria`: accessible label always exposed to screen readers,
 *     regardless of which (or no) visible label is shown — this is
 *     what the icon-only mobile button is announced as
 *
 * Reduced visual weight: tighter padding, stronger glass/blur,
 * softer border, unified ghost buttons. All three actions are styled
 * identically; the only hover affordance is a small lift + a faint
 * sand wash.
 */
const items = [
  {
    aria: "Start OMEGA AI Property Scan",
    desktopLabel: "Start OMEGA AI Scan",
    mobileLabel: "Scan",
    href: "/diagnosis",
    icon: DiagIcon,
  },
  {
    aria: "Explore OMEGA Services",
    desktopLabel: "Explore Services",
    mobileLabel: "Hub",
    href: "/service-hub",
    icon: HubIcon,
  },
  {
    aria: "Request OMEGA Inspection",
    desktopLabel: "Request Inspection",
    mobileLabel: "Inspect",
    href: "/contact",
    icon: TalkIcon,
  },
];

export function FloatingDock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, delay: heroTimeline.dockFollows, ease }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      {/*
        Each anchor is wrapped in a Fragment that prepends a literal
        " " text node to every button after the first. Visual spacing
        is still produced by `flex` + `gap-3`; the extra whitespace
        text node guarantees real space characters between the three
        button labels in the rendered DOM textContent.
      */}
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
              {/*
                Two label variants:
                  - mobile (≤ sm): short label (Hub / Diagnose / Contact)
                  - sm and up   : full label
                Always rendering at least the short label keeps the dock
                self-explanatory on touch devices without a tooltip.
              */}
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

function DiagIcon({ className = "" }: { className?: string }) {
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
      <circle cx="7" cy="7" r="5" />
      <path d="M7 4v3l2 1" />
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
