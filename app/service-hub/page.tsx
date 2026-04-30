import { Navigation } from "@/components/Navigation";
import { ServiceHubHero } from "@/components/ServiceHubHero";
import { ServiceCatalog } from "@/components/ServiceCatalog";
import { GuidedPathSection } from "@/components/GuidedPathSection";
import { ServiceHubCTA } from "@/components/ServiceHubCTA";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";

export const metadata = {
  title: "OMEGA Service Hub — Property Solutions for the UAE",
  description:
    "Five service modules — care, repair, assessment, renovation, and engineering. Find the right OMEGA path for your UAE property.",
};

/**
 * /service-hub — the practical service marketplace layer.
 *
 * Composition:
 *
 *   <ServiceHubHero />        Section 01 — Hero
 *   <ServiceCatalog />        Section 02 — Filter bar + service grid
 *   <GuidedPathSection />     Section 03 — Three guided paths
 *   <ServiceHubCTA />         Section 04 — Closing CTA
 *
 * Reuses the landing page's <Navigation>, <Footer>, and
 * <FloatingDock> so the hub feels like a continuation of the same
 * design system, not a separate site. The navigation surfaces an
 * active-state indicator on "OMEGA Service Hub" via a usePathname
 * check inside the component itself.
 *
 * Intentionally no <HeroJourney> on this page — the brief was
 * "premium and usable, not heavy 3D".
 */
export default function ServiceHubPage() {
  return (
    <main className="relative">
      <Navigation />
      <ServiceHubHero />
      <ServiceCatalog />
      <GuidedPathSection />
      <ServiceHubCTA />
      <Footer />
      <FloatingDock />
    </main>
  );
}
