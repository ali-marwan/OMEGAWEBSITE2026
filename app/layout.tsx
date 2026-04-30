import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { MotionProvider } from "@/components/MotionProvider";
import { SITE_URL } from "@/lib/omegaConfig";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_KEYWORDS,
  SITE_NAME,
  organizationJsonLd,
} from "@/lib/seo";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Global metadata defaults. Per-page metadata exports / generators
 * inherit these and override what they need (title, description,
 * canonical, og:image). The `title.template` lets pages set a short
 * title that automatically gets the brand suffix.
 *
 *   page sets:  "OMEGA Service Hub | Property Services in the UAE"
 *   browser:    same string verbatim — Next.js skips the template
 *               when the page provides a final string.
 *
 * `metadataBase` makes relative `og:image` paths resolve correctly
 * during SSR (Next.js otherwise emits warnings for relative URLs in
 * social tags).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph + Twitter defaults — pages override per-route via
  // `buildPageMetadata()`. Keeping defaults here means a route that
  // forgets to call the helper still gets sensible share metadata.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AE",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body className="font-sans antialiased">
        {/* Organization-level JSON-LD — present on every page so
            search engines can build a brand knowledge panel + rich
            results. Per-service Service schema is added inside
            `/service-hub/[slug]/page.tsx`, not here. */}
        <JsonLd data={organizationJsonLd()} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
