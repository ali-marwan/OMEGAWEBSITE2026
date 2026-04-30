"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { ease, viewportOnce } from "@/lib/motion";
import {
  services,
  type ServiceFilter,
} from "@/lib/services";
import {
  ServiceHubCard,
  type ServiceCardState,
} from "./ServiceHubCard";

type Props = {
  filter: ServiceFilter;
};

/**
 * Premium service-card grid.
 *
 * The grid always renders all five services regardless of the active
 * filter. When a category is selected:
 *   - matching cards stay at full opacity and gain a subtle stronger
 *     border + soft omega ring
 *   - non-matching cards drop to ~30 % opacity but stay visible and
 *     clickable (`hover:opacity-55`)
 *
 * That converts the filter from "show / hide" into "highlight on a
 * system map" — never an empty viewport, never a single-card
 * left-aligned view.
 *
 * Layout (12-col grid):
 *   - mobile (<md): every card spans all 12 cols (stacked)
 *   - tablet (md):  pairs of col-span-6; the 5th card is centered
 *                   alone via `md:col-start-4`
 *   - desktop (lg): row 1 = cards 0,1,2 at col-span-4 each; row 2 =
 *                   cards 3,4 at col-span-4 with `lg:col-start-3` /
 *                   `lg:col-start-7` so the second row is centered
 *                   under the first instead of left-anchored
 */
export function ServiceHubGrid({ filter }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.85, ease }}
      className="grid grid-cols-12 gap-6 md:gap-7"
    >
      {services.map((service, i) => {
        // Resolve display state from the active filter
        let state: ServiceCardState = "normal";
        if (filter !== "All") {
          state = service.category === filter ? "featured" : "dimmed";
        }

        // Row positioning. Defaults: full-width on mobile, half-width on
        // tablet, third-width on desktop. Cards 3 (index 3) and 4
        // (index 4) need explicit col-starts so the 3+2 layout reads
        // as a centered second row rather than a left-anchored stub.
        let positionClass = "col-span-12 md:col-span-6 lg:col-span-4";
        if (i === 3) {
          // Second row, left card on lg — starts at col 3 (cols 3-6)
          positionClass += " lg:col-start-3";
        } else if (i === 4) {
          // 5th card alone on tablet (centered) and second row right
          // on desktop (cols 7-10)
          positionClass += " md:col-start-4 lg:col-start-7";
        }

        return (
          <Fragment key={service.id}>
            {i > 0 && " "}
            <ServiceHubCard
              service={service}
              state={state}
              className={positionClass}
            />
          </Fragment>
        );
      })}
    </motion.div>
  );
}
