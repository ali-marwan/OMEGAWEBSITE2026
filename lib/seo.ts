/**
 * OMEGA — central SEO + structured-data layer.
 *
 * Single source of truth for:
 *   - Default site title / description / site name
 *   - The `buildPageMetadata()` helper that produces a Next.js
 *     `Metadata` object with title, description, canonical URL,
 *     Open Graph + Twitter card metadata, and robots directive
 *   - JSON-LD builders for Organization (global) + Service (per
 *     service detail page)
 *   - The `<JsonLd>` server component that renders structured data
 *     into a page's `<head>`
 *
 * Every route's metadata flows through `buildPageMetadata` so the
 * site has consistent OG / Twitter / canonical structure. Per-page
 * overrides are passed in as arguments — there are no scattered
 * Open Graph definitions to drift out of sync.
 *
 * Mobile-app alignment: the structured-data shape is consumable by
 * the eventual app's universal-link metadata + native share sheet.
 */

import type { Metadata } from "next";
import {
  COMPANY_NAME,
  COUNTRY_NAME,
  OG_DEFAULT_IMAGE_ALT,
  OG_DEFAULT_IMAGE_HEIGHT,
  OG_DEFAULT_IMAGE_PATH,
  OG_DEFAULT_IMAGE_WIDTH,
  ROUTES,
  SITE_URL,
  canonicalUrl,
} from "./omegaConfig";
import type { Article } from "./insights";
import type { Service } from "./services";

/* ── Default metadata constants ──────────────────────────────────── */

/** Site name surfaced in Open Graph + browser tab suffix. */
export const SITE_NAME = COMPANY_NAME;

/** Default page title used as a fallback / template suffix. */
export const DEFAULT_TITLE =
  "OMEGA | Engineering-Led Property Solutions in the UAE";

/** Default page description used when a page does not override it. */
export const DEFAULT_DESCRIPTION =
  "OMEGA provides property care, home services, property health reports, renovation, engineering solutions, and AI-guided diagnosis for UAE properties.";

/**
 * Focus topics — surfaced as a `keywords` meta tag where Next.js
 * still honours it. Modern crawlers ignore meta keywords, but
 * keeping a curated list documents the brand's positioning for
 * future content + ad copy.
 */
export const SITE_KEYWORDS = [
  "UAE property services",
  "Dubai property maintenance",
  "property care UAE",
  "annual maintenance UAE",
  "home services UAE",
  "property health report",
  "renovation UAE",
  "engineering solutions UAE",
  "AI property diagnosis",
] as const;

/* ── Page metadata builder ───────────────────────────────────────── */

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path the page lives at (e.g. `/service-hub`). Used for canonical + og:url. */
  path: string;
  /** Open Graph type — defaults to "website"; service detail pages may use "article". */
  ogType?: "website" | "article" | "profile";
  /** Optional override for the share image. Defaults to the global OG image. */
  ogImage?: string;
  /** Optional `noindex` flag — for staging routes / unfinished pages. */
  noindex?: boolean;
};

/**
 * Produce a fully-formed Next.js `Metadata` object for a route.
 *
 * Always sets:
 *   - title, description
 *   - alternates.canonical → fully-qualified URL
 *   - openGraph: title, description, type, url, siteName, locale, images
 *   - twitter: card="summary_large_image", title, description, images
 *   - robots: index/follow when `noindex` is false (default)
 *
 * Page authors should pass the brief-specified title + description
 * verbatim. `buildPageMetadata` handles the canonical + share scaffolding.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const url = canonicalUrl(input.path);
  const imagePath = input.ogImage ?? OG_DEFAULT_IMAGE_PATH;
  const imageUrl = canonicalUrl(imagePath);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      type: input.ogType ?? "website",
      url,
      siteName: SITE_NAME,
      locale: "en_AE",
      images: [
        {
          url: imageUrl,
          width: OG_DEFAULT_IMAGE_WIDTH,
          height: OG_DEFAULT_IMAGE_HEIGHT,
          alt: OG_DEFAULT_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/* ── JSON-LD builders ────────────────────────────────────────────── */

/**
 * Generic JSON-LD object — every helper below produces one of these.
 * Keep the type loose (`Record<string, unknown>`) so we can extend
 * schemas without TypeScript fighting us; schema.org fields are not
 * a closed enum.
 */
export type JsonLdObject = Record<string, unknown>;

/**
 * Organization schema — describes OMEGA the company. Rendered once,
 * inside `app/layout.tsx`, so every page's `<head>` includes the
 * brand description for crawler / rich-result snippets.
 *
 * Intentionally omits:
 *   - `telephone` / `email` / `address` — these are TODO placeholders
 *     elsewhere on the site and should not be published as
 *     structured data until operations confirms real values.
 *   - `aggregateRating` / `review` — no fake reviews.
 *   - `award` / `priceRange` — no unverified claims.
 *
 * `sameAs` is empty pending real social profiles. Add them when the
 * operations team confirms.
 */
export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "OMEGA",
    url: SITE_URL,
    description:
      "Engineering-led property solutions company in the UAE — property care, home services, property health reports, renovation, engineering solutions, and AI-guided diagnosis.",
    areaServed: {
      "@type": "Country",
      name: COUNTRY_NAME,
    },
    // TODO(operations): populate `sameAs` with verified profiles
    // (LinkedIn, Instagram, etc.) once the social presence is set up.
    sameAs: [] as string[],
  };
}

/**
 * Service schema — one per service detail page. Describes what the
 * service offers, who provides it, and where it's available, so
 * search engines can present rich-result service cards.
 */
export function serviceJsonLd(service: Service): JsonLdObject {
  const serviceUrl = canonicalUrl(service.route);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.descriptor,
    description: service.fullDescription,
    url: serviceUrl,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: COUNTRY_NAME,
    },
    category: service.category,
  };
}

/**
 * Article schema — one per `/insights/[slug]` detail page. Describes
 * the post (headline, abstract, dates, author, primary URL) so search
 * engines can present rich-result article cards. Article body is
 * placeholder today — the structured data still surfaces the meta
 * (title / description / dates) so SEO is in place when real bodies
 * land.
 *
 * Mobile-app alignment: the same Article schema feeds an eventual
 * Insights tab in the mobile app. The `mainEntityOfPage` URL is the
 * canonical web URL the universal-link associates with.
 */
export function articleJsonLd(article: Article): JsonLdObject {
  const articleUrl = canonicalUrl(`/insights/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    articleSection: article.category,
    keywords: [...article.tags].join(", "),
  };
}

/**
 * The `<JsonLd>` component itself lives in `components/JsonLd.tsx`
 * so this file can stay as a pure-TypeScript `.ts` module (no JSX).
 * Import from `@/components/JsonLd` to render structured data; this
 * file is responsible only for the data builders.
 */

/* ── Re-exports for convenience ──────────────────────────────────── */

export { ROUTES, SITE_URL, canonicalUrl };
