/**
 * OMEGA — canonical lead-capture data layer.
 *
 * Single source of truth for every form submission across the site
 * (`/contact`, `/diagnosis`, `/service-hub/[slug]` action centre).
 * The `LeadPayload` shape matches the structure the future backend /
 * CRM / mobile app will ingest, so wiring it up later is a
 * one-place change in `submitLead`.
 *
 * Frontend-only for now: `submitLead` validates, logs in
 * development, and returns a mocked success response. No network
 * calls, no third-party SDKs. The function is structured so the
 * body can later swap to:
 *   - `fetch('/api/leads', ...)` for a Next.js API route
 *   - Supabase / Firebase client insert
 *   - CRM webhook
 *   - WhatsApp Business notification
 *   - Email notification (Resend / Mailgun)
 *
 * Mobile-app alignment: `LeadPayload` maps 1:1 onto the eventual
 * mobile app's `Lead` model (Swift / Kotlin record). Action codes
 * use the same UPPERCASE taxonomy the app's analytics + router
 * consume, and `id` + `status` + `createdAt` mean a lead can round-
 * trip through the CRM unchanged.
 */

import {
  TODO_WHATSAPP_NUMBER,
  TODO_WHATSAPP_LINK,
  type SupportChannel,
} from "./omegaConfig";

/* ── Action taxonomy ─────────────────────────────────────────────── */

/**
 * Stable UPPERCASE action codes — match the eventual app/CRM router.
 * Adding a new action here is the only place you have to touch;
 * every form uses one of these strings.
 *
 * Mobile-app alignment:
 *   SERVICE_REQUEST   → ServiceRequest sheet
 *   START_DIAGNOSIS   → Diagnosis flow
 *   CONTACT_TEAM      → ContactEnquiry screen
 *   GENERAL_ENQUIRY   → ContactEnquiry screen (no service scope)
 */
export type LeadActionType =
  | "SERVICE_REQUEST"
  | "START_DIAGNOSIS"
  | "CONTACT_TEAM"
  | "GENERAL_ENQUIRY";

/**
 * Lifecycle status. Web only ever produces `DRAFT` (work in
 * progress) or `SUBMITTED` (the user pressed submit). The CRM /
 * admin dashboard transitions to `REVIEW_PENDING` after triage.
 */
export type LeadStatus = "DRAFT" | "SUBMITTED" | "REVIEW_PENDING";

/**
 * Canonical contact-method taxonomy. Sub-set of `SupportChannel`
 * (WhatsApp / Phone / Email) — but the form uses the user-facing
 * label "Call" rather than the institutional "Phone".
 */
export type LeadContactMethod = "WhatsApp" | "Call" | "Email";

/* ── Canonical shape ─────────────────────────────────────────────── */

/**
 * Every form submission produces an object of this shape. Optional
 * fields are explicitly nullable / undefined-safe so a backend can
 * tell "not asked" from "asked but skipped" later.
 *
 * Mobile-app alignment: this is the exact `Lead` model the app and
 * CRM both ingest. Field names match the brief's spec verbatim so
 * the contract is unambiguous.
 */
export type LeadPayload = {
  /** UUID generated client-side. Stable across the lead's lifetime. */
  id: string;
  /** Always "website" today. Mobile app will set this differently. */
  source: "website" | "mobile_app" | "admin";
  /** Pathname the lead was submitted from (e.g. `/diagnosis`). */
  route: string;
  /** Stable action taxonomy. */
  actionType: LeadActionType;
  /** Service module the lead is about, when applicable. */
  serviceName?: string | null;
  /** Stable service code (UPPERCASE), e.g. `HOME_SERVICES`. */
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
  /** Optional link to a `DiagnosisSession.id` when the lead came from /diagnosis. */
  diagnosisSessionId?: string | null;
  /** ISO timestamp at the moment of build. */
  createdAt: string;
  /** Lifecycle status. Web sets DRAFT → SUBMITTED on submit. */
  status: LeadStatus;
  /**
   * Free-form metadata bag — used by diagnosis to tag urgency /
   * issue category etc. without inflating the top-level shape.
   * Backend treats this as a JSON column.
   */
  extra?: Record<string, unknown>;
};

/**
 * Backwards-compatibility alias. Older code that imported `Lead`
 * keeps working; new code should prefer the explicit `LeadPayload`
 * name (matches the brief).
 */
export type Lead = LeadPayload;

/* ── ID generation ───────────────────────────────────────────────── */

/**
 * Browser-safe UUID generator. `crypto.randomUUID` is available in
 * every modern browser and on Node 19+, but we fall back to a
 * timestamp + random suffix for older runtimes (e.g. some test
 * environments) so the call site never crashes.
 */
function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof (crypto as Crypto & { randomUUID?: () => string }).randomUUID ===
      "function"
  ) {
    return (crypto as Crypto & { randomUUID: () => string }).randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ── Builders ────────────────────────────────────────────────────── */

/**
 * Build a canonical `LeadPayload` from a form's local state. Pure
 * function — no side effects, no validation. Validation happens
 * separately via `validateLead` so callers can show inline errors
 * before submitting.
 *
 * Defaults:
 *   - `source` defaults to "website"
 *   - `id` is generated client-side
 *   - `createdAt` is the current ISO timestamp
 *   - `status` defaults to "DRAFT" — `submitLead` flips it to
 *     "SUBMITTED" on successful submission
 *   - `uploadedFiles` defaults to `[]`
 */
export function buildLead(
  input: Omit<
    LeadPayload,
    "source" | "id" | "createdAt" | "uploadedFiles" | "status"
  > & {
    source?: LeadPayload["source"];
    id?: string;
    createdAt?: string;
    uploadedFiles?: string[];
    status?: LeadStatus;
  }
): LeadPayload {
  return {
    source: input.source ?? "website",
    id: input.id ?? generateId(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    uploadedFiles: input.uploadedFiles ?? [],
    status: input.status ?? "DRAFT",
    ...input,
  };
}

/**
 * Submit a lead. Frontend-only today: validates, logs in
 * development via `console.info`, and returns a mocked success
 * response. When the backend lands, swap the body — every form on
 * the site routes through here, so the change is one-place.
 *
 * Returns a discriminated union so callers can branch on the
 * `ok` flag exactly the same way they will once a real API exists.
 *
 * Future swap points (each is a single-line change):
 *
 *   ```ts
 *   // 1. Next.js API route
 *   const res = await fetch('/api/leads', { method: 'POST', body: JSON.stringify(submitted) });
 *
 *   // 2. Supabase
 *   const { error } = await supabase.from('leads').insert(submitted);
 *
 *   // 3. CRM webhook (e.g. HubSpot)
 *   await fetch(CRM_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(submitted) });
 *
 *   // 4. WhatsApp Business notification
 *   await fetch(WA_BUSINESS_API, { method: 'POST', body: JSON.stringify(formatForWhatsApp(submitted)) });
 *
 *   // 5. Email notification (Resend / Mailgun)
 *   await resend.emails.send({ to: OPS_EMAIL, subject: ..., react: <LeadEmail lead={submitted} /> });
 *   ```
 */
export async function submitLead(
  lead: LeadPayload
): Promise<
  | { ok: true; lead: LeadPayload }
  | { ok: false; lead: LeadPayload; errors: LeadErrors }
> {
  // Validate first — never log invalid data, never count it as
  // submitted. Backend will revalidate but this catches obvious
  // shape problems before we tell the user it succeeded.
  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return { ok: false, lead, errors };
  }

  // Promote DRAFT → SUBMITTED. The CRM transitions to REVIEW_PENDING
  // after triage; web never sets that value.
  const submitted: LeadPayload = { ...lead, status: "SUBMITTED" };

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info("[OMEGA Lead]", submitted);
  }

  // TODO(backend): replace this stub with a real persistence call.
  // The function is async so callers (forms) can `await` it without
  // a refactor when the swap happens.
  await Promise.resolve();

  return { ok: true, lead: submitted };
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
  serviceCode: string;
  preferredContactMethod: string;
  enquiryType: string;
}>;

/**
 * Pure validator. Rules per the brief:
 *   - Full name required for service / contact forms (any non-DIAGNOSIS action)
 *   - Phone or email required — at least one of the two
 *   - Email, when provided, must look like an email
 *   - Message required for general enquiries / contact_team
 *   - Service code required for service requests
 *
 * Returns the same `LeadErrors` shape regardless of action type so
 * the UI can render errors with one map.
 */
export function validateLead(
  lead: Pick<
    LeadPayload,
    | "actionType"
    | "fullName"
    | "phone"
    | "email"
    | "message"
    | "serviceName"
    | "serviceCode"
    | "preferredContactMethod"
  >
): LeadErrors {
  const errors: LeadErrors = {};
  const fullName = (lead.fullName ?? "").trim();
  const phone = (lead.phone ?? "").trim();
  const email = (lead.email ?? "").trim();
  const message = (lead.message ?? "").trim();

  // Full name is required for everything except a pure diagnosis
  // intake (the diagnosis flow doesn't ask for the user's name
  // until the result step where contact info is optional).
  if (lead.actionType !== "START_DIAGNOSIS" && fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  // Phone or email is required for everything except diagnosis
  // (which currently captures contact via the result panel only).
  if (lead.actionType !== "START_DIAGNOSIS") {
    if (!phone && !email) {
      errors.phone = "Phone or email is required.";
      errors.email = "Phone or email is required.";
    } else if (email && !isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // Message required for general enquiry / contact_team — those are
  // the cases where the form is the only signal of intent.
  if (
    (lead.actionType === "GENERAL_ENQUIRY" ||
      lead.actionType === "CONTACT_TEAM") &&
    message.length < 4
  ) {
    errors.message = "Please describe your enquiry.";
  }

  // Service code required for service requests — without it the
  // backend has no route to dispatch on.
  if (
    lead.actionType === "SERVICE_REQUEST" &&
    !lead.serviceCode &&
    !lead.serviceName
  ) {
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
 * Re-export from `omegaConfig` for convenience. Keep one
 * authoritative copy — `omegaConfig.ts` — and let consumers import
 * from either module without confusion.
 */
export { TODO_WHATSAPP_NUMBER, TODO_WHATSAPP_LINK };
/**
 * @deprecated — use `TODO_WHATSAPP_NUMBER` from `lib/omegaConfig`.
 * Kept for back-compat with any imports that already reach into
 * this module.
 */
export const OMEGA_WHATSAPP_NUMBER = TODO_WHATSAPP_NUMBER;

/**
 * Returns `true` when the WhatsApp channel has a real configured
 * value (env-set number or branded link override). Components use
 * this to gate "Continue on WhatsApp" affordances — when WhatsApp
 * isn't configured, the button is hidden entirely so users never
 * click into a broken `wa.me/TODO_WHATSAPP_NUMBER` URL.
 *
 * Configuration sources (any one is enough):
 *   - `NEXT_PUBLIC_WHATSAPP_NUMBER` is set to a real E.164 number
 *   - `NEXT_PUBLIC_WHATSAPP_LINK` is set to a real URL override
 */
export function isWhatsAppConfigured(): boolean {
  const numberConfigured =
    !!TODO_WHATSAPP_NUMBER && TODO_WHATSAPP_NUMBER !== "TODO_WHATSAPP_NUMBER";
  const linkConfigured =
    !!TODO_WHATSAPP_LINK && TODO_WHATSAPP_LINK !== "TODO_WHATSAPP_LINK";
  return numberConfigured || linkConfigured;
}

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
 * Returns a string usable as an `<a href>`. If the WhatsApp number
 * is still the placeholder, the URL is intentionally non-functional
 * — the visible href surfaces the placeholder so the QA team sees
 * the gap. Callers should use `isWhatsAppConfigured()` to gate
 * rendering of WhatsApp-specific UI before invoking this.
 *
 * If `TODO_WHATSAPP_LINK` has been swapped to a real link override
 * (e.g. a branded short-link), that takes priority over the wa.me
 * URL.
 */
export function buildWhatsAppLink(lead: LeadPayload): string {
  const lines: string[] = [];
  lines.push("Hello OMEGA team,");
  if (lead.fullName) lines.push(`This is ${lead.fullName}.`);
  if (lead.serviceName) lines.push(`Service interest: ${lead.serviceName}`);
  if (lead.propertyType) lines.push(`Property type: ${lead.propertyType}`);
  if (lead.location) lines.push(`Location: ${lead.location}`);
  if (lead.message) lines.push("", lead.message);
  lines.push("", `(Sent via OMEGA website · ${lead.route})`);

  const text = lines.join("\n");

  // Prefer a branded link override if the operations team has
  // configured one. Otherwise build a wa.me URL.
  if (TODO_WHATSAPP_LINK !== "TODO_WHATSAPP_LINK") {
    return `${TODO_WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${TODO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ── Type re-exports for convenience ─────────────────────────────── */

export type { SupportChannel };
