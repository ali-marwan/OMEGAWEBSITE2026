import type { Article } from "@/lib/insights";
import {
  ArticleBodyShell,
  ArticleClosing,
  ArticleSection,
  BulletList,
  InlineCtaPanel,
  InlineLink,
  Paragraph,
  Subsection,
  type TocEntry,
} from "./_shared";

/**
 * /insights/annual-maintenance-plan-uae-property
 * "What an Annual Maintenance Plan Should Cover in a UAE Property"
 *
 * First fully-published OMEGA Insights article. Voice / claims
 * discipline (per the brief): no fixed timelines, no guaranteed
 * outcomes, no fake statistics, no DIY guidance for AC, electrical,
 * refrigerant, plumbing, pumps, or DBs. Hedged wording throughout.
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "what-it-should-include", label: "What a plan should include" },
  { id: "what-not-to-ignore", label: "What should not be ignored" },
  { id: "care-vs-repair", label: "Property care vs one-time repair" },
  { id: "health-report", label: "When to request a health report" },
  { id: "omega-approach", label: "How OMEGA approaches care" },
];

export function AnnualMaintenancePlanBody({
  article,
}: {
  article: Article;
}) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          Many property issues start small. A drip you noticed last
          week. An AC that takes a little longer to cool the room. A
          hairline crack near a doorframe. Individually they're
          trivial — but UAE properties operate under conditions that
          turn small issues into expensive ones if they're left to
          compound over time.
        </Paragraph>
        <Paragraph>
          Heat load on AC systems runs near continuously through
          summer. Water leakage tracks across finishes faster in
          coastal humidity. MEP-related service needs accumulate
          quietly between visible problems.
        </Paragraph>
        <Paragraph>
          A useful annual maintenance plan is not a list of emergency
          repairs waiting to happen. It is a structured property
          care system that catches issues before they escalate,
          tracks what's been done, and gives the owner a clear view
          of what the property actually needs.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-it-should-include"
        index="02"
        title="What an annual maintenance plan should include"
      >
        <Paragraph>
          A practical plan has seven components that work together.
          None of them is exotic — the value is in running them on a
          fixed cadence, recording what's found, and connecting one
          visit to the next.
        </Paragraph>

        <Subsection
          letter="A"
          title="Scheduled inspections"
          body="Regular checks at a fixed cadence are the foundation. An inspection typically covers visible condition across MEP, finishes, and core systems — recording what's working, what shows early signs of wear, and what needs further review. The cadence is set by property type and use; a single annual visit may suit a low-occupancy unit, while villas or commercial spaces typically benefit from more frequent visits."
        />

        <Subsection
          letter="B"
          title="AC and cooling checks"
          body="AC performance is the single biggest service item in most UAE properties. A maintenance check should include filter condition, drainage clearance, cooling performance against ambient temperature, abnormal noise or vibration, refrigerant or condensate leaks, and the general condition of indoor and outdoor units. Catching a partially blocked drain or a struggling fan in March is straightforward; catching it during a July breakdown is not."
        />

        <Subsection
          letter="C"
          title="Plumbing and leakage checks"
          body="Leaks rarely announce themselves directly. They show up as ceiling stains, swollen skirting, recurring drainage smells, or a quiet drop in water pressure. A maintenance round should look at visible piping, fixtures, water pressure, drainage performance, and the condition of seals and silicone in wet areas. Where a leak is suspected but not yet visible, further investigation may be needed before repair scope is committed."
        />

        <Subsection
          letter="D"
          title="Electrical checks"
          body="A basic electrical inspection identifies visible faults — damaged accessories, scorched sockets, exposed wiring, unstable lighting, and breakers that trip more than expected. It also flags areas that need formal technical review rather than handyman fixes. Electrical work that touches the distribution board or modifies circuits typically belongs with a qualified team, not with general maintenance scope."
        />

        <Subsection
          letter="E"
          title="Civil and finishing checks"
          body="Doors that bind, paint that bubbles, gypsum joints opening, sealant cracking around showers, tile movement, hairline cracks at junction points — these are the property's quieter signals. A maintenance round should record their location and severity, even when no immediate action is taken, so changes between visits are visible."
        />

        <Subsection
          letter="F"
          title="Issue tracking and reporting"
          body="A plan without documentation is a list of one-off visits. The plan should produce a written record per visit: what was inspected, what was found, what was done, what was deferred, and what's recommended. Over time this record becomes the property's condition history — useful for owners, for renovation decisions, and for handover when the property changes hands."
        />

        <Subsection
          letter="G"
          title="Emergency response path"
          body="The owner should know exactly what happens between scheduled visits if something goes wrong. A clear escalation path covers how to report an urgent issue, who responds, and what falls inside the plan vs what may require additional service. Response times depend on issue severity and location and are confirmed at intake — they are not promises."
        />
      </ArticleSection>

      <ArticleSection
        id="what-not-to-ignore"
        index="03"
        title="What should not be ignored"
      >
        <Paragraph>
          Some signals are worth taking seriously even when they look
          minor in isolation. The pattern matters more than any
          single occurrence.
        </Paragraph>
        <BulletList
          items={[
            "Recurring AC issues — the same fault reappearing after repair.",
            "Repeated leaks in the same location.",
            "Electrical tripping with no clear cause.",
            "Moisture marks that grow or change colour.",
            "New cracks, or cracks that widen between visits.",
            "Sudden drops in water pressure.",
            "Smells from drainage that don't resolve after cleaning.",
            "Sealants that crack, lift, or discolour.",
            "Repairs that were closed without documented resolution.",
          ]}
        />
        <Paragraph>
          Each of these may be minor. Each of them may also be the
          visible part of something larger. They are worth flagging
          for technical review rather than absorbing as "just how
          the property is."
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="care-vs-repair"
        index="04"
        title="Property care vs one-time repair"
      >
        <Paragraph>
          There's a difference between fixing a problem and managing
          a property.
        </Paragraph>
        <Paragraph>
          A one-time repair fixes the immediate issue. It closes the
          ticket. It rarely captures what caused the issue, what's
          likely to happen next, or what should be checked before
          the next thing fails.
        </Paragraph>
        <Paragraph>
          Property care creates a recurring support structure.
          Issues are documented, tracked, and connected to the
          property's condition history. Repairs are not isolated
          events; they're entries in an ongoing record.
        </Paragraph>
        <Paragraph>
          For owners moving from reactive repairs to structured
          care, the shift is mostly about visibility — knowing
          what's been done, what's pending, and what the property
          actually needs over time.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="health-report"
        index="05"
        title="When to request a property health report"
      >
        <Paragraph>
          Annual maintenance is the right structure for most
          properties most of the time. It's not always the right
          starting point.
        </Paragraph>
        <Paragraph>
          If the property has multiple unresolved issues, recurring
          problems that have been repaired more than once, a planned
          renovation, or a buying or rental decision in motion, a
          property health report is often the better first step. The
          report establishes a baseline before further repairs are
          committed — what's working, what isn't, what needs
          technical review, and what should be addressed before
          scope is locked.
        </Paragraph>
        <Paragraph>
          Read more about the{" "}
          <InlineLink href="/service-hub/property-health-report">
            OMEGA Property Health Report
          </InlineLink>
          {" "}— a structured way to map the property before any
          repair scope is committed.
        </Paragraph>
        <Paragraph>
          Once the baseline is clear, an annual maintenance plan
          continues from there with a structured view of the
          property rather than a series of disconnected repairs.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="omega-approach"
        index="06"
        title="How OMEGA approaches annual property care"
      >
        <Paragraph>
          OMEGA structures property care around four things:
          assessment, service response, reporting, and ongoing
          support.
        </Paragraph>
        <Paragraph>
          Scope depends on the property — type, condition, access,
          and the specific service requirements agreed with the
          owner. There is no single fixed package; what works for
          an apartment in a serviced tower differs from what works
          for a standalone villa, and what suits an active
          commercial space differs again.
        </Paragraph>
        <Paragraph>
          Where works fall outside the agreed scope — for example,
          large repairs, structural items, or works requiring
          authority coordination — they are flagged, scoped
          separately, and handled through the relevant OMEGA path.
          Annual maintenance is the structure that holds the
          recurring care; the{" "}
          <InlineLink href="/service-hub">Service Hub</InlineLink>
          {" "}holds the modules that handle larger items when they
          appear.
        </Paragraph>
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Start with structured property care."
        description="OMEGA Property Care System helps organize annual maintenance, ongoing support, and issue follow-up for UAE properties."
        primaryLabel="View Property Care System"
      />

      <ArticleClosing>
        <p>
          A good annual maintenance plan is not only about fixing
          problems. It is about knowing what needs attention, what
          can wait, what requires technical review, and how the
          property should be supported over time.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
