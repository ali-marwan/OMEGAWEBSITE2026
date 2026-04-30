"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { ServiceFilterBar } from "./ServiceFilterBar";
import { ServiceHubGrid } from "./ServiceHubGrid";
import { services, type ServiceFilter } from "@/lib/services";

/**
 * Service catalog — the interactive shell that wraps the filter bar
 * and the card grid into a single client island.
 *
 * Owns the active filter state in `useState`. Today the state lives
 * only in memory; later it can be promoted to a URL search param
 * (`?category=property-care`) without touching the filter bar or
 * the grid components — both are stateless and just receive
 * `value` / `filter` props.
 *
 * The grid always renders all five services regardless of the
 * filter — non-matching cards are dimmed in place rather than
 * hidden, so the filter behaves as a "highlight on a system map"
 * and the viewport never collapses to a single isolated card.
 */
export function ServiceCatalog() {
  const [filter, setFilter] = useState<ServiceFilter>("All");

  return (
    <section
      id="catalog"
      // Top padding: pt-20 / md:pt-24 (80–96 px). The fixed nav pill
      // is ~90 px of visual presence at the top of the viewport (see
      // [id] { scroll-margin-top: 120px } in globals.css), so the
      // eyebrow row, filter bar, and card grid all need to start
      // visibly below that chrome. Anything tighter (pt-12/16) made
      // the eyebrow look like it was sitting under the header during
      // continuous scroll.
      className="relative mx-auto max-w-page px-6 lg:px-10 pt-20 pb-16 md:pt-24 md:pb-20"
    >
      {/* Section eyebrow */}
      <Reveal>
        <div className="flex items-center justify-between gap-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Section 02 — Service Catalog</span>
          </div>
          {" "}
          <span className="hidden md:inline">
            {services.length} Modules ·{" "}
            {filter === "All" ? "All Categories" : `${filter} Active`}
          </span>
        </div>
      </Reveal>

      {/* Title row */}
      <div className="mt-7 grid grid-cols-12 items-end gap-x-6 gap-y-6">
        <Reveal
          as="h2"
          delay={0.1}
          className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] leading-[1.06] tracking-tightest text-graphite"
        >
          <span className="block font-semibold">Browse the system.</span>
          {" "}
          <span className="mt-1.5 block font-light text-muted">
            Pick the path that fits.
          </span>
        </Reveal>
        <Reveal
          as="p"
          delay={0.15}
          className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]"
        >
          Highlight a category on the system map. Every module
          connects to OMEGA AI Diagnostics, direct service requests,
          or a conversation with the team.
        </Reveal>
      </div>

      {/* Filter bar */}
      <Reveal delay={0.2} className="mt-8">
        <ServiceFilterBar value={filter} onChange={setFilter} />
      </Reveal>

      {/* Card grid */}
      <div className="mt-8 md:mt-10">
        <ServiceHubGrid filter={filter} />
      </div>
    </section>
  );
}
