"use client";

import { Fragment } from "react";
import {
  deriveRecommendedAction,
  deriveSuggestedRoute,
  type DiagnosisSession,
} from "@/lib/diagnosis";

/**
 * Live summary panel — sticky on desktop (right column), collapsed
 * inline on mobile.
 *
 * Reflects whatever has been answered so far and recomputes the
 * suggested route on every render. The panel is intentionally
 * read-only — it surfaces state, doesn't mutate it.
 *
 * The "Pending" pattern keeps the panel honest: a row only shows a
 * concrete value once the user has answered. Until then it shows a
 * dim "—" so the panel never lies about progress.
 */
export function DiagnosisSummaryPanel({
  session,
}: {
  session: DiagnosisSession;
}) {
  const route = deriveSuggestedRoute(session);
  const action = deriveRecommendedAction(route);

  const rows: Array<{ label: string; value: string | null }> = [
    { label: "Property type", value: session.propertyType },
    { label: "Issue category", value: session.issueCategory },
    { label: "Urgency", value: session.urgency },
    {
      label: "Description",
      value: session.description.trim()
        ? truncate(session.description.trim(), 90)
        : null,
    },
    { label: "Location", value: session.location.trim() || null },
    { label: "Recurring", value: session.recurringIssue },
    { label: "Access", value: session.accessAvailable },
  ];

  const signals = [
    session.hasWaterLeakage ? "Water" : null,
    session.hasPowerIssue ? "Power" : null,
    session.hasACShutdown ? "AC shutdown" : null,
  ].filter((x): x is string => Boolean(x));

  return (
    <aside
      aria-label="Diagnosis summary"
      className="relative rounded-[20px] border border-line/80 bg-warmwhite/70 p-6 md:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)] backdrop-blur-sm"
    >
      {/* Heading row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-technical text-graphite/80">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
          />
          {" "}
          <span>Diagnosis Summary</span>
        </div>
        {" "}
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          Updates as you answer
        </span>
      </div>

      {/* Suggested-route hero block */}
      <div className="mt-5 rounded-[14px] border border-line/70 bg-warmwhite/85 p-4">
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          Suggested Route
        </div>
        <div className="mt-2 flex items-center gap-2">
          {route ? (
            <>
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
              />
              {" "}
              <span className="text-[1.05rem] font-semibold text-graphite leading-tight">
                {route}
              </span>
            </>
          ) : (
            <>
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full border border-graphite/25"
              />
              {" "}
              <span className="text-[0.95rem] text-muted leading-tight">
                Pending — answer the next question
              </span>
            </>
          )}
        </div>
        {action && (
          <p className="mt-3 text-[0.86rem] leading-[1.6] text-muted">
            {action}
          </p>
        )}
      </div>

      {/* Field-by-field status */}
      <dl className="mt-5 divide-y divide-line/50">
        {rows.map((row, i) => (
          <Fragment key={row.label}>
            {i > 0 && " "}
            <div className="flex items-start justify-between gap-4 py-2.5">
              <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                {row.label}
              </dt>
              {" "}
              <dd
                className={`text-right text-[0.86rem] leading-[1.5] ${
                  row.value ? "text-graphite/90" : "text-graphite/30"
                }`}
              >
                {row.value ?? "—"}
              </dd>
            </div>
          </Fragment>
        ))}

        {/* Cross-system signals row */}
        <div className="flex items-start justify-between gap-4 py-2.5">
          <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            Signals
          </dt>
          {" "}
          <dd
            className={`text-right text-[0.86rem] leading-[1.5] ${
              signals.length > 0 ? "text-graphite/90" : "text-graphite/30"
            }`}
          >
            {signals.length > 0 ? signals.join(" · ") : "—"}
          </dd>
        </div>

        {/* Photos */}
        <div className="flex items-start justify-between gap-4 py-2.5">
          <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            Photos
          </dt>
          {" "}
          <dd
            className={`text-right text-[0.86rem] leading-[1.5] ${
              session.uploadedPhotos.length > 0
                ? "text-graphite/90"
                : "text-graphite/30"
            }`}
          >
            {session.uploadedPhotos.length > 0
              ? `${session.uploadedPhotos.length} attached`
              : "—"}
          </dd>
        </div>
      </dl>

      {/* Footnote */}
      <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
        Initial route only · OMEGA confirms where required
      </p>
    </aside>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
