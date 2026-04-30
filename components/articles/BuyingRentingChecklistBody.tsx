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
 * /insights/what-to-check-before-buying-or-renting-uae
 * "What to Check Before Buying or Renting a Property in the UAE"
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "ac", label: "AC performance" },
  { id: "leakage", label: "Visible leakage and moisture" },
  { id: "water", label: "Water pressure and drainage" },
  { id: "electrical", label: "Electrical visible condition" },
  { id: "finishes", label: "Finishes, doors, windows" },
  { id: "history", label: "Maintenance history" },
  { id: "omega-path", label: "When to involve OMEGA" },
];

export function BuyingRentingChecklistBody({
  article,
}: {
  article: Article;
}) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          Viewing day rarely shows the property at its honest worst.
          The AC has usually been on for hours before the visit,
          finishes have been touched up, lighting has been chosen
          to flatter the rooms, and any recent issues have been
          tidied for the visit. None of this is dishonest — it's
          how viewings work — but it does mean the property's
          quirks rarely show themselves in the time available.
        </Paragraph>
        <Paragraph>
          A structured walk-through is the difference between
          signing on the day and signing with a clear view of what
          the property actually delivers. The list below is what to
          look for in the time you have, and what to ask the
          landlord, agent, or seller before you commit.
        </Paragraph>
      </ArticleSection>

      <ArticleSection id="ac" index="02" title="AC performance">
        <Paragraph>
          AC is the system that most directly shapes how usable a
          UAE property is — and the one most likely to surprise
          new occupants if it isn't checked properly on viewing.
        </Paragraph>

        <BulletList
          items={[
            "Run every AC unit, in every room, at the same time. Wait long enough to feel actual cooling, not just air movement.",
            "Listen for noise — grinding, rattling, persistent vibration, or fan sounds that change pitch unexpectedly.",
            "Check drainage — look under the indoor unit and along the wall below it for staining, swollen skirting, or visible drips.",
            "Compare cooling between rooms. Significant difference between zones may indicate uneven service history or a unit that's struggling.",
            "Note the unit ages if visible. Very old units that haven't been recently serviced are more likely to need work soon.",
          ]}
        />

        <Paragraph>
          Strong cooling on a 25° viewing day doesn't always mean
          strong cooling on a 45° summer day — but weak cooling on
          a 25° viewing day reliably means weak cooling later.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="leakage"
        index="03"
        title="Visible leakage and moisture"
      >
        <Paragraph>
          Leaks leave evidence even after they're cleaned up. The
          evidence is what to look for.
        </Paragraph>

        <BulletList
          items={[
            "Ceilings — look across the surface at an angle for ring stains, slight bulges, or discoloured patches that read differently from the rest of the paint.",
            "Walls — check around windows, beneath bathroom and kitchen walls on adjacent rooms, and at junctions between floors and walls.",
            "Under sinks and behind toilets — open the cabinet under every sink. Stains on the cabinet base, swollen wood, or drip marks are what you're looking for.",
            "Around showers and bathtubs — sealants that have cracked, lifted, or discoloured, and tile grout that reads darker in some spots than others.",
            "Balconies and external walls — water marks that suggest drainage routes the property hasn't been keeping up with.",
          ]}
        />

        <Paragraph>
          A property without any of these signals is rare. A
          property with several of them, or with one signal that
          looks fresh, is worth a second conversation before
          signing.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="water"
        index="04"
        title="Water pressure and drainage"
      >
        <Paragraph>
          Pressure and drainage are easy to test on viewing day
          and tell you a lot about the property's plumbing health.
        </Paragraph>

        <BulletList
          items={[
            "Run hot and cold water at every basin, shower, and kitchen tap. Pressure should be consistent across fixtures.",
            "Run two fixtures at once where possible — pressure should hold rather than drop sharply.",
            "Watch how each drain handles the water. A slow drain that backs up briefly is a flag worth raising before moving in.",
            "Flush every toilet. Confirm the cistern fills cleanly and the bowl clears without re-running.",
            "Check shower drains for pooling — water should clear, not gather.",
            "Listen for unusual sounds in pipework when fixtures are running or when the water is shut off (water hammer, rumbling, kettle-like sounds).",
          ]}
        />
      </ArticleSection>

      <ArticleSection
        id="electrical"
        index="05"
        title="Electrical — visible condition only"
      >
        <Paragraph>
          The electrical assessment on viewing day is visual only.
          Do not open the distribution board, do not test breakers
          beyond switching what would normally be switched, and
          treat anything beyond visible inspection as a question to
          raise rather than a check to perform yourself.
        </Paragraph>

        <BulletList
          items={[
            "Check every accessible light switch and main fixture. Flicker, slow response, or unusual buzzing should be flagged.",
            "Look at every socket you can see. Discolouration, scorching, loose-fitting accessories, or visibly damaged faceplates are all signals.",
            "Open and close any visible cabinets that house lighting or smart-home equipment. Note unusual heat, smells, or visible damage.",
            "Ask whether the property has had recent breaker tripping issues, recent rewiring, or any electrical work in the last 12 months.",
            "Note where the distribution board is and confirm it's accessible — but don't open it.",
          ]}
        />
      </ArticleSection>

      <ArticleSection
        id="finishes"
        index="06"
        title="Finishes, doors, and windows"
      >
        <Paragraph>
          Visible finishes show how the property has been maintained
          and how it will need to be maintained in the future.
        </Paragraph>

        <BulletList
          items={[
            "Paint — areas of touch-up that don't quite match, fresh paint over a moisture mark, or paint that's bubbled or flaked anywhere.",
            "Tiles — cracked or hollow-sounding tiles, grout that's discoloured in patches, signs of recent re-grouting in one area only.",
            "Joinery — cabinet doors, kitchen handles, hinges. Sticking doors and misaligned drawers are usually fixable, but worth noting.",
            "Doors and windows — every door should close cleanly without forcing. Windows should slide or open without binding. Locks should engage smoothly.",
            "Sealants — around windows, in wet areas, around skirting. Cracked or lifted sealant is the most common precursor to moisture issues.",
            "Balconies and external surfaces — drainage points clear, sealants intact, surface condition consistent.",
          ]}
        />
      </ArticleSection>

      <ArticleSection
        id="history"
        index="07"
        title="Maintenance history"
      >
        <Paragraph>
          The property's maintenance record is one of the most
          informative documents in the entire viewing process. It
          is also the document most often missing.
        </Paragraph>

        <BulletList
          items={[
            "Ask for a maintenance log or service history. Even an informal record helps.",
            "Ask specifically about AC servicing — when was the last full service, who did it, what was done.",
            "Ask whether any system has had repeated repairs in the last 12 months. Recurring repairs without resolution are the strongest signal of underlying issues.",
            "Ask about any recent leaks or moisture issues, and how they were resolved.",
            "If the property has been recently renovated, ask what scope was covered and whether it was completed under engineering oversight.",
          ]}
        />

        <Paragraph>
          A property whose owner can answer these questions clearly
          is usually a property that's been managed well. A
          property whose owner can't is not necessarily badly
          managed — but it does mean you're moving in with less
          information than you should have.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="omega-path"
        index="08"
        title="When to involve OMEGA"
      >
        <Paragraph>
          For high-value purchases, properties with multiple
          ambiguous signals, or any property where the maintenance
          history is incomplete, an{" "}
          <InlineLink href="/service-hub/property-health-report">
            OMEGA Property Health Report
          </InlineLink>
          {" "}provides a structured technical view before the
          contract is signed. The report records visible condition
          across MEP, finishes, and core systems, and it identifies
          items that need further specialist review before they
          become the new owner's problem.
        </Paragraph>
        <Paragraph>
          For uncertainty about which path applies — health report
          vs maintenance plan vs targeted repair — the{" "}
          <InlineLink href="/diagnosis">
            OMEGA AI Property Diagnostics
          </InlineLink>
          {" "}flow takes a description plus optional photos and
          suggests the right OMEGA route. Final scope is confirmed
          by the OMEGA team after review.
        </Paragraph>
        <Paragraph>
          Once you've moved in, an{" "}
          <InlineLink href="/service-hub/property-care-system">
            OMEGA Property Care System
          </InlineLink>
          {" "}plan converts the inspection findings into ongoing
          maintenance — so the items the report flagged get tracked
          rather than rediscovered later.
        </Paragraph>
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Make the property tell you the truth — before you sign."
        description="An OMEGA Property Health Report records the property's condition across MEP, finishes, and core systems, with clear photos and recommended actions."
        primaryLabel="View Property Health Report"
      />

      <ArticleClosing>
        <p>
          Viewing day is short. The list of things that go wrong
          after move-in is usually shorter than it looks — but
          only when the right questions are asked while there's
          still time to ask them. A structured walk-through, plus
          a structured assessment for higher-stakes decisions, is
          the difference between knowing the property and hoping
          for the best.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
