"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { ServiceFilterBar } from "./ServiceFilterBar";
import { ServiceHubGrid } from "./ServiceHubGrid";
import { filterServices, type ServiceFilter } from "@/lib/services";

/**
 * Service catalog — the interactive shell that wraps the filter bar
 * and the card grid into a single client island.
 *
 * Owns the active filter state in `useState`. Today the state lives
 * only in memory; later it can be promoted to a URL search param
 * (`?category=property-care`) without touching the filter bar or
 * the grid components — both are stateless and just receive
 * `value` / `filter` props.
 */
export function ServiceCatalog() {
  const [filter, setFilter] = useState<ServiceFilter>("All");
  const visibleCount = filterServices(filter).length;

  return (
    <section
      id="catalog"
      className="relative mx-auto max-w-page px-6 lg:px-10 pt-20 md:pt-28"
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
            {visibleCount} {visibleCount === 1 ? "Module" : "Modules"} ·{" "}
            {filter === "All" ? "All Categories" : filter}
          </span>
        </div>
      </Reveal>

      {/* Title row */}
      <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-6">
        <Reveal
          as="h2"
          delay={0.1}
          className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite"
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
          Filter by category to narrow the system map. Every module
          connects to OMEGA AI Diagnostics, direct service requests,
          or a conversation with the team.
        </Reveal>
      </div>

      {/* Filter bar */}
      <Reveal delay={0.2} className="mt-10">
        <ServiceFilterBar value={filter} onChange={setFilter} />
      </Reveal>

      {/* Card grid */}
      <div className="mt-10">
        <ServiceHubGrid filter={filter} />
      </div>
    </section>
  );
}
