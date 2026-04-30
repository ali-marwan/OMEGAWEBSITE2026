"use client";

import { Fragment } from "react";
import { OmegaMark } from "./OmegaMark";

export function Footer() {
  return (
    <footer className="relative bg-warmwhite border-t border-line/80">
      <div className="mx-auto max-w-page px-6 lg:px-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3 text-graphite">
              <OmegaMark size={28} />
              <span className="text-[1rem] tracking-[0.3em] font-medium">
                OMEGA
              </span>
            </div>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Engineering-led property solutions across the UAE — care,
              repair, assessment, renovation and engineering, operating
              as one system.
            </p>
          </div>

          <FooterCol
            label="System"
            items={[
              "OMEGA Property Care",
              "OMEGA Home Services",
              "OMEGA Property Health Report",
              "OMEGA Renovation",
              "OMEGA Engineering Solutions",
            ]}
            className="col-span-6 md:col-span-3"
          />
          <FooterCol
            label="Studio"
            items={["About OMEGA", "Engineering Practice", "Press", "Careers"]}
            className="col-span-6 md:col-span-2"
          />
          <FooterCol
            label="Connect"
            items={["Speak to Our Team", "OMEGA Service Hub", "WhatsApp", "Email"]}
            className="col-span-12 md:col-span-2"
          />
        </div>

        {/* Copyright — two stacked paragraphs on every breakpoint.
            Using `<p>` per the spec gives each line its own
            block-level container; the literal `{"\n"}` text node
            between them guarantees the DOM textContent contains a
            real newline character (not a space) between the two
            sentences, so a flat-text search will not see them as
            one continuous run-on string. */}
        <div className="mt-16 flex flex-col items-start gap-2 border-t border-line/80 pt-6 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <p>© 2026 OMEGA · UAE</p>
          {"\n"}
          <p>One System for Property Care · Elevated by Engineering</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  label,
  items,
  className = "",
}: {
  label: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-mono text-[0.68rem] uppercase tracking-technical text-muted">
        {label}
      </div>
      {/* Each list item is wrapped in a Fragment that prepends a
          literal " " text node to every entry after the first, so the
          rendered textContent reads as separate words rather than
          joining (e.g. "OMEGA Home ServicesOMEGA Property Health
          Report"). The visual layout stays identical because flex /
          space-y-3 still provides the on-screen spacing. */}
      <ul className="mt-5 space-y-3">
        {items.map((it, i) => (
          <Fragment key={it}>
            {i > 0 && " "}
            <li>
              <a
                href="#"
                className="text-[0.92rem] text-graphite/85 hover:text-omega transition-colors duration-500 ease-elegant"
              >
                {it}
              </a>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
