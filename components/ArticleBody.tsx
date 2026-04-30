import Link from "next/link";
import { Fragment } from "react";
import type { Article } from "@/lib/insights";
import { AcTechnicianResetBody } from "./articles/AcTechnicianResetBody";
import { AiDiagnosticsRoutingBody } from "./articles/AiDiagnosticsRoutingBody";
import { AnnualMaintenancePlanBody } from "./articles/AnnualMaintenancePlanBody";
import { BuyingRentingChecklistBody } from "./articles/BuyingRentingChecklistBody";
import { EngineeringReviewBody } from "./articles/EngineeringReviewBody";
import { HealthReportBeforeRenovationBody } from "./articles/HealthReportBeforeRenovationBody";
import { RenovationVsRepairBody } from "./articles/RenovationVsRepairBody";
import { VillaMaintenanceSignsBody } from "./articles/VillaMaintenanceSignsBody";

/**
 * Slugs that have a fully-written body component. Articles whose
 * slug is in this set render their dedicated body; everything else
 * falls through to the placeholder body below.
 *
 * The page-level `app/insights/[slug]/page.tsx` reads this same set
 * to decide whether to render the page-level `<ArticleFinalCTA />`
 * (which is suppressed for full-body articles because they ship
 * their own inline CTA panel — no double-CTA redundancy).
 *
 * Adding a new full article is a 3-step change:
 *   1. Drop a body component into `components/articles/`
 *   2. Map its slug to the component in `articleBodies` below
 *   3. Add the slug to `HAS_FULL_BODY`
 *
 * Eventually this map is replaced by a CMS / MDX-driven loader.
 */
export const HAS_FULL_BODY: ReadonlySet<string> = new Set([
  "annual-maintenance-plan-uae-property",
  "when-an-ac-issue-needs-a-technician",
  "why-a-property-health-report-matters-before-renovation",
  "common-signs-your-villa-needs-a-maintenance-review",
  "renovation-vs-repair-choosing-the-right-path",
  "why-engineering-review-matters-before-major-changes",
  "how-omega-ai-diagnostics-helps-route-issues",
  "what-to-check-before-buying-or-renting-uae",
]);

const articleBodies: Record<
  string,
  (props: { article: Article }) => React.ReactNode
> = {
  "annual-maintenance-plan-uae-property": AnnualMaintenancePlanBody,
  "when-an-ac-issue-needs-a-technician": AcTechnicianResetBody,
  "why-a-property-health-report-matters-before-renovation":
    HealthReportBeforeRenovationBody,
  "common-signs-your-villa-needs-a-maintenance-review":
    VillaMaintenanceSignsBody,
  "renovation-vs-repair-choosing-the-right-path": RenovationVsRepairBody,
  "why-engineering-review-matters-before-major-changes":
    EngineeringReviewBody,
  "how-omega-ai-diagnostics-helps-route-issues": AiDiagnosticsRoutingBody,
  "what-to-check-before-buying-or-renting-uae": BuyingRentingChecklistBody,
};

/**
 * `/insights/[slug]` — Section 02: Article body.
 *
 * Routes to the matching full-body component when one exists for
 * the article's slug; otherwise renders the structured placeholder
 * body below.
 *
 * Placeholder body sections (per the brief):
 *   01  Overview
 *   02  Key points
 *   03  What this means for property owners
 *   04  When to involve OMEGA
 *   05  Related service path
 *
 * Each placeholder section uses the OMEGA section pattern (mono
 * index strip + heading + body) and contains copy that explicitly
 * acknowledges the body is in development. As real articles ship,
 * they migrate from the placeholder template to a dedicated body
 * component with no surrounding page changes.
 */
export function ArticleBody({ article }: { article: Article }) {
  // Full-body article — route to its dedicated component.
  const FullBody = articleBodies[article.slug];
  if (FullBody) return <FullBody article={article} />;

  // Default — placeholder body below.
  return <PlaceholderBody article={article} />;
}

function PlaceholderBody({ article }: { article: Article }) {
  return (
    <section
      id="article-body"
      className="relative bg-warmwhite pt-10 pb-12 md:pt-14 md:pb-14"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-50"
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/*
          Two-column body — narrow content column with comfortable
          measure (max ~70ch) on desktop, full-width on mobile. Keeps
          the reading experience editorial without sprawling.
        */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <article className="col-span-12 lg:col-span-8 space-y-12">
            {/* Editorial draft notice — temporary, removed when the
                first real body lands. */}
            <aside className="rounded-[14px] border border-omega/30 bg-omega/[0.04] p-4 md:p-5">
              <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-omega">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
                />
                {" "}
                <span>Editorial Draft</span>
              </div>
              <p className="mt-2 text-[0.88rem] leading-[1.65] text-graphite/85">
                This article is part of the OMEGA Insights structure.
                The full body is being written. Sections below outline
                what the published version will cover.
              </p>
            </aside>

            <ArticleSection
              index="01"
              title="Overview"
              body={
                <>
                  This article will explore <strong>{article.title.toLowerCase()}</strong>.
                  The full version sets the context, lays out what's at
                  stake for a UAE property owner, and frames the
                  decisions the article helps with.
                </>
              }
            />

            <ArticleSection
              index="02"
              title="Key points"
              body={
                <>
                  The published article will surface 4–5 short, scannable
                  takeaways readers can act on. Each point is grounded in
                  OMEGA's UAE service experience — no generic checklist
                  copy, no fabricated statistics.
                </>
              }
            >
              {/* Placeholder bullet list — typographically real but the
                  copy is generic. Replaced per-article when content
                  lands. */}
              <ul className="mt-5 space-y-3">
                {[
                  "Practical signal to look for",
                  "What it usually indicates",
                  "What it doesn't necessarily mean",
                  "When to escalate vs monitor",
                ].map((stub, i) => (
                  <Fragment key={stub}>
                    {i > 0 && " "}
                    <li className="flex items-start gap-3 text-[0.95rem] leading-[1.7] text-muted">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-omega"
                      />
                      {" "}
                      <span>
                        Placeholder · {stub} (final wording arrives with
                        the published article).
                      </span>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </ArticleSection>

            <ArticleSection
              index="03"
              title="What this means for property owners"
              body={
                <>
                  The published version will translate the technical
                  signals into client-facing decisions — what to do, what
                  to defer, and what's worth a conversation with the
                  OMEGA team. UAE-specific context (climate, MEP density,
                  tenancy expectations) is folded in where relevant.
                </>
              }
            />

            <ArticleSection
              index="04"
              title="When to involve OMEGA"
              body={
                <>
                  Most issues described in OMEGA Insights have a clear
                  point at which professional involvement saves time and
                  cost. The published article will name that point
                  explicitly — never as a hard rule, always with the
                  judgement context that lets the reader decide.
                </>
              }
            />

            <ArticleSection
              index="05"
              title="Related service path"
              body={
                <>
                  Every Insight connects to a real OMEGA route. The
                  published version will explain why this article points
                  to{" "}
                  <Link
                    href={article.relatedRoute}
                    className="text-graphite underline decoration-omega/40 underline-offset-4 transition-colors duration-500 ease-elegant hover:text-omega hover:decoration-omega"
                  >
                    {readableRouteLabel(article.relatedRoute)}
                  </Link>
                  {" "}and what to expect after the user takes that step.
                </>
              }
            />
          </article>

          {/* Right rail — sticky meta block summarising the article on
              desktop. Hidden on mobile to keep the reading flow clean. */}
          <aside className="hidden lg:block col-span-12 lg:col-span-4">
            <div className="sticky top-[140px] rounded-[20px] border border-line/80 bg-warmwhite/85 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)]">
              <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                />
                {" "}
                <span>In this insight</span>
              </div>
              <ol className="mt-5 space-y-3 text-[0.9rem] leading-[1.6] text-muted">
                {[
                  "Overview",
                  "Key points",
                  "What this means for property owners",
                  "When to involve OMEGA",
                  "Related service path",
                ].map((label, i) => (
                  <Fragment key={label}>
                    {i > 0 && " "}
                    <li className="flex items-baseline gap-3">
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {" "}
                      <span>{label}</span>
                    </li>
                  </Fragment>
                ))}
              </ol>

              {/* Mono meta strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                <div>
                  <div className="text-graphite/60">Reading time</div>
                  <div className="mt-1 text-graphite/90">
                    {article.readingTime} min
                  </div>
                </div>
                <div>
                  <div className="text-graphite/60">Category</div>
                  <div className="mt-1 normal-case tracking-[0.02em] text-graphite/90">
                    {article.category}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/**
 * One numbered article section. Index strip + heading + body + slot
 * for an optional list / sub-content (used by section 02 for the
 * placeholder bullets).
 */
function ArticleSection({
  index,
  title,
  body,
  children,
}: {
  index: string;
  title: string;
  body: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
        />
        {" "}
        <span>{index}</span>
        {" "}
        <span aria-hidden className="h-3 w-px bg-line" />
        {" "}
        <span>{title}</span>
      </div>
      <h2 className="mt-3 text-[1.4rem] md:text-[1.6rem] leading-[1.2] tracking-tightest font-semibold text-graphite">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-base md:text-[1.02rem] leading-[1.75] text-muted">
        {body}
      </p>
      {children}
    </div>
  );
}

/**
 * Convert a route path into a human-readable label for inline copy.
 * `/service-hub/property-care-system` → "OMEGA Property Care System".
 * `/diagnosis` → "OMEGA AI Property Diagnostics".
 * Falls back to a Title-Case version of the slug for anything else
 * so future routes don't break the body.
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
