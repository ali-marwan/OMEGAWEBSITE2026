/**
 * OMEGA — central action routing map.
 *
 * Every CTA across the site (header, hero, dock, footer, service
 * cards, embedded action centre) maps a stable `ActionCode` onto a
 * route. Components import the code instead of hard-coding the
 * route string, so renaming a route is a one-place change.
 *
 * The codes also double as analytics tags (`data-action="<CODE>"`)
 * and as the contract the future mobile app router will consume —
 * one taxonomy across web + native + CRM.
 *
 * Sentinel `EMBEDDED` indicates the action is handled in-page (e.g.
 * the action centre tabs on a service detail page) rather than as
 * a route navigation. Components that surface `REQUEST_SERVICE`
 * already know to scroll to the embedded form rather than navigate.
 */

import { ROUTES } from "./omegaConfig";

/* ── Action codes ────────────────────────────────────────────────── */

/**
 * Primary CTAs the website + mobile app share. Adding a new action
 * is a one-place change here; every consumer reads the code, never
 * the literal route.
 *
 * Mobile-app alignment: each code maps onto a screen / flow:
 *   OPEN_SERVICE_HUB     → ServiceHub screen
 *   START_DIAGNOSIS      → Diagnosis flow (multi-step wizard)
 *   CONTACT_TEAM         → ContactEnquiry screen
 *   REQUEST_SERVICE      → ServiceRequest sheet (in-context)
 *   BACK_TO_SERVICE_HUB  → pop to ServiceHub
 *   VIEW_DETAILS         → ServiceDetail screen
 */
export const ACTION_CODES = [
  "OPEN_SERVICE_HUB",
  "START_DIAGNOSIS",
  "CONTACT_TEAM",
  "REQUEST_SERVICE",
  "BACK_TO_SERVICE_HUB",
  "VIEW_DETAILS",
] as const;

export type ActionCode = (typeof ACTION_CODES)[number];

/* ── Action labels (visible CTA copy) ────────────────────────────── */

/**
 * The standardised CTA label per action code. Components SHOULD
 * read these instead of hard-coding label strings, so the brand
 * voice stays consistent and any future copy change is one-place.
 *
 * Use sparingly — some buttons need contextual variants (e.g.
 * "View Suggested Service" on the diagnosis result card). The map
 * covers the canonical default; contextual overrides are still
 * fine where needed.
 */
export const ACTION_LABELS: Record<ActionCode, string> = {
  OPEN_SERVICE_HUB: "Open Service Hub",
  START_DIAGNOSIS: "Start Diagnosis",
  CONTACT_TEAM: "Speak to Team",
  REQUEST_SERVICE: "Request Service",
  BACK_TO_SERVICE_HUB: "Back to Service Hub",
  VIEW_DETAILS: "View Details",
};

/* ── Route resolution ────────────────────────────────────────────── */

/**
 * Sentinel route value indicating an action stays on the current
 * page (e.g. opens an inline form, scrolls to an action-centre tab,
 * triggers a modal). Components that surface an `EMBEDDED` action
 * are responsible for handling it in-page.
 */
export const EMBEDDED = "EMBEDDED" as const;

/**
 * Map every action code onto the route a real navigation should
 * land on. `EMBEDDED` actions resolve in-page and never navigate.
 */
export const ACTION_ROUTES: Record<ActionCode, string> = {
  OPEN_SERVICE_HUB: ROUTES.serviceHub,
  START_DIAGNOSIS: ROUTES.diagnosis,
  CONTACT_TEAM: ROUTES.contact,
  REQUEST_SERVICE: EMBEDDED,
  BACK_TO_SERVICE_HUB: ROUTES.serviceHub,
  VIEW_DETAILS: EMBEDDED,
};

/**
 * Helper — resolve a route for a given action. Returns null when
 * the action is `EMBEDDED` (callers should handle that locally).
 */
export function resolveActionRoute(code: ActionCode): string | null {
  const target = ACTION_ROUTES[code];
  return target === EMBEDDED ? null : target;
}
