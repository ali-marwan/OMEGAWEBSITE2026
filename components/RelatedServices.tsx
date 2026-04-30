import Link from "next/link";
import { Fragment } from "react";
import { getRelatedServices, type Service } from "@/lib/services";

/**
 * Related services — a 2-3 card row pulled from the active service's
 * `relatedSlugs` (curated, not auto-derived from category). Renders
 * nothing if the data has no related entries, so the section never
 * appears empty.
 *
 * Each card is a compact mini-service tile: index + category, title,
 * descriptor, and a "View …" CTA that routes to the related detail
 * page. `data-action="VIEW_DETAILS"` is preserved so the same
 * navigation tracking works as on the catalog grid.
 */
export function RelatedServices({ service }: { service: Service }) {
  const related = getRelatedServices(service.slug);
  if (related.length === 0) return null;

  return (
    <section
      id="related"
      className="relative overflow-hidden bg-warmwhite pt-12 pb-12 md:pt-16 md:pb-16"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Top architectural rule */}
        <div className="h-px arch-rule" />

        {/* Section eyebrow */}
        <div className="mt-7 flex items-center justify-between gap-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Related Services</span>
          </div>
          {" "}
          <span className="hidden md:inline">
            {related.length} of {related.length}
          </span>
        </div>

        {/* Title row */}
        <div className="mt-7 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] font-semibold leading-[1.08] tracking-tightest text-graphite">
            Modules that connect to this one.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base leading-[1.75] text-muted">
            Other OMEGA paths that often combine with{" "}
            <span className="text-graphite/85">{service.title}</span>{" "}
            on a real project.
          </p>
        </div>

        {/* Related card grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {related.map((rel, i) => (
            <Fragment key={rel.id}>
              {i > 0 && " "}
              <RelatedCard related={rel} />
            </Fragment>
          ))}
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}

/**
 * Compact card for the related-services row — same architectural
 * vocabulary as the main hub card but stripped of use cases and the
 * full action list to keep this section calm and supportive rather
 * than competitive with the catalog grid.
 */
function RelatedCard({ related }: { related: Service }) {
  return (
    <Link
      href={related.route}
      data-action="VIEW_DETAILS"
      className="group module-card module-card--quiet relative flex h-full flex-col overflow-hidden rounded-[20px] border border-line/85 bg-warmwhite p-7 md:p-8 transition-[border-color,box-shadow,transform] duration-500 ease-elegant hover:border-graphite/25"
    >
      {/* Architectural corner ticks */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-px w-7 bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-7 w-px bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-px w-7 bg-graphite/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-7 w-px bg-graphite/15"
      />

      {/* Top row: index / category */}
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega/40 transition-all duration-500 ease-elegant group-hover:bg-omega"
        />
        {" "}
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-omega">
          {related.index}
        </span>
        {" "}
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
          / {related.category}
        </span>
      </div>

      {/* Accent rule */}
      <div
        aria-hidden
        className="mt-4 h-px w-9 bg-omega/35 transition-all duration-500 ease-elegant group-hover:w-14 group-hover:bg-omega/70"
      />

      {/* Title */}
      <h3 className="mt-5 text-[1.18rem] md:text-[1.3rem] font-semibold leading-tight tracking-tight text-graphite transition-transform duration-500 ease-elegant group-hover:translate-x-0.5">
        {related.title}
      </h3>

      {/* Descriptor */}
      <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted/90">
        {related.descriptor}
      </p>

      {/* Spacer pushes the CTA to the bottom */}
      <div className="flex-1" />

      {/* Hairline */}
      <div className="mt-6 h-px w-full bg-line" />

      {/* View CTA row */}
      <div className="mt-4 flex items-center justify-between gap-3 text-[0.92rem] font-medium text-graphite transition-colors duration-500 ease-elegant group-hover:text-omega">
        <span>View module</span>
        {" "}
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full border border-graphite/20 transition-all duration-500 ease-elegant group-hover:border-omega/60 group-hover:bg-omega/5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7h8m0 0L7 3m4 4-4 4" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
