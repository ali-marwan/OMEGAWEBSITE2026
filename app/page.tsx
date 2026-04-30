import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SystemBand } from "@/components/SystemBand";
import { ServicePreview } from "@/components/ServicePreview";
import { AISystem } from "@/components/AISystem";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";
import { SplineJourney } from "@/components/SplineJourney";

export default function HomePage() {
  return (
    <main className="relative">
      <Navigation />
      {/* Pinned 3D-logo journey — fixed overlay on lg+. It travels
          across Hero → Operating Principles → start of Service System,
          then fades. Returns null on tablet/mobile and for
          reduced-motion users; in those modes the inline render inside
          <Hero> is used instead. */}
      <SplineJourney />
      <Hero />
      <SystemBand />
      <ServicePreview />
      <AISystem />
      <Footer />
      <FloatingDock />
    </main>
  );
}
