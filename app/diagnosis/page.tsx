import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { DiagnosisHero } from "@/components/DiagnosisHero";
import { DiagnosisExperience } from "@/components/DiagnosisExperience";
import { DiagnosisCTA } from "@/components/DiagnosisCTA";
import { DiagnosisFloatingDock } from "@/components/DiagnosisFloatingDock";
import { buildPageMetadata } from "@/lib/seo";

/**
 * `/diagnosis` — OMEGA AI Property Diagnostics.
 *
 * A separate route from the Service Hub. The page composition is
 * deliberately lean: a hero, the guided experience (multi-step flow +
 * live summary + result panel), a closing CTA with the safety note,
 * and a custom floating dock. The standard FloatingDock is
 * intentionally NOT rendered here — the diagnosis page substitutes
 * `<DiagnosisFloatingDock />` so the dock surfaces the actions that
 * make sense once the user is already inside the diagnostic flow
 * (Service Hub · Speak to Team · Home), without duplicating a
 * "Start Diagnosis" button on a page whose entire purpose is the
 * diagnosis itself.
 *
 * Server component. The state-bearing flow lives inside
 * `<DiagnosisExperience />`, which is a client component — that
 * boundary keeps the rest of the page static-rendered.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "OMEGA AI Property Diagnostics | Guided Property Diagnosis",
  description:
    "Describe property issues, upload photos, and get routed to the right OMEGA service path through guided AI property diagnostics.",
  path: "/diagnosis",
});

export default function DiagnosisPage() {
  return (
    <main className="relative">
      <Navigation />
      <DiagnosisHero />
      <DiagnosisExperience />
      <DiagnosisCTA />
      <Footer />
      <DiagnosisFloatingDock />
    </main>
  );
}
