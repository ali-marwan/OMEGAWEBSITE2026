"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type Action = {
  code: string;
  label: string;
  href: string;
  variant: "primary" | "ghost";
};

const actions: Action[] = [
  {
    code: "START_DIAGNOSIS",
    label: "Start Diagnosis",
    href: "/diagnosis",
    variant: "primary",
  },
  {
    code: "OPEN_HUB",
    label: "Open Service Hub",
    href: "/service-hub#top",
    variant: "ghost",
  },
  {
    code: "CONTACT_TEAM",
    label: "Speak to Our Team",
    href: "/#contact",
    variant: "ghost",
  },
];

/**
 * Closing CTA on /service-hub.
 *
 * Three inline action buttons rather than three full cards (the
 * card pattern lives in <ClosingPaths> on the landing page; this
 * variant is the lighter, action-oriented version a hub user lands
 * on after browsing the catalog and the guided path).
 *
 * One primary action (Start Diagnosis) plus two ghost actions
 * (Open Service Hub anchors back to the top of this page; Speak
 * to Our Team scrolls to the landing page's connect anchor).
 */
export function ServiceHubCTA() {
  return (
    <section
      id="cta"
      // Top padding raised to pt-20 / md:pt-24 so the section eyebrow
      // and "Choose the right OMEGA path." headline clear the sticky
      // header (~90 px of chrome at the top of the viewport).
      className="relative overflow-hidden bg-warmwhite pt-20 pb-20 md:pt-24 md:pb-24"
    >
      {/* Soft warm radial — gentle ambient closer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.07) 0%, rgba(242,106,27,0.02) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Eyebrow */}
        <Reveal>
          <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Section 04 — Choose Your Path</span>
          </div>
        </Reveal>

        {/* Headline + supporting paragraph */}
        <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.8rem] leading-[1.06] tracking-tightest text-graphite"
          >
            <span className="block font-semibold">Choose the right</span>
            {" "}
            <span className="mt-1.5 block font-light text-muted">
              OMEGA path.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
          >
            Start with diagnosis, browse services, or speak directly
            with the team.
          </Reveal>
        </div>

        {/* Three actions in a row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4"
        >
          {actions.map((action, i) => (
            <Fragment key={action.code}>
              {i > 0 && " "}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease },
                  },
                }}
              >
                <Link
                  href={action.href}
                  data-action={action.code}
                  className={
                    action.variant === "primary"
                      ? "inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
                      : "inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
                  }
                >
                  <span>{action.label}</span>
                  {" "}
                  <Arrow />
                </Link>
              </motion.div>
            </Fragment>
          ))}
        </motion.div>

        {/* Bottom architectural rule */}
        <div className="mt-16 h-px arch-rule" />
      </div>
    </section>
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
