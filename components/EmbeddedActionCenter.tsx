"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useState,
  type FormEvent,
} from "react";
import { ease } from "@/lib/motion";
import {
  buildLead,
  submitLead,
  type Lead,
  type LeadContactMethod,
} from "@/lib/leads";
import type { Service } from "@/lib/services";
import {
  LeadSuccessPanel,
  ServiceRequestForm,
} from "./ServiceRequestForm";

/**
 * Action Centre tab keys. They double as URL hash values so external
 * links (hero CTAs, closing CTA, floating dock) can deep-link to a
 * specific tab via `#request`, `#diagnosis`, or `#contact`.
 *
 * `BACK_TO_HUB` is intentionally NOT a tab. It's a real navigation
 * to `/service-hub` and is surfaced through the floating dock, the
 * breadcrumb, and the related-services section — not as a panel
 * inside this section.
 */
const VALID_TABS = ["request", "diagnosis", "contact"] as const;
type TabKey = (typeof VALID_TABS)[number];

type TabConfig = {
  key: TabKey;
  code: "SERVICE_REQUEST" | "START_DIAGNOSIS" | "CONTACT_TEAM";
  label: string;
  short: string;
};

const tabs: readonly TabConfig[] = [
  {
    key: "request",
    code: "SERVICE_REQUEST",
    label: "Request Service",
    short: "Request",
  },
  {
    key: "diagnosis",
    code: "START_DIAGNOSIS",
    label: "Start Diagnosis",
    short: "Diagnose",
  },
  {
    key: "contact",
    code: "CONTACT_TEAM",
    label: "Speak to Team",
    short: "Contact",
  },
];

/**
 * Scroll the page so the Action Centre wrapper sits cleanly below
 * the sticky header.
 *
 * Uses `scrollIntoView({ block: "start" })` which respects the
 * global `[id] { scroll-margin-top: 140px }` rule from globals.css —
 * one source of truth for the header offset, no hard-coded pixel
 * math drifting between components.
 *
 * Wrapped in two `requestAnimationFrame` calls so React has time to
 * commit any tab-state change first; otherwise the scroll target
 * could move while the new panel is still being painted, leaving
 * the heading slightly off below the chrome.
 */
function scrollToActionCenter(behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById("action-center");
      if (!el) return;
      el.scrollIntoView({ behavior, block: "start" });
    });
  });
}

/**
 * Embedded Action Centre — the same-page replacement for separate
 * action routes.
 *
 * Anchor strategy (the fix for the wrong-position jump):
 *   - The section wrapper carries `id="action-center"` and is the
 *     ONLY scroll target. There are no per-tab anchor stubs.
 *   - External links use `#request`, `#diagnosis`, `#contact` — the
 *     tab keys. The browser finds no element with those ids, so it
 *     does not auto-scroll. Our `hashchange` listener catches the
 *     hash, activates the matching tab, then manually scrolls to
 *     `#action-center`. This eliminates the dual-scroll race
 *     between the browser default and React's tab swap that was
 *     landing the page in the wrong place.
 *   - On initial mount we also read the hash, so direct links like
 *     `https://example.com/service-hub/.../#diagnosis` (typed,
 *     bookmarked, or shared) land on the right tab + scroll target
 *     after hydration. Same code path on localhost and Vercel —
 *     hashes are client-only, never reach the server.
 *
 * Form behaviour (UI placeholders for the future backend):
 *   - Real `<input>` / `<textarea>` / `<select>` fields with proper
 *     names, autocomplete, and labels — when the backend lands the
 *     payload is a clean POST body, not a redesign.
 *   - On submit we `preventDefault()` and swap the form for an
 *     inline acknowledgment block. No data leaves the browser yet.
 */
export function EmbeddedActionCenter({ service }: { service: Service }) {
  const [activeTab, setActiveTab] = useState<TabKey>("request");

  // Hash → tab sync, on mount and on hashchange. The mount-time
  // sync() catches direct loads like `/service-hub/foo#diagnosis`
  // (hashes are client-only and never reach Vercel's server, so
  // this code path is identical on localhost and production).
  useEffect(() => {
    const sync = () => {
      if (typeof window === "undefined") return;
      const raw = window.location.hash.replace("#", "");
      if ((VALID_TABS as readonly string[]).includes(raw)) {
        setActiveTab(raw as TabKey);
        scrollToActionCenter("smooth");
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Delegated click listener — catches clicks on ANY anchor in the
  // page whose href is `#request`, `#diagnosis`, or `#contact`, and
  // handles the activation + scroll in JS regardless of whether the
  // URL hash actually changed.
  //
  // This covers the edge case the `hashchange` listener can't:
  // browsers do NOT fire `hashchange` when the new hash equals the
  // current hash. So if a user opens the page with `#request` (sync
  // runs, tab activates, page scrolls), then scrolls back to the
  // hero and clicks "Request Service" again, the URL hash doesn't
  // change → no hashchange event → without this delegator the click
  // would feel dead. With it, every click reliably scrolls back to
  // the action centre and re-activates the tab.
  useEffect(() => {
    const onAnchorClick = (e: MouseEvent) => {
      // Honour modifier keys (cmd/ctrl/shift/alt-click should still
      // open in a new tab) and non-primary mouse buttons.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const tab = href.slice(1);
      if (!(VALID_TABS as readonly string[]).includes(tab)) return;

      // We own this navigation — skip the browser's anchor scroll
      // (which would fight our manual scroll) and run our own logic.
      e.preventDefault();
      setActiveTab(tab as TabKey);
      if (typeof window !== "undefined" && window.history) {
        window.history.replaceState(null, "", `#${tab}`);
      }
      scrollToActionCenter("smooth");
    };
    document.addEventListener("click", onAnchorClick);
    return () => document.removeEventListener("click", onAnchorClick);
  }, []);

  // Tab click handler — switches state, updates the URL hash without
  // pushing browser history, and scrolls the section into view.
  const onPickTab = useCallback((key: TabKey) => {
    setActiveTab(key);
    if (typeof window !== "undefined" && window.history) {
      window.history.replaceState(null, "", `#${key}`);
    }
    scrollToActionCenter("smooth");
  }, []);

  return (
    <section
      id="action-center"
      className="relative overflow-hidden bg-warmwhite pt-12 pb-16 md:pt-16 md:pb-20"
    >
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
          <span>Action Centre</span>
        </div>

        {/* Section title + subtitle */}
        <div className="mt-5 grid grid-cols-12 items-end gap-x-6 gap-y-4">
          <h2 className="col-span-12 lg:col-span-7 text-[1.85rem] md:text-[2.4rem] font-semibold leading-[1.08] tracking-tightest text-graphite">
            Action Centre.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base leading-[1.7] text-muted">
            Request service, start diagnosis, or contact the team —
            without leaving this page.
          </p>
        </div>

        {/*
          Tab strip.

          - Mobile (< md): the tabs sit on a single row that scrolls
            horizontally. `flex-nowrap` + `overflow-x-auto` +
            `snap-x snap-mandatory` give a calm chip-scroller, and
            `-mx-6 px-6` lets the row bleed to the viewport edges so
            partially-visible tabs hint at scroll. The narrow CSS
            class `.action-tab-scroller` (defined in globals.css)
            hides the scrollbar on macOS / iOS.
          - md and up: tabs wrap as before, no scroll.
        */}
        <div
          role="tablist"
          aria-label="Action Centre tabs"
          className="action-tab-scroller mt-7 -mx-6 lg:-mx-10 flex items-center gap-2 overflow-x-auto px-6 lg:px-10 snap-x snap-mandatory md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:snap-none md:gap-3"
        >
          {tabs.map((tab, i) => {
            const isActive = activeTab === tab.key;
            return (
              <Fragment key={tab.key}>
                {i > 0 && " "}
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.key}`}
                  data-action={tab.code}
                  onClick={() => onPickTab(tab.key)}
                  className={`group/tab inline-flex flex-shrink-0 snap-start items-center gap-2.5 rounded-full border px-4 py-2.5 text-[0.82rem] font-medium transition-all duration-500 ease-elegant hover:-translate-y-px md:flex-shrink ${
                    isActive
                      ? "border-graphite/90 bg-graphite text-warmwhite shadow-[0_1px_0_rgba(30,30,30,0.04),0_14px_28px_-22px_rgba(30,30,30,0.32)]"
                      : "border-line/80 bg-warmwhite/70 text-graphite/80 hover:border-graphite/30 hover:text-graphite"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-500 ease-elegant ${
                      isActive
                        ? "bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
                        : "bg-omega/40 group-hover/tab:bg-omega/70"
                    }`}
                  />
                  {" "}
                  <span>{tab.label}</span>
                  {" "}
                  <span
                    className={`hidden md:inline font-mono text-[0.66rem] uppercase tracking-[0.12em] ${
                      isActive ? "text-warmwhite/70" : "text-muted"
                    }`}
                  >
                    {tab.code}
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>

        {/* ── Active panel ──────────────────────────────────────── */}
        <div className="mt-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`panel-${activeTab}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.3, ease }}
              className={`rounded-[20px] border bg-warmwhite p-6 md:p-9 ${
                activeTab === "diagnosis"
                  ? "border-omega/35 bg-warmwhite shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_22px_46px_-30px_rgba(242,106,27,0.18)]"
                  : "border-line/85"
              }`}
            >
              {activeTab === "request" && (
                <RequestServicePanel service={service} />
              )}
              {activeTab === "diagnosis" && (
                <StartDiagnosisPanel service={service} />
              )}
              {activeTab === "contact" && (
                <SpeakToTeamPanel service={service} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom architectural rule */}
        <div className="mt-12 h-px arch-rule" />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Shared building blocks
   ────────────────────────────────────────────────────────────────── */

function PanelHeader({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-line/70 pb-6">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
        />
        {" "}
        <span className="text-omega">{code}</span>
        {" "}
        <span aria-hidden className="h-3 w-px bg-line" />
        {" "}
        <span>Action Panel</span>
      </div>
      {/*
        Real newline between the eyebrow row and the panel title so
        flat textContent reads as two lines, never one run-on string.
      */}
      {"\n"}
      <h3 className="mt-3 text-[1.4rem] md:text-[1.65rem] font-semibold leading-tight tracking-tight text-graphite">
        {title}
      </h3>
      <p className="mt-2 max-w-2xl text-[0.95rem] leading-[1.6] text-muted">
        {description}
      </p>
    </header>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
      {children}
    </span>
  );
}

const fieldClass =
  "mt-2 block w-full rounded-[10px] border border-line/85 bg-warmwhite px-4 py-3 text-[0.95rem] text-graphite placeholder:text-graphite/35 transition-[border-color,box-shadow] duration-500 ease-elegant focus:border-graphite/40 focus:outline-none focus:ring-2 focus:ring-omega/20";

function PrimaryButton({
  children,
  type = "button",
  dataAction,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  dataAction: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      data-action={dataAction}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
    >
      <span>{children}</span>
      {" "}
      <ArrowGlyph />
    </button>
  );
}

function ArrowGlyph() {
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

function Acknowledgment({
  code,
  message,
  onReset,
}: {
  code: string;
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[14px] border border-omega/30 bg-omega/[0.04] p-6 md:p-7">
      <div className="flex items-center gap-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
        />
        {" "}
        <span>{code} · Captured</span>
      </div>
      <p className="mt-4 max-w-2xl text-[0.95rem] leading-[1.7] text-graphite/85">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 text-[0.85rem] font-medium text-graphite/80 transition-colors duration-500 ease-elegant hover:text-omega"
      >
        <span aria-hidden>↻</span>
        {" "}
        <span>Submit another</span>
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Panel 01 — Request Service (SERVICE_REQUEST)
   ────────────────────────────────────────────────────────────────── */

/**
 * Request Service tab — uses the canonical reusable
 * `<ServiceRequestForm />` so the same form (with the same Lead
 * shape, validation, and success state) renders here, on `/contact`,
 * and anywhere else that needs a service-scoped intake. The
 * service-detail page passes its `Service` so the lead carries the
 * right `serviceName` + `serviceCode` automatically.
 */
function RequestServicePanel({ service }: { service: Service }) {
  return (
    <>
      <PanelHeader
        code="SERVICE_REQUEST"
        title="Request this service."
        description={`Share a few details about your property and what you need. We'll match the request to ${service.title} and the right OMEGA team.`}
      />
      <div className="mt-7">
        <ServiceRequestForm
          actionType="SERVICE_REQUEST"
          service={{ name: service.title, code: service.slug }}
          sourceRoute={`/service-hub/${service.slug}`}
        />
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Panel 02 — Start Diagnosis (START_DIAGNOSIS)
   ────────────────────────────────────────────────────────────────── */

function StartDiagnosisPanel({ service }: { service: Service }) {
  const id = useId();
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [issueType, setIssueType] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("medium");

  const suggestedRoute = (() => {
    if (!issueType) return null;
    const map: Record<string, string> = {
      ac: "OMEGA Home Services · AC fault flow",
      plumbing: "OMEGA Home Services · Plumbing repair flow",
      electrical: "OMEGA Home Services · Electrical fault flow",
      structural: "OMEGA Engineering Solutions · Structural review",
      finish: "OMEGA Renovation · Finishing scope",
      assessment: "OMEGA Property Health Report · Full assessment",
    };
    return map[issueType] ?? `${service.title} · diagnosis flow`;
  })();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Build canonical Lead (`actionType: diagnosis`) so this submit
    // produces the same shape as the standalone `/diagnosis` flow
    // and the future backend / CRM ingests one taxonomy.
    const formData = new FormData(e.currentTarget);
    const lead = buildLead({
      route: `/service-hub/${service.slug}`,
      actionType: "START_DIAGNOSIS",
      serviceName: service.title,
      serviceCode: service.serviceCode,
      message: String(formData.get("issue") ?? "").trim(),
      propertyType: String(formData.get("propertyType") ?? "") || null,
      extra: {
        issueType,
        urgency,
        suggestedRoute,
      },
    });
    const result = await submitLead(lead);
    if (result.ok) setSubmittedLead(result.lead);
  };

  if (submittedLead) {
    return (
      <>
        <PanelHeader
          code="START_DIAGNOSIS"
          title="Diagnosis captured."
          description={
            suggestedRoute
              ? `Suggested route: ${suggestedRoute}. OMEGA confirms scope after review.`
              : "OMEGA confirms scope after review."
          }
        />
        <div className="mt-6">
          <LeadSuccessPanel
            lead={submittedLead}
            sourceRoute={`/service-hub/${service.slug}`}
            onAnother={() => setSubmittedLead(null)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PanelHeader
        code="START_DIAGNOSIS"
        title="Run a quick diagnosis."
        description="Describe what's happening and the AI will suggest the most relevant OMEGA service path."
      />

      <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
        <label htmlFor={`${id}-issue`} className="block">
          <FieldLabel>Describe the issue</FieldLabel>
          <textarea
            id={`${id}-issue`}
            name="issue"
            rows={4}
            placeholder="e.g. The AC isn't cooling and there's water dripping from the indoor unit."
            className={fieldClass}
          />
        </label>

        {/* Upload + issue type */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <div className="block">
            <FieldLabel>Upload Photos</FieldLabel>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload diagnosis photos placeholder"
              data-action="UPLOAD_PHOTOS"
              className="mt-2 flex flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-line bg-warmwhite/60 px-5 py-6 text-center transition-colors duration-500 ease-elegant hover:border-graphite/30"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full border border-graphite/15 text-graphite/60"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 11V3m0 0L3 7m4-4 4 4" />
                </svg>
              </span>
              {" "}
              <span className="text-[0.9rem] text-graphite/85">
                Drop photos here or browse files
              </span>
              {" "}
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                One or two images help the AI route faster
              </span>
            </div>
          </div>

          <label htmlFor={`${id}-issue-type`} className="block">
            <FieldLabel>Issue Type</FieldLabel>
            <select
              id={`${id}-issue-type`}
              name="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select a category</option>
              <option value="ac">AC / cooling</option>
              <option value="plumbing">Plumbing / water</option>
              <option value="electrical">Electrical / lighting</option>
              <option value="structural">Structural / cracks</option>
              <option value="finish">Finishes / joinery</option>
              <option value="assessment">General property assessment</option>
            </select>
          </label>
        </div>

        {/* Urgency + property type */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <fieldset>
            <FieldLabel>Urgency Level</FieldLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { key: "low", label: "Low" },
                { key: "medium", label: "Medium" },
                { key: "high", label: "High" },
                { key: "urgent", label: "Urgent" },
              ].map((opt, i) => (
                <Fragment key={opt.key}>
                  {i > 0 && " "}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line/85 bg-warmwhite px-4 py-2 text-[0.8rem] text-graphite/85 transition-colors duration-500 ease-elegant has-[:checked]:border-graphite/60 has-[:checked]:bg-graphite has-[:checked]:text-warmwhite hover:border-graphite/30">
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.key}
                      checked={urgency === opt.key}
                      onChange={() => setUrgency(opt.key)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-omega/50 transition-colors duration-500 ease-elegant peer-checked:bg-omega"
                    />
                    {" "}
                    <span>{opt.label}</span>
                  </label>
                </Fragment>
              ))}
            </div>
          </fieldset>

          <label htmlFor={`${id}-property-type`} className="block">
            <FieldLabel>Property Type</FieldLabel>
            <select
              id={`${id}-property-type`}
              name="propertyType"
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled>
                Select a property type
              </option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial unit</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        {/* Suggested OMEGA route placeholder */}
        <div className="rounded-[14px] border border-omega/25 bg-omega/[0.03] p-5">
          <div className="flex items-center gap-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
            />
            {" "}
            <span>Suggested OMEGA Route</span>
          </div>
          <p className="mt-3 text-[0.95rem] leading-[1.7] text-graphite/85">
            {suggestedRoute ?? (
              <span className="text-muted">
                Pick an issue type to see the recommended OMEGA path.
              </span>
            )}
          </p>
        </div>

        {/* Submit row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <PrimaryButton type="submit" dataAction="START_DIAGNOSIS">
            Start Diagnosis
          </PrimaryButton>
          {" "}
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            Action · START_DIAGNOSIS · DIAGNOSTIC_REQUEST
          </p>
        </div>
      </form>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Panel 03 — Speak to Team (CONTACT_TEAM)
   ────────────────────────────────────────────────────────────────── */

function SpeakToTeamPanel({ service }: { service: Service }) {
  const id = useId();
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [channel, setChannel] = useState<string>("whatsapp");

  const channels = [
    { key: "whatsapp", label: "WhatsApp", meta: "Quick chat" },
    { key: "callback", label: "Request Callback", meta: "Phone return call" },
    { key: "email", label: "Email", meta: "Detailed enquiries" },
    { key: "schedule", label: "Schedule Discussion", meta: "30 min · video or in person" },
  ];

  /**
   * Map the EAC's four channel options onto the canonical
   * `LeadContactMethod` taxonomy (WhatsApp / Call / Email). Both
   * `callback` and `schedule` collapse to "Call" since they both
   * imply a voice connection — the human-readable label is preserved
   * in `extra.channelLabel` for the operations team.
   */
  const channelMethod: Record<string, LeadContactMethod> = {
    whatsapp: "WhatsApp",
    callback: "Call",
    email: "Email",
    schedule: "Call",
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lead = buildLead({
      route: `/service-hub/${service.slug}`,
      actionType: "CONTACT_TEAM",
      serviceName: service.title,
      serviceCode: service.serviceCode,
      fullName: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      preferredContactMethod: channelMethod[channel] ?? null,
      extra: {
        channelLabel:
          channels.find((c) => c.key === channel)?.label ?? channel,
      },
    });
    const result = await submitLead(lead);
    if (result.ok) setSubmittedLead(result.lead);
  };

  if (submittedLead) {
    return (
      <>
        <PanelHeader
          code="CONTACT_TEAM"
          title="The team will be in touch."
          description={`We've noted your message about ${service.title} and your preferred channel.`}
        />
        <div className="mt-6">
          <LeadSuccessPanel
            lead={submittedLead}
            sourceRoute={`/service-hub/${service.slug}`}
            onAnother={() => setSubmittedLead(null)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PanelHeader
        code="CONTACT_TEAM"
        title="Talk to the OMEGA team."
        description="Pick a channel and leave a short note. Every option leads back to the same OMEGA service network."
      />

      <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
        {/* Channel selector — full-width chip row */}
        <fieldset>
          <FieldLabel>Preferred Channel</FieldLabel>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
            {channels.map((opt, i) => (
              <Fragment key={opt.key}>
                {i > 0 && " "}
                <label className="group/channel relative flex cursor-pointer items-center justify-between gap-3 rounded-[14px] border border-line/85 bg-warmwhite p-4 transition-colors duration-500 ease-elegant has-[:checked]:border-graphite/60 has-[:checked]:bg-graphite has-[:checked]:text-warmwhite hover:border-graphite/30">
                  <input
                    type="radio"
                    name="channel"
                    value={opt.key}
                    checked={channel === opt.key}
                    onChange={() => setChannel(opt.key)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-omega/50 transition-colors duration-500 ease-elegant peer-checked:bg-omega"
                    />
                    {" "}
                    <span className="text-[0.9rem] font-medium">
                      {opt.label}
                    </span>
                  </div>
                  {" "}
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] opacity-70">
                    {opt.meta}
                  </span>
                </label>
              </Fragment>
            ))}
          </div>
        </fieldset>

        {/* Form fields */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <label htmlFor={`${id}-name`} className="block">
            <FieldLabel>Name</FieldLabel>
            <input
              id={`${id}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Sara Al Hammadi"
              className={fieldClass}
            />
          </label>

          <label htmlFor={`${id}-phone`} className="block">
            <FieldLabel>Phone / WhatsApp</FieldLabel>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+971 50 000 0000"
              className={fieldClass}
            />
          </label>
        </div>

        <label htmlFor={`${id}-message`} className="block">
          <FieldLabel>Message</FieldLabel>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            placeholder={`Anything we should know about your ${service.title} enquiry?`}
            className={fieldClass}
          />
        </label>

        {/* Submit row */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <PrimaryButton type="submit" dataAction="CONTACT_TEAM">
            Contact Team
          </PrimaryButton>
          {" "}
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            Action · CONTACT_TEAM
          </p>
        </div>
      </form>
    </>
  );
}
