import Link from "next/link";
import { Fragment } from "react";
import type { Article } from "@/lib/insights";
import { formatArticleDate } from "@/lib/insights";

/**
 * `/insights` — Section 02: Featured article.
 *
 * Single full-row card surfaced above the filter rail + grid. Larger
 * type, more breathing room, matching the flagship-card pattern used
 * on Studio's Service System block. The whole card is a single
 * `<Link>` so the click target is generous.
 *
 * Renders `null` if no featured article exists — the listing page
 * gracefully drops the section without an empty hero.
 */
export function InsightsFeaturedArticle({
  article,
}: {
  article: Article | undefined;
}) {
  if (!article) return null;

  return (
    <section
      id="featured"
      className="relative bg-warmwhite pt-8 pb-9 md:pt-12 md:pb-12"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Featured</span>
        </div>

        {/*
          Featured-article card. Per the brief, kept "elegant and not
          oversized" — restrained title sizing, tighter padding, and
          the visual side condensed to a single restrained orbit
          panel rather than the larger flagship treatment used on
          /studio's service system.
        */}
        <Link
          href={`/insights/${article.slug}`}
          aria-label={`Read featured insight: ${article.title}`}
          className="module-card group mt-6 block rounded-[20px] border border-line/80 bg-warmwhite/90 p-6 md:p-7 transition-all duration-500 ease-elegant hover:-translate-y-0.5"
        >
          <div className="grid grid-cols-12 gap-x-6 gap-y-5 items-center">
            {/* Left — copy */}
            <div className="col-span-12 lg:col-span-8">
              {/* Category + meta strip */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                />
                {" "}
                <span>{article.category}</span>
                {" "}
                <span aria-hidden className="h-3 w-px bg-line" />
                {" "}
                <span>{article.readingTime} min read</span>
                {" "}
                <span aria-hidden className="h-3 w-px bg-line" />
                {" "}
                <span>{formatArticleDate(article.publishedAt)}</span>
              </div>

              {/* Title — restrained sizing relative to a hero h1, so
                  the featured card reads as a quiet flagship rather
                  than a competing headline. */}
              <h2 className="mt-4 text-[1.4rem] md:text-[1.7rem] lg:text-[1.95rem] leading-[1.12] tracking-tightest font-semibold text-graphite">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-3 max-w-2xl text-[0.95rem] md:text-[1rem] leading-[1.7] text-muted">
                {article.excerpt}
              </p>

              {/* Tag chips — limited to 3 here (was 4) so the card
                  stays compact even on dense titles. */}
              {article.tags.length > 0 && (
                <ul className="mt-5 flex flex-wrap items-center gap-2">
                  {article.tags.slice(0, 3).map((t, i) => (
                    <Fragment key={t}>
                      {i > 0 && " "}
                      <li className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-warmwhite/80 px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-graphite/80">
                        <span
                          aria-hidden
                          className="inline-block h-1 w-1 rounded-full bg-omega"
                        />
                        {" "}
                        <span className="normal-case tracking-[0.02em]">
                          {t}
                        </span>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              )}

              {/* Read Insight visual + path hint, inline on lg+ so the
                  featured card stays a single restrained block. */}
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-graphite px-5 py-2.5 text-[0.85rem] font-medium text-warmwhite transition-all duration-500 ease-elegant group-hover:-translate-y-px group-hover:bg-graphite/90">
                  <span>Read Insight</span>
                  {" "}
                  <Arrow />
                </span>
                {" "}
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                  Path · {article.relatedCTA}
                </span>
              </div>
            </div>

            {/* Right — single restrained orbit panel. Compact on lg
                so the card height matches the copy column rather
                than stretching the panel. Hidden on mobile (the copy
                is enough; the orbit visual is decorative). */}
            <div
              aria-hidden
              className="hidden lg:block col-span-12 lg:col-span-4"
            >
              <div className="relative aspect-square w-full max-w-[200px] ml-auto overflow-hidden rounded-[16px] border border-line/70 bg-warmwhite/70">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(242,106,27,0.10) 0%, rgba(242,106,27,0.03) 24%, rgba(232,222,208,0.20) 52%, rgba(232,222,208,0) 78%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-3/4 w-3/4">
                    <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/40" />
                    <div className="absolute left-1/2 top-1/2 h-4/5 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/25" />
                    <div className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-omega/35" />
                    <div className="absolute left-1/2 top-1/2 h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
                    <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-omega/65 shadow-[0_0_10px_rgba(242,106,27,0.55)]" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                  Featured
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h8m0 0L7 3m4 4-4 4" />
    </svg>
  );
}
