/**
 * OMEGA Service Hub — centralized service data model.
 *
 * Single source of truth for everything the Service Hub renders. The
 * card grid, the filter bar, the guided path section, and the
 * (future) per-service detail page all read from this file. There is
 * no hardcoded service copy anywhere else in the UI.
 *
 * Design intent:
 *   - One platform layer that frontend, future backend, and a future
 *     mobile app can all share.
 *   - `appActionType` tags every service with the dominant flow it
 *     belongs to in the eventual app (SERVICE_REQUEST,
 *     ASSESSMENT_REQUEST, RENOVATION_REQUEST, ENGINEERING_REQUEST,
 *     DIAGNOSTIC_REQUEST). The mobile app can route on this value
 *     without re-implementing taxonomy.
 *   - Each service exposes a `availableActions` array using the
 *     stable action codes (VIEW_DETAILS, START_DIAGNOSIS,
 *     SERVICE_REQUEST, CONTACT_TEAM) so the same buttons map to
 *     identical app flows when the mobile client is wired up.
 */

/** Top-level service categories the user can filter by. */
export type ServiceCategory =
  | "Property Care"
  | "Home Services"
  | "Health Report"
  | "Renovation"
  | "Engineering";

/** Filter values exposed to the UI ("All" + every category). */
export type ServiceFilter = "All" | ServiceCategory;

/**
 * Stable action codes shared between web and the future mobile app.
 * Adding a new action here is the only place you have to touch — the
 * card UI iterates the array and a future router maps the code to a
 * concrete app screen.
 */
export type ActionCode =
  | "VIEW_DETAILS"
  | "START_DIAGNOSIS"
  | "SERVICE_REQUEST"
  | "CONTACT_TEAM";

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

export type Service = {
  id: string;
  slug: string;
  /** Two-digit display index ("01", "02", ...). */
  index: string;
  title: string;
  descriptor: string;
  description: string;
  category: ServiceCategory;
  /** Lower number = higher priority, used to sort the grid. */
  priority: number;
  useCases: readonly string[];
  availableActions: readonly ServiceAction[];
  /** Detail page route. */
  route: string;
  /** Primary call-to-action shown at the bottom of the card. */
  primaryCta: { label: string; href: string };
  /** App flow tag — see AppActionType for semantics. */
  appActionType: AppActionType;
};

/**
 * Every service supports the same four standardised actions.
 * Centralising the construction here keeps action codes / hrefs
 * consistent across the whole hub.
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
    href: "/#ai",
  },
  {
    code: "SERVICE_REQUEST",
    label: "Request Service",
    href: `/service-hub/${slug}#request`,
  },
  {
    code: "CONTACT_TEAM",
    label: "Speak to Team",
    href: "/#contact",
  },
];

export const services: readonly Service[] = [
  {
    id: "property-care-system",
    slug: "property-care-system",
    index: "01",
    title: "OMEGA Property Care System",
    descriptor: "Annual Maintenance & Ongoing Property Support",
    description:
      "Structured annual maintenance and ongoing property care for residential and commercial properties.",
    category: "Property Care",
    priority: 1,
    useCases: [
      "Annual maintenance",
      "Preventive checks",
      "Ongoing support",
      "Property performance",
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
    index: "02",
    title: "OMEGA Home Services",
    descriptor: "On-Demand Repairs & Property Support",
    description:
      "Fast response for everyday property issues, faults, repairs, and service needs.",
    category: "Home Services",
    priority: 2,
    useCases: [
      "AC issues",
      "Plumbing leaks",
      "Electrical faults",
      "General repairs",
    ],
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
    index: "03",
    title: "OMEGA Property Health Report",
    descriptor: "Property Assessment & Technical Report",
    description:
      "A structured property assessment to identify condition, risks, required actions, and improvement priorities.",
    category: "Health Report",
    priority: 3,
    useCases: [
      "Pre-renovation assessment",
      "Buying / renting assessment",
      "Condition report",
      "Risk identification",
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
    index: "04",
    title: "OMEGA Renovation",
    descriptor: "Upgrades, Fit-Out & Property Enhancements",
    description:
      "Controlled renovation and fit-out improvements for existing spaces, villas, apartments, and commercial units.",
    category: "Renovation",
    priority: 4,
    useCases: [
      "Villa upgrades",
      "Apartment improvements",
      "Fit-out works",
      "Space transformation",
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
    index: "05",
    title: "OMEGA Engineering Solutions",
    descriptor: "Drawings, Design & Authority Approvals",
    description:
      "Engineering drawings, design coordination, technical review, and authority approval support.",
    category: "Engineering",
    priority: 5,
    useCases: [
      "Drawings",
      "MEP coordination",
      "Authority approvals",
      "Technical problem solving",
    ],
    availableActions: buildStandardActions("engineering-solutions"),
    route: "/service-hub/engineering-solutions",
    primaryCta: {
      label: "View Engineering",
      href: "/service-hub/engineering-solutions",
    },
    appActionType: "ENGINEERING_REQUEST",
  },
] as const;

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

/** Look up a single service by its url slug. Returns undefined when
 *  no match — callers (e.g. the [slug] detail page) should treat
 *  undefined as a 404. */
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** All slugs for `generateStaticParams` in the [slug] detail page. */
export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
