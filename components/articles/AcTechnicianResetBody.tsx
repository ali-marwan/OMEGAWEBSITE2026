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
 * /insights/when-an-ac-issue-needs-a-technician
 * "When an AC Issue Needs a Technician Instead of a Quick Reset"
 *
 * Voice / claims discipline: no fixed timelines, no DIY for AC
 * units / refrigerant / electrical panels / DBs. Hedged wording.
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "when-reset-helps", label: "When a reset may help" },
  { id: "when-technician", label: "When a technician is required" },
  { id: "what-not-to-do", label: "What not to do" },
  { id: "checklist", label: "Quick technician checklist" },
  { id: "omega-path", label: "When to involve OMEGA" },
];

export function AcTechnicianResetBody({ article }: { article: Article }) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          AC is the single most-used system in most UAE properties.
          When something feels off — cooling that's slower than
          usual, an unfamiliar noise, a damp patch under the unit —
          the first instinct is often to reset the breaker or the
          thermostat and hope it clears.
        </Paragraph>
        <Paragraph>
          Sometimes that's enough. More often, a reset masks a fault
          that returns within days, larger than before. The
          difference between the two cases isn't always obvious from
          the room — but a few signals reliably indicate a unit that
          needs a technician rather than a button-press.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="when-reset-helps"
        index="02"
        title="When a reset may help"
      >
        <Paragraph>
          A small set of AC issues genuinely clear themselves with a
          power-cycle or a thermostat reset:
        </Paragraph>
        <BulletList
          items={[
            "A one-off thermostat freeze after a power cut, where the unit returns to normal once cycled.",
            "A breaker that tripped during a single high-load moment (multiple appliances starting at once) and stays stable after reset.",
            "A remote that's lost sync with the unit and needs re-pairing.",
          ]}
        />
        <Paragraph>
          What these have in common: the unit returns to consistent
          performance after the reset and the issue does not repeat.
          If the same fault reappears within hours or days, the
          reset has not fixed the underlying cause.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="when-technician"
        index="03"
        title="When a technician is required"
      >
        <Paragraph>
          Several signals indicate the unit needs proper service
          rather than another reset. Each of these may indicate
          different root causes — none should be assumed without a
          technician's review.
        </Paragraph>

        <BulletList
          items={[
            "Weak or uneven cooling that doesn't recover after running for an hour.",
            "Visible water dripping from the indoor unit, or staining around it.",
            "A breaker that trips repeatedly when the AC turns on, even after reset.",
            "Unfamiliar noise — grinding, rattling, or persistent vibration from indoor or outdoor unit.",
            "Burnt or chemical smell from the vents (refrigerant, electrical, or musty odour).",
            "Recurring fault — the same issue reappearing after a previous repair.",
            "Ice forming on pipes or the indoor coil, which usually means restricted airflow or a refrigerant issue.",
            "Unit that runs continuously without reaching set temperature, especially on cooler mornings.",
          ]}
        />

        <Paragraph>
          Any one of these typically requires a technician visit.
          Two or more occurring together usually points to a system
          that needs full service rather than a single repair.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-not-to-do"
        index="04"
        title="What not to do"
      >
        <Paragraph>
          AC systems combine refrigerant under pressure, mains
          electricity, and condensate drainage. None of those are
          safe to investigate without the right equipment and
          training.
        </Paragraph>

        <BulletList
          items={[
            "Do not open the indoor or outdoor unit casing.",
            "Do not attempt to top up refrigerant or handle refrigerant lines.",
            "Do not open the electrical panel or distribution board to investigate breaker tripping.",
            "Do not spray household cleaners directly into vents or onto the indoor coil.",
            "Do not run the unit if you smell burning or see sparking — switch it off at the breaker if it is safe to do so, and contact a technician.",
          ]}
        />

        <Paragraph>
          Filter cleaning is the only routine intervention that
          typically belongs with the user, and even that should
          follow the manufacturer's specific instructions for the
          unit. Anything beyond that requires technician review.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="checklist"
        index="05"
        title="Quick technician checklist"
      >
        <Paragraph>
          If two or more of the items below apply to a unit, it's
          time to book a service visit rather than another reset.
        </Paragraph>

        <BulletList
          items={[
            "Same fault has returned after a previous repair.",
            "Cooling has been weak for more than 24 hours.",
            "Visible water or moisture around the indoor unit.",
            "Breaker has tripped more than once in a week.",
            "New or unusual noise during operation.",
            "Smell from vents that doesn't clear.",
            "Indoor unit dripping or producing visible ice.",
            "Outdoor unit running but indoor unit not cooling.",
            "Power consumption appears noticeably higher than usual.",
          ]}
        />
      </ArticleSection>

      <ArticleSection
        id="omega-path"
        index="06"
        title="When to involve OMEGA"
      >
        <Paragraph>
          For one-off AC issues — a single fault that needs prompt
          response —{" "}
          <InlineLink href="/service-hub/home-services">
            OMEGA Home Services
          </InlineLink>
          {" "}covers technician visits across AC, plumbing,
          electrical, and general repairs. Same-day or next-day
          response is often available, subject to issue severity
          and location.
        </Paragraph>
        <Paragraph>
          For properties where AC issues recur, or where multiple
          systems show signs of wear, an annual{" "}
          <InlineLink href="/service-hub/property-care-system">
            OMEGA Property Care System
          </InlineLink>
          {" "}plan is usually the better fit. It moves the property
          from reactive repairs to scheduled preventive care, with
          recorded inspections and a single point of contact between
          visits.
        </Paragraph>
        <Paragraph>
          If you are unsure which path applies, the{" "}
          <InlineLink href="/diagnosis">
            OMEGA AI Property Diagnostics
          </InlineLink>
          {" "}flow takes a description plus optional photos and
          suggests an initial route. Final scope is confirmed by the
          OMEGA team after review.
        </Paragraph>

        <SafetyCallout />
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Get the right AC response."
        description="Book an OMEGA Home Services technician for one-off AC issues, or move recurring problems onto a structured care plan."
        primaryLabel="View Home Services"
      />

      <ArticleClosing>
        <p>
          Most AC faults are not mysterious. They are either small
          enough to clear with a sensible reset, or they're signals
          that the unit needs proper service. Telling the two apart
          — and acting on the second category early — is what keeps
          UAE properties cool through summer without unplanned
          breakdowns.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
