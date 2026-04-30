"use client";

import dynamic from "next/dynamic";

/**
 * Lazy wrapper for `<HeroJourney />`.
 *
 * Why this exists:
 *   `<HeroJourney />` is the GLB-driven 3D hero overlay. Its
 *   dependency graph pulls in `@react-three/fiber`, `@react-three/drei`,
 *   `three`, and `gsap` + `gsap/ScrollTrigger`. That graph is several
 *   hundred KB of JavaScript that would otherwise ship in the initial
 *   homepage bundle for every visitor, including mobile and reduced-
 *   motion users — both of whom are immediately bounced by HeroJourney's
 *   own gating logic (the component returns `null` on tablet, mobile,
 *   or `prefers-reduced-motion`).
 *
 * What this does:
 *   `next/dynamic({ ssr: false })` produces a client-only chunk that
 *   the browser only fetches *after* the initial bundle has parsed.
 *   On mobile / tablet / reduced-motion the component returns null
 *   without the heavy chunk ever being requested. On desktop with
 *   normal motion the chunk loads in the background and the GLB
 *   journey hydrates when it's ready — hero text + first viewport
 *   render with zero blocking dependence on Three.js.
 *
 * Why we can't dynamic-import directly inside `app/page.tsx`:
 *   `app/page.tsx` is a Server Component. Next.js 16 disallows
 *   `dynamic({ ssr: false })` inside Server Components. Wrapping in
 *   this thin "use client" module is the canonical workaround — it
 *   keeps the page itself static while moving the heavy chunk to a
 *   separate fetch.
 *
 * Loading behaviour:
 *   - `loading: () => null` — no placeholder; the page renders
 *     immediately. The static `OmegaMark` fallback inside `<Hero />`
 *     occupies the right column until the GLB takes over (or
 *     forever, on mobile / reduced-motion).
 *   - The GLB hero never blocks the LCP element — the LCP is the
 *     hero headline, which is in the server-rendered `<Hero />`.
 */
export const HeroJourneyLazy = dynamic(
  () => import("./HeroJourney").then((mod) => mod.HeroJourney),
  {
    ssr: false,
    loading: () => null,
  }
);
