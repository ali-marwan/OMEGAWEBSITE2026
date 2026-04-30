import {
  TODO_EMAIL,
  TODO_PHONE,
  TODO_WHATSAPP_LINK,
  UAE_COVERAGE,
  URGENT_RESPONSE_NOTE,
  emailHref,
  isContactConfigured,
  phoneHref,
  whatsappHref,
} from "@/lib/contact";
import { Fragment } from "react";

/**
 * `/contact` — Direct contact panel (right-side column on desktop,
 * stacked below the form on mobile).
 *
 * Renders three direct-contact channels (WhatsApp · Email · Phone)
 * plus the UAE coverage strip and the urgent-issue response note.
 *
 * Configuration discipline:
 *   - Every contact value reads from env vars via `lib/omegaConfig.ts`
 *     with `TODO_*` placeholder fallbacks.
 *   - When a channel is configured (env var set to a real value), the
 *     row renders as a clickable link with the real value visible.
 *   - When unconfigured (env var still the placeholder), the row
 *     renders as a quiet, non-interactive label that says
 *     "To be added before launch" / "To be configured before
 *     launch" — never the literal "TODO_PHONE" string. Visitors
 *     never see scaffolding text; the operations team still sees
 *     which channels are pending in the launch-readiness footer.
 *
 * Replacing values for launch:
 *   1. Set `NEXT_PUBLIC_CONTACT_PHONE` in Vercel env settings
 *   2. Set `NEXT_PUBLIC_CONTACT_EMAIL`
 *   3. Set `NEXT_PUBLIC_WHATSAPP_LINK` (and / or `NEXT_PUBLIC_WHATSAPP_NUMBER`)
 *   4. Redeploy. Each channel that has a real value flips to live;
 *      remaining placeholders stay as "To be added before launch"
 *      until their env var is set.
 */
type Channel = {
  code: "WHATSAPP" | "EMAIL" | "PHONE";
  label: string;
  /** The raw value (env var content or `TODO_*` fallback). */
  rawValue: string;
  /** Friendly fallback shown when `rawValue` is still a placeholder. */
  fallbackLabel: string;
  /** Computed href when configured. */
  href: string;
  external: boolean;
  Icon: () => React.ReactElement;
};

const channels: Channel[] = [
  {
    code: "WHATSAPP",
    label: "WhatsApp",
    rawValue: TODO_WHATSAPP_LINK,
    fallbackLabel: "To be configured before launch",
    href: whatsappHref(),
    external: true,
    Icon: WhatsAppIcon,
  },
  {
    code: "EMAIL",
    label: "Email",
    rawValue: TODO_EMAIL,
    fallbackLabel: "To be added before launch",
    href: emailHref(),
    external: false,
    Icon: EmailIcon,
  },
  {
    code: "PHONE",
    label: "Phone",
    rawValue: TODO_PHONE,
    fallbackLabel: "To be added before launch",
    href: phoneHref(),
    external: false,
    Icon: PhoneIcon,
  },
];

export function ContactDirectPanel() {
  // How many channels are pending real values? Surfaced in the
  // panel footnote so launch readiness is visible at a glance.
  const pendingCount = channels.filter(
    (c) => !isContactConfigured(c.rawValue)
  ).length;

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

      {/* Channels list — one row per channel. Configured channels are
          rendered as clickable <a>; unconfigured channels render as
          a quiet labelled <div>. */}
      <ul className="mt-6 space-y-3">
        {channels.map((c, i) => (
          <Fragment key={c.code}>
            {i > 0 && " "}
            <li>
              <ChannelRow channel={c} />
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

      {/* Operational footnote — surfaces only when at least one
          channel is still pending. Once all three env vars are set,
          this footnote disappears. */}
      {pendingCount > 0 && (
        <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
          {pendingCount} of {channels.length} channels pending
          operational sign-off
        </p>
      )}
    </aside>
  );
}

/**
 * One channel row — adapts its rendering based on whether the
 * channel is configured. Configured rows are clickable <a> elements
 * with the real value visible. Unconfigured rows are quiet,
 * non-interactive labels with reduced opacity.
 */
function ChannelRow({ channel }: { channel: Channel }) {
  const configured = isContactConfigured(channel.rawValue);
  const value = configured ? channel.rawValue : channel.fallbackLabel;
  const Icon = channel.Icon;

  if (configured) {
    return (
      <a
        href={channel.href}
        data-action={`CONTACT_${channel.code}`}
        target={channel.external ? "_blank" : undefined}
        rel={channel.external ? "noopener noreferrer" : undefined}
        className="group/channel flex items-center gap-4 rounded-[14px] border border-line/70 bg-warmwhite/85 p-4 transition-all duration-500 ease-elegant hover:-translate-y-px hover:border-graphite/30"
      >
        <span
          aria-hidden
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line/80 bg-warmwhite/90 text-graphite/70 transition-colors duration-500 ease-elegant group-hover/channel:text-graphite"
        >
          <Icon />
        </span>
        {" "}
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
            {channel.label}
          </div>
          <div className="mt-0.5 truncate text-[0.95rem] font-medium text-graphite/90 transition-colors duration-500 ease-elegant group-hover/channel:text-graphite">
            {value}
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
    );
  }

  // Unconfigured row — non-interactive. Reduced opacity so the
  // pending state is visible without being alarming. No `<a>` tag,
  // no hover lift, no arrow icon. Carries `aria-disabled="true"`
  // for screen readers.
  return (
    <div
      role="presentation"
      aria-disabled="true"
      data-action={`CONTACT_${channel.code}_PENDING`}
      className="flex items-center gap-4 rounded-[14px] border border-dashed border-line/70 bg-warmwhite/60 p-4 opacity-75"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line/80 bg-warmwhite/90 text-graphite/55"
      >
        <Icon />
      </span>
      {" "}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          {channel.label}
        </div>
        <div className="mt-0.5 text-[0.92rem] italic text-graphite/55">
          {value}
        </div>
      </div>
    </div>
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
