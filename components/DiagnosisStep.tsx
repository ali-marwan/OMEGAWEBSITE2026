"use client";

import { Fragment, useRef } from "react";
import {
  diagnosisSteps,
  issueCategories,
  propertyTypes,
  urgencyLevels,
  yesNoOptions,
  type DiagnosisSession,
  type IssueCategory,
  type PropertyType,
  type StepCode,
  type Urgency,
  type YesNo,
} from "@/lib/diagnosis";

type Patch = (patch: Partial<DiagnosisSession>) => void;

/**
 * Renders the form fields for a given diagnosis step.
 *
 * Each step is a focused, single-purpose question with chip-style
 * selectors where possible — clicking a chip both selects the value
 * and (in single-select cases) is the answer for that step. The
 * "Next" button stays disabled until the step's required fields are
 * answered, so the user can only advance after a real choice.
 *
 * Step 5 (`SUGGESTED_PATH`) is rendered separately by
 * `<SuggestedPathCard />` — this component never has to handle it.
 */
export function DiagnosisStep({
  stepCode,
  session,
  patch,
}: {
  stepCode: StepCode;
  session: DiagnosisSession;
  patch: Patch;
}) {
  const step = diagnosisSteps.find((s) => s.code === stepCode);
  if (!step) return null;

  return (
    <div>
      {/* Step heading row — index pill + question */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
        <span
          aria-hidden
          className="inline-flex h-7 items-center justify-center rounded-full border border-line/70 bg-warmwhite/80 px-2.5 text-[0.66rem] tracking-[0.16em] text-graphite/80"
        >
          STEP · {step.index}
        </span>
        {" "}
        <span aria-hidden className="h-3 w-px bg-line" />
        {" "}
        <span>{step.label}</span>
      </div>

      <h2 className="mt-5 max-w-3xl text-[1.5rem] md:text-[1.85rem] leading-[1.15] tracking-tightest text-graphite font-semibold">
        {step.question}
      </h2>

      {step.helper && (
        <p className="mt-3 max-w-2xl text-base leading-[1.7] text-muted">
          {step.helper}
        </p>
      )}

      {/* Per-step form bodies */}
      <div className="mt-7">
        {stepCode === "PROPERTY_TYPE" && (
          <PropertyTypeStep session={session} patch={patch} />
        )}
        {stepCode === "ISSUE_CATEGORY" && (
          <IssueCategoryStep session={session} patch={patch} />
        )}
        {stepCode === "ISSUE_DESCRIPTION" && (
          <IssueDescriptionStep session={session} patch={patch} />
        )}
        {stepCode === "PROPERTY_CONTEXT" && (
          <PropertyContextStep session={session} patch={patch} />
        )}
      </div>
    </div>
  );
}

/* ── Step 01 — Property Type ─────────────────────────────────────── */

function PropertyTypeStep({
  session,
  patch,
}: {
  session: DiagnosisSession;
  patch: Patch;
}) {
  return (
    <ChipGroup
      label="Property Type"
      options={propertyTypes}
      selected={session.propertyType}
      onSelect={(v) => patch({ propertyType: v as PropertyType })}
    />
  );
}

/* ── Step 02 — Issue Category ────────────────────────────────────── */

function IssueCategoryStep({
  session,
  patch,
}: {
  session: DiagnosisSession;
  patch: Patch;
}) {
  return (
    <ChipGroup
      label="Issue Category"
      options={issueCategories}
      selected={session.issueCategory}
      onSelect={(v) => patch({ issueCategory: v as IssueCategory })}
    />
  );
}

/* ── Step 03 — Issue Description ─────────────────────────────────── */

function IssueDescriptionStep({
  session,
  patch,
}: {
  session: DiagnosisSession;
  patch: Patch;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Frontend-only: store file names so the user sees confirmation.
  // No upload yet; later the file objects can be passed to the API.
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    patch({ uploadedPhotos: [...session.uploadedPhotos, ...names] });
  };

  return (
    <div className="space-y-7">
      {/* Description textarea */}
      <FieldShell label="Description" htmlFor="diagnosis-description">
        <textarea
          id="diagnosis-description"
          value={session.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="Describe what is happening — when it started, what triggers it, what you have already tried..."
          rows={5}
          className="w-full rounded-[14px] border border-line/80 bg-warmwhite/80 px-4 py-3.5 text-sm leading-[1.7] text-graphite placeholder:text-muted/70 focus:border-graphite/50 focus:outline-none focus:ring-2 focus:ring-omega/15 transition-all duration-500 ease-elegant"
        />
      </FieldShell>

      {/* Upload photos placeholder */}
      <FieldShell label="Upload Photos">
        <div
          className="rounded-[14px] border border-dashed border-line/90 bg-warmwhite/60 px-4 py-5 transition-all duration-500 ease-elegant hover:border-graphite/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/80 bg-warmwhite/80 text-graphite/70"
              >
                <UploadGlyph />
              </span>
              {" "}
              <div>
                <div className="text-sm font-medium text-graphite">
                  Add photos to clarify the issue
                </div>
                <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                  PNG, JPG · clear daylight shots
                </div>
              </div>
            </div>
            {" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-graphite/15 bg-warmwhite/70 px-4 py-2 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
            >
              <span>Choose Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {session.uploadedPhotos.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
              {session.uploadedPhotos.map((name, i) => (
                <Fragment key={`${name}-${i}`}>
                  {i > 0 && " "}
                  <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/80 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/80">
                    <span
                      aria-hidden
                      className="inline-block h-1 w-1 rounded-full bg-omega"
                    />
                    {" "}
                    <span className="normal-case tracking-[0.02em]">
                      {name}
                    </span>
                  </li>
                </Fragment>
              ))}
            </ul>
          )}
        </div>
      </FieldShell>

      {/* Urgency level — chips */}
      <ChipGroup
        label="Urgency Level"
        helper="Critical means active risk to property or people right now."
        options={urgencyLevels}
        selected={session.urgency}
        onSelect={(v) => patch({ urgency: v as Urgency })}
      />
    </div>
  );
}

/* ── Step 04 — Property Context ──────────────────────────────────── */

function PropertyContextStep({
  session,
  patch,
}: {
  session: DiagnosisSession;
  patch: Patch;
}) {
  return (
    <div className="space-y-7">
      {/* Location */}
      <FieldShell
        label="Location / Area"
        htmlFor="diagnosis-location"
        helper="Emirate, community, or building — whatever helps a technician find the property."
      >
        <input
          id="diagnosis-location"
          type="text"
          value={session.location}
          onChange={(e) => patch({ location: e.target.value })}
          placeholder="e.g. Dubai Marina, Tower XYZ"
          className="w-full rounded-full border border-line/80 bg-warmwhite/80 px-4 py-3 text-sm leading-[1.5] text-graphite placeholder:text-muted/70 focus:border-graphite/50 focus:outline-none focus:ring-2 focus:ring-omega/15 transition-all duration-500 ease-elegant"
        />
      </FieldShell>

      {/* Yes/No pair: recurring + access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
        <ChipGroup
          label="Is this recurring?"
          options={yesNoOptions}
          selected={session.recurringIssue}
          onSelect={(v) => patch({ recurringIssue: v as YesNo })}
          compact
        />
        <ChipGroup
          label="Is access available?"
          options={yesNoOptions}
          selected={session.accessAvailable}
          onSelect={(v) => patch({ accessAvailable: v as YesNo })}
          compact
        />
      </div>

      {/* Affected areas */}
      <FieldShell
        label="Is it affecting other areas?"
        htmlFor="diagnosis-affected-areas"
        helper="Optional — list other rooms, units, or systems impacted."
      >
        <input
          id="diagnosis-affected-areas"
          type="text"
          value={session.affectedAreas}
          onChange={(e) => patch({ affectedAreas: e.target.value })}
          placeholder="e.g. ceiling stain in living room and bedroom below"
          className="w-full rounded-full border border-line/80 bg-warmwhite/80 px-4 py-3 text-sm leading-[1.5] text-graphite placeholder:text-muted/70 focus:border-graphite/50 focus:outline-none focus:ring-2 focus:ring-omega/15 transition-all duration-500 ease-elegant"
        />
      </FieldShell>

      {/* Cross-system signals — multi-select toggles */}
      <FieldShell
        label="Cross-system signals"
        helper="Tick anything that applies — these change which OMEGA path fits best."
      >
        <div className="flex flex-wrap items-center gap-2">
          <ToggleChip
            checked={session.hasWaterLeakage}
            onToggle={(v) => patch({ hasWaterLeakage: v })}
            label="Water leakage"
          />
          {" "}
          <ToggleChip
            checked={session.hasPowerIssue}
            onToggle={(v) => patch({ hasPowerIssue: v })}
            label="Power issue"
          />
          {" "}
          <ToggleChip
            checked={session.hasACShutdown}
            onToggle={(v) => patch({ hasACShutdown: v })}
            label="AC shutdown"
          />
        </div>
      </FieldShell>
    </div>
  );
}

/* ── Reusable building blocks ────────────────────────────────────── */

function ChipGroup<T extends string>({
  label,
  helper,
  options,
  selected,
  onSelect,
  compact = false,
}: {
  label: string;
  helper?: string;
  options: readonly T[];
  selected: T | null;
  onSelect: (value: T) => void;
  compact?: boolean;
}) {
  return (
    <FieldShell label={label} helper={helper}>
      <ul
        role="radiogroup"
        aria-label={label}
        className={`flex flex-wrap items-center ${compact ? "gap-2" : "gap-2.5"}`}
      >
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <Fragment key={opt}>
              {i > 0 && " "}
              <li>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelect(opt)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500 ease-elegant ${
                    isSelected
                      ? "border-graphite/85 bg-graphite text-warmwhite shadow-[0_1px_0_rgba(30,30,30,0.05),0_14px_28px_-18px_rgba(30,30,30,0.32)]"
                      : "border-line/80 bg-warmwhite/70 text-graphite/85 hover:-translate-y-px hover:border-graphite/40 hover:text-graphite"
                  }`}
                >
                  {isSelected && (
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_6px_rgba(242,106,27,0.6)]"
                    />
                  )}
                  {" "}
                  <span>{opt}</span>
                </button>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </FieldShell>
  );
}

function ToggleChip({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onToggle(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500 ease-elegant ${
        checked
          ? "border-omega/60 bg-warmwhite text-graphite shadow-[inset_0_0_0_1px_rgba(242,106,27,0.25)]"
          : "border-line/80 bg-warmwhite/70 text-graphite/80 hover:border-graphite/40 hover:text-graphite"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-3.5 w-3.5 rounded-full border transition-all duration-500 ease-elegant ${
          checked
            ? "border-omega bg-omega shadow-[0_0_6px_rgba(242,106,27,0.55)]"
            : "border-graphite/30 bg-transparent"
        }`}
      />
      {" "}
      <span>{label}</span>
    </button>
  );
}

function FieldShell({
  label,
  helper,
  htmlFor,
  children,
}: {
  label: string;
  helper?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full bg-omega"
        />
        {" "}
        {htmlFor ? (
          <label htmlFor={htmlFor}>{label}</label>
        ) : (
          <span>{label}</span>
        )}
      </div>
      {helper && (
        <p className="mt-1.5 text-[0.85rem] leading-[1.6] text-muted">
          {helper}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function UploadGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 1.5v8M3.5 5L7 1.5l3.5 3.5M2 12h10" />
    </svg>
  );
}
