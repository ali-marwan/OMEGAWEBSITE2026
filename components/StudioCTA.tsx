import Link from "next/link";
import { Fragment } from "react";

/**
 * `/studio` — Section 07: Closing CTA.
 *
 * Three exits matching the brief:
 *   - Open Service Hub  → /service-hub          (primary)
 *   - Start Diagnosis   → /diagnosis            (ghost)
 *   - Speak to Team     → /#contact             (ghost)
 *
 * Hash anchor for "Speak to Team" uses a plain `<a>` (not Next.js
 * `<Link>`) so the browser fires a real `hashchange` event — same
 * pattern used by the rest of the site.
 *
 * Closes the page architectural rhythm with a top + bottom arch-rule
 * and a soft warm radial accent, matching every other section's
 * closing layer.
 */

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  /** Plain `<a>` for hash anchors so hashchange fires; otherwise Link. */
  hashOnly?: boolean;
  dataAction?: string;
};

const buttons: CtaButton[] = [
  {
    label: "Open Service Hub",
    href: "/service-hub",
    variant: "primary",
    dataAction: "OPEN_SERVICE_HUB",
  },
  {
    label: "Start Diagnosis",
    href: "/diagnosis",
    variant: "ghost",
    dataAction: "START_DIAGNOSIS",
  },
  {
    label: "Speak to Team",
    href: "/#contact",
    variant: "ghost",
    hashOnly: true,
    dataAction: "CONTACT_TEAM",
  },
];

export function StudioCTA() {
  return (
    <section
      id="studio-cta"
      className="relative overflow-hidden bg-warmwhite pt-10 pb-14 md:pt-14 md:pb-16"
    >
      {/* Soft warm radial closing accent */}
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

        {/* Section eyebrow */}
        <div className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Next Step</span>
        </div>

        {/* Headline + supporting paragraph */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            Start with the right OMEGA path.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            Browse the service system, run a guided diagnosis, or
            speak directly with the team. Every route lands on a real
            person — no dead ends.
          </p>
        </div>

        {/* Three buttons. Literal whitespace text node between each
            sibling keeps labels apart in flat textContent — same
            pattern used across the rest of the site. */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          {buttons.map((btn, i) => (
            <Fragment key={btn.label}>
              {i > 0 && " "}
              {btn.hashOnly ? (
                <a
                  href={btn.href}
                  data-action={btn.dataAction}
                  className={btnClass(btn.variant)}
                >
                  <span>{btn.label}</span>
                  {btn.variant === "primary" && (
                    <>
                      {" "}
                      <Arrow />
                    </>
                  )}
                </a>
              ) : (
                <Link
                  href={btn.href}
                  data-action={btn.dataAction}
                  className={btnClass(btn.variant)}
                >
                  <span>{btn.label}</span>
                  {btn.variant === "primary" && (
                    <>
                      {" "}
                      <Arrow />
                    </>
                  )}
                </Link>
              )}
            </Fragment>
          ))}
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-10 h-px arch-rule" />
      </div>
    </section>
  );
}

function btnClass(variant: "primary" | "ghost"): string {
  if (variant === "primary") {
    return "inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90";
  }
  return "inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40";
}

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h8m0 0L7 3m4 4-4 4" />
    </svg>
  );
}
