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
 * /insights/how-omega-ai-diagnostics-helps-route-issues
 * "How OMEGA AI Diagnostics Helps Route Property Issues"
 *
 * AI positioning discipline (per the brief):
 *   - OMEGA AI is a guided intake and routing layer.
 *   - It does not provide final technical confirmation.
 *   - OMEGA team confirms scope where required.
 */

const tocEntries: readonly TocEntry[] = [
  { id: "introduction", label: "Introduction" },
  { id: "what-it-collects", label: "What the diagnosis collects" },
  { id: "how-it-works", label: "How the flow works" },
  { id: "routing", label: "How routing works" },
  { id: "human-confirmation", label: "Human confirmation" },
  { id: "limits", label: "What it does not do" },
];

export function AiDiagnosticsRoutingBody({
  article,
}: {
  article: Article;
}) {
  return (
    <ArticleBodyShell article={article} tocEntries={tocEntries}>
      <ArticleSection id="introduction" index="01" title="Introduction">
        <Paragraph>
          Property issues rarely arrive with a clear label. A leak
          could be plumbing, AC condensate, sealant failure, or a
          building-level issue routed through the unit. An AC fault
          might be a maintenance item, an electrical issue, or a
          symptom of larger system wear. The right service path
          depends on a context the owner often doesn't have at
          hand — and shouldn't be expected to.
        </Paragraph>
        <Paragraph>
          OMEGA AI Property Diagnostics is the structured intake
          layer that handles that translation. It collects what
          the owner can describe and observe, and routes the
          request to the right OMEGA service path. It is not a
          chatbot, and it is not a substitute for technical
          confirmation. It is the front door.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="what-it-collects"
        index="02"
        title="What the diagnosis collects"
      >
        <Paragraph>
          The diagnosis flow is short. It asks for what the OMEGA
          team would otherwise have to ask for in a phone call or
          on the first site visit, in a format that's structured
          enough to route on.
        </Paragraph>

        <BulletList
          items={[
            "Property type — apartment, villa, townhouse, office, retail, F&B, or other. Routes scope and access expectations.",
            "Issue category — AC, plumbing, electrical, civil/finishes, renovation, inspection, authority/engineering, or 'not sure'. Anchors the routing logic.",
            "Description — a short note from the owner about what is happening, where, and what's already been tried.",
            "Photos — optional, but typically the fastest way to communicate the situation clearly.",
            "Urgency — Normal, Urgent, or Critical. Critical issues skip the routing logic entirely and escalate to a direct contact path.",
            "Context — location, recurring issue flag, access availability, affected areas, and any cross-system signals (water, power, AC).",
          ]}
        />

        <Paragraph>
          None of these are required to be precise — they only need
          to be honest. The OMEGA team confirms scope after review,
          and the diagnosis output is initial guidance, not a
          binding diagnosis.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="how-it-works"
        index="03"
        title="How the flow works"
      >
        <Paragraph>
          The diagnosis runs as five steps. Each step has its own
          required fields; the user can move back to revise earlier
          answers without losing the session.
        </Paragraph>

        <BulletList
          items={[
            "Step 01 — Property Type. Sets the baseline scope and access context.",
            "Step 02 — Issue Category. Anchors the routing path; 'Not Sure' is a valid answer that defers routing to the description.",
            "Step 03 — Issue Description. Free text plus optional photo upload and an urgency selector.",
            "Step 04 — Property Context. Location, recurrence, access, and the cross-system signal flags.",
            "Step 05 — Suggested Route. The result panel — initial guidance only, with the recommended next move and the right OMEGA path.",
          ]}
        />

        <Paragraph>
          A live summary panel updates after every answer so the
          user sees the routing logic resolve as the inputs come
          in. The full session is a structured object that the
          OMEGA team and any future backend can ingest without
          reformatting.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="routing"
        index="04"
        title="How routing works"
      >
        <Paragraph>
          The routing logic is encoded once and applied
          consistently. It maps the inputs onto one of the OMEGA
          paths:
        </Paragraph>

        <BulletList
          items={[
            "DIY guidance — for issues that are typically self-resolvable, with a clear note about when to escalate if they don't.",
            "OMEGA Home Services — AC, plumbing, electrical, and general repairs. The default path for one-off everyday issues.",
            "OMEGA Property Care System — recurring issues, multi-system signals, or properties where structured ongoing care is the better fit.",
            "OMEGA Property Health Report — unclear issues, properties being sold or rented, properties planning renovation, or recurring problems with no clear cause.",
            "OMEGA Renovation — works that go beyond repair into upgrade, fit-out, or property transformation.",
            "OMEGA Engineering Solutions — drawings, MEP coordination, technical review, or authority-related work.",
            "Speak to Team — the path for any issue marked Critical urgency, or for situations where the routing isn't conclusive.",
          ]}
        />

        <Paragraph>
          Two priorities override everything else. Critical urgency
          escalates directly to the team — it does not get routed
          through service modules. And recurring issues or
          multi-system signals usually point to Property Care
          rather than another single-visit repair.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="human-confirmation"
        index="05"
        title="The role of human confirmation"
      >
        <Paragraph>
          The diagnosis output is a starting point. Every
          suggestion is initial guidance — the OMEGA team
          confirms scope after review, and the right service path
          can change once a specialist has looked at the photos,
          the description, or the property itself.
        </Paragraph>
        <Paragraph>
          That confirmation is not a delay — it's the design. AI
          routing without human oversight either underclaims (so
          you end up on the wrong path) or overclaims (so you make
          decisions on guidance the system isn't qualified to give).
          The OMEGA AI flow stays inside its lane: structured
          intake plus initial guidance, with confirmation handled
          by people.
        </Paragraph>
      </ArticleSection>

      <ArticleSection
        id="limits"
        index="06"
        title="What OMEGA AI Diagnostics does not do"
      >
        <Paragraph>
          The flow is intentionally bounded. It is worth being
          explicit about what it isn't.
        </Paragraph>

        <BulletList
          items={[
            "It does not provide final technical diagnosis. The output is initial guidance, not a definitive call.",
            "It does not replace site inspection. Where inspection is the right next step, that's what the routing recommends.",
            "It does not commit OMEGA to a specific scope, timeline, or cost. Those are confirmed after review.",
            "It does not handle emergency response. Critical urgency escalates directly to the team, but the AI flow itself is not a 24/7 dispatch system.",
            "It does not collect more information than it asks for. The session does not run silently in the background after the user submits.",
          ]}
        />

        <SafetyCallout>
          <p>
            For active leaks, electrical hazards, fire/life-safety
            risks, AC shutdowns, or anything that may damage
            property or affect safety, contact OMEGA directly. Do
            not wait for a routed response in those cases — the
            urgency selector exists precisely so the situation
            skips routing and reaches a person quickly.
          </p>
        </SafetyCallout>
      </ArticleSection>

      <InlineCtaPanel
        article={article}
        heading="Start a guided diagnosis."
        description="OMEGA AI Property Diagnostics takes a description, optional photos, and a few context questions, and routes the request to the right OMEGA service path."
        primaryLabel="Start Diagnosis"
      />

      <ArticleClosing>
        <p>
          The strongest part of OMEGA AI Diagnostics is what it
          doesn't try to do. It is structured intake, careful
          routing, and a clean handoff to people who confirm scope
          — not a system pretending to do work that requires
          judgement it doesn't have. That boundary is the design,
          not a limitation.
        </p>
      </ArticleClosing>
    </ArticleBodyShell>
  );
}
