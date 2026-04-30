import Link from "next/link";
import { Fragment } from "react";
import type { Article } from "@/lib/insights";

/**
 * Shared building blocks used by every full-body OMEGA Insights
 * article. Extracted so per-article files stay focused on the
 * narrative — they import the chrome (shell + TOC + section
 * primitives + CTA panel) and provide content.
 *
 * Voice / claims discipline (applies to every article that uses
 * these helpers):
 *   - No fixed timelines, guaranteed approvals, fake stats, or
 *     invented regulations.
 *   - Hedged wording where appropriate ("typically", "may",
 *     "where applicable", "subject to site condition", "confirmed
 *     after review").
 *   - No DIY guidance that involves opening AC units, electrical
 *     panels, refrigerant systems, plumbing systems, pumps, or DBs.
 *   - The only safety message that scales across articles is the
 *     standard one used in <SafetyCallout> below — kept short.
 */

/* ── Article body shell ──────────────────────────────────────────── */

export type TocEntry = {
  /** Anchor id matching the section's `id` prop. */
  id: string;
  /** Short label shown in the sticky right-rail TOC. */
  label: string;
};

/**
 * Wraps every full article body in the standard chrome:
 *   - Section wrapper with `arch-grid` backdrop
 *   - 12-col grid, 8-col content + 4-col TOC sidebar on lg+
 *   - Stacked single-column on <lg
 *
 * `tocEntries` drives the right-rail navigation. Every numbered
 * `<ArticleSection>` should have an `id` matching one of these
 * entries so the anchor links resolve.
 */
export function ArticleBodyShell({
  article,
  tocEntries,
  children,
}: {
  article: Article;
  tocEntries: readonly TocEntry[];
  children: React.ReactNode;
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
          <article className="col-span-12 lg:col-span-8 space-y-12">
            {children}
          </article>

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
                {tocEntries.map((entry, i) => (
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

/* ── Section building blocks ─────────────────────────────────────── */

/**
 * One numbered article section. Index strip + heading + body.
 * Anchored via `id` so the sticky TOC can scroll to it.
 */
export function ArticleSection({
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
 * Lettered subsection (A, B, C…) used inside section bodies for
 * structured lists where each item deserves its own short body.
 */
export function Subsection({
  letter,
  title,
  body,
}: {
  letter: string;
  title: string;
  body: React.ReactNode;
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
 * Sub-heading (h3) used for inline section breaks where a lettered
 * subsection is too heavy. No left border, no letter — just a quiet
 * heading + body slot.
 */
export function SubHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-[1.05rem] md:text-[1.15rem] font-semibold leading-[1.3] text-graphite">
        {title}
      </h3>
      {children && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

/** Standardised body paragraph. */
export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base md:text-[1.05rem] leading-[1.75] text-graphite/85">
      {children}
    </p>
  );
}

/** Bullet list of plain strings. */
export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-3">
      {items.map((item, i) => (
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
  );
}

/**
 * Safety / accuracy callout — used at the foot of articles where
 * readers might be tempted to act on visible signals without a
 * professional. The default copy covers the standard "active risk →
 * contact OMEGA directly" message; pass children to override.
 */
export function SafetyCallout({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="rounded-[14px] border border-omega/30 bg-omega/[0.04] p-4 md:p-5">
      <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-omega">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
        />
        {" "}
        <span>Safety Note</span>
      </div>
      <div className="mt-2 text-[0.92rem] leading-[1.7] text-graphite/85">
        {children ?? (
          <p>
            For active leaks, electrical hazards, fire/life-safety
            risks, or anything that may damage property or affect
            safety, contact OMEGA directly. Do not attempt to open AC
            units, electrical panels, refrigerant systems, pumps, or
            distribution boards.
          </p>
        )}
      </div>
    </aside>
  );
}

/* ── Inline CTA panel ────────────────────────────────────────────── */

/**
 * Inline article CTA panel. Article-specific `heading` and
 * `description` are passed by the article body; the buttons follow
 * the standardised pattern:
 *
 *   1. Primary  → article.relatedRoute (label: per article)
 *   2. Ghost    → /diagnosis (skipped if relatedRoute is /diagnosis)
 *   3. Ghost    → /contact   (skipped if relatedRoute is /contact)
 *
 * `primaryLabel` overrides the auto-generated label
 * (`View ${ServiceName}`); pass when the article wants a different
 * CTA label like "Request a Health Report" or "Open Service Hub".
 */
export function InlineCtaPanel({
  article,
  heading,
  description,
  primaryLabel,
}: {
  article: Article;
  heading: string;
  description: string;
  primaryLabel?: string;
}) {
  const isDiagnosis = article.relatedRoute === "/diagnosis";
  const showDiagnosisCta = !isDiagnosis;
  const showContactCta = article.relatedRoute !== "/contact";

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
        {heading}
      </h2>

      <p className="mt-3 max-w-2xl text-base leading-[1.7] text-muted">
        {description}
      </p>

      <div className="mt-7 flex flex-wrap items-stretch gap-3 md:gap-4">
        <Link
          href={article.relatedRoute}
          data-action={
            isDiagnosis ? "START_DIAGNOSIS" : "OPEN_SUGGESTED_ROUTE"
          }
          data-article-slug={article.slug}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
        >
          <span>{primaryLabel ?? article.relatedCTA}</span>
          {" "}
          <Arrow />
        </Link>
        {" "}
        {showDiagnosisCta && (
          <>
            <Link
              href="/diagnosis"
              data-action="START_DIAGNOSIS"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
            >
              <span>Start Diagnosis</span>
            </Link>
            {" "}
          </>
        )}
        {showContactCta && (
          <Link
            href="/contact"
            data-action="CONTACT_TEAM"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Speak to Team</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Closing paragraph ───────────────────────────────────────────── */

/**
 * The article's last word. Visually set apart with a top hairline
 * + slightly darker text so it reads as a deliberate sign-off.
 */
export function ArticleClosing({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="closing"
      className="border-t border-line/60 pt-8 text-base md:text-[1.05rem] leading-[1.75] text-graphite/85"
    >
      {children}
    </div>
  );
}

/* ── Inline link helper ──────────────────────────────────────────── */

/**
 * Anchor styled with the underline + decoration treatment used
 * inline within article paragraphs. Centralised so all eight
 * articles render inline links identically.
 */
export function InlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-graphite underline decoration-omega/40 underline-offset-4 transition-colors duration-500 ease-elegant hover:text-omega hover:decoration-omega"
    >
      {children}
    </Link>
  );
}

/* ── Glyph ───────────────────────────────────────────────────────── */

export function Arrow() {
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
