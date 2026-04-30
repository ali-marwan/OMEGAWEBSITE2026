/**
 * OMEGA — canonical lead-capture data layer.
 *
 * Single source of truth for every form submission across the site
 * (`/contact`, `/diagnosis`, `/service-hub/[slug]` action centre).
 * The `Lead` shape matches the structure the future backend / CRM /
 * mobile app will ingest, so wiring it up later is a one-place
 * change in `submitLead`.
 *
 * Frontend-only for now: `submitLead` just logs the canonical object
 * and returns it. No network calls, no third-party SDKs. Calling it
 * from any form keeps the data shape stable while we iterate on the
 * UI.
 *
 * Module exports:
 *   - `Lead`, `LeadActionType`, `LeadContactMethod` — types
 *   - `buildLead` — pure helper that assembles a canonical lead from
 *     a form's local state without side effects
 *   - `submitLead` — async wrapper that logs (and later POSTs) the
 *     lead and returns it for callers that want to chain UI state
 *   - `OMEGA_WHATSAPP_NUMBER` — configurable placeholder; substitute
 *     a real E.164 number once operations confirms
 *   - `buildWhatsAppLink` — produces a wa.me deep link with the
 *     lead's identity + service + property pre-filled in the message
 *   - `validateLead` — pure validator, returns a per-field error map
 */

/* ── Action taxonomy ─────────────────────────────────────────────── */

/**
 * Stable action codes — match the eventual app/CRM router. Adding a
 * new action here is the only place you have to touch; every form
 * uses one of these strings.
 */
export type LeadActionType =
  | "service_request"
  | "diagnosis"
  | "contact_team"
  | "general_enquiry";

export type LeadContactMethod = "WhatsApp" | "Call" | "Email";

/* ── Canonical shape ─────────────────────────────────────────────── */

/**
 * Every form submission produces an object of this shape. Optional
 * fields are explicitly nullable / undefined-safe so a backend can
 * tell "not asked" from "asked but skipped" later.
 */
export type Lead = {
  /** Always "website" today. Mobile app will set this differently. */
  source: "website";
  /** Pathname the lead was submitted from (e.g. `/diagnosis`). */
  route: string;
  /** Stable action taxonomy. */
  actionType: LeadActionType;
  /** Service module the lead is about, when applicable. */
  serviceName?: string | null;
  /** Stable service slug (e.g. `home-services`). */
  serviceCode?: string | null;
  fullName?: string;
  phone?: string;
  email?: string;
  propertyType?: string | null;
  location?: string;
  message?: string;
  preferredContactMethod?: LeadContactMethod | null;
  /**
   * File names attached to the form (frontend-only — the real File
   * objects are not serialised here). Empty array if none.
   */
  uploadedFiles: string[];
  /** ISO timestamp at the moment of build. */
  createdAt: string;
  /**
   * Free-form metadata bag — used by diagnosis to tag urgency /
   * issue category etc. without inflating the top-level shape.
   * Backend treats this as a JSON column.
   */
  extra?: Record<string, unknown>;
};

/* ── Builders ────────────────────────────────────────────────────── */

/**
 * Build a canonical `Lead` from a form's local state. Pure function
 * — no side effects, no validation. Validation happens separately
 * via `validateLead` so callers can show inline errors before
 * submitting.
 */
export function buildLead(
  input: Omit<Lead, "source" | "createdAt" | "uploadedFiles"> & {
    uploadedFiles?: string[];
  }
): Lead {
  return {
    source: "website",
    createdAt: new Date().toISOString(),
    uploadedFiles: input.uploadedFiles ?? [],
    ...input,
  };
}

/**
 * Submit a lead. Frontend-only today: logs the canonical object via
 * `console.info` and returns it so callers can chain UI state. When
 * the backend lands, swap the body for a `fetch('/api/leads', ...)`
 * call — every form on the site routes through here, so the change
 * is one-place.
 *
 * Returns `{ ok: boolean, lead: Lead }` so callers can handle the
 * "request failed" branch the same way they will once a real API
 * exists.
 */
export async function submitLead(
  lead: Lead
): Promise<{ ok: boolean; lead: Lead }> {
  // eslint-disable-next-line no-console
  console.info("[OMEGA Lead]", lead);
  return { ok: true, lead };
}

/* ── Validation ──────────────────────────────────────────────────── */

/**
 * Per-field error map. Keys are the form field names; values are the
 * error message to display, or null/undefined when the field is
 * valid. Use with a touched-set so errors only show after the user
 * has interacted with that field.
 */
export type LeadErrors = Partial<{
  fullName: string;
  phone: string;
  email: string;
  message: string;
  serviceName: string;
  preferredContactMethod: string;
  enquiryType: string;
}>;

/**
 * Pure validator. Rules per the brief:
 *   - Full name required (non-empty after trim)
 *   - Phone or email required — at least one of the two
 *   - Email, when provided, must look like an email
 *   - Message required for general enquiries
 *   - Service name required for service requests
 *
 * Returns the same `LeadErrors` shape regardless of action type so
 * the UI can render errors with one map.
 */
export function validateLead(
  lead: Pick<
    Lead,
    | "actionType"
    | "fullName"
    | "phone"
    | "email"
    | "message"
    | "serviceName"
    | "preferredContactMethod"
  >
): LeadErrors {
  const errors: LeadErrors = {};
  const fullName = (lead.fullName ?? "").trim();
  const phone = (lead.phone ?? "").trim();
  const email = (lead.email ?? "").trim();
  const message = (lead.message ?? "").trim();

  if (fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!phone && !email) {
    errors.phone = "Phone or email is required.";
    errors.email = "Phone or email is required.";
  } else if (email && !isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (lead.actionType === "general_enquiry" && message.length < 4) {
    errors.message = "Please describe your enquiry.";
  }

  if (lead.actionType === "service_request" && !lead.serviceName) {
    errors.serviceName = "Please pick a service.";
  }

  return errors;
}

/** Lightweight email shape check — not a full RFC validator. */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ── WhatsApp deep link ──────────────────────────────────────────── */

/**
 * Operational WhatsApp number — placeholder. Substitute the real
 * E.164 number (e.g. `971501234567`, no plus sign, digits only) once
 * operations confirms. Centralising here means every form, footer,
 * and dock points at the same destination after the swap.
 */
export const OMEGA_WHATSAPP_NUMBER = "TODO_WHATSAPP_NUMBER";

/**
 * Build a `wa.me` deep link with the lead pre-filled in the message
 * body. The pre-fill includes:
 *
 *   - Client name (when provided)
 *   - Selected service (when applicable)
 *   - Property type (when provided)
 *   - Location (when provided)
 *   - Short message (when provided)
 *   - Source page
 *
 * Returns a string usable as an `<a href>`. If
 * `OMEGA_WHATSAPP_NUMBER` is still the placeholder, the URL is
 * intentionally non-functional — the visible href surfaces the
 * placeholder so the QA team sees the gap.
 */
export function buildWhatsAppLink(lead: Lead): string {
  const lines: string[] = [];
  lines.push("Hello OMEGA team,");
  if (lead.fullName) lines.push(`This is ${lead.fullName}.`);
  if (lead.serviceName) lines.push(`Service interest: ${lead.serviceName}`);
  if (lead.propertyType) lines.push(`Property type: ${lead.propertyType}`);
  if (lead.location) lines.push(`Location: ${lead.location}`);
  if (lead.message) lines.push("", lead.message);
  lines.push("", `(Sent via OMEGA website · ${lead.route})`);

  const text = lines.join("\n");
  return `https://wa.me/${OMEGA_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
