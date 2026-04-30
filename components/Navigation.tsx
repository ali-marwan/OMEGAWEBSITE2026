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
 */
const links = [
  { label: "System", href: "/#system" },
  { label: "Services", href: "/#services" },
  { label: "OMEGA AI", href: "/#ai" },
  { label: "Studio", href: "/#studio" },
];

const SERVICE_HUB_HREF = "/service-hub";

export function Navigation() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onServiceHub =
    pathname === SERVICE_HUB_HREF ||
    pathname?.startsWith(`${SERVICE_HUB_HREF}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll(); // initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <span
              aria-hidden
              className="hidden md:inline-block h-3 w-px bg-line"
            />
            {" "}
            <span className="hidden md:inline-block font-mono text-[0.68rem] uppercase tracking-technical text-muted">
              UAE · Engineering-led Property Solutions
            </span>
          </Link>
          {/* Whitespace separator so brand strapline doesn't join the
              first nav link in DOM textContent. */}
          {" "}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l, i) => (
              <Fragment key={l.href}>
                {i > 0 && " "}
                <Link
                  href={l.href}
                  className="text-[0.85rem] text-muted hover:text-graphite transition-colors duration-500 ease-elegant"
                >
                  {l.label}
                </Link>
              </Fragment>
            ))}
            {" "}
            {/* OMEGA Service Hub CTA. When the user is already on
                /service-hub the button surfaces an active-state
                indicator (a small omega-orange dot with a soft glow)
                inside the pill, so the navigation tells the visitor
                where they are without hiding the link entirely. */}
            <Link
              href={SERVICE_HUB_HREF}
              aria-current={onServiceHub ? "page" : undefined}
              className={`group/cta inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-all duration-500 ease-elegant hover:-translate-y-px ${
                onServiceHub
                  ? "border-omega/70 bg-graphite text-warmwhite shadow-[0_0_0_1px_rgba(242,106,27,0.18)]"
                  : "border-graphite/90 bg-graphite text-warmwhite hover:bg-graphite/90"
              }`}
            >
              {onServiceHub && (
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.7)]"
                />
              )}
              {onServiceHub && " "}
              <span>OMEGA Service Hub</span>
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
