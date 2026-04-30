"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { ease, heroTimeline } from "@/lib/motion";

const items = [
  {
    label: "Open OMEGA Service Hub",
    href: "#hub",
    icon: HubIcon,
  },
  {
    label: "Start Diagnosis",
    href: "#ai",
    icon: DiagIcon,
  },
  {
    label: "Speak to Our Team",
    href: "#contact",
    icon: TalkIcon,
  },
];

/**
 * Floating dock — pinned bottom-center action rail.
 *
 * Reduced visual weight: tighter padding, stronger glass/blur,
 * softer border, unified ghost buttons. All three actions are styled
 * identically; the only hover affordance is a small lift + a faint
 * sand wash. This keeps the dock present without competing with the
 * page's primary content.
 */
export function FloatingDock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, delay: heroTimeline.dockFollows, ease }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      {/* Each anchor is wrapped in a Fragment that prepends a literal
          " " text node to every button after the first. The visual
          spacing is still produced by `flex` + `gap-1`, but the extra
          whitespace text node guarantees the rendered DOM textContent
          places real space characters between the three button labels. */}
      <div className="flex items-center gap-3 rounded-full border border-line/30 bg-warmwhite/45 px-1.5 py-1 shadow-dock backdrop-blur-3xl backdrop-saturate-150 transition-all duration-500 ease-elegant hover:-translate-y-0.5">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && " "}
            <a
              href={item.href}
              className="group relative flex items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium text-graphite/85 transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-warmwhite/70 hover:text-graphite"
            >
              <item.icon className="text-graphite/55 group-hover:text-graphite" />
              <span className="hidden sm:inline-block">{item.label}</span>
            </a>
          </Fragment>
        ))}
      </div>
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
