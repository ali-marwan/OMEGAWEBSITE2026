"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { OmegaMark } from "./OmegaMark";
import { ease } from "@/lib/motion";

/**
 * Header navigation — five entries, the last is a styled action that
 * leads to the Service Hub. Keeping a single accented item gives the
 * header a clear primary call to action without adding visual weight.
 */
const links = [
  { label: "System", href: "#system" },
  { label: "Services", href: "#services" },
  { label: "OMEGA AI", href: "#intelligence" },
  { label: "Studio", href: "#studio" },
];

export function Navigation() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

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
          <a
            href="#top"
            className="flex items-center gap-3 pl-1 pr-3 text-graphite"
          >
            <OmegaMark size={22} className="text-graphite" />
            <span className="text-[0.95rem] tracking-[0.32em] font-medium">
              OMEGA
            </span>
            <span className="hidden md:inline-block h-3 w-px bg-line" />
            <span className="hidden md:inline-block font-mono text-[0.68rem] uppercase tracking-technical text-muted">
              UAE · Engineering-led Property Solutions
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[0.85rem] text-muted hover:text-graphite transition-colors duration-500 ease-elegant"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#hub"
              className="rounded-full border border-graphite/90 bg-graphite px-4 py-2 text-[0.8rem] font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
            >
              OMEGA Service Hub
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
