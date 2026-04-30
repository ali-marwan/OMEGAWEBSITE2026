import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";
import {
  getAllServiceSlugs,
  getServiceBySlug,
  type Service,
} from "@/lib/services";

/**
 * Pre-render every known service slug at build time. Keeps the
 * detail routes statically generated and gives Next.js a complete
 * sitemap for the service hub.
 */
export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service · OMEGA Service Hub" };
  return {
    title: `${service.title} — OMEGA Service Hub`,
    description: service.description,
  };
}

/**
 * /service-hub/[slug] — service detail placeholder.
 *
 * Looks up the service from the centralized data model and renders
 * a clean detail header with all of the catalog metadata that's
 * already in `lib/services.ts`. The full booking / request / track
 * flows are intentionally not built yet; this page exists so:
 *
 *   - "View Details" links from <ServiceHubCard> resolve cleanly
 *     instead of 404'ing.
 *   - The four `availableActions` per service are surfaced as a
 *     real list of buttons (each carries `data-action` with the
 *     stable action code so the future mobile app can hand them
 *     off to its router).
 *   - Crawlers + visitors land on a real page with the right
 *     metadata for SEO.
 *
 * When a request flow is built later, replace the "Detail flow
 * coming soon" notice with the live form / booking / tracking UI.
 */
export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main className="relative">
      <Navigation />
      <DetailHero service={service} />
      <Footer />
      <FloatingDock />
    </main>
  );
}

function DetailHero({ service }: { service: Service }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-warmwhite pt-32 pb-32 md:pt-40 md:pb-40"
    >
      {/* Architectural grid + soft warm radial — same vocabulary
          as every other section on the OMEGA platform. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(242,106,27,0.07) 0%, rgba(242,106,27,0.02) 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mt-7 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
        >
          <Link
            href="/service-hub"
            className="text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
          >
            Service Hub
          </Link>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-graphite/85">{service.category}</span>
          {" "}
          <span aria-hidden>·</span>
          {" "}
          <span className="text-omega">{service.index}</span>
        </nav>

        {/* Eyebrow */}
        <div className="mt-10 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-technical text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>
            {service.index} · {service.category} · {service.appActionType}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-8 max-w-4xl font-sans font-bold text-[2.4rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[1.04] tracking-tightest text-graphite">
          {service.title}
        </h1>

        {/* Descriptor */}
        <p className="mt-3 max-w-3xl font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
          {service.descriptor}
        </p>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-base md:text-lg leading-[1.75] text-muted">
          {service.description}
        </p>

        {/* Use cases */}
        <div className="mt-12">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-graphite/70">
            Use Cases
          </div>
          {" "}
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-[0.95rem] text-graphite/85">
            {service.useCases.map((c, i) => (
              <Fragment key={c}>
                {i > 0 && " "}
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block h-1 w-1 rounded-full bg-omega"
                  />
                  {" "}
                  <span>{c}</span>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>

        {/* Available actions */}
        <div className="mt-12">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-graphite/70">
            Available Actions
          </div>
          {" "}
          <div className="mt-5 flex flex-wrap items-stretch gap-3 md:gap-4">
            {service.availableActions.map((action, i) => (
              <Fragment key={action.code}>
                {i > 0 && " "}
                <Link
                  href={action.href}
                  data-action={action.code}
                  className={
                    i === 0
                      ? "inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-6 py-3 text-[0.86rem] font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
                      : "inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-6 py-3 text-[0.86rem] font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
                  }
                >
                  <span>{action.label}</span>
                </Link>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Detail flow coming-soon notice */}
        <div className="mt-16 rounded-[20px] border border-line/85 bg-warmwhite/70 p-8 md:p-10">
          <div className="flex items-center gap-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Detail Flow · In Progress</span>
          </div>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-[1.7] text-muted">
            Booking, photo upload, request tracking, and live service
            scheduling for this module are being built. For now, start
            a diagnosis or speak directly with the team — both routes
            connect to the same OMEGA service network.
          </p>
        </div>

        {/* Bottom hairline */}
        <div className="mt-20 h-px arch-rule" />
      </div>
    </section>
  );
}
