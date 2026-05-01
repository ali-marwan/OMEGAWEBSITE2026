import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SystemBand } from "@/components/SystemBand";
import { ServicePreview } from "@/components/ServicePreview";
import { SplineFeatureSection } from "@/components/SplineFeatureSection";
import { AISystem } from "@/components/AISystem";
import { PhotoToReport } from "@/components/PhotoToReport";
import { ComplianceLayer } from "@/components/ComplianceLayer";
import { PropertyUseCases } from "@/components/PropertyUseCases";
import { ExecutionMoat } from "@/components/ExecutionMoat";
import { ClosingPaths } from "@/components/ClosingPaths";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";
import { HeroJourneyLazy } from "@/components/HeroJourneyLazy";
import { WaveCanvas } from "@/components/WaveCanvas";
import { buildPageMetadata } from "@/lib/seo";

/**
 * Homepage metadata. New positioning: OMEGA AI as UAE Property
 * Intelligence + Execution Platform. `buildPageMetadata` adds the
 * canonical URL, Open Graph + Twitter card scaffolding around it.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "OMEGA | AI-Guided Property Intelligence. Executed by OMEGA.",
  description:
    "AI property assessment for UAE repairs, renovations, and fit-outs. Photograph the issue, understand the risk, plan the work, and execute through OMEGA's UAE technical team.",
  path: "/",
});

// `<HeroJourneyLazy />` is a thin client-only wrapper around
// `<HeroJourney />` that uses `next/dynamic({ ssr: false })` to keep
// the heavy R3F + drei + three + GSAP chunk out of the initial
// homepage bundle. On mobile / tablet / `prefers-reduced-motion` the
// chunk is never fetched at all — the inner `HeroJourney` component
// gates itself by media query and returns `null` in those cases, but
// the lazy wrapper means the bytes don't even load. On desktop with
// normal motion the chunk loads in the background after the page
// has rendered and the GLB experience hydrates when it's ready.

export default function HomePage() {
  return (
    <>
      {/* Full-page wave-canvas background. The canvas paints its own
          warmwhite fill + the layered sand/amber/orange waves on top,
          so the page reads as flat white with a faint moving texture.
          `pointer-events: none` + `z-index: 0` so it never blocks
          clicks, scroll, hover, or the floating dock. The
          `[data-wave-bg] > section` rule in `globals.css` makes the
          top-level light sections fully transparent so the canvas IS
          the page background. The dark Spline panel (an inner
          `bg-[#0c0b0a]` div) and the Footer's inner content stay
          opaque on top. Skipped on mobile (<768 px) and for
          reduced-motion users for performance. */}
      <WaveCanvas />
      <main className="relative z-10" data-wave-bg>
        <Navigation />
        {/* GLB-driven 3D logo journey — fixed overlay on lg+. Travels
            across Hero → Operating Principles → start of Service System
            via GSAP ScrollTrigger, then settles + recedes. Returns null
            on tablet/mobile and for reduced-motion users; in those
            modes the inline OmegaMark fallback inside <Hero> is used. */}
        <HeroJourneyLazy />
        <Hero />
        <SystemBand />
        <ServicePreview />
        {/* Premium dark "Engineering-Led Experience" interruption — one
            controlled dark moment between the light Service System
            (above) and the light AI Property Diagnostics section
            (below). Houses the Spline cursor-following light wall as
            the visual; lazy-loaded behind a viewport + media-query
            gate so mobile / reduced-motion users get a static dark
            fallback and never download the 3D runtime. */}
        <SplineFeatureSection />
        <AISystem />
        {/* From Photo to Property Report — the report-output layer.
            Surfaces OMEGA AI's structured property-report deliverable
            (the monetisable, defensible artefact a landlord, tenant,
            PM, or engineer can act on or share). */}
        <PhotoToReport />
        {/* UAE Compliance Layer — "Built for UAE Property Execution".
            Surfaces authority-, NOC-, and approval-related risks that
            OMEGA AI flags before work begins. Includes the explicit
            disclaimer that AI doesn't replace authority approval or
            engineering review. */}
        <ComplianceLayer />
        {/* Property Intelligence Use Cases — concrete scenarios
            (AC, leak, cracks, snagging, move-in/out, fit-out, etc.)
            where OMEGA AI Property Scan applies. */}
        <PropertyUseCases />
        {/* Execution Moat — "AI is only the starting point. Execution
            is the advantage." Stacks the seven OMEGA-owned layers
            downstream of the AI scan. */}
        <ExecutionMoat />
        {/* Closing-CTA section — three premium "next steps" (Property
            Scan · OMEGA Inspection · Speak to Our Team) so the page
            resolves into a clear next action before the footer rather
            than dropping in abruptly. Section anchor is `#hub`. */}
        <ClosingPaths />
        <Footer />
        <FloatingDock />
      </main>
    </>
  );
}
