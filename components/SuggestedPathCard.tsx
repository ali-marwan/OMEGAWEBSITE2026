"use client";

import Link from "next/link";
import { Fragment } from "react";
import {
  deriveRecommendedAction,
  deriveSuggestedRoute,
  suggestedRouteHref,
  suggestedRouteRationale,
  type DiagnosisSession,
} from "@/lib/diagnosis";
import type { Lead } from "@/lib/leads";

/**
 * Result panel — shown when the user reaches Step 05.
 *
 * Renders the suggested OMEGA path computed from the session, the
 * rationale paragraph, the recommended next action, and the three
 * primary action buttons:
 *
 *   - "Open <suggested>" → Next.js Link to the matching service hub
 *     detail page (or `/service-hub` for DIY / Speak to Team falls
 *     through to `/#contact`)
 *   - "Submit to OMEGA" → calls `onSubmit`, which (for now) just
 *     marks the session as submitted in local component state. Easy
 *     to wire to a backend later — the entire `DiagnosisSession`
 *     object is the payload.
 *   - "Speak to Team" → /#contact
 *   - "Open Service Hub" → /service-hub
 *
 * The card also surfaces a compact recap of the user's answers so
 * they can verify before submitting.
 */
export function SuggestedPathCard({
  session,
  submittedLead,
  onSubmit,
  onRestart,
}: {
  session: DiagnosisSession;
  /** Non-null after successful `submitLead`. Drives the success state. */
  submittedLead: Lead | null;
  onSubmit: () => void;
  onRestart: () => void;
}) {
  const submitted = submittedLead !== null;
  const route = deriveSuggestedRoute(session);
  const action = deriveRecommendedAction(route);
  const routeHref = route ? suggestedRouteHref(route) : "/service-hub";
  const rationale = route ? suggestedRouteRationale(route) : null;

  // Compact recap rows — shown above the CTA stack for confirmation
  const recap: Array<{ label: string; value: string | null }> = [
    { label: "Property type", value: session.propertyType },
    { label: "Issue category", value: session.issueCategory },
    { label: "Urgency", value: session.urgency },
    { label: "Recurring", value: session.recurringIssue },
    { label: "Location", value: session.location.trim() || null },
  ];

  return (
    <article className="relative rounded-[24px] border border-line/80 bg-warmwhite/85 p-6 md:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_0_rgba(30,30,30,0.02),0_24px_56px_-30px_rgba(30,30,30,0.22)] backdrop-blur-sm">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-technical text-muted">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.6)]"
        />
        {" "}
        <span>Suggested OMEGA Route</span>
      </div>

      {/* Suggested route name */}
      <h2 className="mt-4 text-[1.85rem] md:text-[2.3rem] leading-[1.08] tracking-tightest font-semibold text-graphite">
        {route ?? "Need a little more information"}
      </h2>

      {rationale && (
        <p className="mt-4 max-w-2xl text-base leading-[1.7] text-muted">
          {rationale}
        </p>
      )}

      {/* Recommended next action — pulled out as a small accent row */}
      {action && (
        <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-line/70 bg-warmwhite/90 p-4">
          <span
            aria-hidden
            className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-omega/10 text-omega"
          >
            <ArrowGlyph />
          </span>
          {" "}
          <div>
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
              Recommended next move
            </div>
            <p className="mt-1 text-[0.95rem] leading-[1.6] text-graphite/90">
              {action}
            </p>
          </div>
        </div>
      )}

      {/* Recap row — quick confirmation strip */}
      <div className="mt-7">
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-graphite/70">
          Your Answers
        </div>
        {" "}
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {recap.map((r, i) => (
            <Fragment key={r.label}>
              {i > 0 && " "}
              <li className="flex items-baseline justify-between gap-4 border-b border-line/50 py-2">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                  {r.label}
                </span>
                {" "}
                <span
                  className={`text-[0.88rem] text-right ${
                    r.value ? "text-graphite/90" : "text-graphite/30"
                  }`}
                >
                  {r.value ?? "—"}
                </span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>

      {/* Accuracy note — explicit boundary on what this result is.
          Surfaces *inside* the result card so users see it before
          they decide to submit, not buried at the bottom of the
          page. Mirrors the longer Safety Note panel in DiagnosisCTA
          for consistency. */}
      <p className="mt-6 text-[0.82rem] leading-[1.65] text-muted">
        This is an initial route based on your inputs. OMEGA may
        adjust the scope after review, inspection, or technical
        verification.
      </p>

      {/* CTA stack — exactly the three actions the brief asks for.
          The third action is contextual: it points to the suggested
          route's hub page when one was computed, otherwise it falls
          back to the Service Hub catalog so the button is never a
          dead end. */}
      {!submitted ? (
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          <button
            type="button"
            onClick={onSubmit}
            data-action="DIAGNOSIS_SUBMIT"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
          >
            <span>Submit Diagnosis</span>
            {" "}
            <Arrow />
          </button>
          {" "}
          <Link
            href="/contact"
            data-action="CONTACT_TEAM"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Speak to Team</span>
          </Link>
          {" "}
          <Link
            href={route ? routeHref : "/service-hub"}
            data-action={route ? "OPEN_SUGGESTED_ROUTE" : "OPEN_SERVICE_HUB"}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>View Suggested Service</span>
          </Link>
        </div>
      ) : (
        <SubmittedBlock route={route} routeHref={routeHref} onRestart={onRestart} />
      )}
    </article>
  );
}

function SubmittedBlock({
  route,
  routeHref,
  onRestart,
}: {
  route: ReturnType<typeof deriveSuggestedRoute>;
  routeHref: string;
  onRestart: () => void;
}) {
  return (
    <div className="mt-9">
      <div className="rounded-[14px] border border-omega/40 bg-warmwhite/95 p-5">
        <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.65)]"
          />
          {" "}
          <span>Submitted to OMEGA</span>
        </div>
        <p className="mt-3 text-[0.95rem] leading-[1.6] text-graphite/90">
          Thanks — your diagnosis has been received. The OMEGA team
          will review your input and confirm the right path. You'll
          hear back via your preferred channel.
        </p>
      </div>

      {/* Standardised success CTAs — Speak to Team (primary route to
          /contact), Back to Service Hub (catalog), and the
          contextually-suggested service (only if the router resolved
          a route — null falls back to the Hub). "Start Diagnosis" is
          intentionally omitted since we're already on /diagnosis. A
          quiet "Start a New Diagnosis" reset sits below as a soft
          tertiary action. */}
      <div className="mt-6 flex flex-wrap items-stretch gap-3 md:gap-4">
        <Link
          href="/contact"
          data-action="CONTACT_TEAM"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
        >
          <span>Speak to Team</span>
          {" "}
          <Arrow />
        </Link>
        {" "}
        <Link
          href="/service-hub"
          data-action="OPEN_SERVICE_HUB"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
        >
          <span>Back to Service Hub</span>
        </Link>
        {" "}
        {route && (
          <Link
            href={routeHref}
            data-action="OPEN_SUGGESTED_ROUTE"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>View Suggested Service</span>
          </Link>
        )}
      </div>

      {/* Soft tertiary reset — set apart visually so it doesn't
          compete with the three forward CTAs above. */}
      <button
        type="button"
        onClick={onRestart}
        className="mt-5 inline-flex items-center gap-2 text-[0.85rem] font-medium text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
      >
        <span aria-hidden>↻</span>
        {" "}
        <span>Start a new diagnosis</span>
      </button>
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

function ArrowGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h8m0 0L7 3m4 4-4 4" />
    </svg>
  );
}
