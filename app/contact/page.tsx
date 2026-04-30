import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FloatingDock } from "@/components/FloatingDock";
import { ContactHero } from "@/components/ContactHero";
import { ContactRouteCards } from "@/components/ContactRouteCards";
import { ContactExperience } from "@/components/ContactExperience";
import { buildPageMetadata } from "@/lib/seo";

/**
 * `/contact` — the OMEGA contact / Speak to Our Team intake page.
 *
 * Composition mirrors every other narrative route (Navigation,
 * sectioned content, Footer, FloatingDock) so the page reads as
 * part of one continuous product. Order:
 *
 *   1. Hero            — "Speak to the right OMEGA team."
 *   2. Route cards     — General / Urgent / Technical (3 cards)
 *   3. Form + Direct   — main intake form on the left, direct-contact
 *      contact panel        panel on the right (single column on mobile)
 *
 * The page is structured as an *operational intake* — every field
 * maps cleanly to the eventual backend / CRM / WhatsApp Business
 * payload (see `lib/contact.ts` → `ContactSubmission`). Submission is
 * frontend-only for now and shows a clean success card after
 * "Submit to OMEGA".
 *
 * Server component. The form's state lives inside
 * `<ContactExperience />` (client component) — that boundary keeps
 * the rest of the page static-rendered.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Contact OMEGA | Speak to the Right Team",
  description:
    "Contact OMEGA for property care, home services, property assessment, renovation, engineering support, or guided diagnosis.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="relative">
      <Navigation />
      <ContactHero />
      <ContactRouteCards />
      <ContactExperience />
      <Footer />
      <FloatingDock />
    </main>
  );
}
