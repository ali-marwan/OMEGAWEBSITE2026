import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";
import { ServiceDetailHero } from "@/components/ServiceDetailHero";
import { WhatThisCovers } from "@/components/WhatThisCovers";
import { WhenToUseService } from "@/components/WhenToUseService";
import { OmegaProcess } from "@/components/OmegaProcess";
import { EmbeddedActionCenter } from "@/components/EmbeddedActionCenter";
import { RelatedServices } from "@/components/RelatedServices";
import { DetailCTA } from "@/components/DetailCTA";
import {
  getAllServiceSlugs,
  getServiceBySlug,
  type Service,
} from "@/lib/services";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata, serviceJsonLd } from "@/lib/seo";

/**
 * Pre-render every known service slug at build time. Keeps the
 * detail routes statically generated and gives Next.js a complete
 * sitemap for the service hub.
 *
 * If a new service is added to `services` in `lib/services.ts`, it
 * will automatically pick up a static route here on the next build —
 * no code changes required in this file.
 */
export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

/**
 * Per-service title pattern matches the brief's spec:
 *   "OMEGA Property Care System | Annual Maintenance & Property Support"
 *
 * The `descriptor` field already carries the right secondary phrase
 * for every service, so we compose `<title> | <descriptor>` rather
 * than maintaining a separate per-slug map. Editors update one
 * `lib/services.ts` field; the SEO title stays in sync.
 */
function buildServiceTitle(service: Service): string {
  return `${service.title} | ${service.descriptor}`;
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return buildPageMetadata({
      title: "Service Not Found | OMEGA Service Hub",
      description:
        "The OMEGA service module you requested could not be located.",
      path: `/service-hub/${slug}`,
      noindex: true,
    });
  }
  return buildPageMetadata({
    title: buildServiceTitle(service),
    description: service.fullDescription,
    path: service.route,
    // `article` framing is closer to a service description than a
    // generic website page — gives crawlers a slightly richer
    // signal for rich-result generation.
    ogType: "article",
  });
}

/**
 * /service-hub/[slug] — reusable service detail page.
 *
 * Composition (top → bottom, matches the brief's section list):
 *
 *   <Navigation>             shared header
 *   <ServiceDetailHero>      1. Hero — index, category, title,
 *                               descriptor, description, use cases,
 *                               three in-page CTAs
 *   <WhatThisCovers>         2. "What this covers" — 4 module cards
 *   <WhenToUseService>       3. "When to use this service" — 4–5
 *                               client-facing scenarios
 *   <OmegaProcess>           4. "OMEGA Process" — 4 standard steps
 *                               (sourced from `omegaProcess`)
 *   <EmbeddedActionCenter>   5. Embedded action centre — Request /
 *                               Diagnosis / Speak to Team / Back to
 *                               Hub as same-page tabs. Only Back to
 *                               Hub navigates; the other three are
 *                               inline forms / contact options.
 *   <RelatedServices>        6. 2–3 curated related modules
 *   <DetailCTA>              7. Final CTA — three buttons that all
 *                               scroll to the action-centre tabs
 *   <Footer>                 shared footer
 *   <FloatingDock>           shared floating action rail
 *
 * Page is a Server Component. Only the EmbeddedActionCenter,
 * Navigation, and FloatingDock are client components — every other
 * section is server-rendered, so the route ships almost entirely as
 * static HTML and the action-centre's tab JS hydrates on top.
 *
 * Unknown slugs render the app's `_not-found` route via Next.js's
 * `notFound()` — the brief's "clean not-found state".
 */
export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main className="relative">
      {/* Per-service Service schema — adds rich-result eligibility
          for service cards in search. Site-wide Organization schema
          is injected once in `app/layout.tsx`; this is the
          per-page complement. */}
      <JsonLd data={serviceJsonLd(service)} />
      <Navigation />
      <ServiceDetailHero service={service} />
      <WhatThisCovers service={service} />
      <WhenToUseService service={service} />
      <OmegaProcess />
      <EmbeddedActionCenter service={service} />
      <RelatedServices service={service} />
      <DetailCTA service={service} />
      <Footer />
      <FloatingDock />
    </main>
  );
}
