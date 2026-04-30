"use client";

import { Fragment, type MouseEvent } from "react";
import { contactRoutes } from "@/lib/contact";

/**
 * `/contact` — Section 02: Contact route cards.
 *
 * Three cards (General · Urgent · Technical/Renovation) that scroll
 * the user to the main form below and pre-fill the form's enquiry
 * type via a global `CustomEvent`.
 *
 * Each card is a full-clickable `<a href="#contact-form">` so the
 * native browser scroll handles the navigation (no manual scroll
 * code needed — the global `[id] { scroll-margin-top: 140px }` rule
 * keeps the form clear of the sticky header). The onClick handler
 * additionally dispatches `contact:prefill` so `<ContactForm />`
 * pre-fills the matching enquiry type.
 *
 * Each card carries `data-action="<CODE>"` so the future analytics /
 * mobile-app router can hand off without parsing the href.
 *
 * Why a CustomEvent instead of URL search params:
 *   - Keeps the URL clean (no `?type=urgent` query baggage)
 *   - Doesn't require client-state hoisting between sibling sections
 *   - Survives soft Next.js navigations cleanly
 *   - Falls back gracefully — no JS still gets you to the form
 */
export function ContactRouteCards() {
  return (
    <section
      id="contact-routes"
      className="relative bg-warmwhite pt-8 pb-9 md:pt-12 md:pb-12"
    >
      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Choose Your Route</span>
        </div>

        {/* Headline + supporting paragraph */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            Pick the closest route — we route the rest.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            Three intake paths cover most enquiries. Anything that
            doesn't fit cleanly — pick "General enquiry" and OMEGA
            will route it on review.
          </p>
        </div>

        {/* 3 route cards — 1 col on mobile, 3 on lg */}
        <ul className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {contactRoutes.map((r, i) => (
            <Fragment key={r.code}>
              {i > 0 && " "}
              <li>
                <a
                  href="#contact-form"
                  data-action={r.code}
                  onClick={(e) => prefillAndAnnounce(e, r)}
                  className="module-card module-card--quiet group flex h-full flex-col justify-between gap-6 rounded-[20px] border border-line/80 bg-warmwhite/85 p-6 md:p-7 transition-all duration-500 ease-elegant hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-technical text-muted">
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
                      />
                      {" "}
                      <span>{r.index}</span>
                      {" "}
                      <span aria-hidden className="h-3 w-px bg-line" />
                      {" "}
                      <span>Route</span>
                    </div>
                    <h3 className="mt-4 text-[1.2rem] md:text-[1.3rem] font-semibold leading-[1.2] text-graphite">
                      {r.title}
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-[1.65] text-muted">
                      {r.description}
                    </p>
                  </div>
                  {/* Visual affordance — not a separate clickable;
                      the whole card is the link. */}
                  <span className="inline-flex items-center gap-2 self-start rounded-full border border-graphite/15 bg-warmwhite/70 px-4 py-2 text-[0.82rem] font-medium text-graphite transition-all duration-500 ease-elegant group-hover:-translate-y-px group-hover:border-graphite/40">
                    <span>Start enquiry</span>
                    {" "}
                    <Arrow />
                  </span>
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Click handler — dispatch the prefill event and let the browser
 * handle the actual scroll via the anchor's href. We don't
 * `preventDefault` because the native anchor jump (with our global
 * 140 px scroll-margin-top) lands the form correctly.
 *
 * The dispatched event is namespaced (`contact:prefill`) so it
 * cannot collide with anything else listening on `window`.
 */
function prefillAndAnnounce(
  _e: MouseEvent<HTMLAnchorElement>,
  route: (typeof contactRoutes)[number]
) {
  window.dispatchEvent(
    new CustomEvent("contact:prefill", {
      detail: { code: route.code, enquiry: route.prefillEnquiry },
    })
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
