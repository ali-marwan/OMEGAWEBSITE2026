import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SystemBand } from "@/components/SystemBand";
import { ServicePreview } from "@/components/ServicePreview";
import { AISystem } from "@/components/AISystem";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";
import { HeroJourney } from "@/components/HeroJourney";

// <HeroJourney> is a "use client" component that returns `null` until
// its desktop / reduced-motion check has run in a useEffect. The SSR
// pass therefore emits no markup for it, and the heavy R3F + GSAP
// chunk is loaded only on the client where it can actually execute.
// (Next.js 16 disallows `dynamic({ ssr: false })` in Server Components,
// so we defer the lazy-loading to the component's own mount logic
// rather than a dynamic wrapper here.)

export default function HomePage() {
  return (
    <main className="relative">
      <Navigation />
      {/* GLB-driven 3D logo journey — fixed overlay on lg+. Travels
          across Hero → Operating Principles → start of Service System
          via GSAP ScrollTrigger, then settles + recedes. Returns null
          on tablet/mobile and for reduced-motion users; in those
          modes the inline OmegaMark fallback inside <Hero> is used. */}
      <HeroJourney />
      <Hero />
      <SystemBand />
      <ServicePreview />
      <AISystem />
      <Footer />
      <FloatingDock />
    </main>
  );
}
