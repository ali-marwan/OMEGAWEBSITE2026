import type { Article } from "@/lib/insights";
import {
  ArticleBodyShell,
  ArticleClosing,
  ArticleSection,
  BulletList,
  InlineCtaPanel,
  InlineLink,
  Paragraph,
  SafetyCallout,
  type TocEntry,
} from "./_shared";

/**
 * /insights/common-signs-your-villa-needs-a-maintenance-review
 * "Common Signs Your Villa Needs a Maintenance Review"
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "early-signals", label: "The early signals" },
  { id: "why-villas", label: "Why villas accumulate hidden issues" },
  { id: "checklist", label: "Practical checklist" },
  { id: "omega-path", label: "When to involve OMEGA" },
];

export function VillaMaintenanceSignsBody({
  article,
}: {
  article: Article;
}) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          Villas show their issues differently than apartments. The
          surface area is larger, the systems are more distributed,
          and the property typically sees more variation in use,
          climate exposure, and access. Most villa problems
          announce themselves quietly long before they become repair
          bills — but only if the owner knows what to listen for.
        </Paragraph>
        <Paragraph>
          A maintenance review is the structured pause that
          translates the property's quieter signals into a clear
          action list. The earlier a review happens, the smaller
          the action list usually is.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="early-signals"
        index="02"
        title="The early signals worth taking seriously"
      >
        <Paragraph>
          Several patterns commonly precede larger issues in UAE
          villas. Each may indicate different root causes — none
          should be assumed without inspection.
        </Paragraph>

        <BulletList
          items={[
            "Recurring AC issues — the same fault returning after repair, or weak cooling that doesn't recover after a service visit.",
            "Moisture marks on ceilings, walls, or skirting that grow, change colour, or reappear after repainting.",
            "A sudden or gradual drop in water pressure across multiple fixtures, especially at upper floors.",
            "Repeated electrical tripping with no clear single cause, or breakers that won't reset cleanly.",
            "New cracks at door corners, window reveals, or junction points — particularly hairline patterns that widen between visits.",
            "Sealants in wet areas (showers, kitchen, around basins) that have cracked, lifted, or discoloured.",
            "Drainage smells from sinks or floor traps that don't clear with cleaning.",
            "Doors and windows that stop closing cleanly, sometimes seasonally, sometimes permanently.",
            "Pool, irrigation, or external systems showing performance changes the owner can't explain.",
          ]}
        />

        <Paragraph>
          One occurrence of any of these is usually a normal
          maintenance item. Two or more occurring together — or any
          one of them recurring after repair — is the threshold
          where a review pays back the cost of doing it.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="why-villas"
        index="03"
        title="Why villas accumulate hidden issues"
      >
        <Paragraph>
          Villas have characteristics that compound small issues
          differently than apartments do.
        </Paragraph>

        <BulletList
          items={[
            "Larger envelope — more roof, more facade, more glazing exposed to UAE sun, dust, and seasonal humidity.",
            "More MEP — separate AC zones, more electrical circuits, more plumbing routes, often spread across two or three floors.",
            "External systems — gardens, irrigation, pools, outdoor lighting, gates, and shaded structures all add maintenance surface.",
            "Multiple access points — leaks at one floor often originate from another; tracing them takes structured inspection rather than guesswork.",
            "Ownership patterns — villas often change hands more than apartments, and undocumented prior repairs can mask repeated issues.",
          ]}
        />

        <Paragraph>
          None of this makes villas harder to maintain — it just
          means villa maintenance benefits more visibly from
          structured tracking. A clean record of what's been done,
          when, and where is the difference between a property that
          ages predictably and one that surprises its owner.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="checklist"
        index="04"
        title="Practical maintenance review checklist"
      >
        <Paragraph>
          A useful villa review covers the items below at a fixed
          cadence. The list is not exhaustive — but if any item
          shows a change between visits, it should be flagged for
          technical review.
        </Paragraph>

        <BulletList
          items={[
            "AC indoor and outdoor units — cooling performance, drainage, noise, visible condition.",
            "Visible plumbing fixtures — taps, shower fittings, drain performance, water pressure across floors.",
            "Wet area sealants — joints around showers, basins, kitchen sinks, balconies.",
            "Electrical accessories — sockets, switches, lighting, breaker stability.",
            "Walls and ceilings — moisture marks, cracks, paint condition, sealant joints.",
            "Doors and windows — alignment, hardware, weather seals, glazing condition.",
            "Roof and external surfaces (where accessible) — visible signs of wear, drainage, parapet condition.",
            "Garden, irrigation, and pool systems — operational checks where applicable.",
            "Maintenance log — what was found, what was repaired, what was deferred, what's recommended.",
          ]}
        />
      </ArticleSection>

      <ArticleSection
        id="omega-path"
        index="05"
        title="When to involve OMEGA"
      >
        <Paragraph>
          Most villas benefit from being on a structured care plan
          rather than handled through one-off repairs. The right
          OMEGA path depends on what the review surfaces.
        </Paragraph>
        <Paragraph>
          For ongoing villa care — scheduled inspections, preventive
          checks, issue tracking, and a single point of contact
          between visits —{" "}
          <InlineLink href="/service-hub/property-care-system">
            OMEGA Property Care System
          </InlineLink>
          {" "}is the structure that holds the recurring work.
        </Paragraph>
        <Paragraph>
          For one-off issues that need a competent team on site
          quickly — a leak, an AC fault, an electrical issue —{" "}
          <InlineLink href="/service-hub/home-services">
            OMEGA Home Services
          </InlineLink>
          {" "}covers the technician response without committing to
          a long contract.
        </Paragraph>
        <Paragraph>
          Where the review uncovers multiple unresolved issues, or
          where the villa is being prepared for a sale, rental, or
          renovation,{" "}
          <InlineLink href="/service-hub/property-health-report">
            OMEGA Property Health Report
          </InlineLink>
          {" "}provides a structured baseline before further repairs
          are committed.
        </Paragraph>

        <SafetyCallout />
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Move from reactive repairs to structured villa care."
        description="OMEGA Property Care System organises annual villa maintenance, ongoing support, and clear documentation across the systems that matter most."
        primaryLabel="View Property Care System"
      />

      <ArticleClosing>
        <p>
          The signals a villa gives its owner are usually accurate.
          A maintenance review is what turns those signals into a
          clear action list — small, ordered, and resolved before
          they become bigger items on a different bill.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
