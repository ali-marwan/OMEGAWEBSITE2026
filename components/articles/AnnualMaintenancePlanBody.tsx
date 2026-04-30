import Link from "next/link";
import { Fragment } from "react";
import type { Article } from "@/lib/insights";

/**
 * Full article body for the first published OMEGA Insights piece:
 *
 *   /insights/annual-maintenance-plan-uae-property
 *   "What an Annual Maintenance Plan Should Cover in a UAE Property"
 *
 * This component is the live replacement for the placeholder body
 * rendered by `<ArticleBody />` for the `annual-maintenance-plan-
 * uae-property` slug. It carries the article's narrative, the
 * inline CTA panel (section 8 of the brief), and the closing
 * paragraph (section 9).
 *
 * When the article-detail page detects this slug has a real body
 * (via `HAS_FULL_BODY` from `ArticleBody.tsx`), it suppresses the
 * generic page-level `<ArticleFinalCTA />` so the in-body CTA is
 * the only call-to-act surface — no double-CTA redundancy.
 *
 * Layout matches the placeholder body's chrome (sticky right-rail
 * TOC on lg+, narrow content column with comfortable measure on
 * desktop, full-width on mobile) so all articles feel
 * structurally identical regardless of body source.
 *
 * Voice / claims discipline (per the brief):
 *   - No fixed timelines, guaranteed approvals, fake stats, or
 *     invented regulations.
 *   - Hedged wording where appropriate ("typically", "may", "where
 *     applicable", "subject to site condition", "confirmed after
 *     review").
 *   - Engineering-led tone — practical, calm, premium, never
 *     salesy.
 */
export function AnnualMaintenancePlanBody({
  article,
}: {
  article: Article;
}) {
  return (
    <section
      id="article-body"
      className="relative bg-warmwhite pt-10 pb-12 md:pt-14 md:pb-14"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-50"
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          {/* Content column. Narrow measure (~70ch) on desktop for
              comfortable reading. */}
          <article className="col-span-12 lg:col-span-8 space-y-12">
            {/* ─── 01. Introduction ──────────────────────────────── */}
            <ArticleSection
              id="introduction"
              index="01"
              title="Introduction"
            >
              <Paragraph>
                Many property issues start small. A drip you noticed
                last week. An AC that takes a little longer to cool
                the room. A hairline crack near a doorframe.
                Individually they're trivial — but UAE properties
                operate under conditions that turn small issues into
                expensive ones if they're left to compound over time.
              </Paragraph>
              <Paragraph>
                Heat load on AC systems runs near continuously through
                summer. Water leakage tracks across finishes faster in
                coastal humidity. MEP-related service needs accumulate
                quietly between visible problems.
              </Paragraph>
              <Paragraph>
                A useful annual maintenance plan is not a list of
                emergency repairs waiting to happen. It is a structured
                property care system that catches issues before they
                escalate, tracks what's been done, and gives the owner
                a clear view of what the property actually needs.
              </Paragraph>
            </ArticleSection>

            {/* ─── 02. What a maintenance plan should include ─── */}
            <ArticleSection
              id="what-it-should-include"
              index="02"
              title="What an annual maintenance plan should include"
            >
              <Paragraph>
                A practical plan has seven components that work
                together. None of them is exotic — the value is in
                running them on a fixed cadence, recording what's
                found, and connecting one visit to the next.
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

            {/* ─── 03. What should not be ignored ───────────────── */}
            <ArticleSection
              id="what-not-to-ignore"
              index="03"
              title="What should not be ignored"
            >
              <Paragraph>
                Some signals are worth taking seriously even when
                they look minor in isolation. The pattern matters
                more than any single occurrence.
              </Paragraph>

              <ul className="mt-2 space-y-3">
                {[
                  "Recurring AC issues — the same fault reappearing after repair.",
                  "Repeated leaks in the same location.",
                  "Electrical tripping with no clear cause.",
                  "Moisture marks that grow or change colour.",
                  "New cracks, or cracks that widen between visits.",
                  "Sudden drops in water pressure.",
                  "Smells from drainage that don't resolve after cleaning.",
                  "Sealants that crack, lift, or discolour.",
                  "Repairs that were closed without documented resolution.",
                ].map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && " "}
                    <li className="flex items-start gap-3 text-base leading-[1.7] text-graphite/85">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-omega"
                      />
                      {" "}
                      <span>{item}</span>
                    </li>
                  </Fragment>
                ))}
              </ul>

              <Paragraph>
                Each of these may be minor. Each of them may also be
                the visible part of something larger. They are worth
                flagging for technical review rather than absorbing
                as "just how the property is."
              </Paragraph>
            </ArticleSection>

            {/* ─── 04. Property care vs one-time repair ─────────── */}
            <ArticleSection
              id="care-vs-repair"
              index="04"
              title="Property care vs one-time repair"
            >
              <Paragraph>
                There's a difference between fixing a problem and
                managing a property.
              </Paragraph>
              <Paragraph>
                A one-time repair fixes the immediate issue. It
                closes the ticket. It rarely captures what caused the
                issue, what's likely to happen next, or what should
                be checked before the next thing fails.
              </Paragraph>
              <Paragraph>
                Property care creates a recurring support structure.
                Issues are documented, tracked, and connected to the
                property's condition history. Repairs are not
                isolated events; they're entries in an ongoing record.
              </Paragraph>
              <Paragraph>
                For owners moving from reactive repairs to structured
                care, the shift is mostly about visibility — knowing
                what's been done, what's pending, and what the
                property actually needs over time.
              </Paragraph>
            </ArticleSection>

            {/* ─── 05. When to request a property health report ─── */}
            <ArticleSection
              id="health-report"
              index="05"
              title="When to request a property health report"
            >
              <Paragraph>
                Annual maintenance is the right structure for most
                properties most of the time. It's not always the
                right starting point.
              </Paragraph>
              <Paragraph>
                If the property has multiple unresolved issues,
                recurring problems that have been repaired more than
                once, a planned renovation, or a buying or rental
                decision in motion, a property health report is often
                the better first step. The report establishes a
                baseline before further repairs are committed —
                what's working, what isn't, what needs technical
                review, and what should be addressed before scope is
                locked.
              </Paragraph>
              <Paragraph>
                Read more about the{" "}
                <Link
                  href="/service-hub/property-health-report"
                  className="text-graphite underline decoration-omega/40 underline-offset-4 transition-colors duration-500 ease-elegant hover:text-omega hover:decoration-omega"
                >
                  OMEGA Property Health Report
                </Link>
                {" "}— a structured way to map the property before any
                repair scope is committed.
              </Paragraph>
              <Paragraph>
                Once the baseline is clear, an annual maintenance
                plan continues from there with a structured view of
                the property rather than a series of disconnected
                repairs.
              </Paragraph>
            </ArticleSection>

            {/* ─── 06. How OMEGA approaches annual property care ─ */}
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
                Scope depends on the property — type, condition,
                access, and the specific service requirements agreed
                with the owner. There is no single fixed package;
                what works for an apartment in a serviced tower
                differs from what works for a standalone villa, and
                what suits an active commercial space differs again.
              </Paragraph>
              <Paragraph>
                Where works fall outside the agreed scope — for
                example, large repairs, structural items, or works
                requiring authority coordination — they are flagged,
                scoped separately, and handled through the relevant
                OMEGA path. Annual maintenance is the structure that
                holds the recurring care; the{" "}
                <Link
                  href="/service-hub"
                  className="text-graphite underline decoration-omega/40 underline-offset-4 transition-colors duration-500 ease-elegant hover:text-omega hover:decoration-omega"
                >
                  Service Hub
                </Link>
                {" "}holds the modules that handle larger items when
                they appear.
              </Paragraph>
            </ArticleSection>

            {/* ─── 07. Inline CTA panel — "Start with structured care" ─ */}
            <InlineCtaPanel article={article} />

            {/* ─── Closing paragraph ─────────────────────────────── */}
            <div
              id="closing"
              className="border-t border-line/60 pt-8 text-base md:text-[1.05rem] leading-[1.75] text-graphite/85"
            >
              <p>
                A good annual maintenance plan is not only about fixing
                problems. It is about knowing what needs attention,
                what can wait, what requires technical review, and
                how the property should be supported over time.
              </p>
            </div>
          </article>

          {/* Sticky right-rail TOC on lg+. Hidden on mobile to keep
              the reading flow uncluttered. Anchors match the
              section ids above. */}
          <aside className="hidden lg:block col-span-12 lg:col-span-4">
            <div className="sticky top-[140px] rounded-[20px] border border-line/80 bg-warmwhite/85 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)]">
              <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                />
                {" "}
                <span>In this insight</span>
              </div>

              <ol className="mt-5 space-y-3 text-[0.9rem] leading-[1.6]">
                {[
                  { id: "introduction", label: "Introduction" },
                  {
                    id: "what-it-should-include",
                    label: "What a plan should include",
                  },
                  {
                    id: "what-not-to-ignore",
                    label: "What should not be ignored",
                  },
                  {
                    id: "care-vs-repair",
                    label: "Property care vs one-time repair",
                  },
                  {
                    id: "health-report",
                    label: "When to request a health report",
                  },
                  {
                    id: "omega-approach",
                    label: "How OMEGA approaches care",
                  },
                ].map((entry, i) => (
                  <Fragment key={entry.id}>
                    {i > 0 && " "}
                    <li className="flex items-baseline gap-3">
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {" "}
                      <a
                        href={`#${entry.id}`}
                        className="text-muted transition-colors duration-500 ease-elegant hover:text-graphite"
                      >
                        {entry.label}
                      </a>
                    </li>
                  </Fragment>
                ))}
              </ol>

              {/* Mono meta strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                <div>
                  <div className="text-graphite/60">Reading time</div>
                  <div className="mt-1 text-graphite/90">
                    {article.readingTime} min
                  </div>
                </div>
                <div>
                  <div className="text-graphite/60">Category</div>
                  <div className="mt-1 normal-case tracking-[0.02em] text-graphite/90">
                    {article.category}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ── Building blocks ─────────────────────────────────────────────── */

/**
 * One numbered article section. Index strip + heading + body.
 * Anchored via `id` so the sticky TOC can scroll to it.
 */
function ArticleSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id}>
      <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
        />
        {" "}
        <span>{index}</span>
        {" "}
        <span aria-hidden className="h-3 w-px bg-line" />
        {" "}
        <span>{title}</span>
      </div>
      <h2 className="mt-3 text-[1.4rem] md:text-[1.6rem] leading-[1.2] tracking-tightest font-semibold text-graphite">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

/**
 * One labelled subsection inside section 02. Letter prefix + bold
 * title + body. Indented slightly relative to the parent section
 * so the hierarchy is visible without heavy chrome.
 */
function Subsection({
  letter,
  title,
  body,
}: {
  letter: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mt-6 border-l-2 border-line/70 pl-5">
      <div className="flex items-baseline gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
        <span>{letter}</span>
      </div>
      <h3 className="mt-1 text-[1.1rem] md:text-[1.15rem] font-semibold leading-[1.3] text-graphite">
        {title}
      </h3>
      <p className="mt-2 text-base leading-[1.75] text-graphite/85">
        {body}
      </p>
    </div>
  );
}

/**
 * Standardised body paragraph — comfortable line height + slightly
 * darker text than the placeholder body to signal "real content".
 */
function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base md:text-[1.05rem] leading-[1.75] text-graphite/85">
      {children}
    </p>
  );
}

/**
 * Inline article CTA panel — section 08 of the brief.
 * Replaces the page-level `<ArticleFinalCTA />` for this article so
 * the reader sees one CTA per page (not two). Three buttons match
 * the brief verbatim:
 *
 *   1. View Property Care System  → /service-hub/property-care-system
 *   2. Start Diagnosis            → /diagnosis
 *   3. Speak to Team              → /contact
 *
 * Visually identical to the rest of the OMEGA CTA blocks: omega
 * eyebrow row + headline + supporting paragraph + button row, with
 * arch-rule top + bottom for closing rhythm.
 */
function InlineCtaPanel({ article }: { article: Article }) {
  return (
    <div
      id="cta-panel"
      className="rounded-[24px] border border-line/80 bg-warmwhite/90 p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)]"
    >
      <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
        />
        {" "}
        <span>From insight to action</span>
      </div>

      <h2 className="mt-4 text-[1.5rem] md:text-[1.85rem] leading-[1.1] tracking-tightest font-semibold text-graphite">
        Start with structured property care.
      </h2>

      <p className="mt-3 max-w-2xl text-base leading-[1.7] text-muted">
        OMEGA Property Care System helps organize annual maintenance,
        ongoing support, and issue follow-up for UAE properties.
      </p>

      <div className="mt-7 flex flex-wrap items-stretch gap-3 md:gap-4">
        <Link
          href={article.relatedRoute}
          data-action="OPEN_SUGGESTED_ROUTE"
          data-article-slug={article.slug}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
        >
          <span>View Property Care System</span>
          {" "}
          <Arrow />
        </Link>
        {" "}
        <Link
          href="/diagnosis"
          data-action="START_DIAGNOSIS"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
        >
          <span>Start Diagnosis</span>
        </Link>
        {" "}
        <Link
          href="/contact"
          data-action="CONTACT_TEAM"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
        >
          <span>Speak to Team</span>
        </Link>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h8m0 0L7 3m4 4-4 4" />
    </svg>
  );
}
