import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingDock } from "@/components/FloatingDock";
import { ArticleHero } from "@/components/ArticleHero";
import { ArticleBody, HAS_FULL_BODY } from "@/components/ArticleBody";
import { ArticleRelatedInsights } from "@/components/ArticleRelatedInsights";
import { ArticleFinalCTA } from "@/components/ArticleFinalCTA";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/insights";
import { articleJsonLd, buildPageMetadata } from "@/lib/seo";

/**
 * Pre-render every known article slug at build time. Adding a new
 * article to `lib/insights.ts` automatically extends this route's
 * static params on the next build — no code edits needed here.
 */
export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

/**
 * Per-article metadata reads `seoTitle` / `seoDescription` directly
 * from the article entry — editors override per-article meta in one
 * place. `ogType` is "article" (richer rich-result signal than the
 * default "website").
 */
export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return buildPageMetadata({
      title: "Insight Not Found | OMEGA Insights",
      description: "The OMEGA Insights article you requested could not be located.",
      path: `/insights/${slug}`,
      noindex: true,
    });
  }
  return buildPageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/insights/${article.slug}`,
    ogType: "article",
  });
}

/**
 * `/insights/[slug]` — reusable article detail page.
 *
 * Composition (top → bottom):
 *
 *   <Navigation>                  shared header
 *   <JsonLd data={articleJsonLd(article)} />
 *                                 Per-article schema.org Article
 *                                 structured data — surfaces
 *                                 headline / dates / author / URL
 *                                 even before the body is full.
 *   <ArticleHero>                 1. Hero — breadcrumb, category,
 *                                    title, excerpt, byline, tags
 *   <ArticleBody>                 2. Article body — five structured
 *                                    placeholder sections (Overview,
 *                                    Key points, What this means,
 *                                    When to involve OMEGA, Related
 *                                    service path) + sticky meta rail
 *                                    on lg+
 *   <ArticleFinalCTA>             3 + 5. Related-service CTA +
 *                                    standard three-route closing
 *   <ArticleRelatedInsights>      4. 2–3 curated related articles
 *   <Footer>                      shared footer
 *   <FloatingDock>                shared floating action rail
 *
 * Server component. No heavy client interactivity inside the
 * article — only the global Navigation / FloatingDock client
 * boundaries hydrate.
 *
 * Unknown slug renders the app's `_not-found` route via Next.js's
 * `notFound()` — clean 404 with the standard chrome.
 */
export default async function ArticleDetailPage({ params }: Params) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.slug, 3);

  // Articles with a fully-written body render their own inline CTA
  // panel (e.g. "Start with structured property care."). For those,
  // the generic page-level <ArticleFinalCTA /> is suppressed so the
  // reader sees one CTA, not two. Articles still on the placeholder
  // body keep the page-level CTA as their primary call-to-act.
  const hasFullBody = HAS_FULL_BODY.has(article.slug);

  return (
    <main className="relative">
      <JsonLd data={articleJsonLd(article)} />
      <Navigation />
      <ArticleHero article={article} />
      <ArticleBody article={article} />
      {!hasFullBody && <ArticleFinalCTA article={article} />}
      <ArticleRelatedInsights articles={related} />
      <Footer />
      <FloatingDock />
    </main>
  );
}
