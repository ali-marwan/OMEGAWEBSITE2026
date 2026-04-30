/**
 * OMEGA Insights — content data layer.
 *
 * Single source of truth for the `/insights` knowledge hub: the
 * listing page, category filter, featured article, individual
 * `/insights/[slug]` detail pages, and the per-article SEO metadata
 * all read from this file.
 *
 * Design intent (per the brief):
 *   - Frontend-only for now. Full article bodies are NOT written
 *     here — the detail page renders 5 structured placeholder
 *     sections per article. When real content lands, body data
 *     migrates to MDX / a CMS / Supabase / Sanity / Notion without
 *     touching the listing UI.
 *   - Each article carries everything the SEO + share + lead-routing
 *     layers need: `seoTitle`, `seoDescription`, `relatedRoute`,
 *     `relatedCTA`. The listing card + the detail page consume the
 *     same fields.
 *   - Categories are an Insights-specific taxonomy (parallel to but
 *     not identical with `ServiceCategory` in `lib/services.ts`).
 *     They include "OMEGA AI Diagnostics" and "UAE Property
 *     Guidance" which aren't service modules.
 *
 * Mobile-app alignment:
 *   - The same `Article` shape will feed the eventual mobile app's
 *     Insights tab. UPPERCASE codes (`category`, `relatedRoute`)
 *     match the rest of the OMEGA taxonomy so the mobile router
 *     consumes one contract.
 */

/* ── Categories ──────────────────────────────────────────────────── */

/**
 * Insights categories — used for the filter row + per-article
 * category label. Order is the display order on the filter rail.
 *
 * The first 5 mirror the Service Hub modules; the last 2 cover
 * cross-cutting OMEGA topics that don't map to a single service.
 */
export const insightsCategories = [
  "Property Care",
  "Home Services",
  "Property Health Reports",
  "Renovation",
  "Engineering Solutions",
  "OMEGA AI Diagnostics",
  "UAE Property Guidance",
] as const;

export type InsightsCategory = (typeof insightsCategories)[number];

/** Filter values exposed to the UI ("All" + every category). */
export type InsightsFilter = "All" | InsightsCategory;

export const insightsFilters: readonly InsightsFilter[] = [
  "All",
  ...insightsCategories,
] as const;

/* ── Article shape ───────────────────────────────────────────────── */

/**
 * A single OMEGA Insights article. Frontend-only today; a future
 * CMS migration replaces the `articles` array below with a typed
 * fetcher returning the same shape.
 *
 * Required fields cover SEO, listing UI, and detail page routing:
 *   - `id` / `slug`             — stable identity
 *   - `title` / `excerpt`       — listing card + detail hero
 *   - `category` / `tags`       — filter + classification
 *   - `author`                  — byline (placeholder for now)
 *   - `publishedAt` / `updatedAt` — ISO dates surfaced in metadata
 *   - `readingTime`             — minutes, displayed on cards
 *   - `featured`                — `true` for the homepage hero of
 *                                 /insights; exactly one expected
 *   - `relatedRoute` / `relatedCTA` — the lead-funnel link the
 *                                     article points back to
 *   - `seoTitle` / `seoDescription` — per-article metadata override
 */
export type Article = {
  id: string;
  slug: string;
  title: string;
  /** Short summary used on listing cards + detail hero. 2–3 lines. */
  excerpt: string;
  category: InsightsCategory;
  tags: readonly string[];
  author: string;
  /** ISO date string. */
  publishedAt: string;
  /** ISO date string. */
  updatedAt: string;
  /** Estimated reading time in minutes. */
  readingTime: number;
  /** Exactly one article in `articles` should be `featured: true`. */
  featured: boolean;
  /**
   * Route this article funnels readers to. Either a service detail
   * route (`/service-hub/<slug>`) or `/diagnosis` for AI-routing
   * articles. Use the full path so the CTA component can render a
   * Link without composing URLs.
   */
  relatedRoute: string;
  /**
   * CTA label paired with `relatedRoute`. Use one of the standard
   * action labels: "View Related Service" / "Start Diagnosis" /
   * "Speak to Team".
   */
  relatedCTA: "View Related Service" | "Start Diagnosis" | "Speak to Team";
  /** Per-article SEO title override (used by `generateMetadata`). */
  seoTitle: string;
  /** Per-article SEO description override. */
  seoDescription: string;
};

/* ── Article catalogue (8 placeholder entries) ───────────────────── */

const PLACEHOLDER_AUTHOR = "OMEGA Editorial";
const PLACEHOLDER_PUBLISHED = "2025-01-01T00:00:00.000Z";
const PLACEHOLDER_UPDATED = "2025-01-01T00:00:00.000Z";

export const articles: readonly Article[] = [
  {
    id: "annual-maintenance-plan-coverage",
    // First fully-written article. Slug is intentionally distinct
    // from the previous placeholder slug so the published article
    // can carry SEO-optimised wording aligned with the new title.
    slug: "annual-maintenance-plan-uae-property",
    title: "What an Annual Maintenance Plan Should Cover in a UAE Property",
    excerpt:
      "A clear annual maintenance plan helps property owners move from reactive repairs to structured care, covering inspections, preventive checks, issue tracking, and the right service response.",
    category: "Property Care",
    tags: ["annual maintenance", "property care", "preventive checks"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 5,
    featured: true,
    relatedRoute: "/service-hub/property-care-system",
    relatedCTA: "View Related Service",
    seoTitle:
      "Annual Maintenance Plan UAE | What Property Care Should Cover",
    seoDescription:
      "Learn what an annual maintenance plan should include for UAE properties, from AC and plumbing checks to reporting, issue tracking, and ongoing property care.",
  },
  {
    id: "ac-issue-technician-vs-reset",
    slug: "when-an-ac-issue-needs-a-technician",
    title: "When an AC Issue Needs a Technician Instead of a Quick Reset",
    excerpt:
      "Some AC faults clear themselves with a thermostat reset. Others are early signs of a system that needs proper service before it fails on a 45° day. A quick guide to telling them apart.",
    category: "Home Services",
    tags: ["AC", "home services", "diagnostics", "summer prep"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 5,
    featured: false,
    relatedRoute: "/service-hub/home-services",
    relatedCTA: "View Related Service",
    seoTitle:
      "When an AC Issue Needs a Technician Instead of a Quick Reset | OMEGA Insights",
    seoDescription:
      "How to tell when an AC issue is a quick reset vs a real fault that needs a technician. UAE-specific guidance from OMEGA.",
  },
  {
    id: "health-report-before-renovation",
    slug: "why-a-property-health-report-matters-before-renovation",
    title: "Why a Property Health Report Matters Before Renovation",
    excerpt:
      "Locking renovation scope without a baseline condition view means surprises mid-build. A property health report maps what's behind the walls before the contractor opens them.",
    category: "Property Health Reports",
    tags: ["health report", "renovation", "pre-renovation"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 7,
    featured: false,
    relatedRoute: "/service-hub/property-health-report",
    relatedCTA: "View Related Service",
    seoTitle:
      "Why a Property Health Report Matters Before Renovation | OMEGA Insights",
    seoDescription:
      "A property health report sets a clear baseline before renovation scope is committed. Here's why it matters for UAE properties.",
  },
  {
    id: "villa-maintenance-review-signs",
    slug: "common-signs-your-villa-needs-a-maintenance-review",
    title: "Common Signs Your Villa Needs a Maintenance Review",
    excerpt:
      "Most villa issues announce themselves quietly long before they become repair bills. Recurring stains, AC short-cycling, and uneven cooling are early signals worth taking seriously.",
    category: "Property Care",
    tags: ["villa", "maintenance", "early signals"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 5,
    featured: false,
    relatedRoute: "/service-hub/property-care-system",
    relatedCTA: "View Related Service",
    seoTitle:
      "Common Signs Your Villa Needs a Maintenance Review | OMEGA Insights",
    seoDescription:
      "Recurring stains, short-cycling AC, and uneven cooling are early signals a villa needs structured maintenance review. UAE-specific guidance.",
  },
  {
    id: "renovation-vs-repair",
    slug: "renovation-vs-repair-choosing-the-right-path",
    title: "Renovation vs Repair: How to Choose the Right Path",
    excerpt:
      "Some property issues are simple repairs. Others are signals that the underlying system needs renovation. The decision shapes scope, budget, and timeline — here's how to read it.",
    category: "Renovation",
    tags: ["renovation", "repair", "decision guide"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 6,
    featured: false,
    relatedRoute: "/service-hub/renovation",
    relatedCTA: "View Related Service",
    seoTitle:
      "Renovation vs Repair: How to Choose the Right Path | OMEGA Insights",
    seoDescription:
      "How to decide between renovation and repair for a UAE property. Practical guidance from OMEGA on scope, budget, and timing.",
  },
  {
    id: "engineering-review-major-changes",
    slug: "why-engineering-review-matters-before-major-changes",
    title: "Why Engineering Review Matters Before Major Property Changes",
    excerpt:
      "Layout changes, structural modifications, and MEP rework all benefit from engineering input before contractors quote. The cost of that input is small relative to the cost of getting the scope wrong.",
    category: "Engineering Solutions",
    tags: ["engineering", "MEP", "structural", "drawings"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 7,
    featured: false,
    relatedRoute: "/service-hub/engineering-solutions",
    relatedCTA: "View Related Service",
    seoTitle:
      "Why Engineering Review Matters Before Major Property Changes | OMEGA Insights",
    seoDescription:
      "Engineering review before layout, structural, or MEP changes prevents costly scope mistakes. Here's why it matters for UAE projects.",
  },
  {
    id: "ai-diagnostics-routing",
    slug: "how-omega-ai-diagnostics-helps-route-issues",
    title: "How OMEGA AI Diagnostics Helps Route Property Issues",
    excerpt:
      "Property issues rarely arrive labelled. OMEGA AI Diagnostics is the structured intake layer that helps describe what's happening and route the request to the right OMEGA service path.",
    category: "OMEGA AI Diagnostics",
    tags: ["AI diagnostics", "intake", "routing"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 4,
    featured: false,
    relatedRoute: "/diagnosis",
    relatedCTA: "Start Diagnosis",
    seoTitle:
      "How OMEGA AI Diagnostics Helps Route Property Issues | OMEGA Insights",
    seoDescription:
      "OMEGA AI Diagnostics is a structured intake layer for UAE property issues. How the routing works and where confirmation by OMEGA happens.",
  },
  {
    id: "buying-renting-uae-checklist",
    slug: "what-to-check-before-buying-or-renting-uae",
    title: "What to Check Before Buying or Renting a Property in the UAE",
    excerpt:
      "A new property's quirks rarely show themselves on viewing day. AC performance, water pressure, finishes, and access details are worth a structured check before you sign — here's a starting list.",
    category: "UAE Property Guidance",
    tags: ["buying", "renting", "checklist", "UAE"],
    author: PLACEHOLDER_AUTHOR,
    publishedAt: PLACEHOLDER_PUBLISHED,
    updatedAt: PLACEHOLDER_UPDATED,
    readingTime: 6,
    featured: false,
    relatedRoute: "/service-hub/property-health-report",
    relatedCTA: "View Related Service",
    seoTitle:
      "What to Check Before Buying or Renting a Property in the UAE | OMEGA Insights",
    seoDescription:
      "A starting checklist for UAE buyers and renters. AC, water, finishes, and access — the property quirks that rarely show on viewing day.",
  },
] as const;

/* ── Helper functions ────────────────────────────────────────────── */

/**
 * Look up a single article by its url slug. Returns undefined when
 * no match — the [slug] detail page treats undefined as a 404.
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** All slugs for `generateStaticParams` in the [slug] detail page. */
export function getAllArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}

/** Filter articles by an Insights filter value. */
export function filterArticles(
  filter: InsightsFilter
): readonly Article[] {
  if (filter === "All") return articles;
  return articles.filter((a) => a.category === filter);
}

/**
 * Resolve the featured article for the listing page hero. There's
 * exactly one in the catalogue today; if multiple are flagged we
 * fall back to the first declared.
 */
export function getFeaturedArticle(): Article | undefined {
  return articles.find((a) => a.featured) ?? articles[0];
}

/**
 * Articles other than the featured one — used for the listing
 * grid below the featured block. Maintains the catalogue's
 * declaration order (= editorial priority).
 */
export function getNonFeaturedArticles(): readonly Article[] {
  const featured = getFeaturedArticle();
  if (!featured) return articles;
  return articles.filter((a) => a.id !== featured.id);
}

/**
 * Resolve up to N related articles for a given article. Same
 * category first, then a fallback to whatever shares any tags. We
 * never include the article itself.
 */
export function getRelatedArticles(
  slug: string,
  limit = 3
): readonly Article[] {
  const article = getArticleBySlug(slug);
  if (!article) return [];

  const sameCategory = articles.filter(
    (a) => a.id !== article.id && a.category === article.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  // Fall back to tag overlap so visitors always see ≥1 related read.
  const remaining = articles.filter(
    (a) =>
      a.id !== article.id &&
      a.category !== article.category &&
      a.tags.some((t) => article.tags.includes(t))
  );

  return [...sameCategory, ...remaining].slice(0, limit);
}

/**
 * Format an ISO date for display (e.g. "Jan 15, 2025"). Centralised
 * so every consumer of `publishedAt` / `updatedAt` renders the same
 * format.
 */
export function formatArticleDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
