import { Fragment } from "react";
import type { Service } from "@/lib/services";

type CtaButton = {
  code: "SERVICE_REQUEST" | "START_DIAGNOSIS" | "CONTACT_TEAM";
  label: string;
  href: string;
  variant: "primary" | "ghost";
};

/**
 * Closing CTA on a service detail page.
 *
 * All three buttons are *in-page* anchors that open the matching tab
 * in the Embedded Action Centre on the same page. None of them
 * navigate away — the action centre's `hashchange` listener
 * activates the right tab and scrolls to `#action-center` with the
 * correct sticky-header offset.
 *
 *   #request    → SERVICE_REQUEST tab
 *   #diagnosis  → START_DIAGNOSIS tab
 *   #contact    → CONTACT_TEAM tab
 *
 * Each button carries `data-action="<CODE>"` so the future analytics
 * / mobile-app router can hand off without parsing the href.
 */
export function DetailCTA({ service }: { service: Service }) {
  const buttons: CtaButton[] = [
    {
      code: "SERVICE_REQUEST",
      label: "Request Service",
      href: "#request",
      variant: "primary",
    },
    {
      code: "START_DIAGNOSIS",
      label: "Start Diagnosis",
      href: "#diagnosis",
      variant: "ghost",
    },
    {
      code: "CONTACT_TEAM",
      label: "Speak to Our Team",
      href: "#contact",
      variant: "ghost",
    },
  ];

  return (
    <section
      id="cta"
      // Compact section paddings (`pt-12 pb-16`) keep the closing CTA
      // tight against the related-services row above and the footer
      // below — no dead zone between sections.
      className="relative overflow-hidden bg-warmwhite pt-12 pb-16 md:pt-16 md:pb-20"
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

        {/* Headline + supporting paragraph row */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.8rem] leading-[1.06] tracking-tightest text-graphite">
            <span className="block font-semibold">Ready to move forward?</span>
            {" "}
            <span className="mt-1.5 block font-light text-muted">
              Choose your next step — without leaving the page.
            </span>
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            Start with a request, diagnosis, or direct conversation
            with the OMEGA team. Every action is embedded above —
            nothing opens a new page.
          </p>
        </div>

        {/*
          Three inline buttons. Plain `<a>` (not Next.js `<Link>`)
          for hash navigation: Next's Link uses `history.pushState`
          for hash-only changes which silently updates the URL but
          does NOT fire a `hashchange` event. The Embedded Action
          Centre depends on `hashchange` to switch tabs and scroll,
          so plain anchors are required here. Literal `{" "}` text
          nodes between siblings keep labels apart in flat
          textContent.
        */}
        <div className="mt-9 flex flex-wrap items-stretch gap-3 md:gap-4">
          {buttons.map((btn, i) => (
            <Fragment key={btn.code}>
              {i > 0 && " "}
              <a
                href={btn.href}
                data-action={btn.code}
                className={
                  btn.variant === "primary"
                    ? "inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
                    : "inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
                }
              >
                <span>{btn.label}</span>
                {" "}
                <Arrow />
              </a>
            </Fragment>
          ))}
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
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
