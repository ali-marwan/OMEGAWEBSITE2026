import Link from "next/link";
import { Fragment } from "react";
import type { Article } from "@/lib/insights";
import { formatArticleDate } from "@/lib/insights";

/**
 * `/insights/[slug]` — Section 01: Article hero.
 *
 * Mirrors the OMEGA hero pattern (breadcrumb, eyebrow, h1, mono
 * descriptor, supporting paragraph, chip strip, top + bottom
 * arch-rule) so the article reads as a peer of the rest of the
 * site, not a generic blog post.
 *
 * Layout (top → bottom):
 *   ──── arch-rule ────
 *   breadcrumb       (Home · Insights · {category})
 *   eyebrow          (●  {category} | {readingTime} min | {publishedAt})
 *   title            (h1 — article.title)
 *   excerpt          (paragraph)
 *   tag chips
 *   ──── arch-rule ────
 *
 * No CTA row in the hero — the article body handles next-step
 * routing via the related-service CTA further down the page.
 */
export function ArticleHero({ article }: { article: Article }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-warmwhite pt-28 pb-8 md:pt-32 md:pb-10"
    >
      {/* Architectural micro-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-70"
      />

      {/* Soft warm radial accent — top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.07) 0%, rgba(242,106,27,0.02) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Breadcrumb row */}
        <nav
          aria-label="Breadcrumb"
          className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
        >
          <Link
            href="/"
            className="text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
          >
            Home
          </Link>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <Link
            href="/insights"
            className="text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
          >
            Insights
          </Link>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-omega">{article.category}</span>
        </nav>

        {/* Eyebrow row — category + reading time + published date */}
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
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

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl font-sans font-bold text-[2rem] md:text-[2.6rem] lg:text-[3.1rem] leading-[1.06] tracking-tightest text-graphite">
          {article.title}
        </h1>

        {/* Author byline — mono caps */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          By {article.author}
        </p>

        {/* Excerpt */}
        <p className="mt-6 max-w-3xl text-base md:text-lg leading-[1.7] text-muted">
          {article.excerpt}
        </p>

        {/* Tag chips */}
        {article.tags.length > 0 && (
          <div className="mt-7">
            <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
              Tags
            </div>
            {" "}
            <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
              {article.tags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && " "}
                  <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/70 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/80">
                    <span
                      aria-hidden
                      className="inline-block h-1 w-1 rounded-full bg-omega"
                    />
                    {" "}
                    <span className="normal-case tracking-[0.02em]">
                      {tag}
                    </span>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom architectural rule */}
        <div className="mt-8 h-px arch-rule" />
      </div>
    </section>
  );
}
