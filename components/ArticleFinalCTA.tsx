import Link from "next/link";
import type { Article } from "@/lib/insights";

/**
 * `/insights/[slug]` — Section 03: Related-service CTA + Section 05:
 * Final CTA.
 *
 * Combines the article's contextual related-service link with the
 * standard 3-CTA closing block (Open Service Hub · Start Diagnosis ·
 * Speak to Team). Per the brief, every article connects to a real
 * OMEGA route — this section is where that connection is surfaced.
 *
 * Layout:
 *   - Top: large contextual card with the article-specific CTA
 *     (e.g. "View OMEGA Property Care System" / "Start Diagnosis").
 *   - Bottom: standard three exits in case the contextual CTA
 *     doesn't fit the reader's intent.
 *
 * Wraps in arch-rule top + bottom for closing rhythm consistent
 * with every other OMEGA page.
 */
export function ArticleFinalCTA({ article }: { article: Article }) {
  return (
    <section
      id="article-cta"
      className="relative overflow-hidden bg-warmwhite pt-10 pb-14 md:pt-14 md:pb-16"
    >
      {/* Soft warm radial closing accent */}
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

        {/* Section eyebrow */}
        <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>From Insight to Action</span>
        </div>

        {/* Article-specific contextual CTA card */}
        <div className="mt-6 rounded-[24px] border border-line/80 bg-warmwhite/90 p-6 md:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)]">
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-6">
            <h2 className="col-span-12 lg:col-span-7 text-[1.7rem] md:text-[2.1rem] leading-[1.08] tracking-tightest font-semibold text-graphite">
              The OMEGA path this insight points to.
            </h2>
            {" "}
            <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
              Every Insight connects to a real OMEGA route. This article
              points you to{" "}
              <span className="font-medium text-graphite">
                {readableRouteLabel(article.relatedRoute)}
              </span>
              .
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-stretch gap-3 md:gap-4">
            <Link
              href={article.relatedRoute}
              data-action={
                article.relatedRoute === "/diagnosis"
                  ? "START_DIAGNOSIS"
                  : "OPEN_SUGGESTED_ROUTE"
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
            >
              <span>{article.relatedCTA}</span>
              {" "}
              <Arrow />
            </Link>
          </div>
        </div>

        {/* Standard three-route closing block */}
        <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h3 className="col-span-12 lg:col-span-7 text-[1.4rem] md:text-[1.7rem] leading-[1.15] tracking-tightest font-semibold text-graphite">
            Or take a different route.
          </h3>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-[0.95rem] text-muted leading-[1.7]">
            Browse the full service system, run a guided diagnosis, or
            speak directly with the team.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-stretch gap-3 md:gap-4">
          <Link
            href="/service-hub"
            data-action="OPEN_SERVICE_HUB"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-6 py-3 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Open Service Hub</span>
          </Link>
          {" "}
          {article.relatedRoute !== "/diagnosis" && (
            <>
              <Link
                href="/diagnosis"
                data-action="START_DIAGNOSIS"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-6 py-3 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
              >
                <span>Start Diagnosis</span>
              </Link>
              {" "}
            </>
          )}
          <Link
            href="/contact"
            data-action="CONTACT_TEAM"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-6 py-3 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Speak to Team</span>
          </Link>
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}

/**
 * Convert a route path into a human-readable label for the
 * contextual CTA description. Mirrors the same helper inside
 * `ArticleBody` — duplicated locally so each component stays
 * self-contained and can move independently when the body migrates
 * to MDX.
 */
function readableRouteLabel(route: string): string {
  if (route === "/diagnosis") return "OMEGA AI Property Diagnostics";
  if (route === "/service-hub") return "the OMEGA Service Hub";
  if (route === "/contact") return "the OMEGA team";
  if (route.startsWith("/service-hub/")) {
    const slug = route.split("/").pop() ?? "";
    const title = slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    return `OMEGA ${title}`;
  }
  return route;
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
