import type { Article } from "@/lib/insights";
import {
  ArticleBodyShell,
  ArticleClosing,
  ArticleSection,
  BulletList,
  InlineCtaPanel,
  InlineLink,
  Paragraph,
  type TocEntry,
} from "./_shared";

/**
 * /insights/renovation-vs-repair-choosing-the-right-path
 * "Renovation vs Repair: How to Choose the Right Path"
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "what-is-repair", label: "What a repair fixes" },
  { id: "what-is-renovation", label: "What renovation changes" },
  { id: "recurring-faults", label: "Recurring faults" },
  { id: "decision-guide", label: "How to choose" },
  { id: "omega-path", label: "When to involve OMEGA" },
];

export function RenovationVsRepairBody({ article }: { article: Article }) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          Some property issues are simple repairs. Others are
          signals that the underlying system needs renovation. The
          decision shapes scope, budget, and timeline in different
          ways — and getting it wrong on either side has a real
          cost. Choosing too small means the same issue returns
          three months later. Choosing too large means renovation
          budget spent on a problem that a repair would have
          resolved.
        </Paragraph>
        <Paragraph>
          The honest answer for most properties sits between the
          two, and the right way to find it is to read the
          property's signals before the contractor arrives with a
          quote.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-is-repair"
        index="02"
        title="What a repair fixes"
      >
        <Paragraph>
          A repair addresses a defined issue and returns the
          property to its previous functional state. The scope is
          contained: a leaking tap, a tripping breaker, a cracked
          tile, a sticking door. The work is bounded; the cost is
          predictable; the documentation is short.
        </Paragraph>
        <Paragraph>
          Repairs are appropriate when the issue is recent, the
          cause is identifiable, the fix is proportional to the
          fault, and the underlying system is otherwise sound.
          Most everyday property issues fall into this category —
          and the right response is to handle them quickly, record
          what was done, and move on.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-is-renovation"
        index="03"
        title="What renovation changes"
      >
        <Paragraph>
          Renovation changes condition, function, or finish. It is
          a deliberate reset rather than a return to baseline.
          Renovation scope might cover finishes only (paint,
          flooring, joinery), it might extend to fixtures and
          fittings (kitchens, bathrooms, lighting), or it might
          include MEP and layout changes that touch the property's
          systems and structure.
        </Paragraph>
        <Paragraph>
          Renovation is appropriate when the property's current
          condition genuinely needs upgrade, when the use case is
          changing, when several systems are at end-of-life
          together, or when repeated repairs are no longer the
          economical option. The scope is larger and the
          coordination is more involved — but the outcome is a
          property that performs differently afterwards, not just
          a property where one issue stopped recurring.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="recurring-faults"
        index="04"
        title="Recurring faults — the signal that scope may be wrong"
      >
        <Paragraph>
          The pattern that most often suggests the property needs
          renovation rather than another repair is recurrence. The
          same fault returning after a documented fix is rarely a
          coincidence — it usually means the repair addressed the
          symptom rather than the underlying cause.
        </Paragraph>

        <BulletList
          items={[
            "A leak that returns in a different spot near the original location.",
            "An AC fault that recurs after multiple repair visits.",
            "Cracks that reappear in the same line after filling.",
            "Drainage smells that come back after cleaning.",
            "Sealants that fail repeatedly in the same wet area.",
            "Doors or windows that move out of alignment again after adjustment.",
          ]}
        />

        <Paragraph>
          Two or more recurrences usually warrant a different
          conversation: not "fix it again", but "what's actually
          happening here, and is the right answer renovation rather
          than repair?"
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="decision-guide"
        index="05"
        title="How to choose between the two"
      >
        <Paragraph>
          The decision rarely needs to be made in isolation. A few
          straightforward questions usually clarify the right path.
        </Paragraph>

        <BulletList
          items={[
            "Is the issue recent and contained, or recurring? Recent and contained typically signals repair; recurring usually signals renovation or technical review.",
            "Is the affected system otherwise sound? Sound system + isolated issue = repair. End-of-life or repeatedly failing system = renovation candidate.",
            "Are multiple systems showing wear at the same time? If so, renovation often costs less in total than addressing each system separately.",
            "Is the property's use changing? A new tenant, new family member, or new commercial use can be the right moment to renovate even if individual repairs would still hold.",
            "Is the budget framing this as a one-off or as part of a longer plan? Repair is right for one-off thinking; renovation is right when the property is being repositioned.",
          ]}
        />

        <Paragraph>
          Where the answer isn't clear from the questions alone, a{" "}
          <InlineLink href="/service-hub/property-health-report">
            property health report
          </InlineLink>
          {" "}is the structured way to map the property before
          either path is committed. It records the condition that
          would otherwise be guessed at, and the report's findings
          shape whether the right next step is repair, renovation,
          or further technical review.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="omega-path"
        index="06"
        title="When to involve OMEGA"
      >
        <Paragraph>
          For one-off repairs and everyday property issues,{" "}
          <InlineLink href="/service-hub/home-services">
            OMEGA Home Services
          </InlineLink>
          {" "}covers technician response across AC, plumbing,
          electrical, and general repairs.
        </Paragraph>
        <Paragraph>
          For renovation — kitchens, bathrooms, full refurbishments,
          fit-outs —{" "}
          <InlineLink href="/service-hub/renovation">
            OMEGA Renovation
          </InlineLink>
          {" "}delivers the works on a controlled programme with
          coordination across trades, finishes, and MEP where
          required.
        </Paragraph>
        <Paragraph>
          Where renovation scope touches structure, MEP changes, or
          works requiring authority coordination,{" "}
          <InlineLink href="/service-hub/engineering-solutions">
            OMEGA Engineering Solutions
          </InlineLink>
          {" "}provides drawings, technical review, and authority-
          related support where applicable. Engineering input
          before the contractor quotes is usually less costly than
          engineering input after a build has started.
        </Paragraph>
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Pick the right path before scope is committed."
        description="OMEGA Renovation handles fit-out and refurbishment as a controlled programme — with engineering input where structure or services are touched."
        primaryLabel="View Renovation"
      />

      <ArticleClosing>
        <p>
          The strongest renovation outcomes come from owners who
          know — before the work starts — whether the property
          needs a repair, a renovation, or a technical review. The
          difference between the three isn't always obvious. The
          earlier it gets clarified, the cleaner the build.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
