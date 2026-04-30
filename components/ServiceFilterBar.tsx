"use client";

import { Fragment } from "react";
import { serviceFilters, type ServiceFilter } from "@/lib/services";

type Props = {
  value: ServiceFilter;
  onChange: (filter: ServiceFilter) => void;
};

/**
 * Premium filter bar.
 *
 * Pure presentation — receives `value` and `onChange` from its
 * parent (ServiceCatalog) so the filter state can be lifted to a
 * single source of truth and later swapped for URL-driven state
 * without re-touching this component.
 *
 * Active style is a solid graphite pill; inactive is a thin-line
 * pill that brightens on hover. Each pill is a real `<button>` so
 * it's keyboard-focusable and screen-reader-friendly.
 */
export function ServiceFilterBar({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter services"
      className="flex flex-wrap items-center gap-2"
    >
      {serviceFilters.map((filter, i) => {
        const active = filter === value;
        return (
          <Fragment key={filter}>
            {i > 0 && " "}
            <button
              type="button"
              onClick={() => onChange(filter)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.78rem] font-medium transition-all duration-500 ease-elegant hover:-translate-y-px ${
                active
                  ? "border-graphite/90 bg-graphite text-warmwhite shadow-[0_1px_0_rgba(30,30,30,0.04),0_14px_28px_-22px_rgba(30,30,30,0.32)]"
                  : "border-line/80 bg-warmwhite/70 text-graphite/80 hover:border-graphite/30 hover:text-graphite"
              }`}
            >
              {active && (
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
                />
              )}
              {active && " "}
              <span>{filter}</span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
