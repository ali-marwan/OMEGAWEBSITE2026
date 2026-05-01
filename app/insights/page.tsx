import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FloatingDock } from "@/components/FloatingDock";
import { GrassFieldHero } from "@/components/insights/GrassFieldHero";
import { InsightsFeaturedArticle } from "@/components/InsightsFeaturedArticle";
import { InsightsExperience } from "@/components/InsightsExperience";
import { InsightsCTA } from "@/components/InsightsCTA";
import {
  articles,
  getFeaturedArticle,
  getNonFeaturedArticles,
} from "@/lib/insights";
import { buildPageMetadata } from "@/lib/seo";

/**
 * `/insights` — OMEGA Insights listing page.
 *
 * Server-rendered. The article catalogue is read once on the server
 * and passed as props into the (client-side) filter + grid section
 * — no duplicate hydration of the data, no fetches.
 *
 * Composition (top → bottom):
 *
 *   <Navigation>                shared header
 *   <InsightsHero>              1. Hero — title, subtitle, CTAs
 *   <InsightsFeaturedArticle>   2. Featured article block
 *   <InsightsExperience>        3. Category filter rail + article grid
 *   <InsightsCTA>               4. Closing CTA — Hub / Diagnosis / Speak
 *   <Footer>                    shared footer
 *   <FloatingDock>              shared floating action rail
 *
 * The featured article is excluded from the grid below so it isn't
 * surfaced twice — visitors see it once at the top, then the rest
 * of the catalogue.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "OMEGA Insights | UAE Property Care & Engineering Guidance",
  description:
    "Practical guidance from OMEGA on property care, home services, health reports, renovation, engineering solutions, and AI diagnostics in the UAE.",
  path: "/insights",
});

export default function InsightsPage() {
  const featured = getFeaturedArticle();
  const rest = getNonFeaturedArticles();

  return (
    <main className="relative">
      <Navigation />
      {/* SANDBOX: WebGPU grass-field hero (Verdana-demo port, OMEGA
          warm palette). Active on /insights only — not on the
          homepage or any other route. To revert, swap the import +
          tag back to <InsightsHero />. */}
      <GrassFieldHero />
      <InsightsFeaturedArticle article={featured} />
      <InsightsExperience articles={rest.length > 0 ? rest : articles} />
      <InsightsCTA />
      <Footer />
      <FloatingDock />
    </main>
  );
}
