import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FloatingDock } from "@/components/FloatingDock";
import { StudioHero } from "@/components/StudioHero";
import { StudioPhilosophy } from "@/components/StudioPhilosophy";
import { StudioServiceSystem } from "@/components/StudioServiceSystem";
import { StudioWhyEngineering } from "@/components/StudioWhyEngineering";
import { StudioUAEContext } from "@/components/StudioUAEContext";
import { StudioAIConnection } from "@/components/StudioAIConnection";
import { StudioCTA } from "@/components/StudioCTA";
import { buildPageMetadata } from "@/lib/seo";

/**
 * `/studio` — OMEGA's credibility and company narrative page.
 *
 * Composition matches every other route on the site (Navigation,
 * sectioned content, Footer, FloatingDock) so this page reads as
 * part of one continuous product, not a separate marketing page.
 *
 * Section order maps directly to the brief:
 *   1. Hero                — what OMEGA is in one sentence
 *   2. Philosophy          — one company / one property system
 *   3. Service system      — the five services with detail-page links
 *   4. Why engineering-led — five editorial principles
 *   5. UAE context         — properties, MEP signals, expectations
 *   6. OMEGA AI connection — diagnostics is part of the system
 *   7. Closing CTA         — Hub / Diagnosis / Speak to Team
 *
 * Server component. Each section is its own component; the few that
 * rely on subtle scroll-reveal motion mark themselves "use client"
 * locally. The standard FloatingDock is rendered (this is a regular
 * narrative page, not the diagnostic experience that gets its own
 * dock variant).
 */
export const metadata: Metadata = buildPageMetadata({
  title: "OMEGA Studio | Engineering-Led Property Solutions",
  description:
    "Learn how OMEGA connects property care, home services, assessments, renovation, engineering support, and AI diagnostics into one UAE property system.",
  path: "/studio",
});

export default function StudioPage() {
  return (
    <main className="relative">
      <Navigation />
      <StudioHero />
      <StudioPhilosophy />
      <StudioServiceSystem />
      <StudioWhyEngineering />
      <StudioUAEContext />
      <StudioAIConnection />
      <StudioCTA />
      <Footer />
      <FloatingDock />
    </main>
  );
}
