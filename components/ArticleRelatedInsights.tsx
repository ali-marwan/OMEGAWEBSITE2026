import { Fragment } from "react";
import type { Article } from "@/lib/insights";
import { InsightsCard } from "./InsightsCard";

/**
 * `/insights/[slug]` — Section 04: Related insights.
 *
 * Up to N related articles, surfaced as standard `<InsightsCard>`
 * tiles in a 1 / 2 / 3 column responsive grid. Same chrome as the
 * listing page so visitors recognise the navigation pattern.
 *
 * Renders `null` when no related articles are available — the
 * detail page collapses gracefully without an empty rail.
 */
export function ArticleRelatedInsights({
  articles,
}: {
  articles: readonly Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <section
      id="related-insights"
      className="relative bg-warmwhite pt-10 pb-12 md:pt-14 md:pb-14"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Section eyebrow */}
        <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Related Insights</span>
        </div>

        {/* Heading + supporting paragraph */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            More from OMEGA Insights.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            Curated reads in adjacent categories — same UAE property
            context, different angle.
          </p>
        </div>

        {/* Grid */}
        <ul className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {articles.map((article, i) => (
            <Fragment key={article.id}>
              {i > 0 && " "}
              <li>
                <InsightsCard article={article} />
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
