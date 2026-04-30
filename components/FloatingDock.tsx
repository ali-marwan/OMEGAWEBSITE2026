"use client";

import { motion } from "framer-motion";
import { ease, heroTimeline } from "@/lib/motion";

const items = [
  {
    label: "Open OMEGA Service Hub",
    href: "#hub",
    primary: true,
    icon: HubIcon,
  },
  {
    label: "Start Diagnosis",
    href: "#intelligence",
    icon: DiagIcon,
  },
  {
    label: "Speak to Our Team",
    href: "#contact",
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
      <div className="flex items-center gap-1 rounded-full border border-line/45 bg-warmwhite/55 p-1 shadow-dock backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-elegant hover:-translate-y-0.5">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.78rem] font-medium transition-all duration-500 ease-elegant ${
              item.primary
                ? "bg-graphite text-warmwhite hover:bg-graphite/90 hover:-translate-y-px"
                : "text-graphite hover:bg-sand/70 hover:-translate-y-px"
            }`}
          >
            <item.icon
              className={
                item.primary ? "text-omega" : "text-graphite/70 group-hover:text-graphite"
              }
            />
            <span className="hidden sm:inline-block">{item.label}</span>
          </a>
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
