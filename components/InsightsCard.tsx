import Link from "next/link";
import type { Article } from "@/lib/insights";
import { formatArticleDate } from "@/lib/insights";

/**
 * Single Insights article card.
 *
 * Premium editorial card without imagery — typography + abstract
 * technical line placeholder per the brief. The whole card is a
 * single `<Link>` so the click target covers the full surface; the
 * "Read Insight" affordance is visual-only, not a separate
 * clickable.
 *
 * Layout:
 *   - Top:    decorative line placeholder (architectural orbit lines)
 *   - Body:   category chip · title · excerpt · related-service tag
 *   - Footer: reading time · "Read Insight" affordance
 */
export function InsightsCard({
  article,
  variant = "standard",
}: {
  article: Article;
  /** "featured" gets larger padding + a thicker top placeholder. */
  variant?: "standard" | "featured";
}) {
  const isFeatured = variant === "featured";
  return (
    <Link
      href={`/insights/${article.slug}`}
      aria-label={`Read insight: ${article.title}`}
      className={`module-card module-card--quiet group flex h-full flex-col rounded-[20px] border border-line/80 bg-warmwhite/85 transition-all duration-500 ease-elegant hover:-translate-y-0.5 ${
        isFeatured ? "p-7 md:p-9" : "p-6 md:p-7"
      }`}
    >
      {/* Abstract technical line placeholder — sits where a thumbnail
          would otherwise live. Concentric architectural rings + a
          single warm radial halo, all CSS so the card stays light. */}
      <div
        aria-hidden
        className={`relative w-full overflow-hidden rounded-[14px] border border-line/70 bg-warmwhite/70 ${
          isFeatured ? "h-32 md:h-44" : "h-24 md:h-28"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, rgba(242,106,27,0.08) 0%, rgba(242,106,27,0.02) 28%, rgba(232,222,208,0.18) 55%, rgba(232,222,208,0) 78%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-3/5 w-3/5">
            <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/45" />
            <div className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
            <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-omega/35" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-omega/60 shadow-[0_0_8px_rgba(242,106,27,0.45)]" />
          </div>
        </div>
        {/* Mono index strip */}
        <div className="absolute top-3 left-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          INSIGHT
        </div>
      </div>

      {/* Body */}
      <div className="mt-5 flex flex-1 flex-col">
        {/* Category chip */}
        <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>{article.category}</span>
        </div>

        {/* Title */}
        <h3
          className={`mt-3 font-semibold leading-[1.2] tracking-tightest text-graphite ${
            isFeatured
              ? "text-[1.4rem] md:text-[1.6rem]"
              : "text-[1.05rem] md:text-[1.15rem]"
          }`}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          className={`mt-3 leading-[1.65] text-muted ${
            isFeatured ? "text-[0.98rem]" : "text-[0.92rem]"
          }`}
        >
          {article.excerpt}
        </p>

        {/* Footer — reading time + related service tag + Read Insight */}
        <div className="mt-6 flex flex-1 flex-col justify-end gap-4">
          {/* Mono meta strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
            <span>{article.readingTime} min read</span>
            {" "}
            <span aria-hidden className="h-2 w-px bg-line" />
            {" "}
            <span>{formatArticleDate(article.publishedAt)}</span>
            {article.relatedCTA && (
              <>
                {" "}
                <span aria-hidden className="h-2 w-px bg-line" />
                {" "}
                <span>Path · {article.relatedCTA}</span>
              </>
            )}
          </div>

          {/* Read Insight — visual affordance only; the whole card is
              the clickable. */}
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-graphite/15 bg-warmwhite/70 px-4 py-2 text-[0.82rem] font-medium text-graphite transition-all duration-500 ease-elegant group-hover:-translate-y-px group-hover:border-graphite/40">
            <span>Read Insight</span>
            {" "}
            <Arrow />
          </span>
        </div>
      </div>
    </Link>
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
