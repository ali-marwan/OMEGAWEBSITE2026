import type { JsonLdObject } from "@/lib/seo";

/**
 * Renders a JSON-LD structured-data block as a `<script>` tag in
 * the document head/body. The `<JsonLd>` component is the only
 * component-shaped export from the SEO layer — everything else in
 * `lib/seo.ts` is pure TypeScript (helpers + builders).
 *
 * Why this lives in `components/` instead of `lib/`:
 *   - `lib/seo.ts` stays as a `.ts` file (no JSX), which keeps it
 *     importable from any module type (server, edge, future
 *     mobile-app shared package) without the `.tsx` extension
 *     pulling React typings into non-component callers.
 *   - The component itself is server-only (no client interaction),
 *     so it doesn't carry "use client" — Next.js inlines it at SSR.
 *
 * Returns `null` for empty inputs so callers can compose
 * conditionally without ifs.
 */
export function JsonLd({
  data,
}: {
  data: JsonLdObject | null | undefined;
}) {
  if (!data) return null;
  // `dangerouslySetInnerHTML` is the canonical way to inject JSON-LD
  // in React — the alternative (`JSON.stringify` as a child) escapes
  // the angle brackets that crawlers expect.
  //
  // We pass the JSON through `JSON.stringify(...)` and replace any
  // `<` with the unicode-escaped equivalent so the closing
  // `</script>` token can never appear in the payload. This is the
  // standard XSS-safe encoding for inline JSON-LD.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
