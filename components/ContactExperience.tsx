"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  contactMethods,
  enquiryTypes,
  enquiryTypeToServiceCode,
  initialContactSubmission,
  propertyTypes,
  type ContactMethod,
  type ContactSubmission,
  type EnquiryType,
  type PropertyType,
} from "@/lib/contact";
import {
  buildLead,
  submitLead,
  validateLead,
  type Lead,
  type LeadActionType,
  type LeadErrors,
} from "@/lib/leads";
import { ContactDirectPanel } from "./ContactDirectPanel";
import { LeadSuccessPanel } from "./ServiceRequestForm";

/**
 * `/contact` — Section 03: Form + Direct contact panel.
 *
 * Owns the form state, listens for the `contact:prefill` event
 * dispatched by `<ContactRouteCards />`, validates inline (no
 * browser-default alerts), and on submit emits a canonical
 * `Lead` via `submitLead` from `lib/leads.ts`.
 *
 * Layout:
 *   - Desktop (lg+): 12-col grid, form col-span-7 + direct panel
 *     col-span-5, panel `lg:sticky` so it follows scroll while the
 *     user works through the form.
 *   - Mobile / tablet: single column — form first, direct panel
 *     stacked below.
 *
 * On success, swaps the form for `<LeadSuccessPanel />` which
 * always presents three forward routes (Start Diagnosis · Back to
 * Service Hub · Speak to Team) plus a "Continue on WhatsApp"
 * deep-link if the user picked WhatsApp as their preferred channel.
 */

/**
 * Map a contact-form enquiry-type selection onto the canonical Lead
 * action and service taxonomy. Centralising the mapping keeps the
 * form free of conditional spaghetti and makes it easy for future
 * code (mobile app, analytics) to reuse the same logic.
 */
function deriveActionAndService(
  enquiryType: EnquiryType | null
): {
  actionType: LeadActionType;
  serviceName: string | null;
  serviceCode: string | null;
} {
  if (!enquiryType) {
    return {
      actionType: "general_enquiry",
      serviceName: null,
      serviceCode: null,
    };
  }
  if (enquiryType === "OMEGA AI / Diagnosis") {
    return {
      actionType: "diagnosis",
      serviceName: enquiryType,
      serviceCode: null,
    };
  }
  if (enquiryType === "General enquiry") {
    return {
      actionType: "general_enquiry",
      serviceName: null,
      serviceCode: null,
    };
  }
  return {
    actionType: "service_request",
    serviceName: enquiryType,
    serviceCode: enquiryTypeToServiceCode[enquiryType],
  };
}

export function ContactExperience() {
  const [submission, setSubmission] = useState<ContactSubmission>(
    initialContactSubmission
  );
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Patch helper — preserves React state immutability and keeps each
   * field-level handler one line.
   */
  const patch = useCallback((next: Partial<ContactSubmission>) => {
    setSubmission((prev) => ({ ...prev, ...next }));
  }, []);

  const markTouched = useCallback((field: string) => {
    setTouched((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  /**
   * Listen for prefill events from the route cards above. The cards
   * call `dispatchEvent('contact:prefill', { detail: { enquiry } })`
   * which we map onto the form's `enquiryType` field.
   *
   * The detail's enquiry value comes from `lib/contact.ts`'s
   * `contactRoutes` config, which uses one of the legacy labels
   * ("General enquiry" / "Urgent issue" / "Renovation"). After the
   * enquiry-type list was tightened, "Urgent issue" no longer
   * exists — so we accept the legacy label and silently fall back
   * to the closest matching new label so the prefill keeps working
   * without coupling the route-card data to the dropdown taxonomy.
   */
  useEffect(() => {
    type PrefillDetail = { enquiry?: string };
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<PrefillDetail>).detail;
      if (!detail?.enquiry) return;
      const incoming = detail.enquiry as string;
      const matched = (enquiryTypes as readonly string[]).includes(incoming)
        ? (incoming as EnquiryType)
        : // Soft fallback — urgent + general both go to General enquiry
          ("General enquiry" as EnquiryType);
      setSubmission((prev) =>
        prev.enquiryType ? prev : { ...prev, enquiryType: matched }
      );
    };
    window.addEventListener("contact:prefill", handler as EventListener);
    return () =>
      window.removeEventListener("contact:prefill", handler as EventListener);
  }, []);

  /**
   * Handle file picker changes. Names only — no upload happens yet.
   */
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    setSubmission((prev) => ({
      ...prev,
      uploadedAttachmentNames: [...prev.uploadedAttachmentNames, ...names],
    }));
  }, []);

  /**
   * Compute errors from the canonical validator. The `enquiryType`
   * dropdown is required separately (the validator doesn't know
   * about it). We add a custom error for that here.
   */
  const { actionType, serviceName, serviceCode } = deriveActionAndService(
    submission.enquiryType
  );

  const baseErrors: LeadErrors = validateLead({
    actionType,
    fullName: submission.fullName,
    phone: submission.phone,
    email: submission.email,
    message: submission.description,
    serviceName,
    preferredContactMethod: submission.preferredContact,
  });
  const enquiryTypeError = !submission.enquiryType
    ? "Please pick an enquiry type."
    : undefined;
  const errors: LeadErrors & { enquiryType?: string } = {
    ...baseErrors,
    enquiryType: enquiryTypeError,
  };

  const showError = (field: keyof typeof errors) =>
    (touched.has(field as string) || touched.has("__submit")) &&
    Boolean(errors[field]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setTouched(
        new Set([
          "fullName",
          "phone",
          "email",
          "message",
          "enquiryType",
          "__submit",
        ])
      );
      const hasErrors =
        Object.keys(baseErrors).length > 0 || enquiryTypeError !== undefined;
      if (hasErrors) return;

      setSubmitting(true);
      const lead = buildLead({
        route: "/contact",
        actionType,
        serviceName,
        serviceCode,
        fullName: submission.fullName.trim(),
        phone: submission.phone.trim(),
        email: submission.email.trim(),
        propertyType: submission.propertyType,
        location: submission.location.trim(),
        message: submission.description.trim(),
        preferredContactMethod: submission.preferredContact,
        uploadedFiles: submission.uploadedAttachmentNames,
        extra: {
          enquiryType: submission.enquiryType,
        },
      });
      const { ok } = await submitLead(lead);
      setSubmitting(false);
      if (ok) {
        setSubmittedLead(lead);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document
              .getElementById("contact-form")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        });
      }
    },
    [
      actionType,
      baseErrors,
      enquiryTypeError,
      serviceCode,
      serviceName,
      submission,
    ]
  );

  const handleRestart = useCallback(() => {
    setSubmission(initialContactSubmission);
    setTouched(new Set());
    setSubmittedLead(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById("contact-form")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, []);

  const inputClass = (field: keyof typeof errors) =>
    `text-input ${
      showError(field) ? "text-input--error" : ""
    }`;

  return (
    <section
      id="contact-form"
      className="relative bg-warmwhite pt-8 pb-9 md:pt-12 md:pb-12"
    >
      {/* Subtle architectural grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 arch-grid opacity-50"
      />

      <div className="relative mx-auto max-w-page px-6 lg:px-10">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
          />
          {" "}
          <span>Operational Intake</span>
        </div>

        {/* Headline + lede */}
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <h2 className="col-span-12 lg:col-span-7 text-[2rem] md:text-[2.6rem] leading-[1.06] tracking-tightest text-graphite font-semibold">
            Tell OMEGA what you need.
          </h2>
          {" "}
          <p className="col-span-12 lg:col-span-5 text-base text-muted leading-[1.75]">
            Every field maps onto how OMEGA routes the enquiry — name,
            channel, property, and the service area you're asking
            about. Photos help where visible symptoms matter.
          </p>
        </div>

        {/* Two-column body — form left, direct panel right */}
        <div className="mt-9 grid grid-cols-12 gap-x-6 gap-y-8">
          {/* ── Form column ──────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-7">
            {!submittedLead ? (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="OMEGA contact form"
                className="rounded-[24px] border border-line/80 bg-warmwhite/80 p-6 md:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)] backdrop-blur-sm"
              >
                {/* Service interest dropdown — first thing the user
                    picks so the form's downstream logic (action type,
                    serviceCode) maps cleanly. */}
                <FieldShell
                  label="Service interest"
                  htmlFor="contact-enquiry-type"
                  required
                  error={showError("enquiryType") ? errors.enquiryType : undefined}
                >
                  <select
                    id="contact-enquiry-type"
                    value={submission.enquiryType ?? ""}
                    onChange={(e) =>
                      patch({
                        enquiryType: (e.target.value as EnquiryType) || null,
                      })
                    }
                    onBlur={() => markTouched("enquiryType")}
                    className={`${inputClass("enquiryType")} cursor-pointer`}
                    aria-invalid={showError("enquiryType") || undefined}
                  >
                    <option value="">Select…</option>
                    {enquiryTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                {/* Identity row */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                  <FieldShell
                    label="Full name"
                    htmlFor="contact-fullname"
                    required
                    error={showError("fullName") ? errors.fullName : undefined}
                  >
                    <input
                      id="contact-fullname"
                      type="text"
                      autoComplete="name"
                      value={submission.fullName}
                      onChange={(e) => patch({ fullName: e.target.value })}
                      onBlur={() => markTouched("fullName")}
                      placeholder="Your full name"
                      className={inputClass("fullName")}
                      aria-invalid={showError("fullName") || undefined}
                    />
                  </FieldShell>
                  {" "}
                  <FieldShell
                    label="Phone / WhatsApp"
                    htmlFor="contact-phone"
                    helper="Phone or email is required."
                    error={showError("phone") ? errors.phone : undefined}
                  >
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      value={submission.phone}
                      onChange={(e) => patch({ phone: e.target.value })}
                      onBlur={() => markTouched("phone")}
                      placeholder="+971 ..."
                      className={inputClass("phone")}
                      aria-invalid={showError("phone") || undefined}
                    />
                  </FieldShell>
                  <FieldShell
                    label="Email"
                    htmlFor="contact-email"
                    error={showError("email") ? errors.email : undefined}
                  >
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={submission.email}
                      onChange={(e) => patch({ email: e.target.value })}
                      onBlur={() => markTouched("email")}
                      placeholder="you@email.com"
                      className={inputClass("email")}
                      aria-invalid={showError("email") || undefined}
                    />
                  </FieldShell>
                  <FieldShell
                    label="Property type"
                    htmlFor="contact-property-type"
                  >
                    <select
                      id="contact-property-type"
                      value={submission.propertyType ?? ""}
                      onChange={(e) =>
                        patch({
                          propertyType:
                            (e.target.value as PropertyType) || null,
                        })
                      }
                      className={`${inputClass("phone")} cursor-pointer`}
                    >
                      <option value="">Select…</option>
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                </div>

                {/* Location */}
                <div className="mt-6">
                  <FieldShell
                    label="Location / area"
                    htmlFor="contact-location"
                    helper="Emirate, community, or building."
                  >
                    <input
                      id="contact-location"
                      type="text"
                      value={submission.location}
                      onChange={(e) => patch({ location: e.target.value })}
                      placeholder="e.g. Dubai Marina, Tower XYZ"
                      className={inputClass("phone")}
                    />
                  </FieldShell>
                </div>

                {/* Description / message */}
                <div className="mt-6">
                  <FieldShell
                    label="Brief description"
                    htmlFor="contact-description"
                    required={actionType === "general_enquiry"}
                    error={showError("message") ? errors.message : undefined}
                  >
                    <textarea
                      id="contact-description"
                      rows={5}
                      value={submission.description}
                      onChange={(e) =>
                        patch({ description: e.target.value })
                      }
                      onBlur={() => markTouched("message")}
                      placeholder="Describe what you need, where, and any urgency. Photos can be attached below."
                      className={`${inputClass("message")} resize-y`}
                      aria-invalid={showError("message") || undefined}
                    />
                  </FieldShell>
                </div>

                {/* Preferred contact method — chip-style radio */}
                <div className="mt-6">
                  <FieldShell
                    label="Preferred contact method"
                    helper="How would you like the OMEGA team to reach you?"
                  >
                    <ul
                      role="radiogroup"
                      aria-label="Preferred contact method"
                      className="flex flex-wrap items-center gap-2.5"
                    >
                      {contactMethods.map((m, i) => {
                        const selected = submission.preferredContact === m;
                        return (
                          <Fragment key={m}>
                            {i > 0 && " "}
                            <li>
                              <button
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() =>
                                  patch({
                                    preferredContact:
                                      m as ContactMethod,
                                  })
                                }
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500 ease-elegant ${
                                  selected
                                    ? "border-graphite/85 bg-graphite text-warmwhite shadow-[0_1px_0_rgba(30,30,30,0.05),0_14px_28px_-18px_rgba(30,30,30,0.32)]"
                                    : "border-line/80 bg-warmwhite/70 text-graphite/85 hover:-translate-y-px hover:border-graphite/40 hover:text-graphite"
                                }`}
                              >
                                {selected && (
                                  <span
                                    aria-hidden
                                    className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_6px_rgba(242,106,27,0.6)]"
                                  />
                                )}
                                {" "}
                                <span>{m}</span>
                              </button>
                            </li>
                          </Fragment>
                        );
                      })}
                    </ul>
                  </FieldShell>
                </div>

                {/* File / photo upload */}
                <div className="mt-6">
                  <FieldShell
                    label="Attachments (optional)"
                    helper="Photos or PDFs help us understand the situation faster."
                  >
                    <div className="rounded-[14px] border border-dashed border-line/90 bg-warmwhite/60 px-4 py-5 transition-all duration-500 ease-elegant hover:border-graphite/40">
                      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/80 bg-warmwhite/80 text-graphite/70"
                          >
                            <UploadGlyph />
                          </span>
                          {" "}
                          <div>
                            <div className="text-sm font-medium text-graphite">
                              Add photos or documents
                            </div>
                            <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                              PNG · JPG · PDF
                            </div>
                          </div>
                        </div>
                        {" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-graphite/15 bg-warmwhite/70 px-4 py-2.5 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40 sm:w-auto sm:py-2"
                        >
                          <span>Choose Files</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFiles(e.target.files)}
                          className="hidden"
                        />
                      </div>

                      {submission.uploadedAttachmentNames.length > 0 && (
                        <ul className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
                          {submission.uploadedAttachmentNames.map(
                            (name, i) => (
                              <Fragment key={`${name}-${i}`}>
                                {i > 0 && " "}
                                <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/80 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/80">
                                  <span
                                    aria-hidden
                                    className="inline-block h-1 w-1 rounded-full bg-omega"
                                  />
                                  {" "}
                                  <span className="normal-case tracking-[0.02em]">
                                    {name}
                                  </span>
                                </li>
                              </Fragment>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </FieldShell>
                </div>

                {/* Submit row */}
                <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-7">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                    OMEGA reviews every enquiry before responding
                  </p>
                  {" "}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <span>Submit Enquiry</span>
                    {" "}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            ) : (
              <LeadSuccessPanel
                lead={submittedLead}
                onAnother={handleRestart}
                sourceRoute="/contact"
              />
            )}
          </div>

          {/* ── Direct panel column ──────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-[140px]">
              <ContactDirectPanel />
            </div>
          </div>
        </div>
      </div>

      {/*
        Inline form-element styles. `.text-input` is the shared input
        chrome (border, focus ring, padding, type rendering) used by
        every text input + textarea + select on this page. The
        `--error` variant flips the border to OMEGA orange when a
        field has a visible validation error — matches
        `<ServiceRequestForm />` so error treatment is consistent
        across the site.
      */}
      <style jsx>{`
        :global(.text-input) {
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(216, 207, 194, 0.85);
          background: rgba(248, 246, 241, 0.85);
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #1e1e1e;
          transition: border-color 500ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        :global(.text-input::placeholder) {
          color: rgba(95, 90, 84, 0.65);
        }
        :global(.text-input:focus) {
          outline: none;
          border-color: rgba(30, 30, 30, 0.5);
          box-shadow: 0 0 0 2px rgba(242, 106, 27, 0.15);
        }
        :global(.text-input--error) {
          border-color: rgba(242, 106, 27, 0.7);
        }
        :global(.text-input--error:focus) {
          border-color: rgba(242, 106, 27, 0.85);
        }
        :global(textarea.text-input) {
          padding: 0.85rem 1rem;
          line-height: 1.65;
        }
      `}</style>
    </section>
  );
}

/* ── Reusable shells ─────────────────────────────────────────────── */

function FieldShell({
  label,
  helper,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  helper?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/70">
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full bg-omega"
        />
        {" "}
        {htmlFor ? (
          <label htmlFor={htmlFor}>{label}</label>
        ) : (
          <span>{label}</span>
        )}
        {required && (
          <>
            {" "}
            <span aria-hidden className="text-omega">·</span>
            {" "}
            <span className="text-omega">Required</span>
          </>
        )}
      </div>
      {helper && !error && (
        <p className="mt-1.5 text-[0.85rem] leading-[1.6] text-muted">
          {helper}
        </p>
      )}
      <div className="mt-3">{children}</div>
      {error && (
        <p
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[0.82rem] leading-[1.5] text-omega"
        >
          <span aria-hidden className="mt-0.5 inline-block">!</span>
          {" "}
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function UploadGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 1.5v8M3.5 5L7 1.5l3.5 3.5M2 12h10" />
    </svg>
  );
}
