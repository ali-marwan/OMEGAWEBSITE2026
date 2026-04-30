"use client";

import { useCallback, useMemo, useState } from "react";
import {
  diagnosisSteps,
  initialDiagnosisSession,
  deriveRecommendedAction,
  deriveSuggestedRoute,
  suggestedRouteHref,
  type DiagnosisSession,
  type StepCode,
} from "@/lib/diagnosis";
import { buildLead, submitLead, type Lead } from "@/lib/leads";
import { DiagnosisStep } from "./DiagnosisStep";
import { DiagnosisStepper } from "./DiagnosisStepper";
import { DiagnosisSummaryPanel } from "./DiagnosisSummaryPanel";
import { SuggestedPathCard } from "./SuggestedPathCard";

/**
 * The state-bearing client component that runs the full diagnosis
 * flow end-to-end. Owns:
 *
 *   - The `DiagnosisSession` object (single source of truth for
 *     answered fields). Any step can mutate any field via `patch`.
 *   - The active step pointer (`stepIndex` ∈ [0, 4]).
 *   - The `completedSteps` set (which prior steps the user has
 *     answered enough to count as complete — drives the stepper UI
 *     and what the user is allowed to jump back to).
 *   - The `submitted` flag flipped when the user clicks "Submit to
 *     OMEGA" on the result panel.
 *
 * Layout:
 *   - Desktop ≥ lg: 12-col grid, left col-span-7 form + right
 *     col-span-5 summary, summary is `lg:sticky` to follow scroll.
 *   - Mobile / tablet: single column, stepper on top, form, then
 *     summary, then a sticky bottom navigation bar with Back / Next.
 *
 * The flow ALWAYS shows the summary panel — even on step 5 — so the
 * user can see what they answered while reviewing the suggested
 * path. The form column on step 5 swaps from a step form to the
 * full `<SuggestedPathCard />`.
 */
export function DiagnosisExperience() {
  const [session, setSession] =
    useState<DiagnosisSession>(initialDiagnosisSession);
  const [stepIndex, setStepIndex] = useState(0);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<StepCode>>(
    new Set()
  );

  const activeStep = diagnosisSteps[stepIndex];
  const isLastStep = stepIndex === diagnosisSteps.length - 1;

  const patch = useCallback(
    (next: Partial<DiagnosisSession>) => {
      setSession((prev) => {
        const merged: DiagnosisSession = { ...prev, ...next };
        // Keep computed fields in sync so any consumer (incl. the
        // submit payload) sees a fresh suggested route + action.
        const route = deriveSuggestedRoute(merged);
        merged.suggestedRoute = route;
        merged.recommendedAction = deriveRecommendedAction(route);
        return merged;
      });
    },
    []
  );

  /** Whether the active step has enough data to advance. */
  const canAdvance = useMemo(() => {
    switch (activeStep.code) {
      case "PROPERTY_TYPE":
        return session.propertyType !== null;
      case "ISSUE_CATEGORY":
        return session.issueCategory !== null;
      case "ISSUE_DESCRIPTION":
        return session.description.trim().length > 0 && session.urgency !== null;
      case "PROPERTY_CONTEXT":
        // Recurring + access are the two anchor signals. Affected
        // areas / location / signals are optional.
        return (
          session.recurringIssue !== null && session.accessAvailable !== null
        );
      case "SUGGESTED_PATH":
        return true;
    }
  }, [activeStep.code, session]);

  const goNext = useCallback(() => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(activeStep.code);
      return next;
    });
    setStepIndex((i) => Math.min(i + 1, diagnosisSteps.length - 1));
    // Keep focus near the form column on advance — small RAF chain
    // so the new step has time to mount before scroll.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById("diagnosis-flow")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, [activeStep.code]);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById("diagnosis-flow")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, []);

  /**
   * Jump directly to a step from the stepper rail. Only allowed if
   * the user has already completed it (the stepper itself blocks
   * clicks on locked steps; this guards programmatic calls too).
   */
  const goToStep = useCallback(
    (code: StepCode) => {
      const idx = diagnosisSteps.findIndex((s) => s.code === code);
      if (idx === -1) return;
      // Block forward jumps to incomplete steps.
      if (idx > stepIndex && !completedSteps.has(code)) return;
      setStepIndex(idx);
    },
    [stepIndex, completedSteps]
  );

  const handleSubmit = useCallback(async () => {
    // Build the canonical `Lead` from the session so backend / CRM /
    // mobile app see the same shape every form on the site produces.
    // The diagnosis-specific fields (urgency, suggestedRoute, etc.)
    // are folded into `extra` so the top-level shape stays clean.
    const route = deriveSuggestedRoute(session);
    const lead = buildLead({
      route: "/diagnosis",
      actionType: "diagnosis",
      serviceName: route ?? null,
      serviceCode: route ? suggestedRouteHref(route).split("/").pop() ?? null : null,
      propertyType: session.propertyType,
      location: session.location,
      message: session.description,
      uploadedFiles: session.uploadedPhotoNames,
      extra: {
        issueCategory: session.issueCategory,
        urgency: session.urgency,
        recurringIssue: session.recurringIssue,
        accessAvailable: session.accessAvailable,
        affectedAreas: session.affectedAreas,
        hasWaterLeakage: session.hasWaterLeakage,
        hasPowerIssue: session.hasPowerIssue,
        hasACShutdown: session.hasACShutdown,
        suggestedRoute: route,
      },
    });
    const { ok } = await submitLead(lead);
    if (ok) {
      setSubmittedLead(lead);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document
            .getElementById("diagnosis-flow")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }
  }, [session]);

  const handleRestart = useCallback(() => {
    setSession(initialDiagnosisSession);
    setStepIndex(0);
    setSubmittedLead(null);
    setCompletedSteps(new Set());
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById("diagnosis-flow")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, []);

  return (
    <section
      id="diagnosis-flow"
      className="relative bg-warmwhite pt-6 pb-12 md:pt-10 md:pb-16"
    >
      {/* Subtle grid backdrop — quieter than the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-50"
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Guided Flow</span>
          {" "}
          <span aria-hidden className="h-3 w-px bg-line" />
          {" "}
          <span>
            Step {activeStep.index} of {diagnosisSteps.length}
          </span>
        </div>

        {/* Stepper rail */}
        <div className="mt-6">
          <DiagnosisStepper
            activeCode={activeStep.code}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>

        {/* Two-column body */}
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10">
          {/* ── Form column ──────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-7">
            {activeStep.code === "SUGGESTED_PATH" ? (
              <SuggestedPathCard
                session={session}
                submittedLead={submittedLead}
                onSubmit={handleSubmit}
                onRestart={handleRestart}
              />
            ) : (
              <div className="rounded-[24px] border border-line/80 bg-warmwhite/80 p-6 md:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)] backdrop-blur-sm">
                <DiagnosisStep
                  stepCode={activeStep.code}
                  session={session}
                  patch={patch}
                />

                {/* Inline (non-mobile-sticky) Back / Next buttons. The
                    sticky bottom bar below mirrors the same controls
                    on small viewports for thumb reach. */}
                <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-7">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={stepIndex === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-graphite/15 bg-transparent px-6 py-3 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span aria-hidden>←</span>
                    {" "}
                    <span>Back</span>
                  </button>
                  {" "}
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canAdvance}
                    className="inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span>
                      {isLastStep || stepIndex === diagnosisSteps.length - 2
                        ? "See Suggested Path"
                        : "Next"}
                    </span>
                    {" "}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Summary column ───────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5">
            {/* Sticky on desktop so the summary follows scroll while
                the user works through long steps (esp. step 4). */}
            <div className="lg:sticky lg:top-[140px]">
              <DiagnosisSummaryPanel session={session} />
            </div>
          </div>
        </div>
      </div>

      {/*
        Mobile sticky bottom action bar — only renders on small
        viewports and only when not on the result step. Gives thumb
        reach to Back / Next without forcing the user to scroll back
        up to the form action row above. Hidden on lg+ where the
        inline action row is comfortably reachable.
      */}
      {activeStep.code !== "SUGGESTED_PATH" && (
        // `bottom-28` (112 px) sits clearly above the
        // DiagnosisFloatingDock (~74 px from the bottom), so the two
        // pinned pills never visually compete on mobile. `bottom-20`
        // (the previous value) put them only 6 px apart in some
        // states. `z-30` keeps the bar below the floating dock
        // (`z-50`) — if a stack ever happens, the dock wins.
        <div className="lg:hidden fixed bottom-28 left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-line/70 bg-warmwhite/90 px-2 py-1.5 shadow-dock backdrop-blur-xl">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              aria-label="Previous step"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-graphite/85 transition-all duration-500 ease-elegant hover:bg-warmwhite/70 disabled:pointer-events-none disabled:opacity-40"
            >
              <span aria-hidden>←</span>
              {" "}
              <span>Back</span>
            </button>
            {" "}
            <span aria-hidden className="h-5 w-px bg-line/80" />
            {" "}
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              aria-label="Next step"
              className="inline-flex items-center gap-2 rounded-full bg-graphite px-5 py-2 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90 disabled:pointer-events-none disabled:opacity-40"
            >
              <span>
                {stepIndex === diagnosisSteps.length - 2 ? "Suggest" : "Next"}
              </span>
              {" "}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
