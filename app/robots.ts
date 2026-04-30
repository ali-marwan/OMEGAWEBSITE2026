import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/omegaConfig";

/**
 * `robots.txt` — Next.js App Router convention.
 *
 * Allow all real product surfaces; block Next.js internals so
 * crawler budget doesn't get spent on chunk URLs that aren't
 * meaningful destinations.
 *
 * The Vercel preview / production deploy emits this as a real
 * `robots.txt` at `https://<host>/robots.txt`.
 *
 * Mobile-app alignment: the `host` we declare here is the same
 * canonical origin used by every Open Graph + JSON-LD URL on the
 * site, so universal-link associations don't drift between
 * platforms.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Next.js internals — never useful in search.
          "/_next/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
