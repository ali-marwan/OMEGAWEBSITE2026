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
 * /insights/why-a-property-health-report-matters-before-renovation
 * "Why a Property Health Report Matters Before Renovation"
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "visible-vs-hidden", label: "Visible vs hidden issues" },
  { id: "what-it-covers", label: "What the report covers" },
  { id: "renovation-scope", label: "How it shapes scope" },
  { id: "limits", label: "What it doesn't replace" },
  { id: "omega-path", label: "When to involve OMEGA" },
];

export function HealthReportBeforeRenovationBody({
  article,
}: {
  article: Article;
}) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          Renovation works best when the starting condition of the
          property is clear. When it isn't, scope drifts. Walls open
          to reveal pipework no one expected. Cracks turn out to
          extend further than the surface suggested. Budget that
          should have gone toward finishes ends up rerouted to
          remedial work that wasn't priced.
        </Paragraph>
        <Paragraph>
          A property health report is not the same as a renovation
          quote. It is a structured technical assessment of the
          property's current state — what is working, what isn't,
          what shows early signs of wear, and what needs technical
          review before further decisions are made. For renovation
          projects of any scale, it's the document that prevents
          guessing.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="visible-vs-hidden"
        index="02"
        title="Visible issues vs hidden issues"
      >
        <Paragraph>
          A walkthrough surfaces what the eye sees on the day —
          paint condition, finish wear, obvious cracks, doors that
          stick, water marks. That's a useful but partial picture.
          Most of what shapes a renovation lives behind the
          finishes.
        </Paragraph>
        <Paragraph>
          A health report combines visible inspection with a
          structured look at the systems behind the walls: AC and
          ducting, plumbing routes, electrical distribution,
          drainage, and the condition of seals and waterproofing
          where accessible. It records what's visible, flags what
          may be hidden, and identifies where further investigation
          is warranted before scope is locked.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-it-covers"
        index="03"
        title="What the report covers"
      >
        <Paragraph>
          Coverage varies by property type and access, but a
          structured assessment typically addresses six areas:
        </Paragraph>

        <BulletList
          items={[
            "MEP condition — visible signs of wear or distress in mechanical, electrical, and plumbing systems where accessible.",
            "Leaks and moisture — ceiling stains, swollen finishes, recurring damp patches, sealant deterioration in wet areas.",
            "Cracks and movement — surface cracking, hairline patterns, sealant separation at joints, signs of recent or ongoing movement.",
            "AC performance — cooling consistency, drainage, condition of indoor and outdoor units, signs of refrigerant or condensate issues.",
            "Electrical visible condition — accessory damage, scorched sockets, lighting inconsistencies, evidence of prior temporary fixes.",
            "Civil and finishes — door alignment, paint condition, tile movement, joinery, areas of accumulated wear.",
          ]}
        />

        <Paragraph>
          Each area is recorded as condition + observed signal +
          recommended action. The report is the document a
          renovation team can quote against, rather than a snapshot
          opinion that gets revised mid-build.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="renovation-scope"
        index="04"
        title="How a health report shapes renovation scope"
      >
        <Paragraph>
          A useful renovation conversation starts with what the
          property actually needs, not what the contractor offers
          first. The health report changes the order of those
          conversations.
        </Paragraph>
        <Paragraph>
          Three things typically shift once a baseline exists:
        </Paragraph>

        <BulletList
          items={[
            "Priorities — items that must be resolved before finishes go in (waterproofing, recurring leaks, electrical issues) move ahead of cosmetic items in the sequence.",
            "Sequence — order of works follows what's behind the walls, not just what's visible. Plumbing or electrical changes get committed before tiles, paint, and joinery.",
            "Contractor brief — quotes are written against documented conditions rather than a verbal description, which reduces the gap between estimate and final cost.",
          ]}
        />

        <Paragraph>
          None of this guarantees a fixed budget. It does mean the
          surprises that arrive mid-build are smaller and rarer
          than they would have been without the baseline.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="limits"
        index="05"
        title="What a health report does not replace"
      >
        <Paragraph>
          A health report is a structured assessment, not a
          specialist test. There are areas where dedicated
          investigation is required and where a general report
          should defer to specialists.
        </Paragraph>

        <BulletList
          items={[
            "Structural assessment of load-bearing elements — typically requires a structural engineer where signs of distress or major modification are present.",
            "Specialist leak detection (acoustic, thermal, moisture mapping) — recommended where a leak is suspected but not visible.",
            "Authority-related testing or sign-off — handled separately, where applicable, through engineering and authority workflows.",
            "Specialist MEP testing of installed systems beyond visible inspection.",
          ]}
        />

        <Paragraph>
          Where the report identifies a need for any of these, the
          recommended next step is documented — but the specialist
          test itself sits outside the report's scope.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="omega-path"
        index="06"
        title="When to involve OMEGA"
      >
        <Paragraph>
          A property health report sits at the front of three
          OMEGA paths, depending on what comes next:
        </Paragraph>
        <Paragraph>
          For owners assessing a property's overall condition —
          before a renovation, before a sale, before committing to
          repairs —{" "}
          <InlineLink href="/service-hub/property-health-report">
            OMEGA Property Health Report
          </InlineLink>
          {" "}provides the structured baseline.
        </Paragraph>
        <Paragraph>
          For owners ready to move into renovation,{" "}
          <InlineLink href="/service-hub/renovation">
            OMEGA Renovation
          </InlineLink>
          {" "}takes the report as input and builds scope from a
          documented condition rather than a starting guess.
        </Paragraph>
        <Paragraph>
          Where the report flags items that need engineering input —
          structural modifications, MEP changes, or works requiring
          authority coordination —{" "}
          <InlineLink href="/service-hub/engineering-solutions">
            OMEGA Engineering Solutions
          </InlineLink>
          {" "}handles drawings, technical review, and authority-
          related support where applicable.
        </Paragraph>
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Set the baseline before scope is locked."
        description="A structured property health report maps the property's condition before renovation decisions are made — what's working, what isn't, and what needs technical review."
        primaryLabel="View Property Health Report"
      />

      <ArticleClosing>
        <p>
          Renovation without an assessment is renovation that
          discovers its own scope mid-build. With a health report,
          the property tells you what it needs first — and the
          decisions that follow are decisions about value, not
          surprises.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
