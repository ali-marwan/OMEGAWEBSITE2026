"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Reveal } from "./Reveal";
import { ease, easeAtmospheric, viewportOnce } from "@/lib/motion";

type Step = {
  code: string;
  label: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    code: "01",
    label: "diagnose",
    title: "Diagnose",
    body: "Describe the issue or upload a photo.",
  },
  {
    code: "02",
    label: "understand",
    title: "Understand",
    body: "Receive a clear explanation of likely causes and risk level.",
  },
  {
    code: "03",
    label: "act",
    title: "Act",
    body: "Get routed to DIY guidance, home service, property care, renovation, or engineering support.",
  },
];

/** Cascade for the steps column. Canvas reveals first, then steps follow. */
const stepsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

const stepItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

/**
 * OMEGA AI · Property Diagnostics.
 *
 * Section composition:
 *   - Eyebrow + headline + supporting paragraph
 *   - Diagnostic instrument canvas (left, col-7 on lg)
 *       6 instrument cells in a 2×3 grid:
 *         Input  · Analysis · Action  (top-down flow)
 *         01 Issue Input         02 Photo Upload
 *         03 Likely Cause        04 Risk Level
 *         05 Recommended Action  06 OMEGA Routing
 *       A slow vertical scanning line sweeps down the canvas; subtle
 *       orange signal accents pulse at the active data points. No
 *       chatbot bubbles, no blue/purple gradients — every shape reads
 *       as instrument-panel, not as "AI assistant UI".
 *   - Step rail (right, col-5 on lg) — Diagnose → Understand → Act + CTA.
 */
export function AISystem() {
  return (
    <section
      id="ai"
      className="relative overflow-hidden bg-warmwhite py-32 md:py-44 text-graphite"
    >
      {/* Subtle architectural grid */}
      <div className="pointer-events-none absolute inset-0 arch-grid" />

      {/* Soft orange radial highlight at the section top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.10) 0%, rgba(242,106,27,0.04) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        <Reveal className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
          <span>Section 03 — OMEGA AI · Property Diagnostics</span>
        </Reveal>

        <div className="mt-7 grid grid-cols-12 items-end gap-6">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-8 text-[2rem] md:text-[3.2rem] leading-[1.05] tracking-tightest text-graphite font-semibold"
          >
            OMEGA AI Property Diagnostics.
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-4 text-base text-muted leading-relaxed"
          >
            Describe issues. Get routed to the right OMEGA path.
            Confirmed by the team where required — guided by OMEGA's
            UAE property experience.
          </Reveal>
        </div>

        {/* Canvas + steps — stretched to align */}
        <div className="mt-20 grid grid-cols-12 items-stretch gap-6 lg:gap-8">
          {/* Diagnostic instrument canvas — reveals first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1.15, ease }}
            className="col-span-12 lg:col-span-7 flex"
          >
            <DiagnosticCanvas />
          </motion.div>

          {/* Step column — canvas-gated cascade */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stepsContainer}
            className="col-span-12 lg:col-span-5 flex flex-col gap-2.5"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.code}
                variants={stepItem}
                className="group relative rounded-2xl border border-line/90 bg-warmwhite/85 p-7 backdrop-blur-sm transition-colors duration-500 ease-elegant hover:border-line"
              >
                {/* Step technical label row — code + step name on the
                    left, hairline progress indicator on the right.
                    Removed the redundant `0X / 03` counter that
                    duplicated the code badge. */}
                <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-technical text-muted">
                  <div className="flex items-baseline gap-3">
                    <span className="text-omega">{step.code}</span>
                    <span>{step.label}</span>
                  </div>
                  <span className="opacity-60">step {i + 1} of 3</span>
                </div>

                <div className="mt-4 h-px w-10 bg-graphite/30" />

                <h3 className="mt-5 text-xl md:text-[1.35rem] font-semibold text-graphite leading-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {step.body}
                </p>
              </motion.div>
            ))}

            {/*
              Routes to the dedicated `/diagnosis` page — the OMEGA
              AI Property Diagnostics module. Replaces the previous
              link to a service-detail action-centre tab so this CTA
              opens the full guided diagnostic experience instead of
              a service-scoped quick form.
            */}
            <motion.a
              href="/diagnosis"
              data-action="START_DIAGNOSIS"
              variants={stepItem}
              className="group mt-1.5 inline-flex items-center justify-between rounded-full bg-omega px-6 py-4 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-omega/90"
            >
              <span>Start Diagnosis</span>
              <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-technical opacity-90">
                begin
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 7h8m0 0L7 3m4 4-4 4" />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Diagnostic instrument canvas — six instrument cells arranged as a
 * 2×3 grid representing the diagnostic flow: input → analysis → action.
 * Each cell renders a small architectural placeholder of its function,
 * not a literal UI control. A slow vertical scanning line sweeps down
 * the canvas to imply live analysis.
 */
function DiagnosticCanvas() {
  return (
    <div
      data-spline-slot="ai-orb"
      className="relative w-full min-h-[640px] overflow-hidden rounded-[24px] border border-line/90 bg-warmwhite hairline"
    >
      {/* Internal subtle grid */}
      <div className="absolute inset-0 arch-grid-tight" />

      {/* Soft orange radial inside the frame */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 50% at 50% 50%, rgba(242,106,27,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Slow vertical scanning line — moves top → bottom on a long loop */}
      <ScanLine />

      {/* Cell grid — generous internal padding accommodates corner labels */}
      <div className="relative h-full p-5 pt-14 pb-14 md:p-8 md:pt-16 md:pb-16">
        <div className="grid h-full grid-cols-2 grid-rows-3 gap-3 md:gap-4">
          <DiagnosticCell code="01" label="Issue Input">
            <IssueInputGlyph />
          </DiagnosticCell>
          <DiagnosticCell code="02" label="Photo Upload">
            <PhotoUploadGlyph />
          </DiagnosticCell>
          <DiagnosticCell code="03" label="Likely Cause" accent>
            <LikelyCauseGlyph />
          </DiagnosticCell>
          <DiagnosticCell code="04" label="Risk Level">
            <RiskLevelGlyph />
          </DiagnosticCell>
          <DiagnosticCell code="05" label="Recommended Action">
            <RecommendedActionGlyph />
          </DiagnosticCell>
          <DiagnosticCell code="06" label="OMEGA Routing" accent>
            <OmegaRoutingGlyph />
          </DiagnosticCell>
        </div>
      </div>

      {/* Top label — single human-readable marker. Replaces the
          previous fake telemetry (model code, lat/lon) so the canvas
          reads as a real diagnostic tool, not a sci-fi dashboard. */}
      <div className="absolute top-5 left-5 font-mono text-[0.65rem] uppercase tracking-technical text-muted">
        OMEGA AI · Property Intake Canvas
      </div>
      <div className="absolute top-5 right-5 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-technical text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.6)]" />
        <span>Live</span>
      </div>
    </div>
  );
}

/**
 * A faint vertical line that drifts from the top of the canvas to the
 * bottom over ~6s — deliberately slow. Reads as "scan in progress",
 * not as a loading bar. Loop is one-way; the line resets to the top
 * silently between cycles thanks to the long delay between iterations.
 */
function ScanLine() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 h-[2px]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(242,106,27,0.45) 50%, transparent 100%)",
        boxShadow: "0 0 12px rgba(242,106,27,0.35)",
      }}
      animate={{ top: ["-2%", "102%"] }}
      transition={{
        duration: 6.5,
        repeat: Infinity,
        ease: easeAtmospheric,
        repeatDelay: 1.4,
      }}
    />
  );
}

/**
 * Single instrument cell. Renders a top label row (code + name + status
 * dot), a hairline separator, and a body slot for a small architectural
 * placeholder. `accent` highlights this cell's status dot in OMEGA orange
 * — used on the cells that represent active inferred data (Likely Cause,
 * OMEGA Routing).
 */
function DiagnosticCell({
  code,
  label,
  accent = false,
  children,
}: {
  code: string;
  label: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[14px] border border-line/85 bg-warmwhite/70 backdrop-blur-sm transition-colors duration-500 ease-elegant hover:border-line">
      {/* Top label row */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
        <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          <span className="text-omega">{code}</span>
          <span className="text-graphite/75">{label}</span>
        </div>
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            accent ? "bg-omega" : "bg-graphite/25"
          } ${
            accent
              ? "shadow-[0_0_10px_rgba(242,106,27,0.6)]"
              : ""
          }`}
        />
      </div>

      {/* Hairline divider */}
      <div className="mx-3.5 h-px bg-line/70" />

      {/* Body */}
      <div className="relative flex flex-1 items-center justify-center px-3.5 py-3">
        {children}
      </div>
    </div>
  );
}

// ── Cell glyphs ──────────────────────────────────────────────────────
// Each glyph is a small architectural placeholder — not a real UI
// control. They imply the function of the cell while staying flat,
// monochrome, and instrument-panel in feel.

/** Three text-line stubs with a slowly blinking caret on the last line. */
function IssueInputGlyph() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="h-1 w-full rounded-full bg-graphite/15" />
      <div className="h-1 w-[78%] rounded-full bg-graphite/15" />
      <div className="flex items-center gap-1">
        <div className="h-1 w-[42%] rounded-full bg-graphite/15" />
        <motion.div
          className="h-2 w-[2px] bg-omega"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

/** Photo frame with corner ticks and a soft diagonal scan inside. */
function PhotoUploadGlyph() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-md border border-line/90" />
      {/* corner ticks */}
      <div className="absolute top-0 left-0 h-2 w-2 border-l border-t border-graphite/40" />
      <div className="absolute top-0 right-0 h-2 w-2 border-r border-t border-graphite/40" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-l border-b border-graphite/40" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-r border-b border-graphite/40" />
      {/* diagonal scan stripes */}
      <div
        className="absolute inset-1 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 6px, rgba(216,207,194,0.7) 6px 7px)",
        }}
      />
      {/* center plus glyph */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" className="text-graphite/55" strokeWidth="1.2" fill="none">
          <path d="M7 2v10M2 7h10" />
        </svg>
      </div>
    </div>
  );
}

/** Three candidate cause rows; the active row is highlighted in orange
 *  with a small confidence percentage badge on the right. */
function LikelyCauseGlyph() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <CauseRow widthClass="w-[58%]" />
      <CauseRow widthClass="w-[72%]" active confidence="84%" />
      <CauseRow widthClass="w-[44%]" />
    </div>
  );
}

function CauseRow({
  widthClass,
  active = false,
  confidence,
}: {
  widthClass: string;
  active?: boolean;
  confidence?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active ? "bg-omega" : "bg-graphite/25"
          }`}
        />
        <div
          className={`h-[3px] rounded-full ${widthClass} ${
            active ? "bg-omega/65" : "bg-graphite/15"
          }`}
        />
      </div>
      {confidence && (
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-omega">
          {confidence}
        </span>
      )}
    </div>
  );
}

/** Five-segment risk meter with one orange segment + numeric readout. */
function RiskLevelGlyph() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.12em]">
        <span className="text-muted">moderate</span>
        <span className="text-omega">3 / 5</span>
      </div>
      <div className="flex h-1.5 gap-1">
        <span className="flex-1 rounded-full bg-graphite/30" />
        <span className="flex-1 rounded-full bg-graphite/30" />
        <span className="flex-1 rounded-full bg-omega" />
        <span className="flex-1 rounded-full bg-graphite/12" />
        <span className="flex-1 rounded-full bg-graphite/12" />
      </div>
    </div>
  );
}

/** Action label + a short directed arrow line implying the next move. */
function RecommendedActionGlyph() {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="h-1 w-full rounded-full bg-graphite/22" />
        <div className="h-1 w-[68%] rounded-full bg-graphite/15" />
      </div>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-omega/60 text-omega">
        <svg width="11" height="11" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M3 7h8m0 0L7 3m4 4-4 4" />
        </svg>
      </div>
    </div>
  );
}

/**
 * OMEGA Routing cell. Shows the five possible routing destinations
 * (DIY guidance, Home Service, Property Care, Renovation, Engineering)
 * as a horizontal rail with a small label under each node. The active
 * route is highlighted in orange. Reads as a real routing UI rather
 * than abstract telemetry.
 */
function OmegaRoutingGlyph() {
  const routes = [
    { short: "DIY", full: "DIY" },
    { short: "Home", full: "Home Service" },
    { short: "Care", full: "Property Care" },
    { short: "Reno", full: "Renovation" },
    { short: "Eng", full: "Engineering" },
  ];
  const activeIndex = 1; // Home Service

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2 font-mono text-[0.6rem] uppercase tracking-[0.12em]">
        <span className="text-muted">route</span>
        <span className="text-omega">→ {routes[activeIndex].full}</span>
      </div>
      <div className="relative">
        {/* horizontal rail behind the nodes */}
        <div className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-line/80" />
        <div className="relative grid grid-cols-5 items-center gap-1">
          {routes.map((r, i) => (
            <span key={r.short} className="flex justify-center">
              <span
                className={`h-2 w-2 rounded-sm border ${
                  i === activeIndex
                    ? "border-omega bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
                    : "border-graphite/35 bg-warmwhite"
                }`}
              />
            </span>
          ))}
        </div>
      </div>
      {/* Per-node labels — the five OMEGA routing destinations spelled
          out in compact form. Active one tinted orange. */}
      <div className="grid grid-cols-5 gap-1 font-mono text-[0.55rem] uppercase tracking-[0.1em]">
        {routes.map((r, i) => (
          <span
            key={r.short}
            className={`text-center ${
              i === activeIndex ? "text-omega" : "text-graphite/55"
            }`}
          >
            {r.short}
          </span>
        ))}
      </div>
    </div>
  );
}
