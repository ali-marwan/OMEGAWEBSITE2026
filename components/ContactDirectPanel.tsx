import {
  TODO_EMAIL,
  TODO_PHONE,
  TODO_WHATSAPP_LINK,
  UAE_COVERAGE,
  URGENT_RESPONSE_NOTE,
  emailHref,
  phoneHref,
  whatsappHref,
} from "@/lib/contact";
import { Fragment } from "react";

/**
 * `/contact` — Direct contact panel (right-side column on desktop,
 * stacked below the form on mobile).
 *
 * Renders the four direct-contact channels (WhatsApp · Email · Phone)
 * plus the UAE coverage strip and the urgent-issue response note.
 *
 * Placeholder discipline: every contact value reads from the
 * `TODO_*` constants in `lib/contact.ts`. Nothing here invents a
 * real phone number, email, or WhatsApp link — the operations team
 * substitutes the constants in one place when production values are
 * configured. Until then, the rendered hrefs (`tel:TODO_PHONE`,
 * `mailto:TODO_EMAIL`, `TODO_WHATSAPP_LINK`) are intentionally
 * non-functional and visually surface the placeholder text.
 */
export function ContactDirectPanel() {
  const channels = [
    {
      code: "WHATSAPP" as const,
      label: "WhatsApp",
      value: TODO_WHATSAPP_LINK,
      href: whatsappHref(),
      icon: WhatsAppIcon,
      external: true,
    },
    {
      code: "EMAIL" as const,
      label: "Email",
      value: TODO_EMAIL,
      href: emailHref(),
      icon: EmailIcon,
      external: false,
    },
    {
      code: "PHONE" as const,
      label: "Phone",
      value: TODO_PHONE,
      href: phoneHref(),
      icon: PhoneIcon,
      external: false,
    },
  ];

  return (
    <aside
      aria-label="Direct contact"
      className="rounded-[24px] border border-line/80 bg-warmwhite/80 p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(30,30,30,0.02),0_18px_44px_-26px_rgba(30,30,30,0.18)]"
    >
      {/* Eyebrow row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-technical text-graphite/80">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-omega shadow-[0_0_8px_rgba(242,106,27,0.55)]"
          />
          {" "}
          <span>Direct Contact</span>
        </div>
        {" "}
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          UAE
        </span>
      </div>

      <p className="mt-5 max-w-md text-[0.95rem] leading-[1.65] text-muted">
        Skip the form when you'd rather talk directly. The OMEGA team
        responds on any of the channels below.
      </p>

      {/* Channels list */}
      <ul className="mt-6 space-y-3">
        {channels.map((c, i) => (
          <Fragment key={c.code}>
            {i > 0 && " "}
            <li>
              <a
                href={c.href}
                data-action={`CONTACT_${c.code}`}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="group/channel flex items-center gap-4 rounded-[14px] border border-line/70 bg-warmwhite/85 p-4 transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/30"
              >
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line/80 bg-warmwhite/90 text-graphite/70 transition-colors duration-500 ease-elegant group-hover/channel:text-graphite"
                >
                  <c.icon />
                </span>
                {" "}
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                    {c.label}
                  </div>
                  <div className="mt-0.5 truncate text-[0.95rem] font-medium text-graphite/90 transition-colors duration-500 ease-elegant group-hover/channel:text-graphite">
                    {c.value}
                  </div>
                </div>
                {" "}
                <span
                  aria-hidden
                  className="flex-shrink-0 text-graphite/40 transition-colors duration-500 ease-elegant group-hover/channel:text-graphite/80"
                >
                  <Arrow />
                </span>
              </a>
            </li>
          </Fragment>
        ))}
      </ul>

      {/* UAE coverage strip */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-line/70 bg-warmwhite/70 px-4 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-graphite/80">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-omega"
        />
        {" "}
        <span>Coverage</span>
        {" "}
        <span aria-hidden className="h-3 w-px bg-line" />
        {" "}
        <span className="normal-case tracking-[0.02em]">{UAE_COVERAGE}</span>
      </div>

      {/* Urgent-issue response note */}
      <div className="mt-5 flex items-start gap-3 rounded-[14px] border border-omega/30 bg-warmwhite/90 p-4">
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-omega/10 text-omega"
        >
          <AlertGlyph />
        </span>
        {" "}
        <p className="text-[0.88rem] leading-[1.6] text-graphite/90">
          {URGENT_RESPONSE_NOTE}
        </p>
      </div>

      {/* Operational note — frontend-only placeholder reminder */}
      <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
        Placeholders pending operational sign-off
      </p>
    </aside>
  );
}

/* ── Glyphs ──────────────────────────────────────────────────────── */

function WhatsAppIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12l1-3a5 5 0 1 1 2 2L2 12Z" />
      <path d="M5.5 6.5c0 1.5 1.5 3 3 3" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="3.5" width="10" height="7" rx="1" />
      <path d="m2.5 4.5 4.5 3.5 4.5-3.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 2.5h2l1 2.5L4.5 6a6 6 0 0 0 3.5 3.5L9 8l2.5 1V11.5a1 1 0 0 1-1 1A8 8 0 0 1 2.5 4a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function AlertGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 2.5 12.5 12h-11L7 2.5Z" />
      <path d="M7 6.5v2.2M7 10.6v.05" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
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
