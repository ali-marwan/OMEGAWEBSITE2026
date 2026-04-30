import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL, canonicalUrl } from "@/lib/omegaConfig";
import { getAllArticleSlugs } from "@/lib/insights";
import { getAllServiceSlugs } from "@/lib/services";

/**
 * `sitemap.xml` — Next.js App Router convention.
 *
 * Lists every public route on the site:
 *   - `/`
 *   - `/service-hub`
 *   - `/service-hub/[slug]` for every service in `lib/services.ts`
 *   - `/diagnosis`
 *   - `/studio`
 *   - `/contact`
 *
 * The dynamic service entries pick up new services automatically —
 * adding a slug to `lib/services.ts` extends the sitemap on the next
 * build with no edits here.
 *
 * `lastModified` is stamped at build time. When pages move to a
 * CMS, swap this for the per-page modified timestamp.
 *
 * Test routes / unfinished pages are intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static top-level routes — declared in priority order so the
  // most important pages surface first to crawlers that respect it.
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}${ROUTES.home}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}${ROUTES.serviceHub}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}${ROUTES.diagnosis}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${ROUTES.studio}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}${ROUTES.contact}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: canonicalUrl("/insights"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic per-service detail pages.
  const serviceEntries: MetadataRoute.Sitemap = getAllServiceSlugs().map(
    (slug) => ({
      url: canonicalUrl(`/service-hub/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  // Dynamic per-article insight pages.
  const articleEntries: MetadataRoute.Sitemap = getAllArticleSlugs().map(
    (slug) => ({
      url: canonicalUrl(`/insights/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticEntries, ...serviceEntries, ...articleEntries];
}
