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
 * /insights/why-engineering-review-matters-before-major-changes
 * "Why Engineering Review Matters Before Major Property Changes"
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "layout", label: "Layout changes" },
  { id: "mep", label: "MEP changes" },
  { id: "authority", label: "Authority-related works" },
  { id: "cost-of-skipping", label: "Cost of skipping engineering" },
  { id: "what-it-delivers", label: "What review delivers" },
  { id: "omega-path", label: "When to involve OMEGA" },
];

export function EngineeringReviewBody({ article }: { article: Article }) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          For most property work in the UAE, a competent contractor
          handles scope end to end. Tiles, paint, joinery, fixtures
          — the contractor's experience covers it, and engineering
          review would add cost without adding value.
        </Paragraph>
        <Paragraph>
          For a smaller set of works, that calculus reverses.
          Layout changes, MEP modifications, structural work, and
          anything touching authority-sensitive scope all benefit
          from engineering input before the contractor quotes.
          Skipping that step rarely shows up as a problem on day
          one — it shows up later, often as rework, scope creep,
          or a quote revision that wasn't priced.
        </Paragraph>
      </ArticleSection>

      <ArticleSection id="layout" index="02" title="Layout changes">
        <Paragraph>
          Moving a wall, opening a partition, creating a new
          doorway, or restructuring how rooms connect — all of
          these change how loads transfer through the property and
          how services route between rooms. Some changes are minor
          and well within a contractor's scope. Others touch
          load-bearing elements, structural sequence, or services
          that need to be redirected before finishes go in.
        </Paragraph>
        <Paragraph>
          Engineering review on layout typically addresses three
          questions: what's load-bearing, what's not, and what
          needs to be re-routed if either category changes. The
          answer informs the build sequence, not just the build
          quote — and it's much harder to revisit once tiles are
          down.
        </Paragraph>
      </ArticleSection>

      <ArticleSection id="mep" index="03" title="MEP changes">
        <Paragraph>
          Mechanical, electrical, and plumbing changes are where
          engineering input most often pays back the cost of doing
          it. UAE properties run distributed AC, distributed
          electrical, and distributed plumbing — moving any of
          those is rarely a single-trade job.
        </Paragraph>

        <BulletList
          items={[
            "AC — relocating units, adding zones, changing duct routes, or upgrading capacity all touch refrigerant lines, electrical loads, drainage, and ceiling space.",
            "Electrical — adding circuits, relocating distribution boards, or changing load profiles needs to be sized correctly and coordinated with the building's incoming supply where applicable.",
            "Plumbing — moving wet areas, adding fixtures, or changing drainage routes needs falls, pipework, and waterproofing planned together rather than improvised.",
          ]}
        />

        <Paragraph>
          Coordination is the value engineering review delivers.
          Without it, each trade plans within its own scope and
          the conflicts surface during the build — usually as
          delays and revised scope.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="authority"
        index="04"
        title="Authority-related works"
      >
        <Paragraph>
          Some works touch scope that requires authority
          coordination — formal drawings, submission, review
          response, and sign-off where applicable. Whether and how
          authority involvement applies depends on the property
          type, the works being done, and the building's
          governance, and is confirmed at intake rather than
          assumed.
        </Paragraph>
        <Paragraph>
          What's consistent across these cases: authority workflows
          are document-driven. The submission needs the right
          drawings, the right calculations, and the right format.
          A contractor without engineering input typically can't
          produce that submission, which means the work either
          stalls until engineering catches up or proceeds outside
          the proper process — neither of which is a good place to
          be.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="cost-of-skipping"
        index="05"
        title="The cost of skipping engineering review"
      >
        <Paragraph>
          The most common pattern when engineering is skipped:
          contractor-only scope produces a quote that looks
          competitive, the build starts, and a few weeks in the
          owner discovers an issue that engineering would have
          caught at the brief stage.
        </Paragraph>

        <BulletList
          items={[
            "Layout change opened up a wall that turns out to carry load — partial rework needed.",
            "MEP changes hit a coordination conflict between AC routes and electrical distribution — schedule slips.",
            "Drainage falls don't work for a moved wet area — finishes lifted and re-laid.",
            "Authority sign-off can't be issued because the submission documents weren't produced — handover delayed.",
            "Scope assumptions baked into the contractor quote turn out not to match the property's actual condition — change orders.",
          ]}
        />

        <Paragraph>
          None of these are inevitable. They are the predictable
          consequences of committing scope without an engineering
          view first. The engineering input itself usually costs a
          fraction of any single one of the items above.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-it-delivers"
        index="06"
        title="What an engineering review delivers"
      >
        <Paragraph>
          A useful engineering review produces three kinds of
          output, all of which feed the rest of the project.
        </Paragraph>

        <BulletList
          items={[
            "Drawings — architectural and MEP drawings prepared to the standard the project (or the authority, where applicable) requires.",
            "Coordination — confirmed sequence and interfaces between trades, so contractor scope is written against a clear technical brief rather than a verbal description.",
            "Technical review — independent judgement on the proposed scope, including identification of items that need authority involvement or further specialist input.",
          ]}
        />

        <Paragraph>
          The output is documentation that survives the project.
          Quotes are written against it, contractors deliver to
          it, and the property's record afterwards reflects what
          was actually built rather than what was planned in
          conversation.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="omega-path"
        index="07"
        title="When to involve OMEGA"
      >
        <Paragraph>
          Engineering review applies to a defined set of works.
          For everyday repairs, finishes-only renovations, and
          contractor-managed scope without structural or MEP
          impact, engineering input may not be needed.
        </Paragraph>
        <Paragraph>
          Where the works do touch any of the categories covered
          in this article — layout changes, MEP modifications,
          structural items, or authority-related scope —{" "}
          <InlineLink href="/service-hub/engineering-solutions">
            OMEGA Engineering Solutions
          </InlineLink>
          {" "}covers drawings, design coordination, technical
          review, MEP coordination, and authority-related support
          where applicable.
        </Paragraph>
        <Paragraph>
          Engineering input is usually most cost-effective at the
          start of a project. For renovations already in motion
          where engineering wasn't part of the original brief,
          targeted technical review can still help — but the
          earlier it happens, the smaller the rework risk.
        </Paragraph>
        <Paragraph>
          For renovation projects more broadly,{" "}
          <InlineLink href="/service-hub/renovation">
            OMEGA Renovation
          </InlineLink>
          {" "}coordinates engineering input directly into the
          delivery programme so the two paths run together rather
          than in sequence.
        </Paragraph>
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Engineering before the contractor."
        description="OMEGA Engineering Solutions covers drawings, MEP coordination, technical review, and authority-related support where applicable — typically before scope is committed."
        primaryLabel="View Engineering Solutions"
      />

      <ArticleClosing>
        <p>
          The cheapest place to find a coordination problem is on
          paper. The most expensive place to find it is mid-build.
          Engineering review is the structured way to keep
          property changes in the first category.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
