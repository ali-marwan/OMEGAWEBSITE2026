"use client";

import { Fragment } from "react";
import { diagnosisSteps, type StepCode } from "@/lib/diagnosis";

/**
 * The vertical step rail shown at the top of the form column.
 *
 * Each step is rendered as a clickable pill — the user can jump back
 * to any completed step (forward jumps are blocked until the user
 * has answered enough to make sense of that step).
 *
 * States per step:
 *   - active:   current step, omega-orange dot + graphite text
 *   - complete: previous step the user has answered, line-coloured
 *               check + muted text
 *   - locked:   future step, line-coloured ring + light muted text
 *
 * The rail is horizontal-scrolling on mobile (the same
 * `action-tab-scroller` utility we use on service-detail action
 * tabs) so the five steps fit a 360 px viewport without wrapping.
 */
export function DiagnosisStepper({
  activeCode,
  completedSteps,
  onStepClick,
}: {
  activeCode: StepCode;
  completedSteps: ReadonlySet<StepCode>;
  onStepClick: (code: StepCode) => void;
}) {
  const activeIndex = diagnosisSteps.findIndex((s) => s.code === activeCode);

  return (
    <nav aria-label="Diagnosis steps" className="w-full">
      <ol
        className="action-tab-scroller -mx-6 lg:-mx-10 flex items-stretch gap-2 overflow-x-auto px-6 lg:px-10 snap-x snap-mandatory md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:snap-none md:gap-3"
      >
        {diagnosisSteps.map((step, i) => {
          const isActive = step.code === activeCode;
          const isComplete = completedSteps.has(step.code);
          const isLocked = !isActive && !isComplete && i > activeIndex;

          // Decide which state styling applies — active wins over the rest
          const state: "active" | "complete" | "locked" = isActive
            ? "active"
            : isComplete
              ? "complete"
              : "locked";

          const base =
            "group/step flex-shrink-0 snap-start md:flex-shrink inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all duration-500 ease-elegant";
          const stateClass = {
            active:
              "border-graphite/85 bg-graphite text-warmwhite shadow-[0_1px_0_rgba(30,30,30,0.05),0_18px_36px_-22px_rgba(30,30,30,0.35)]",
            complete:
              "border-line/80 bg-warmwhite/80 text-graphite/80 hover:border-graphite/40 hover:text-graphite",
            locked:
              "border-line/60 bg-warmwhite/40 text-graphite/35",
          }[state];

          const handleClick = () => {
            if (isLocked) return;
            onStepClick(step.code);
          };

          return (
            <Fragment key={step.code}>
              {i > 0 && " "}
              <li>
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={isLocked}
                  aria-current={isActive ? "step" : undefined}
                  className={`${base} ${stateClass} ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {/* Indicator: dot for active, tick for complete, ring for locked */}
                  {state === "active" && (
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.6)]"
                    />
                  )}
                  {state === "complete" && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="text-omega"
                    >
                      <path d="M2.5 5.5l2 2 4-5" />
                    </svg>
                  )}
                  {state === "locked" && (
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full border border-graphite/30"
                    />
                  )}
                  {" "}
                  <span>{step.index}</span>
                  {" "}
                  <span aria-hidden className="opacity-40">·</span>
                  {" "}
                  <span className="normal-case tracking-[0.04em]">
                    {step.label}
                  </span>
                </button>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
