"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ease, viewportOnce } from "@/lib/motion";

type Tier = "primary" | "entry" | "support";

type Service = {
  index: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  tier: Tier;
};

const services: Service[] = [
  {
    index: "01",
    category: "INTELLIGENCE",
    title: "Property Intelligence",
    subtitle: "AI Scans · Property Reports · Risk Assessment",
    description:
      "OMEGA AI scans, property health reports, condition records, and risk classification — the intelligent entry point into every OMEGA service.",
    tier: "primary",
  },
  {
    index: "02",
    category: "REPAIR & RESPONSE",
    title: "Repair & Response",
    subtitle: "On-Demand Technical Service After Diagnosis",
    description:
      "On-demand technical response for everyday repairs, faults, and service needs — dispatched after AI diagnosis or direct request.",
    tier: "entry",
  },
  {
    index: "03",
    category: "RENOVATION & FIT-OUT",
    title: "Renovation & Fit-Out",
    subtitle: "Upgrade Planning · Scope · BOQ Preparation",
    description:
      "Renovation planning, scope development, and BOQ preparation — moving from AI-generated drafts to controlled execution.",
    tier: "entry",
  },
  {
    index: "04",
    category: "ENGINEERING & COMPLIANCE",
    title: "Engineering & Compliance",
    subtitle: "Authority-Sensitive Review · Drawings · UAE Approvals",
    description:
      "Engineering review, drawings, MEP coordination, and DCD / DEWA / building-management approval awareness across UAE properties.",
    tier: "support",
  },
  {
    index: "05",
    category: "PROPERTY HISTORY",
    title: "Long-Term Property History",
    subtitle: "Service Records · Before / After · Warranties",
    description:
      "Service history, before/after documentation, warranties, and an ongoing property record that compounds intelligence over time.",
    tier: "support",
  },
];

export function ServicePreview() {
  return (
    <section
      id="services"
      className="relative bg-warmwhite pt-28 pb-44 md:pt-40 md:pb-52"
    >
      <div className="mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <Reveal>
          <div className="flex items-center justify-between gap-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <div className="flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-omega" />
              <span>Section 02 — Service System</span>
            </div>
            <span className="hidden md:inline">5 Modules · OMEGA AI connects all</span>
          </div>
        </Reveal>

        {/* Headline + supporting text — mirrors hero rhythm */}
        <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <Reveal
            as="h2"
            delay={0.1}
            className="col-span-12 lg:col-span-8 text-[2rem] md:text-[3rem] leading-[1.06] tracking-tightest text-graphite"
          >
            {/* Two-line headline. `block` forces the line break,
                `mt-X` supplies visible spacing, and a literal
                whitespace text node between the two spans guarantees
                the DOM textContent stays as two separate sentences. */}
            <span className="block font-semibold">Five Modules.</span>
            {" "}
            <span className="mt-1.5 md:mt-2 block font-light text-muted">
              One Intelligent Property System.
            </span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.15}
            className="col-span-12 lg:col-span-4 text-base text-muted leading-[1.75]"
          >
            Intelligence, repair, renovation, engineering, and
            long-term property history — connected by OMEGA AI as the
            intelligent layer across every module.
          </Reveal>
        </div>

        {/* System map rail — five module ticks. Acts as the visual
            "system bus" that the cards below plug into. */}
        <SystemMapRail />

        {/* Asymmetric card grid — modules plug into the rail above via
            short vertical hairlines on each card's top-center port. */}
        <div className="relative mt-8 grid grid-cols-12 gap-6 md:gap-7">
          {services.map((s, i) => (
            <ServiceCard key={s.index} service={s} index={i} />
          ))}
        </div>

        {/* Footer rule */}
        <div className="mt-20 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
          <span>END · §02</span>
          <div className="mx-6 h-px flex-1 bg-line/80" />
          <span>OMEGA · System Map</span>
        </div>
      </div>
    </section>
  );
}

/**
 * Architectural system rail: five evenly-spaced module ticks rendered
 * as a single hairline with index labels. Reads as a technical legend
 * for the cards beneath it without competing visually.
 */
function SystemMapRail() {
  return (
    <Reveal delay={0.2}>
      <div className="mt-16 md:mt-20">
        <div className="relative h-px w-full bg-line/80" />
        <div className="mt-3 grid grid-cols-5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted/80">
          {services.map((s) => (
            <div key={s.index} className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-graphite/40" />
              <span>
                {s.index}
                <span className="hidden sm:inline"> / {s.category}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  /**
   * Asymmetric placement:
   *  - 01 (primary): col-span 7, row-span 2 on lg → tall dominant module
   *  - 02, 03 (entry): col-span 5 on lg → stacked beside primary
   *  - 04, 05 (support): col-span 6 on lg → equal pair below
   */
  const span =
    service.tier === "primary"
      ? "col-span-12 lg:col-span-7 lg:row-span-2"
      : service.tier === "entry"
      ? "col-span-12 sm:col-span-6 lg:col-span-5"
      : "col-span-12 sm:col-span-6 lg:col-span-6";

  const padding =
    service.tier === "primary" ? "p-10 md:p-14 lg:p-16" : "p-9 md:p-11";

  const minHeight =
    service.tier === "primary"
      ? "lg:min-h-[480px]"
      : service.tier === "entry"
      ? "lg:min-h-[226px]"
      : "lg:min-h-[244px]";

  const titleSize =
    service.tier === "primary"
      ? "text-[1.75rem] md:text-[2.15rem] leading-[1.08]"
      : service.tier === "support"
      ? "text-[1.2rem] md:text-[1.32rem] leading-[1.2]"
      : "text-[1.25rem] md:text-[1.4rem] leading-[1.18]";

  // 04/05 are slightly quieter — title tone, descriptor opacity, surface
  const isQuiet = service.tier === "support";

  const surfaceClass = isQuiet
    ? "bg-warmwhite border-line/70 module-card module-card--quiet"
    : "bg-warmwhite border-line/85 module-card";

  const titleTone = isQuiet ? "text-graphite/90" : "text-graphite";
  const subtitleTone = isQuiet ? "text-muted/70" : "text-muted/90";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{
        duration: 0.95,
        delay: 0.09 * index,
        ease,
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[22px] border hover:border-graphite/25 ${surfaceClass} ${span} ${padding} ${minHeight}`}
    >
      {/* System bus plug — short vertical hairline rises from the card
          up toward the SystemMapRail, terminating in a small node port.
          Reads as "module wired into the bus", makes the grid feel
          connected rather than independent. */}
      <span
        className={`pointer-events-none absolute left-1/2 -top-8 h-8 w-px -translate-x-1/2 transition-opacity duration-500 ease-elegant ${
          isQuiet
            ? "bg-line/55 group-hover:bg-line/85"
            : "bg-line/75 group-hover:bg-line"
        }`}
      />
      <span
        className={`pointer-events-none absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-500 ease-elegant ${
          isQuiet
            ? "bg-omega/20 group-hover:bg-omega/70"
            : "bg-omega/35 group-hover:bg-omega"
        }`}
      />

      {/* Soft architectural corner ticks — quieter on support cards */}
      <span
        className={`pointer-events-none absolute top-0 left-0 h-px w-8 ${
          isQuiet ? "bg-graphite/10" : "bg-graphite/15"
        }`}
      />
      <span
        className={`pointer-events-none absolute top-0 left-0 h-8 w-px ${
          isQuiet ? "bg-graphite/10" : "bg-graphite/15"
        }`}
      />
      <span
        className={`pointer-events-none absolute bottom-0 right-0 h-px w-8 ${
          isQuiet ? "bg-graphite/10" : "bg-graphite/15"
        }`}
      />
      <span
        className={`pointer-events-none absolute bottom-0 right-0 h-8 w-px ${
          isQuiet ? "bg-graphite/10" : "bg-graphite/15"
        }`}
      />

      {/* Primary card — internal system schematic + soft warm tint */}
      {service.tier === "primary" && <PrimarySystemSchematic />}

      <div>
        <div className="flex items-start justify-between">
          {/* Index label — small omega dot brightens on hover */}
          <div className="flex items-baseline gap-3">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-3px] rounded-full bg-omega/30 transition-colors duration-500 ease-elegant group-hover:bg-omega" />
            <span
              className={`font-mono leading-none tracking-tight font-medium ${titleTone} ${
                service.tier === "primary"
                  ? "text-[1.5rem] md:text-[1.7rem]"
                  : "text-[1.1rem] md:text-[1.25rem]"
              }`}
            >
              {service.index}
            </span>
            <span
              className={`font-mono text-[0.68rem] uppercase tracking-[0.12em] ${
                isQuiet ? "text-muted/70" : "text-muted"
              }`}
            >
              / {service.category}
            </span>
          </div>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-omega opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-elegant">
            view →
          </span>
        </div>

        {/* Index baseline rule — tightened spacing */}
        <div
          className={`mt-4 h-px ${
            service.tier === "primary" ? "w-14" : "w-10"
          } ${isQuiet ? "bg-graphite/20" : "bg-graphite/25"}`}
        />

        <h3
          className={`mt-5 tracking-tight font-semibold ${titleTone} ${titleSize}`}
        >
          {service.title}
        </h3>
        <p
          className={`mt-2 font-mono uppercase tracking-[0.12em] ${subtitleTone} ${
            service.tier === "primary"
              ? "text-[0.72rem]"
              : "text-[0.68rem]"
          }`}
        >
          {service.subtitle}
        </p>
      </div>

      <div className={service.tier === "primary" ? "mt-8" : "mt-6"}>
        <div
          className={`h-px w-full ${isQuiet ? "bg-line/70" : "bg-line"}`}
        />
        <p
          className={`mt-4 max-w-prose ${
            service.tier === "primary"
              ? "text-[1rem] leading-[1.7] text-muted"
              : isQuiet
              ? "text-[0.93rem] leading-[1.65] text-muted/85"
              : "text-[0.95rem] leading-[1.65] text-muted"
          }`}
        >
          {service.description}
        </p>

        {/* Primary-only system status strip — subtle instrument-panel
            metadata. Reads as a live-system module rather than a card. */}
        {service.tier === "primary" && <PrimaryStatusStrip />}
      </div>
    </motion.article>
  );
}

/**
 * Three small mono-typed status fields rendered as a compact instrument
 * strip below the primary card description. Reads as live system
 * metadata — coverage, module count, status — rather than marketing
 * copy. Each field has a tiny graphite tick as a separator.
 */
function PrimaryStatusStrip() {
  const fields: { label: string; value: string; accent?: boolean }[] = [
    { label: "status", value: "live", accent: true },
    { label: "coverage", value: "uae" },
    { label: "modules", value: "5 / connected" },
  ];

  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.66rem] uppercase tracking-[0.14em]">
      {fields.map((f, i) => (
        <span key={f.label} className="flex items-center gap-2">
          {i > 0 && <span className="h-2 w-px bg-graphite/20" />}
          <span className="text-muted/90">{f.label}</span>
          <span
            className={`flex items-center gap-1.5 ${
              f.accent ? "text-omega" : "text-graphite/85"
            }`}
          >
            {f.accent && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]" />
            )}
            {f.value}
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Faint technical schematic rendered in the lower-right of the primary
 * card. Concentric arcs with a center node and four cardinal port dots —
 * suggests "central operating module with connected disciplines" without
 * being literal. Held at very low opacity so it reads as a watermark, not
 * a graphic. A soft warm radial tint sits behind it for warmth.
 */
function PrimarySystemSchematic() {
  return (
    <>
      {/* Soft warm radial — extremely subtle system glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(620px 480px at 88% 92%, rgba(242,106,27,0.05) 0%, rgba(242,106,27,0) 55%)",
        }}
        aria-hidden
      />

      {/* Quiet corner arc — premium architectural detail */}
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 overflow-hidden">
        <div className="absolute right-[-72px] top-[-72px] h-[180px] w-[180px] rounded-full border border-line/60" />
      </div>

      {/* Technical schematic — concentric arcs + cardinal node ports */}
      <svg
        className="pointer-events-none absolute -right-10 -bottom-10 h-[280px] w-[280px] opacity-90"
        viewBox="0 0 240 240"
        fill="none"
        aria-hidden
      >
        {/* concentric system rings */}
        <circle
          cx="120"
          cy="120"
          r="42"
          stroke="rgba(216,207,194,0.55)"
          strokeWidth="1"
        />
        <circle
          cx="120"
          cy="120"
          r="74"
          stroke="rgba(216,207,194,0.45)"
          strokeWidth="1"
        />
        <circle
          cx="120"
          cy="120"
          r="108"
          stroke="rgba(216,207,194,0.32)"
          strokeWidth="1"
        />
        {/* radial spokes — short technical ticks */}
        <line
          x1="120"
          y1="12"
          x2="120"
          y2="32"
          stroke="rgba(30,30,30,0.18)"
          strokeWidth="1"
        />
        <line
          x1="120"
          y1="208"
          x2="120"
          y2="228"
          stroke="rgba(30,30,30,0.18)"
          strokeWidth="1"
        />
        <line
          x1="12"
          y1="120"
          x2="32"
          y2="120"
          stroke="rgba(30,30,30,0.18)"
          strokeWidth="1"
        />
        <line
          x1="208"
          y1="120"
          x2="228"
          y2="120"
          stroke="rgba(30,30,30,0.18)"
          strokeWidth="1"
        />
        {/* cardinal node ports on outer ring */}
        <circle cx="120" cy="12" r="2" fill="rgba(30,30,30,0.35)" />
        <circle cx="120" cy="228" r="2" fill="rgba(30,30,30,0.25)" />
        <circle cx="12" cy="120" r="2" fill="rgba(30,30,30,0.25)" />
        <circle cx="228" cy="120" r="2" fill="rgba(30,30,30,0.25)" />
        {/* center node — operating module */}
        <circle cx="120" cy="120" r="3.2" fill="rgba(242,106,27,0.55)" />
        <circle
          cx="120"
          cy="120"
          r="6"
          stroke="rgba(242,106,27,0.35)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </>
  );
}
