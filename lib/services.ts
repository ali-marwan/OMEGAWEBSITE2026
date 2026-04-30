/**
 * OMEGA Service Hub — centralised service data model.
 *
 * Single source of truth for everything the Service Hub renders. The
 * card grid, the filter bar, the guided path section, and the
 * per-service detail page (`/service-hub/[slug]`) all read from this
 * file. There is no hardcoded service copy anywhere else in the UI.
 *
 * Design intent:
 *   - One platform layer that frontend, future backend, and a future
 *     mobile app can all share.
 *   - Every service exposes a stable UPPERCASE `serviceCode`
 *     (PROPERTY_CARE_SYSTEM, HOME_SERVICES, ...) — the same code the
 *     mobile app router and CRM consume. Slug + code are kept
 *     parallel: slug for URLs, code for system identity.
 *   - `appActionType` tags every service with the dominant flow it
 *     belongs to in the eventual app (SERVICE_REQUEST,
 *     ASSESSMENT_REQUEST, RENOVATION_REQUEST, ENGINEERING_REQUEST,
 *     DIAGNOSTIC_REQUEST). The mobile app can route on this value
 *     without re-implementing taxonomy.
 *   - Every action button on the detail page exposes a stable code
 *     (SERVICE_REQUEST, START_DIAGNOSIS, CONTACT_TEAM, BACK_TO_HUB)
 *     so the same UI maps to identical app screens / API endpoints
 *     when the mobile client and backend are wired up.
 *   - Per-service fields the detail page reads:
 *       useCases             → short chip-style labels (catalog grid + hero)
 *       whatThisCovers       → 4 module cards with a one-line summary each
 *       whenToUse            → 4–5 client-facing scenarios
 *       processSteps         → 4-step OMEGA process (currently shared)
 *       relatedServiceSlugs  → curated 2–3 related modules
 *     New services only need a single entry in `services`.
 *
 * Mobile-app alignment:
 *   - `Service` is the same record the mobile app's `Service` model
 *     consumes. `serviceCode` is the stable identifier used in deep
 *     links, push payloads, and CRM rows.
 *   - `processSteps` is per-service so individual modules can later
 *     diverge (e.g. Engineering may add an authority-coordination
 *     step) without forking the data model.
 */

/* ── Stable service codes ────────────────────────────────────────── */

/**
 * UPPERCASE service codes — match the eventual app/CRM router. The
 * one place new services are registered. The slug (lowercase, used
 * in URLs) is parallel; both stay in sync via the `services` array
 * below.
 */
export const SERVICE_CODES = [
  "PROPERTY_CARE_SYSTEM",
  "HOME_SERVICES",
  "PROPERTY_HEALTH_REPORT",
  "RENOVATION",
  "ENGINEERING_SOLUTIONS",
] as const;

export type ServiceCode = (typeof SERVICE_CODES)[number];

/* ── Categories ──────────────────────────────────────────────────── */

/** Top-level service categories the user can filter by. */
export type ServiceCategory =
  | "Property Care"
  | "Home Services"
  | "Health Report"
  | "Renovation"
  | "Engineering";

/** Filter values exposed to the UI ("All" + every category). */
export type ServiceFilter = "All" | ServiceCategory;

/* ── Action codes (per-service CTAs) ─────────────────────────────── */

/**
 * Stable action codes shared between web and the future mobile app.
 * Adding a new action here is the only place you have to touch — the
 * card UI iterates the array and a future router maps the code to a
 * concrete app screen.
 *
 * Note: this `ActionCode` is the per-service action set (used on
 * service catalog cards + detail page CTAs). The site-wide CTA
 * taxonomy lives in `lib/actions.ts` (`ACTION_CODES`) — there's
 * overlap (START_DIAGNOSIS / CONTACT_TEAM exist in both) but the two
 * sets are kept separate so service-card actions can evolve
 * independently of the global navigation taxonomy.
 */
export type ActionCode =
  | "VIEW_DETAILS"
  | "START_DIAGNOSIS"
  | "SERVICE_REQUEST"
  | "CONTACT_TEAM"
  | "BACK_TO_HUB";

/**
 * The dominant flow this service feeds in the app. Used by the
 * router (later) to know which screen to land in when the user
 * picks the primary CTA.
 */
export type AppActionType =
  | "SERVICE_REQUEST"
  | "DIAGNOSTIC_REQUEST"
  | "ASSESSMENT_REQUEST"
  | "RENOVATION_REQUEST"
  | "ENGINEERING_REQUEST";

export type ServiceAction = {
  code: ActionCode;
  label: string;
  href: string;
};

/**
 * A single "What this covers" entry — short title + one explanatory
 * line. Always exactly 4 per service (one per useCase) so the detail
 * page renders a clean 2×2 / 4×1 module grid without wrap edge cases.
 */
export type CoverageItem = {
  title: string;
  summary: string;
};

/**
 * The OMEGA standard intake process — same four steps for every
 * service module today. Surfaced on every detail page via
 * `<OmegaProcess />`. Per-service `processSteps` defaults to this
 * constant, but a service can later override its own steps without
 * forking the data model.
 */
export type ProcessStep = {
  code: string;
  title: string;
  description: string;
};

export const omegaProcess: readonly ProcessStep[] = [
  {
    code: "01",
    title: "Submit Request",
    description: "Share your requirement, issue, or property need.",
  },
  {
    code: "02",
    title: "Review & Diagnose",
    description:
      "OMEGA reviews the request and identifies the right technical path.",
  },
  {
    code: "03",
    title: "Scope Confirmation",
    description:
      "If required, the team confirms site details, scope, and service requirements.",
  },
  {
    code: "04",
    title: "Execution & Support",
    description:
      "OMEGA proceeds with the appropriate service, support, or next action.",
  },
] as const;

/* ── Service shape ───────────────────────────────────────────────── */

export type Service = {
  /** Stable identifier (matches slug today, kept separate for clarity). */
  id: string;
  /** URL slug (e.g. `home-services`). */
  slug: string;
  /** UPPERCASE service code (e.g. `HOME_SERVICES`). System taxonomy. */
  serviceCode: ServiceCode;
  /** Two-digit display index ("01", "02", ...). */
  index: string;
  title: string;
  /** Mono-caps strap line under the title on detail page hero. */
  descriptor: string;
  /**
   * One-sentence summary used on catalog cards + hero. Renamed from
   * `description` — the brief specifies `shortDescription`.
   */
  shortDescription: string;
  /**
   * Longer paragraph used on detail page metadata + future SEO /
   * social share / mobile-app feature card. Falls back to
   * `shortDescription` when no longer copy is needed.
   */
  fullDescription: string;
  category: ServiceCategory;
  /** Lower number = higher priority, used to sort the grid. */
  priority: number;
  /**
   * Short labels (1–3 words) for use-case chips on the catalog grid
   * and inside the detail hero's use-cases row.
   */
  useCases: readonly string[];
  /**
   * Detail-page "What this covers" — 4 cards, each a short title +
   * one explanatory line. Mirrors `useCases` 1:1 (same titles) but
   * adds the explanatory summary needed on the detail layout.
   */
  whatThisCovers: readonly CoverageItem[];
  /**
   * Detail-page "When to use this service" — 4–5 short, situational
   * sentences (one per common scenario) that help the visitor decide
   * whether this is the right module for their current need.
   */
  whenToUse: readonly string[];
  /**
   * 4-step OMEGA process for this service. Defaults to the shared
   * `omegaProcess` constant — services can override later if their
   * intake flow diverges.
   */
  processSteps: readonly ProcessStep[];
  /**
   * Slugs of related services rendered in the detail page's
   * "Related services" section. Curated per service rather than
   * computed from the category, so an editor can show the most
   * useful neighbours regardless of taxonomy match.
   *
   * Renamed from `relatedSlugs` — the brief specifies
   * `relatedServiceSlugs`.
   */
  relatedServiceSlugs: readonly string[];
  availableActions: readonly ServiceAction[];
  /** Detail page route. */
  route: string;
  /** Primary call-to-action shown at the bottom of the catalog card. */
  primaryCta: { label: string; href: string };
  /** App flow tag — see AppActionType for semantics. */
  appActionType: AppActionType;
};

/* ── Action builders ─────────────────────────────────────────────── */

/**
 * Hub-card actions — the four standardised action codes every service
 * exposes from the catalog grid. Centralising the construction here
 * keeps action codes / hrefs consistent across the whole hub.
 *
 * Note: this set includes VIEW_DETAILS (entry point into the detail
 * page). The detail page uses a different set — see
 * `buildDetailActions` below — that drops VIEW_DETAILS (we're
 * already on it) and adds BACK_TO_HUB.
 */
const buildStandardActions = (slug: string): ServiceAction[] => [
  {
    code: "VIEW_DETAILS",
    label: "View Details",
    href: `/service-hub/${slug}`,
  },
  {
    code: "START_DIAGNOSIS",
    label: "Start Diagnosis",
    href: `/service-hub/${slug}#diagnosis`,
  },
  {
    code: "SERVICE_REQUEST",
    label: "Request Service",
    href: `/service-hub/${slug}#request`,
  },
  {
    code: "CONTACT_TEAM",
    label: "Speak to Team",
    href: `/service-hub/${slug}#contact`,
  },
];

/**
 * Detail-page actions — the four standardised action codes shown on
 * every `/service-hub/[slug]` page. Three of them are *in-page*
 * anchors that open a tab in the embedded action centre; only
 * BACK_TO_HUB navigates away.
 *
 *   1. SERVICE_REQUEST   → #request       (in-page tab)
 *   2. START_DIAGNOSIS   → #diagnosis     (in-page tab)
 *   3. CONTACT_TEAM      → #contact       (in-page tab)
 *   4. BACK_TO_HUB       → /service-hub   (only nav action)
 */
export const buildDetailActions = (slug: string): ServiceAction[] => [
  {
    code: "SERVICE_REQUEST",
    label: "Request Service",
    href: `/service-hub/${slug}#request`,
  },
  {
    code: "START_DIAGNOSIS",
    label: "Start Diagnosis",
    href: `/service-hub/${slug}#diagnosis`,
  },
  {
    code: "CONTACT_TEAM",
    label: "Speak to Team",
    href: `/service-hub/${slug}#contact`,
  },
  {
    code: "BACK_TO_HUB",
    label: "Back to Service Hub",
    href: "/service-hub",
  },
];

/* ── Service catalogue ───────────────────────────────────────────── */

export const services: readonly Service[] = [
  {
    id: "property-care-system",
    slug: "property-care-system",
    serviceCode: "PROPERTY_CARE_SYSTEM",
    index: "01",
    title: "OMEGA Property Care System",
    descriptor: "Annual Maintenance & Ongoing Property Support",
    shortDescription:
      "Annual maintenance and ongoing support for residential and commercial properties.",
    fullDescription:
      "A structured care programme for properties across the UAE — scheduled maintenance, preventive checks, and priority response between visits, all run through a single OMEGA point of contact.",
    category: "Property Care",
    priority: 1,
    useCases: [
      "Annual maintenance",
      "Preventive checks",
      "Ongoing support",
      "Property performance",
    ],
    whatThisCovers: [
      {
        title: "Annual maintenance",
        summary:
          "Scheduled visits across MEP, finishes, and core systems on a fixed cadence.",
      },
      {
        title: "Preventive checks",
        summary:
          "Routine inspection so small issues are caught before they become expensive failures.",
      },
      {
        title: "Ongoing support",
        summary:
          "Priority response between visits, with a single OMEGA point of contact.",
      },
      {
        title: "Property performance",
        summary:
          "Documented condition log so the property's health is tracked over time.",
      },
    ],
    whenToUse: [
      "You want recurring annual support for your property.",
      "You want preventive maintenance instead of reactive repairs.",
      "You manage a villa, apartment, or commercial unit.",
      "You want one structured system for care, repairs, and follow-up.",
      "You want technical oversight before issues become costly.",
    ],
    processSteps: omegaProcess,
    relatedServiceSlugs: [
      "home-services",
      "property-health-report",
      "engineering-solutions",
    ],
    availableActions: buildStandardActions("property-care-system"),
    route: "/service-hub/property-care-system",
    primaryCta: {
      label: "View Property Care",
      href: "/service-hub/property-care-system",
    },
    appActionType: "SERVICE_REQUEST",
  },
  {
    id: "home-services",
    slug: "home-services",
    serviceCode: "HOME_SERVICES",
    index: "02",
    title: "OMEGA Home Services",
    descriptor: "On-Demand Repairs & Property Support",
    shortDescription:
      "On-demand response for everyday property issues, faults, repairs, and minor service needs.",
    fullDescription:
      "Single-call response for everyday property problems — AC faults, plumbing leaks, electrical issues, and general repairs handled by qualified OMEGA technicians, with a clean repair record per visit.",
    category: "Home Services",
    priority: 2,
    useCases: [
      "AC issues",
      "Plumbing leaks",
      "Electrical faults",
      "General repairs",
    ],
    whatThisCovers: [
      {
        title: "AC issues",
        summary:
          "Cooling faults, servicing, and HVAC repair handled by qualified technicians.",
      },
      {
        title: "Plumbing leaks",
        summary:
          "Leaks, blockages, fixtures, and water-pressure problems resolved on site.",
      },
      {
        title: "Electrical faults",
        summary:
          "Sockets, lighting, breakers, and minor distribution-board fixes.",
      },
      {
        title: "General repairs",
        summary:
          "Handyman, carpentry, paint touch-ups, and door / cabinet adjustments.",
      },
    ],
    whenToUse: [
      "Something has stopped working and you need a competent team on site quickly.",
      "You need prompt support — same-day or next-day where possible.",
      "You want one trusted contact instead of calling a different trade each time.",
      "You're a tenant or owner-occupier and need an accountable repair record.",
      "You need help with everyday property issues without a long contract.",
    ],
    processSteps: omegaProcess,
    relatedServiceSlugs: ["property-care-system", "renovation"],
    availableActions: buildStandardActions("home-services"),
    route: "/service-hub/home-services",
    primaryCta: {
      label: "View Home Services",
      href: "/service-hub/home-services",
    },
    appActionType: "SERVICE_REQUEST",
  },
  {
    id: "property-health-report",
    slug: "property-health-report",
    serviceCode: "PROPERTY_HEALTH_REPORT",
    index: "03",
    title: "OMEGA Property Health Report",
    descriptor: "Property Assessment & Technical Report",
    shortDescription:
      "Structured property assessment to identify condition, risks, required actions, and improvement priorities.",
    fullDescription:
      "An independent technical view of a property — area-by-area condition scoring, photographed evidence, and a clear action list, useful before buying, renting, renovating, or committing to repairs.",
    category: "Health Report",
    priority: 3,
    useCases: [
      "Pre-renovation assessment",
      "Buying / renting assessment",
      "Condition report",
      "Risk identification",
    ],
    whatThisCovers: [
      {
        title: "Pre-renovation assessment",
        summary:
          "Baseline condition mapped before scope is locked or contractors are picked.",
      },
      {
        title: "Buying / renting assessment",
        summary:
          "Independent technical view before you sign a sale or tenancy contract.",
      },
      {
        title: "Condition report",
        summary:
          "Structured scoring per area with clear photos, notes, and priorities.",
      },
      {
        title: "Risk identification",
        summary:
          "Leaks, damp, settlement, and deferred maintenance flagged with clear actions.",
      },
    ],
    whenToUse: [
      "You are about to buy or rent a property and want a neutral technical view.",
      "You are planning a renovation and need a baseline before scope is set.",
      "You suspect ongoing issues but want them mapped before committing to repairs.",
      "You need a clean report you can share with a landlord, buyer, or contractor.",
      "You want a periodic check-up to track your property's condition over time.",
    ],
    processSteps: omegaProcess,
    relatedServiceSlugs: [
      "property-care-system",
      "engineering-solutions",
      "renovation",
    ],
    availableActions: buildStandardActions("property-health-report"),
    route: "/service-hub/property-health-report",
    primaryCta: {
      label: "View Health Report",
      href: "/service-hub/property-health-report",
    },
    appActionType: "ASSESSMENT_REQUEST",
  },
  {
    id: "renovation",
    slug: "renovation",
    serviceCode: "RENOVATION",
    index: "04",
    title: "OMEGA Renovation",
    descriptor: "Upgrades, Fit-Out & Property Enhancements",
    shortDescription:
      "Controlled renovation and fit-out improvements for villas, apartments, and commercial spaces.",
    fullDescription:
      "End-to-end renovation delivered on a controlled programme — kitchens, bathrooms, full refurbishments, and commercial fit-outs, with engineering input where structure or services are touched.",
    category: "Renovation",
    priority: 4,
    useCases: [
      "Villa upgrades",
      "Apartment improvements",
      "Fit-out works",
      "Space transformation",
    ],
    whatThisCovers: [
      {
        title: "Villa upgrades",
        summary:
          "Kitchens, bathrooms, finishes, and full refurbishments delivered end to end.",
      },
      {
        title: "Apartment improvements",
        summary:
          "Layout adjustments, finishes, and fixture upgrades for occupied or empty units.",
      },
      {
        title: "Fit-out works",
        summary:
          "Offices, retail, and small commercial spaces fitted out on a controlled programme.",
      },
      {
        title: "Space transformation",
        summary:
          "Coordinated trades across MEP, finishes, joinery, and post-handover snagging.",
      },
    ],
    whenToUse: [
      "You want to upgrade your home but need one accountable team running the works.",
      "You are fitting out a new commercial space and need a single delivery partner.",
      "Your property needs more than repairs — a real reset of layout, finishes, or systems.",
      "You want engineering input where structure or services are touched.",
      "You need a clear programme, not an open-ended building site.",
    ],
    processSteps: omegaProcess,
    relatedServiceSlugs: [
      "engineering-solutions",
      "property-health-report",
      "home-services",
    ],
    availableActions: buildStandardActions("renovation"),
    route: "/service-hub/renovation",
    primaryCta: {
      label: "View Renovation",
      href: "/service-hub/renovation",
    },
    appActionType: "RENOVATION_REQUEST",
  },
  {
    id: "engineering-solutions",
    slug: "engineering-solutions",
    serviceCode: "ENGINEERING_SOLUTIONS",
    index: "05",
    title: "OMEGA Engineering Solutions",
    descriptor: "Drawings, Design & Authority Coordination",
    shortDescription:
      "Drawings, design coordination, technical review, MEP coordination, and authority-related support where applicable.",
    fullDescription:
      "Engineering-led support for projects that need drawings, MEP coordination, technical review, or authority coordination — independent judgement on unusual property issues, and submission support where works require sign-off.",
    category: "Engineering",
    priority: 5,
    useCases: [
      "Drawings",
      "MEP coordination",
      "Authority approvals",
      "Technical problem solving",
    ],
    whatThisCovers: [
      {
        title: "Drawings",
        summary:
          "Architectural and MEP drawings prepared to UAE authority standards.",
      },
      {
        title: "MEP coordination",
        summary:
          "Mechanical, electrical, and plumbing systems coordinated with structure and finishes.",
      },
      {
        title: "Authority approvals",
        summary:
          "Submission, follow-up, and review-response support where applicable.",
      },
      {
        title: "Technical problem solving",
        summary:
          "Independent review and targeted engineering on unusual property issues.",
      },
    ],
    whenToUse: [
      "You need formal drawings or approvals for a renovation or modification.",
      "You have an existing proposal and want an independent engineer to review it.",
      "You face a property issue that no general contractor has been able to solve.",
      "You need authority sign-off on works that touch structure, MEP, or facade.",
      "You want a second technical opinion before committing significant budget.",
    ],
    processSteps: omegaProcess,
    relatedServiceSlugs: ["renovation", "property-health-report"],
    availableActions: buildStandardActions("engineering-solutions"),
    route: "/service-hub/engineering-solutions",
    primaryCta: {
      label: "View Engineering",
      href: "/service-hub/engineering-solutions",
    },
    appActionType: "ENGINEERING_REQUEST",
  },
] as const;

/* ── Helper functions ────────────────────────────────────────────── */

/** Categories in display order (matches grid + filter order). */
export const categories: readonly ServiceCategory[] = [
  "Property Care",
  "Home Services",
  "Health Report",
  "Renovation",
  "Engineering",
] as const;

/** Filter values for the UI bar — "All" + every category. */
export const serviceFilters: readonly ServiceFilter[] = [
  "All",
  ...categories,
] as const;

/** Filter the service list by a UI filter value. */
export function filterServices(
  filter: ServiceFilter
): readonly Service[] {
  if (filter === "All") return services;
  return services.filter((s) => s.category === filter);
}

/**
 * Look up a single service by its url slug. Returns undefined when
 * no match — callers (e.g. the [slug] detail page) should treat
 * undefined as a 404.
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/**
 * Look up a single service by its UPPERCASE service code. Useful for
 * the future mobile app + CRM, which carry the code (not the slug)
 * in their data layers.
 */
export function getServiceByCode(code: ServiceCode): Service | undefined {
  return services.find((s) => s.serviceCode === code);
}

/** All slugs for `generateStaticParams` in the [slug] detail page. */
export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

/**
 * Resolve the related-services list for a given service. Reads
 * `relatedServiceSlugs` from the service entry and returns the
 * matching Service objects in declaration order, skipping any
 * unknown slug silently (so the detail page renders cleanly even if
 * the data is mid-edit).
 */
export function getRelatedServices(slug: string): readonly Service[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return service.relatedServiceSlugs
    .map((s) => getServiceBySlug(s))
    .filter((s): s is Service => Boolean(s));
}

/**
 * Map a slug to its UPPERCASE serviceCode. Useful when emitting a
 * Lead from a context that only knows the slug (e.g. an embedded
 * action centre on a detail page).
 */
export function slugToServiceCode(slug: string): ServiceCode | null {
  return getServiceBySlug(slug)?.serviceCode ?? null;
}
