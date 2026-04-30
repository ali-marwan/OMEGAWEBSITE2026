"use client";

import { Fragment } from "react";
import { ServiceHubCard } from "./ServiceHubCard";
import { filterServices, type ServiceFilter } from "@/lib/services";

type Props = {
  filter: ServiceFilter;
};

/**
 * Premium service-card grid.
 *
 * Pulls the (already-sorted-by-priority) service list from
 * `lib/services.ts` and filters it by the active category.
 * Responsive layout:
 *
 *   ≥ lg:  3 columns
 *   md:    2 columns
 *   < md:  1 column (stacked)
 *
 * The cards align their CTAs to the bottom via flex-col +
 * flex-1 spacer in `<ServiceHubCard>`, so each row's cards stay
 * the same height regardless of description length.
 */
export function ServiceHubGrid({ filter }: Props) {
  const list = filterServices(filter);

  if (list.length === 0) {
    return (
      <div className="rounded-[20px] border border-line/85 bg-warmwhite/60 px-6 py-10 text-center text-muted">
        No services in this category yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
      {list.map((service, i) => (
        <Fragment key={service.id}>
          {i > 0 && " "}
          <ServiceHubCard service={service} index={i} />
        </Fragment>
      ))}
    </div>
  );
}
