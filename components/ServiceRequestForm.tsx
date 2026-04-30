"use client";

import Link from "next/link";
import {
  Fragment,
  useCallback,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  buildLead,
  buildWhatsAppLink,
  submitLead,
  validateLead,
  type Lead,
  type LeadActionType,
  type LeadContactMethod,
  type LeadErrors,
} from "@/lib/leads";

/**
 * Reusable OMEGA service-request form.
 *
 * One component, four shapes — driven by `actionType`:
 *
 *   - `service_request`  → Used inside `/service-hub/[slug]` action
 *                          centre + as a standalone request form
 *                          anywhere a `service` is supplied.
 *   - `diagnosis`        → Lightweight diagnosis-style intake.
 *   - `contact_team`     → Direct-team channel intake.
 *   - `general_enquiry`  → No service scope — message is required.
 *
 * Props:
 *   - `actionType`         — drives validation rules + submit label
 *   - `service`            — optional `{ name, code }`; pre-fills the
 *                            service the lead is about
 *   - `sourceRoute`        — pathname captured into the canonical Lead
 *   - `onSubmitted?(lead)` — optional callback after a successful submit
 *
 * Behaviour:
 *   - Inline validation (no browser-default alerts). Errors render
 *     under the field and turn the field border red.
 *   - On submit, builds a canonical `Lead` (see lib/leads.ts) and
 *     calls `submitLead`. Frontend-only today; logs to the console.
 *   - On success, swaps the form for `<LeadSuccessPanel />` with
 *     three standard CTAs (Start Diagnosis · Back to Service Hub ·
 *     Speak to Team) and a "Continue on WhatsApp" deep link.
 *
 * The form has NO outer card / heading chrome — callers wrap it in
 * the right card finish for their context (action centre tab,
 * standalone section, etc.). This keeps it portable.
 */

export type ServiceRequestFormProps = {
  actionType: LeadActionType;
  service?: {
    name: string;
    /** Stable slug, e.g. `home-services`. */
    code: string;
  };
  sourceRoute: string;
  /** Submit-button label override; defaults are sensible per action. */
  submitLabel?: string;
  onSubmitted?: (lead: Lead) => void;
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  propertyType: string;
  location: string;
  message: string;
  preferredContactMethod: LeadContactMethod | null;
  uploadedFileNames: string[];
};

const initialState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  propertyType: "",
  location: "",
  message: "",
  preferredContactMethod: null,
  uploadedFileNames: [],
};

const propertyTypes = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Office",
  "Retail",
  "Restaurant / F&B",
  "Other",
];

const contactMethods: LeadContactMethod[] = ["WhatsApp", "Call", "Email"];

const defaultSubmitLabels: Record<LeadActionType, string> = {
  service_request: "Submit Request",
  diagnosis: "Submit Diagnosis",
  contact_team: "Submit Enquiry",
  general_enquiry: "Submit Enquiry",
};

export function ServiceRequestForm({
  actionType,
  service,
  sourceRoute,
  submitLabel,
  onSubmitted,
}: ServiceRequestFormProps) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [state, setState] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Set<keyof FormState>>(new Set());
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Compute errors fresh on every render — no derived state, no stale
  // values. The touched-set decides whether to display them.
  const errors: LeadErrors = validateLead({
    actionType,
    fullName: state.fullName,
    phone: state.phone,
    email: state.email,
    message: state.message,
    serviceName: service?.name,
    preferredContactMethod: state.preferredContactMethod,
  });

  const showError = (field: keyof LeadErrors) =>
    (touched.has(field as keyof FormState) || touched.has("__submit" as never)) &&
    Boolean(errors[field]);

  const patch = useCallback((next: Partial<FormState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  const markTouched = useCallback((field: keyof FormState) => {
    setTouched((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    setState((prev) => ({
      ...prev,
      uploadedFileNames: [...prev.uploadedFileNames, ...names],
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Mark every field touched so all validation errors surface
      // even if the user never blurred them.
      setTouched(
        new Set<keyof FormState>([
          "fullName",
          "phone",
          "email",
          "propertyType",
          "location",
          "message",
          "preferredContactMethod",
          // sentinel — caught by `showError` above
          "__submit" as never,
        ])
      );

      if (Object.keys(errors).length > 0) return;

      setSubmitting(true);
      const lead = buildLead({
        route: sourceRoute,
        actionType,
        serviceName: service?.name ?? null,
        serviceCode: service?.code ?? null,
        fullName: state.fullName.trim(),
        phone: state.phone.trim(),
        email: state.email.trim(),
        propertyType: state.propertyType || null,
        location: state.location.trim(),
        message: state.message.trim(),
        preferredContactMethod: state.preferredContactMethod,
        uploadedFiles: state.uploadedFileNames,
      });
      const { ok } = await submitLead(lead);
      setSubmitting(false);
      if (ok) {
        setSubmittedLead(lead);
        onSubmitted?.(lead);
      }
    },
    [actionType, errors, onSubmitted, service, sourceRoute, state]
  );

  const handleReset = useCallback(() => {
    setState(initialState);
    setTouched(new Set());
    setSubmittedLead(null);
  }, []);

  if (submittedLead) {
    return (
      <LeadSuccessPanel
        lead={submittedLead}
        onAnother={handleReset}
        sourceRoute={sourceRoute}
      />
    );
  }

  const inputClass = (field: keyof LeadErrors) =>
    `w-full rounded-[12px] border px-4 py-3 text-[0.92rem] leading-[1.5] text-graphite bg-warmwhite placeholder:text-muted/65 transition-colors duration-500 ease-elegant focus:outline-none focus:ring-2 focus:ring-omega/15 ${
      showError(field)
        ? "border-omega/70 focus:border-omega/85"
        : "border-line/85 focus:border-graphite/45"
    }`;

  const textareaClass = (field: keyof LeadErrors) =>
    `${inputClass(field)} resize-y min-h-[112px]`;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      aria-label="OMEGA service request form"
    >
      {/* Identity row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <FieldShell
          label="Full name"
          htmlFor={`${id}-name`}
          required
          error={showError("fullName") ? errors.fullName : undefined}
        >
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            value={state.fullName}
            onChange={(e) => patch({ fullName: e.target.value })}
            onBlur={() => markTouched("fullName")}
            placeholder="Your full name"
            className={inputClass("fullName")}
            aria-invalid={showError("fullName") || undefined}
          />
        </FieldShell>

        <FieldShell
          label="Phone / WhatsApp"
          htmlFor={`${id}-phone`}
          helper="Phone or email is required."
          error={showError("phone") ? errors.phone : undefined}
        >
          <input
            id={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            value={state.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            onBlur={() => markTouched("phone")}
            placeholder="+971 ..."
            className={inputClass("phone")}
            aria-invalid={showError("phone") || undefined}
          />
        </FieldShell>

        <FieldShell
          label="Email"
          htmlFor={`${id}-email`}
          error={showError("email") ? errors.email : undefined}
        >
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            value={state.email}
            onChange={(e) => patch({ email: e.target.value })}
            onBlur={() => markTouched("email")}
            placeholder="you@email.com"
            className={inputClass("email")}
            aria-invalid={showError("email") || undefined}
          />
        </FieldShell>

        <FieldShell label="Property type" htmlFor={`${id}-property-type`}>
          <select
            id={`${id}-property-type`}
            value={state.propertyType}
            onChange={(e) => patch({ propertyType: e.target.value })}
            onBlur={() => markTouched("propertyType")}
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
      <FieldShell
        label="Location / area"
        htmlFor={`${id}-location`}
        helper="Emirate, community, or building."
      >
        <input
          id={`${id}-location`}
          type="text"
          autoComplete="address-level2"
          value={state.location}
          onChange={(e) => patch({ location: e.target.value })}
          placeholder="e.g. Dubai Marina"
          className={inputClass("phone")}
        />
      </FieldShell>

      {/* Message */}
      <FieldShell
        label="Brief description"
        htmlFor={`${id}-message`}
        helper={
          actionType === "general_enquiry"
            ? "Tell us what you need."
            : "Anything we should know about the request."
        }
        required={actionType === "general_enquiry"}
        error={showError("message") ? errors.message : undefined}
      >
        <textarea
          id={`${id}-message`}
          value={state.message}
          onChange={(e) => patch({ message: e.target.value })}
          onBlur={() => markTouched("message")}
          placeholder={
            service
              ? `Tell us briefly what you need from ${service.name}.`
              : "Tell us briefly what you need."
          }
          className={textareaClass("message")}
          rows={4}
          aria-invalid={showError("message") || undefined}
        />
      </FieldShell>

      {/* Preferred contact method — chip-style radio */}
      <FieldShell label="Preferred contact method">
        <ul
          role="radiogroup"
          aria-label="Preferred contact method"
          className="flex flex-wrap items-center gap-2.5"
        >
          {contactMethods.map((m, i) => {
            const selected = state.preferredContactMethod === m;
            return (
              <Fragment key={m}>
                {i > 0 && " "}
                <li>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => patch({ preferredContactMethod: m })}
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

      {/* File upload — optional */}
      <FieldShell
        label="Attachments (optional)"
        helper="Photos help us understand the issue faster."
      >
        <div className="rounded-[12px] border border-dashed border-line/90 bg-warmwhite/60 px-4 py-5 transition-colors duration-500 ease-elegant hover:border-graphite/40">
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

          {state.uploadedFileNames.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
              {state.uploadedFileNames.map((name, i) => (
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
              ))}
            </ul>
          )}
        </div>
      </FieldShell>

      {/* Submit row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line/60">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
          {service
            ? `Action · ${actionTypeLabel(actionType)} · ${service.code}`
            : `Action · ${actionTypeLabel(actionType)}`}
        </p>
        {" "}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90 disabled:pointer-events-none disabled:opacity-50"
        >
          <span>{submitLabel ?? defaultSubmitLabels[actionType]}</span>
          {" "}
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}

function actionTypeLabel(t: LeadActionType): string {
  switch (t) {
    case "service_request":
      return "SERVICE_REQUEST";
    case "diagnosis":
      return "DIAGNOSIS";
    case "contact_team":
      return "CONTACT_TEAM";
    case "general_enquiry":
      return "GENERAL_ENQUIRY";
  }
}

/* ── Reusable success panel ──────────────────────────────────────── */

/**
 * Standardised success card used across `/contact`, `/diagnosis`
 * result, and the service-detail action centre.
 *
 * Three CTAs always (Start Diagnosis · Back to Service Hub · Speak
 * to Team) so the user always has a forward path. When the user
 * picked WhatsApp as their preferred channel, a fourth "Continue on
 * WhatsApp" button surfaces with a deep-linked pre-fill.
 */
export function LeadSuccessPanel({
  lead,
  onAnother,
  sourceRoute,
}: {
  lead: Lead;
  /** Optional reset handler — only shown when callers pass it. */
  onAnother?: () => void;
  sourceRoute: string;
}) {
  const whatsappLink =
    lead.preferredContactMethod === "WhatsApp"
      ? buildWhatsAppLink(lead)
      : null;

  return (
    <article className="rounded-[20px] border border-omega/30 bg-warmwhite/90 p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)]">
      <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-omega">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.65)]"
        />
        {" "}
        <span>Request Received</span>
      </div>

      <h3 className="mt-4 text-[1.6rem] md:text-[2rem] leading-[1.1] tracking-tightest font-semibold text-graphite">
        OMEGA team will review and contact you.
      </h3>

      <p className="mt-3 max-w-xl text-base leading-[1.7] text-muted">
        Thanks{lead.fullName ? `, ${lead.fullName}` : ""}. We've
        received your request and will reach out
        {lead.preferredContactMethod
          ? ` via ${lead.preferredContactMethod}`
          : ""}
        . For active leaks, electrical hazards, fire/life safety
        risks, or urgent property risk, contact OMEGA directly.
      </p>

      {/* Recap chips — selected service + preferred channel */}
      {(lead.serviceName || lead.preferredContactMethod) && (
        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {lead.serviceName && (
            <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/85 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/85">
              <span
                aria-hidden
                className="inline-block h-1 w-1 rounded-full bg-omega"
              />
              {" "}
              <span className="normal-case tracking-[0.02em]">
                Service · {lead.serviceName}
              </span>
            </li>
          )}
          {lead.serviceName && lead.preferredContactMethod && " "}
          {lead.preferredContactMethod && (
            <li className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-warmwhite/85 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-graphite/85">
              <span
                aria-hidden
                className="inline-block h-1 w-1 rounded-full bg-omega"
              />
              {" "}
              <span className="normal-case tracking-[0.02em]">
                Contact · {lead.preferredContactMethod}
              </span>
            </li>
          )}
        </ul>
      )}

      {/* Three standard CTAs — always present so users have a path. */}
      <div className="mt-7 flex flex-wrap items-stretch gap-3 md:gap-4">
        {whatsappLink && (
          <>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              data-action="CONTINUE_WHATSAPP"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite px-7 py-3 text-sm font-medium text-warmwhite transition-all duration-500 ease-elegant hover:-translate-y-px hover:bg-graphite/90"
            >
              <span>Continue on WhatsApp</span>
              {" "}
              <Arrow />
            </a>
            {" "}
          </>
        )}

        {/* Conditionally hide whichever CTA matches the page the user
            is already on, so we never tell them to navigate to where
            they already are. */}
        {sourceRoute !== "/diagnosis" && (
          <>
            <Link
              href="/diagnosis"
              data-action="START_DIAGNOSIS"
              className={`inline-flex items-center justify-center gap-2 rounded-full ${whatsappLink ? "border border-graphite/15 bg-transparent text-graphite" : "bg-graphite text-warmwhite"} px-7 py-3 text-sm font-medium transition-all duration-500 ease-elegant hover:-translate-y-px ${whatsappLink ? "hover:border-graphite/40" : "hover:bg-graphite/90"}`}
            >
              <span>Start Diagnosis</span>
              {!whatsappLink && (
                <>
                  {" "}
                  <Arrow />
                </>
              )}
            </Link>
            {" "}
          </>
        )}

        {!sourceRoute.startsWith("/service-hub") && (
          <>
            <Link
              href="/service-hub"
              data-action="OPEN_SERVICE_HUB"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
            >
              <span>Back to Service Hub</span>
            </Link>
            {" "}
          </>
        )}

        {sourceRoute !== "/contact" && (
          <Link
            href="/contact"
            data-action="CONTACT_TEAM"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-graphite/15 bg-transparent px-7 py-3 text-sm font-medium text-graphite transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/40"
          >
            <span>Speak to Team</span>
          </Link>
        )}
      </div>

      {onAnother && (
        <button
          type="button"
          onClick={onAnother}
          className="mt-6 inline-flex items-center gap-2 text-[0.85rem] font-medium text-graphite/70 transition-colors duration-500 ease-elegant hover:text-omega"
        >
          <span aria-hidden>↻</span>
          {" "}
          <span>Submit another</span>
        </button>
      )}
    </article>
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
