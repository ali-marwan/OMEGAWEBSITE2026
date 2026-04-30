/**
 * OMEGA AI Property Diagnostics — data layer.
 *
 * Single source of truth for the `/diagnosis` flow. The route page,
 * the hero, the stepper, every step form, the live summary panel, and
 * the suggested-path result panel all read from this file. There is no
 * hardcoded copy in the diagnosis components beyond layout chrome.
 *
 * Design intent:
 *   - Frontend-only for now. Every type is structured so a future
 *     backend / AI API / CRM / mobile app can ingest the same
 *     `DiagnosisSession` object without taxonomy translation.
 *   - The router (`deriveSuggestedRoute`) encodes the brief's
 *     business rules in one readable function. New rules get added
 *     here, never sprinkled across the UI.
 *   - Every option list is exposed as a frozen tuple so the step
 *     components can iterate without duplicating copy.
 *
 * Routing logic (per the brief):
 *   - critical urgency                      → Speak to Team
 *   - recurring issue or multi-system fault → OMEGA Property Care
 *   - AC / plumbing / electrical            → OMEGA Home Services
 *   - civil / finishes                      → OMEGA Home Services
 *   - renovation / upgrades                 → OMEGA Renovation
 *   - inspection / unknown / buying         → OMEGA Property Health
 *   - drawings / authority / engineering    → OMEGA Engineering
 *   - default fallback                      → DIY Guidance
 */

/* ── Option vocabularies ─────────────────────────────────────────── */

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

export const issueCategories = [
  "AC / Cooling",
  "Plumbing / Leakage",
  "Electrical",
  "Civil / Finishes",
  "Renovation",
  "Inspection / Health Report",
  "Authority / Engineering",
  "Not Sure",
] as const;
export type IssueCategory = (typeof issueCategories)[number];

export const urgencyLevels = ["Normal", "Urgent", "Critical"] as const;
export type Urgency = (typeof urgencyLevels)[number];

export const yesNoOptions = ["Yes", "No"] as const;
export type YesNo = (typeof yesNoOptions)[number];

/**
 * The seven possible OMEGA paths the router can suggest.
 * Order matches the brief.
 */
export const suggestedRoutes = [
  "DIY Guidance",
  "OMEGA Home Services",
  "OMEGA Property Care System",
  "OMEGA Property Health Report",
  "OMEGA Renovation",
  "OMEGA Engineering Solutions",
  "Speak to Team",
] as const;
export type SuggestedRoute = (typeof suggestedRoutes)[number];

/* ── Step model ──────────────────────────────────────────────────── */

export const stepCodes = [
  "PROPERTY_TYPE",
  "ISSUE_CATEGORY",
  "ISSUE_DESCRIPTION",
  "PROPERTY_CONTEXT",
  "SUGGESTED_PATH",
] as const;
export type StepCode = (typeof stepCodes)[number];

export type StepDef = {
  /** Stable code shared with backend / app router. */
  code: StepCode;
  /** "01", "02", ... — used by stepper + summary chips. */
  index: string;
  /** Short label shown in the stepper rail. */
  label: string;
  /** Headline question rendered above the form fields. */
  question: string;
  /** Optional one-line subhelper under the headline. */
  helper?: string;
};

export const diagnosisSteps: readonly StepDef[] = [
  {
    code: "PROPERTY_TYPE",
    index: "01",
    label: "Property Type",
    question: "What type of property is this?",
    helper:
      "Choose the property type so OMEGA can understand access, common systems, and service scope.",
  },
  {
    code: "ISSUE_CATEGORY",
    index: "02",
    label: "Issue Category",
    question: "What area needs attention?",
    helper:
      "Select the closest issue area. If unclear, choose 'Not Sure' and OMEGA AI will route it based on your description.",
  },
  {
    code: "ISSUE_DESCRIPTION",
    index: "03",
    label: "Issue Description",
    question: "Describe what is happening.",
    helper:
      "Describe what you see. Photos help OMEGA understand visible symptoms before site review.",
  },
  {
    code: "PROPERTY_CONTEXT",
    index: "04",
    label: "Property Context",
    question: "What helps us understand the issue?",
    helper:
      "Add context that affects routing — recurrence, access, affected areas, and risk signals.",
  },
  {
    code: "SUGGESTED_PATH",
    index: "05",
    label: "Suggested Route",
    question: "Suggested OMEGA Route",
    helper:
      "OMEGA AI suggests the most relevant next route. Final scope is confirmed by the OMEGA team where required.",
  },
] as const;

/* ── Session shape (the object backend / AI API / CRM will see) ──── */

/**
 * Lifecycle status for a diagnosis session. Web sets:
 *   IN_PROGRESS         → user is filling out the multi-step flow
 *   COMPLETED           → user reached step 5 (Suggested Route) but
 *                         hasn't pressed submit yet
 *   SUBMITTED_TO_OMEGA  → user pressed submit; a Lead has been
 *                         emitted and the session is closed
 *
 * Mobile-app alignment: the same three values drive the app's
 * DiagnosisSession state machine and the CRM's session-list view.
 */
export type DiagnosisSessionStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SUBMITTED_TO_OMEGA";

/**
 * Mobile-app alignment: this `DiagnosisSession` matches the
 * eventual app's `DiagnosisSession` model. `id` is generated
 * client-side (uuid) so the same object can round-trip through the
 * CRM and link back to the `LeadPayload` it produced via
 * `Lead.diagnosisSessionId === DiagnosisSession.id`.
 */
export type DiagnosisSession = {
  /** UUID generated client-side. Stable across the session's lifetime. */
  id: string;
  propertyType: PropertyType | null;
  issueCategory: IssueCategory | null;
  description: string;
  /**
   * File names only — frontend-only placeholder. No upload happens
   * yet. The eventual app + backend will store File / Blob refs
   * with the same key name.
   */
  uploadedPhotos: string[];
  urgency: Urgency | null;
  location: string;
  recurringIssue: YesNo | null;
  accessAvailable: YesNo | null;
  affectedAreas: string;
  hasWaterLeakage: boolean;
  hasPowerIssue: boolean;
  hasACShutdown: boolean;
  /** Computed live by `deriveSuggestedRoute` — null until enough data. */
  suggestedRoute: SuggestedRoute | null;
  /** Computed by `deriveRecommendedAction` from the route. */
  recommendedAction: string | null;
  /** ISO timestamp at the moment the session was created. */
  createdAt: string;
  /** Lifecycle status — see `DiagnosisSessionStatus`. */
  status: DiagnosisSessionStatus;
};

/**
 * Browser-safe UUID generator — same shape as the helper inside
 * `lib/leads.ts`. Duplicated here so the diagnosis layer can stay
 * self-contained (no cross-module dep just for an id).
 */
function generateSessionId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof (crypto as Crypto & { randomUUID?: () => string }).randomUUID ===
      "function"
  ) {
    return (crypto as Crypto & { randomUUID: () => string }).randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Build a fresh diagnosis session with default values. Generates a
 * new id + createdAt every call, so each `<DiagnosisExperience />`
 * instance starts a distinct session.
 */
export function createDiagnosisSession(): DiagnosisSession {
  return {
    id: generateSessionId(),
    propertyType: null,
    issueCategory: null,
    description: "",
    uploadedPhotos: [],
    urgency: null,
    location: "",
    recurringIssue: null,
    accessAvailable: null,
    affectedAreas: "",
    hasWaterLeakage: false,
    hasPowerIssue: false,
    hasACShutdown: false,
    suggestedRoute: null,
    recommendedAction: null,
    createdAt: new Date().toISOString(),
    status: "IN_PROGRESS",
  };
}

/**
 * Initial / default session shape. Provided for callers that need a
 * stable reference (e.g. `useState` initial value). Calling
 * `createDiagnosisSession()` is the right move when starting a new
 * session for a real user — that path generates a fresh id +
 * timestamp every time.
 *
 * @deprecated Prefer `createDiagnosisSession()` for new sessions.
 *   Kept as a constant for back-compat with existing callers.
 */
export const initialDiagnosisSession: DiagnosisSession = {
  id: "",
  propertyType: null,
  issueCategory: null,
  description: "",
  uploadedPhotos: [],
  urgency: null,
  location: "",
  recurringIssue: null,
  accessAvailable: null,
  affectedAreas: "",
  hasWaterLeakage: false,
  hasPowerIssue: false,
  hasACShutdown: false,
  suggestedRoute: null,
  recommendedAction: null,
  createdAt: "",
  status: "IN_PROGRESS",
};

/* ── Routing logic ───────────────────────────────────────────────── */

/**
 * Map a partial diagnosis to an OMEGA path. Pure function — no side
 * effects — so the live summary panel can call it on every keystroke
 * without any orchestration cost.
 *
 * Priority order matters:
 *   1. Critical urgency overrides everything → human contact.
 *   2. Recurring or multi-system signals → Property Care (the
 *      structured ongoing programme is a better fit than a one-off
 *      visit when the property keeps misbehaving).
 *   3. Otherwise, the issue category drives the route.
 *   4. If category is missing entirely, return null (let the UI show
 *      "Pending — answer the next question" rather than a misleading
 *      DIY suggestion).
 */
export function deriveSuggestedRoute(
  s: Pick<
    DiagnosisSession,
    | "issueCategory"
    | "urgency"
    | "recurringIssue"
    | "hasWaterLeakage"
    | "hasPowerIssue"
    | "hasACShutdown"
  >
): SuggestedRoute | null {
  // 1. Critical urgency → always escalate.
  if (s.urgency === "Critical") return "Speak to Team";

  // 2. Recurring / multi-system → ongoing care plan.
  const crossSystemSignalCount = [
    s.hasWaterLeakage,
    s.hasPowerIssue,
    s.hasACShutdown,
  ].filter(Boolean).length;
  if (s.recurringIssue === "Yes" || crossSystemSignalCount >= 2) {
    return "OMEGA Property Care System";
  }

  // 3. Category-driven route.
  switch (s.issueCategory) {
    case "AC / Cooling":
    case "Plumbing / Leakage":
    case "Electrical":
    case "Civil / Finishes":
      return "OMEGA Home Services";
    case "Renovation":
      return "OMEGA Renovation";
    case "Inspection / Health Report":
      return "OMEGA Property Health Report";
    case "Authority / Engineering":
      return "OMEGA Engineering Solutions";
    case "Not Sure":
      return "OMEGA Property Health Report";
    case null:
      return null;
  }
}

/**
 * Short imperative sentence — what the user should do next once a
 * route is picked. Surfaced in the result panel and in the live
 * summary's "Recommended action" line.
 */
export function deriveRecommendedAction(
  route: SuggestedRoute | null
): string | null {
  if (!route) return null;
  switch (route) {
    case "DIY Guidance":
      return "Try basic self-checks before booking a service visit.";
    case "OMEGA Home Services":
      return "Arrange a technician visit — same-day or next-day where possible.";
    case "OMEGA Property Care System":
      return "Move recurring upkeep onto a structured care plan.";
    case "OMEGA Property Health Report":
      return "Commission a structured technical inspection of the property.";
    case "OMEGA Renovation":
      return "Open a controlled renovation conversation with the team.";
    case "OMEGA Engineering Solutions":
      return "Engage OMEGA's engineering team for review or approvals.";
    case "Speak to Team":
      return "Contact OMEGA directly so a specialist can review the situation.";
  }
}

/**
 * The OMEGA route's home — where the user goes when they pick "Open
 * the suggested service" on the result panel. Speak to Team and DIY
 * Guidance both resolve to existing site anchors so nothing 404s.
 */
export function suggestedRouteHref(route: SuggestedRoute): string {
  switch (route) {
    case "DIY Guidance":
      return "/service-hub";
    case "OMEGA Home Services":
      return "/service-hub/home-services";
    case "OMEGA Property Care System":
      return "/service-hub/property-care-system";
    case "OMEGA Property Health Report":
      return "/service-hub/property-health-report";
    case "OMEGA Renovation":
      return "/service-hub/renovation";
    case "OMEGA Engineering Solutions":
      return "/service-hub/engineering-solutions";
    case "Speak to Team":
      return "/contact";
  }
}

/**
 * Short paragraph shown inside the suggested-path result card under
 * the route name. Explains *why* this route fits.
 */
export function suggestedRouteRationale(route: SuggestedRoute): string {
  switch (route) {
    case "DIY Guidance":
      return "From what you described, this is likely something you can address yourself. If anything escalates, OMEGA is one tap away.";
    case "OMEGA Home Services":
      return "A qualified OMEGA technician will visit, diagnose on site, and resolve the issue without a long-term commitment.";
    case "OMEGA Property Care System":
      return "Repeating issues or cross-system faults usually mean the property needs structured ongoing care — not another one-off repair.";
    case "OMEGA Property Health Report":
      return "Before further work, a neutral technical assessment maps the property's condition, risks, and clear actions.";
    case "OMEGA Renovation":
      return "Your input fits a renovation conversation — a single OMEGA team coordinating finishes, MEP, and trades end to end.";
    case "OMEGA Engineering Solutions":
      return "What you described needs engineering — drawings, authority approvals, or technical review. OMEGA's engineering team handles this directly.";
    case "Speak to Team":
      return "For active leaks, electrical hazards, fire/life safety risks, or urgent property risk, contact OMEGA directly so a specialist can review the situation.";
  }
}
