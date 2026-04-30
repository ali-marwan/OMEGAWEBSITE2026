/**
 * OMEGA — centralised application config.
 *
 * Single source of truth for everything the website, future mobile
 * app, and future backend / CRM integrations need to know about
 * "OMEGA the company": brand identity, top-level routes, and
 * operational contact placeholders.
 *
 * Placeholder discipline: every operational contact value below is
 * a clearly-named TODO constant. Do not invent real phone numbers,
 * emails, or WhatsApp deep links here. When the operations team
 * confirms production values, swap them in this file once and the
 * change propagates to every form, footer, dock, and contact panel
 * that reads from this module.
 *
 * Mobile-app alignment: this file maps 1:1 onto the eventual app's
 * `RemoteConfig` / settings bundle. A native client should be able
 * to consume the same shape (transformed to JSON or a typed Swift /
 * Kotlin record) without taxonomy translation.
 */

/* ── Brand identity ──────────────────────────────────────────────── */

export const COMPANY_NAME = "OMEGA";

/** Spelled-out country for human-facing copy. */
export const COUNTRY_NAME = "United Arab Emirates";

/** ISO 3166-1 alpha-2 country code for analytics + future locale logic. */
export const COUNTRY_CODE = "AE";

/* ── Top-level routes ────────────────────────────────────────────── */

/**
 * Every primary destination. CTAs across the site read from this
 * record (via `lib/actions.ts`) so renaming a route is a one-place
 * change. Hash anchors live alongside their parent route, never on
 * their own here, because the brief's product surfaces are full
 * routes — never section anchors.
 */
export const ROUTES = {
  home: "/",
  serviceHub: "/service-hub",
  diagnosis: "/diagnosis",
  contact: "/contact",
  studio: "/studio",
} as const;

export type RouteKey = keyof typeof ROUTES;

/* ── SEO / canonical site URL ────────────────────────────────────── */

/**
 * Production origin used in canonical URLs, Open Graph tags, JSON-LD
 * structured data, and the sitemap. Configurable here so a future
 * domain swap is a one-place change.
 *
 * Order of resolution:
 *   1. `NEXT_PUBLIC_SITE_URL` env var, when set (preview / staging
 *      builds can override without touching source).
 *   2. The Vercel preview URL stamped on every deployment, when
 *      available (no special config needed for preview builds).
 *   3. The production fallback below.
 *
 * Always returned WITHOUT a trailing slash so callers can append
 * route paths cleanly (`SITE_URL + "/service-hub"`).
 */
function resolveSiteUrl(): string {
  // Env-driven override — set this in Vercel project settings when a
  // custom domain is connected.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return stripTrailingSlash(explicit);

  // Vercel auto-stamped origin (preview deploys + production
  // fallback). `NEXT_PUBLIC_VERCEL_URL` does NOT include the scheme.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${stripTrailingSlash(vercel)}`;

  // Hard fallback — the current Vercel-assigned production URL.
  // Replace with the final custom domain when it lands.
  return "https://omegawebsite-2026.vercel.app";
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const SITE_URL = resolveSiteUrl();

/**
 * Build a fully-qualified canonical URL for a route path. Appends
 * the path to `SITE_URL` ensuring exactly one slash between them.
 * Pass `/` for the homepage.
 */
export function canonicalUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  // Normalise duplicate slashes from accidental concatenation
  // upstream (e.g. when slug data has an extra leading slash).
  return `${SITE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
}

/* ── Open Graph default image ────────────────────────────────────── */

/**
 * Path to the default Open Graph / Twitter share image. Resolves to
 * an absolute URL via `canonicalUrl()` when consumed.
 *
 * TODO(design): the file `/public/og/omega-og-default.jpg` does not
 * exist yet. Add a 1200×630 share-card asset before the production
 * launch — until then, social crawlers will fall back to no image.
 * Recommended dimensions:
 *   - Open Graph:  1200 × 630 (or 1200 × 1200 square)
 *   - Twitter:     1200 × 630 (summary_large_image)
 */
export const OG_DEFAULT_IMAGE_PATH = "/og/omega-og-default.jpg";
export const OG_DEFAULT_IMAGE_WIDTH = 1200;
export const OG_DEFAULT_IMAGE_HEIGHT = 630;
export const OG_DEFAULT_IMAGE_ALT = "OMEGA — engineering-led property solutions in the UAE.";

/* ── Operational contact placeholders ────────────────────────────── */

/**
 * Phone number — placeholder. Swap to a real E.164 string (e.g.
 * `+971 4 000 0000`) for the operations team. Surfaces in the
 * direct-contact panel on /contact and any future tel: link.
 */
export const TODO_PHONE = "TODO_PHONE";

/** Email address — placeholder. */
export const TODO_EMAIL = "TODO_EMAIL";

/**
 * WhatsApp number — E.164 digits only, no plus sign (e.g.
 * `971501234567`). Used by `buildWhatsAppLink` in `lib/leads.ts` to
 * compose `https://wa.me/<number>?text=<encoded>`.
 */
export const TODO_WHATSAPP_NUMBER = "TODO_WHATSAPP_NUMBER";

/**
 * Direct WhatsApp link override. If the operations team has a
 * branded short-link or QR target instead of a plain wa.me URL,
 * substitute it here. `lib/leads.ts` falls back to `wa.me` when this
 * is the placeholder.
 */
export const TODO_WHATSAPP_LINK = "TODO_WHATSAPP_LINK";

/* ── Support channels ────────────────────────────────────────────── */

/**
 * Channels the OMEGA team accepts inbound enquiries on. Order is
 * the priority order the website surfaces them in (WhatsApp first
 * for UAE expectations).
 *
 * `as const` gives every consumer a literal string-union type so
 * forms, validators, and the lead payload all share one taxonomy.
 */
export const SUPPORT_CHANNELS = ["WhatsApp", "Phone", "Email"] as const;
export type SupportChannel = (typeof SUPPORT_CHANNELS)[number];

/* ── Convenience config bundle ───────────────────────────────────── */

/**
 * Single bundled object — useful for callers that want a single
 * import (e.g. a future React context provider, server-side render
 * pass, or admin-dashboard config viewer). Everything is also
 * exported individually above so tree-shaking still works for the
 * common case.
 */
export const OMEGA_CONFIG = {
  companyName: COMPANY_NAME,
  country: COUNTRY_NAME,
  countryCode: COUNTRY_CODE,

  // Routes
  homeRoute: ROUTES.home,
  serviceHubRoute: ROUTES.serviceHub,
  diagnosisRoute: ROUTES.diagnosis,
  contactRoute: ROUTES.contact,
  studioRoute: ROUTES.studio,

  // Contact placeholders
  contactPhone: TODO_PHONE,
  defaultEmail: TODO_EMAIL,
  defaultWhatsAppNumber: TODO_WHATSAPP_NUMBER,
  defaultWhatsAppLink: TODO_WHATSAPP_LINK,

  // Channels
  supportChannels: SUPPORT_CHANNELS,
} as const;

export type OmegaConfig = typeof OMEGA_CONFIG;
