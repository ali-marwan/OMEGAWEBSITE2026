"use client";

import { Fragment, useMemo, useState } from "react";
import {
  insightsFilters,
  type Article,
  type InsightsFilter,
} from "@/lib/insights";
import { InsightsCard } from "./InsightsCard";

/**
 * `/insights` — Section 03: Filter rail + article grid.
 *
 * Client component because the filter is interactive. Articles are
 * passed in from the server-rendered listing page (no duplicate
 * data hydration).
 *
 * Filter behaviour (per the brief):
 *   - All articles are ALWAYS rendered. Selecting a category does
 *     NOT remove non-matching cards — they dim instead. This avoids
 *     blank-layout flashes when a category is small, and lets
 *     visitors keep peripheral vision on the rest of the catalogue.
 *   - Dimmed cards stay clickable. The dim treatment is purely
 *     visual — `pointer-events-auto` keeps tap targets live.
 *   - A small mono counter above the grid surfaces the active
 *     filter + how many cards match, so the user knows the dim
 *     pattern is intentional.
 *
 * Filter rail UI:
 *   - Mobile: horizontal-scrolling chip strip with `snap-x` so
 *     filters feel native at 360 px. Re-uses the global
 *     `.action-tab-scroller` utility for scrollbar hiding.
 *   - Desktop: wrapping flex row with the same chip styling.
 */
export function InsightsExperience({
  articles,
}: {
  articles: readonly Article[];
}) {
  const [filter, setFilter] = useState<InsightsFilter>("All");

  const isMatch = useMemo(() => {
    return (article: Article) =>
      filter === "All" || article.category === filter;
  }, [filter]);

  const matchedCount = useMemo(
    () => articles.filter(isMatch).length,
    [articles, isMatch]
  );

  return (
    <section
      id="insights-grid"
      className="relative bg-warmwhite pt-8 pb-12 md:pt-12 md:pb-16"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Browse by category</span>
        </div>

        {/* Filter rail */}
        <nav aria-label="Insights categories" className="mt-6">
          <ul className="action-tab-scroller -mx-6 lg:-mx-10 flex items-stretch gap-2 overflow-x-auto px-6 lg:px-10 snap-x snap-mandatory md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:snap-none md:gap-3">
            {insightsFilters.map((opt, i) => {
              const active = filter === opt;
              return (
                <Fragment key={opt}>
                  {i > 0 && " "}
                  <li>
                    <button
                      type="button"
                      onClick={() => setFilter(opt)}
                      aria-pressed={active}
                      className={`flex-shrink-0 snap-start md:flex-shrink inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all duration-500 ease-elegant ${
                        active
                          ? "border-graphite/85 bg-graphite text-warmwhite shadow-[0_1px_0_rgba(30,30,30,0.05),0_18px_36px_-22px_rgba(30,30,30,0.35)]"
                          : "border-line/80 bg-warmwhite/80 text-graphite/80 hover:-translate-y-px hover:border-graphite/40 hover:text-graphite"
                      }`}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_6px_rgba(242,106,27,0.6)]"
                        />
                      )}
                      {" "}
                      <span className="normal-case tracking-[0.04em]">
                        {opt}
                      </span>
                    </button>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </nav>

        {/* Filter status row — mono caps, quietly informs the visitor
            how many cards match. Only visible when a category filter
            is active (i.e. not "All"); kept off when showing the
            full catalogue so the row doesn't add noise by default. */}
        <div
          aria-live="polite"
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted"
        >
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-omega"
          />
          {" "}
          {filter === "All" ? (
            <span>{articles.length} insights · all categories</span>
          ) : (
            <>
              <span>
                {matchedCount} of {articles.length} insights · {filter}
              </span>
              {" "}
              <span aria-hidden className="h-2 w-px bg-line" />
              {" "}
              <button
                type="button"
                onClick={() => setFilter("All")}
                className="text-graphite/80 underline decoration-omega/40 underline-offset-4 transition-colors duration-500 ease-elegant hover:text-omega hover:decoration-omega"
              >
                Clear filter
              </button>
            </>
          )}
        </div>

        {/* Article grid — every article is rendered every render.
            Non-matching cards get a `dimmed` wrapper class that drops
            opacity + saturation; matching cards render at full
            strength. Dimmed cards remain clickable so visitors can
            still navigate to them — the dim is a visual hint, not a
            disable. */}
        <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {articles.map((article, i) => {
            const matched = isMatch(article);
            return (
              <Fragment key={article.id}>
                {i > 0 && " "}
                <li
                  className={`transition-all duration-500 ease-elegant ${
                    matched
                      ? "opacity-100"
                      : "opacity-35 grayscale-[35%] hover:opacity-70"
                  }`}
                  aria-hidden={!matched || undefined}
                >
                  <InsightsCard article={article} />
                </li>
              </Fragment>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
