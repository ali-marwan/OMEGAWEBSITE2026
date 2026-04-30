/**
 * `/contact` — data layer for the OMEGA contact / Speak to Our Team
 * page.
 *
 * Single source of truth for the route cards, the form's option
 * vocabularies, and the direct-contact placeholder values. The
 * `ContactSubmission` type mirrors the eventual backend / CRM /
 * WhatsApp Business payload — frontend-only for now, but the shape
 * is ready to ship.
 *
 * Placeholder discipline: nothing in this file invents a real phone
 * number, email, or WhatsApp link. Every contact value is a clearly
 * named TODO constant so the operations team can swap in production
 * details in one place when ready.
 */

/* ── Stable codes shared with the future router / CRM ────────────── */

/**
 * Stable codes for the three "where does this enquiry land?" cards
 * shown above the form. They double as analytics tags
 * (`data-action="<CODE>"`) and as a hint the form pre-fills the
 * matching enquiry-type when a user clicks one.
 */
export type ContactRouteCode =
  | "GENERAL_ENQUIRY"
  | "URGENT_ISSUE"
  | "TECHNICAL_RENOVATION";

/* ── Route cards (Section 02 of the page) ────────────────────────── */

export type ContactRoute = {
  code: ContactRouteCode;
  index: string;
  title: string;
  description: string;
  /** Pre-fills the form's enquiry-type when this card is clicked. */
  prefillEnquiry: EnquiryType;
};

export const contactRoutes: readonly ContactRoute[] = [
  {
    code: "GENERAL_ENQUIRY",
    index: "01",
    title: "General enquiry",
    description:
      "For service questions, quotations, and project discussions.",
    prefillEnquiry: "General enquiry",
  },
  {
    code: "URGENT_ISSUE",
    index: "02",
    title: "Urgent property issue",
    description:
      "For active leaks, AC issues, electrical faults, or urgent access coordination.",
    // Urgent issues map onto Home Services — the on-demand response
    // module that handles leaks / AC / electrical faults.
    prefillEnquiry: "Home Services",
  },
  {
    code: "TECHNICAL_RENOVATION",
    index: "03",
    title: "Technical / renovation enquiry",
    description:
      "For renovation, engineering review, authority, drawings, or fit-out discussions.",
    prefillEnquiry: "Renovation",
  },
] as const;

/* ── Form option vocabularies ────────────────────────────────────── */

export const propertyTypes = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Office",
  "Retail",
  "Restaurant / F&B",
  "Other",
] as const;
export type PropertyType = (typeof propertyTypes)[number];

/**
 * Enquiry types — the dropdown options on the main form. Maps 1:1
 * onto the OMEGA service modules plus a general fallback. When the
 * user picks a service, the form lifts the matching `serviceName` +
 * `serviceCode` (slug) into the canonical `Lead` so the backend /
 * mobile app can route on the stable taxonomy without re-parsing
 * label strings.
 */
export const enquiryTypes = [
  "Property Care System",
  "Home Services",
  "Property Health Report",
  "Renovation",
  "Engineering Solutions",
  "OMEGA AI / Diagnosis",
  "General enquiry",
] as const;
export type EnquiryType = (typeof enquiryTypes)[number];

/**
 * Map an enquiry-type label to the matching UPPERCASE service code
 * used as `LeadPayload.serviceCode`. Returns null for "General
 * enquiry" and the "OMEGA AI / Diagnosis" choice (which maps to a
 * different actionType, not a service code).
 *
 * Mobile-app alignment: the values match `SERVICE_CODES` in
 * `lib/services.ts` so the lead can flow through CRM and into the
 * mobile app's service router without taxonomy translation.
 */
export const enquiryTypeToServiceCode: Record<EnquiryType, string | null> = {
  "Property Care System": "PROPERTY_CARE_SYSTEM",
  "Home Services": "HOME_SERVICES",
  "Property Health Report": "PROPERTY_HEALTH_REPORT",
  Renovation: "RENOVATION",
  "Engineering Solutions": "ENGINEERING_SOLUTIONS",
  "OMEGA AI / Diagnosis": null,
  "General enquiry": null,
};

export const contactMethods = ["WhatsApp", "Call", "Email"] as const;
export type ContactMethod = (typeof contactMethods)[number];

/* ── Submission shape (backend / CRM / WhatsApp payload) ─────────── */

export type ContactSubmission = {
  fullName: string;
  phone: string;
  email: string;
  propertyType: PropertyType | null;
  location: string;
  enquiryType: EnquiryType | null;
  description: string;
  preferredContact: ContactMethod | null;
  /** File names only — no upload happens yet. */
  uploadedAttachmentNames: string[];
};

export const initialContactSubmission: ContactSubmission = {
  fullName: "",
  phone: "",
  email: "",
  propertyType: null,
  location: "",
  enquiryType: null,
  description: "",
  preferredContact: null,
  uploadedAttachmentNames: [],
};

/* ── Direct-contact placeholders (re-exported from omegaConfig) ──── */

/**
 * Operational contact values. These re-export the env-driven
 * constants from `lib/omegaConfig.ts` — the single source of truth
 * for all placeholder/contact data on the site.
 *
 * Earlier versions of this module hardcoded their own literal
 * "TODO_PHONE" / "TODO_EMAIL" / "TODO_WHATSAPP_LINK" strings, which
 * bypassed the env-var resolution in omegaConfig. Re-exporting keeps
 * existing `import { TODO_* } from "@/lib/contact"` callers working
 * while ensuring they get the env-driven values.
 */
export {
  TODO_PHONE,
  TODO_EMAIL,
  TODO_WHATSAPP_LINK,
  TODO_WHATSAPP_NUMBER,
} from "./omegaConfig";

import {
  TODO_PHONE as _TODO_PHONE,
  TODO_EMAIL as _TODO_EMAIL,
  TODO_WHATSAPP_LINK as _TODO_WHATSAPP_LINK,
} from "./omegaConfig";

/**
 * Convenience builders so every consumer renders the same href
 * structure. The mailto:/tel: prefixes mean a future swap to real
 * values doesn't require touching the rendering components.
 */
export const phoneHref = (phone: string = _TODO_PHONE) => `tel:${phone}`;
export const emailHref = (email: string = _TODO_EMAIL) => `mailto:${email}`;
/** WhatsApp link — frontend-only; the placeholder href is intentionally non-functional. */
export const whatsappHref = (link: string = _TODO_WHATSAPP_LINK) => link;

/* ── Configuration detection ─────────────────────────────────────── */

/**
 * Returns `true` when a contact value has been swapped from its
 * placeholder string to a real configured value (i.e. the env var
 * has been set, or the operations team has substituted the
 * fallback). Components use this to gracefully render
 * "To be added before launch" labels for unconfigured channels.
 */
export function isContactConfigured(value: string): boolean {
  if (!value) return false;
  // Reject values that still match the literal TODO_* placeholder.
  if (value.startsWith("TODO_")) return false;
  return true;
}

/* ── Page-level constants ────────────────────────────────────────── */

/** UAE coverage label — surfaces in the direct-contact panel. */
export const UAE_COVERAGE = "United Arab Emirates";

/** Response note shown in the direct-contact panel. */
export const URGENT_RESPONSE_NOTE =
  "For urgent property risks, contact the team directly.";
