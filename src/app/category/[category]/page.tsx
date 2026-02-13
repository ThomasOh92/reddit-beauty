import Link from "next/link";
import { notFound } from 'next/navigation';
import CategoryPageWrapper from "@/components/categorypagewrapper";
import DiscussionsBox from "@/components/discussionsbox";
import { Product, SegmentBlock, RecommendationWithLinks } from "../../../types";
import { getAllCategories } from '../../../../lib/getAllCategories';
import { getCategoryData } from "../../../../lib/getCategoryData";
import { APP_URL } from '@/constants';
import { cache, Fragment } from "react";
import { PdfGuideOverlay } from '@/components/pdf-guide-overlay';

export const dynamicParams = true;
export const revalidate = 7200; // optional, for ISR support

type CategoryPageProps = Promise<{
  category: string;
}>;

const getCachedCategoryData = cache((category: string) => getCategoryData(category));

export async function generateMetadata({
  params,
}: {
  params: CategoryPageProps;
}) {
  const { category } = await params;
  const categoryWithSpaces = category.replace(/-/g, " ");
  const categoryCapitalized = categoryWithSpaces
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  // Pull categoryData so we can enrich meta
  const data = await getCachedCategoryData(category);
  const categoryData = (data?.categoryData ?? {}) as { editorial_summary?: string };
  const discussionCount = Array.isArray(data?.discussions) ? data.discussions.length : 0;
  const rankedCount = Math.min(Array.isArray(data?.products) ? data.products.length : 0, 10);
  const seoTitle = discussionCount > 0
    ? `${rankedCount || 10} Best ${categoryCapitalized} (Ranked by ${discussionCount}+ Reddit Discussions)`
    : `Best ${categoryCapitalized} ranked by Reddit`;

  // safe, short description preferring editorial_summary
  const baseDesc = `Discover the top ${categoryWithSpaces} ranked from Reddit discussions. Updated ${month} ${year}.`;
  const editorial = (categoryData.editorial_summary || "").replace(/\s+/g, " ").trim();
  const description = (editorial && editorial.length > 80)
    ? (editorial.length > 155 ? editorial.slice(0, 152) + "…" : editorial)
    : baseDesc;


  return {
    title: seoTitle,
    description: description,
    alternates: {
      canonical: `${APP_URL}/category/${category}`,
    },
    keywords: [categoryWithSpaces, "Reddit rankings", `best ${categoryWithSpaces}`],
    openGraph: {
      title: `Best ${categoryCapitalized} ranked by Reddit`,
      description: description,
      url: `${APP_URL}/category/${category}`,
      type: "website",
      images: [
        {
          url: "https://www.thoroughbeauty.com/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: description,
        }
      ]
    }
  };
}

export async function generateStaticParams() {

  try {
    const data = await getAllCategories();

    const categories = data
      .filter(
        (category: { slug: string; readyForDisplay?: boolean }) =>
          category.slug && category.readyForDisplay
      )
      .map((category: { slug: string }) => ({
        category: category.slug,
      }));

    return categories;
  } catch (err) {
    console.error("Error generating static params for category:", err);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: CategoryPageProps;
}) {
  const { category } = await params;

  const categoryCapitalized = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  try {

    const data = await getCachedCategoryData(category);

    if (
      !data ||
      !Array.isArray(data.products) ||
      data.products.length === 0
    ) {
      return notFound();
    }

    const discussion_data = data.discussions;
    const products = data.products;
    const discussionCount = Array.isArray(discussion_data) ? discussion_data.length : 0;
    const rankedCount = Math.min(products.length, 10);
    const headingPrimary = discussionCount > 0
      ? `${rankedCount} Best ${categoryCapitalized}`
      : `Best ${categoryCapitalized} ranked by Reddit`;
    const headingSecondary = discussionCount > 0
      ? `(Ranked by ${discussionCount}+ Reddit Discussions)`
      : null;
    const categoryData = data.categoryData || {} as {
      editorial_summary?: string;
      editorial_summary_with_links?: SegmentBlock[];
      recommendations_with_links?: RecommendationWithLinks[];
      application_tips?: string[];
      faq?: Array<{
        question?: string;
        q?: string;
        Q?: string;
        answer?: string;
        a?: string;
        A?: string;
      }>;
      recommendations?: string[];
      related_categories?: string[];
      related_posts?: Array<{
        title?: string;
        slug?: string;
      }>;
    };

    const editorialSummarySegments = categoryData.editorial_summary_with_links ?? [];
    const recommendationsWithLinkSegments = (categoryData.recommendations_with_links ?? [])
      .map((rec) => ({ ...rec, segments: rec.segments ?? [] }))
      .filter((rec) => Array.isArray(rec.segments) && rec.segments.length > 0);

    const renderSegmentBlocks = (segments: SegmentBlock[]) =>
      segments.map((segment, index) => {
        if (segment.type === "link" && segment.slug) {
          const href = `/category/${category}/${segment.slug}`;
          return (
            <Link
              key={`segment-${index}-${segment.slug}`}
              href={href}
              className="underline text-pink-600 hover:text-pink-700"
            >
              {segment.content}
            </Link>
          );
        }

        return <Fragment key={`segment-${index}`}>{segment.content}</Fragment>;
      });

    function buildCategoryJsonLd({
      appUrl, category, categoryName, products, categoryData,
    }: {
      appUrl: string;
      category: string;
      categoryName: string;
      products: Product[];
      categoryData: {
        editorial_summary?: string;
        application_tips?: string[];
        faq?: Array<{ question?: string; q?: string; Q?: string; answer?: string; a?: string; A?: string }>;
        recommendations?: string[];
      };
    }) {
      const pageUrl = `${appUrl}/category/${category}`;
      const byId = (suffix: string) => `${pageUrl}#${suffix}`;

      // Index products for rec matching
      const slugByName = new Map(products.map(p => [p.product_name.toLowerCase(), p.slug]));
      const tips = (categoryData.application_tips ?? []).filter(Boolean);

      const recs = (categoryData.recommendations ?? []).filter(Boolean);

      // --- CollectionPage
      const hasPartIds: string[] = [];
      if (products.length) hasPartIds.push(byId("rankings"));
      if (recs.length) hasPartIds.push(byId("picks"));
      if ((categoryData.faq ?? []).length) hasPartIds.push(byId("faq"));
      if (tips.length) hasPartIds.push(byId("tips")); // or "howto" if you switch

      const collectionPage = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": byId("webpage"),
        url: pageUrl,
        name: `${categoryName} – Reddit Rankings`,
        description: categoryData.editorial_summary || `Top ${categoryName} ranked from Reddit.`,
        abstract: categoryData.editorial_summary || undefined,
        inLanguage: "en",
        dateModified: new Date().toISOString(),
        about: { "@type": "Thing", name: categoryName },
        mainEntity: { "@id": byId("rankings") },
        hasPart: hasPartIds.map(id => ({ "@id": id })),
      };

      // --- Rankings (ItemList of Products)
      const topN = products.slice(0, 10);
      const rankings = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": byId("rankings"),
        itemListOrder: "ItemListOrderDescending",
        numberOfItems: products.length,
        isPartOf: { "@id": byId("webpage") },
        itemListElement: topN.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.product_name,
            url: `${pageUrl}/${p.slug}`,
            image: p.image_url,
            review: {
              name: p.product_name + " Editorial Review",
              author: {
                "@type": "Organization",
                name: "Thorough Beauty Editorial Team",
              },
              reviewBody: p.editorial_summary
            }
          },
        })),
      };

      // --- Recommendations (ItemList)
      const recommendations = recs.length ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": byId("picks"),
        name: `${categoryName} – Top Picks`,
        isPartOf: { "@id": byId("webpage") },
        itemListOrder: "ItemListOrderDescending",
        itemListElement: recs.map((r, i) => {
          const lower = r.toLowerCase();
          const matchedName = [...slugByName.keys()].find(n => lower.includes(n));
          // Always use Thing to avoid Product rich result requirements (offers/review/aggregateRating)
          const item = {
            "@type": "Thing",
            name: r,
            ...(matchedName ? { url: `${pageUrl}/${slugByName.get(matchedName)!}` } : {}),
          };
          return { "@type": "ListItem", position: i + 1, item };
        }),
      } : null;

      // --- FAQ (FAQPage)
      const faqPairs = (categoryData.faq ?? [])
        .map(f => ({
          q: (f.question || f.q || f.Q || "").toString().trim(),
          a: (f.answer || f.a || f.A || "").toString().trim(),
        }))
        .filter(({ q, a }) => q && a);

      const faq = faqPairs.length ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": byId("faq"),
        mainEntity: faqPairs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
        isPartOf: { "@id": byId("webpage") },
      } : null;

      // --- Application Tips
      const tipsList = tips.length ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": byId("tips"),
        name: `${categoryName} Application Tips`,
        isPartOf: { "@id": byId("webpage") },
        itemListElement: tips.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Thing", name: t },
        })),
      } : null;

      // --- Breadcrumb (use function arg)
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
          { "@type": "ListItem", position: 2, name: "Categories", item: `${appUrl}/category` },
          { "@type": "ListItem", position: 3, name: categoryName, item: pageUrl },
        ],
      };

      return [collectionPage, rankings, recommendations, faq, tipsList, breadcrumb]
        .filter(Boolean);
    }


    const jsonLd = buildCategoryJsonLd({
      appUrl: APP_URL,
      category,
      categoryName: categoryCapitalized,
      products,
      categoryData,
    });


    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className='mb-4 mt-2 mx-8 md:mx-0 flex justify-center items-center'>
          <PdfGuideOverlay backgroundSize='80%'/>
        </div>

        <h1 className="text-l font-bold mb-2 mt-4 w-full bg-clip-text text-center">
          <span className="text-2xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
            {headingPrimary}
            {headingSecondary ? (
              <>
                <br />
                <span className="text-lg">{headingSecondary}</span>
              </>
            ) : null}
          </span>
        </h1>

        <div className="mb-4 border border-base-300 rounded-xl p-3 shadow-sm bg-base-100">
          <h2 className="text-sm font-bold mb-2">Data Snapshot</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-base-300 p-2 text-center">
              <div className="text-[11px] text-gray-500">Discussions analyzed</div>
              <div className="text-base font-bold">{discussionCount}</div>
            </div>
            <div className="rounded-lg border border-base-300 p-2 text-center">
              <div className="text-[11px] text-gray-500">Products ranked</div>
              <div className="text-base font-bold">{products.length}</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
          <input type="checkbox" defaultChecked={false} />
          <div className="collapse-title text-sm font-bold">Reddit Analysis </div>
          <div className="collapse-content">
            <div className="text-xs mb-4">
              <p>
                <strong>Editorial Summary:</strong>{" "}
                {editorialSummarySegments.length > 0
                  ? renderSegmentBlocks(editorialSummarySegments)
                  : (categoryData.editorial_summary || "No editorial summary available.")}
                <span className="block mt-2 text-[11px] text-gray-500">
                  Summarized by <Link href="/about" className="underline">Tom and Lee</Link>.
                </span>
              </p>
            </div>
            <div className="text-xs">
              <strong>Recommendations:</strong>
              {recommendationsWithLinkSegments.length > 0 ? (
                <ul className="mt-1 ml-4">
                  {recommendationsWithLinkSegments.map((rec, index) => (
                    <li key={`recommendation-${index}`} className="list-disc mb-2">
                      {renderSegmentBlocks(rec.segments)}
                    </li>
                  ))}
                </ul>
              ) : categoryData.recommendations && categoryData.recommendations.length > 0 ? (
                <ul className="mt-1 ml-4">
                  {categoryData.recommendations.map((tip, index) => (
                    <li key={index} className="list-disc mb-2">{tip}</li>
                  ))}
                </ul>
              ) : (
                " No recommendations available."
              )}
            </div>
          </div>

        </div>

        {/* Rankings */}
        <CategoryPageWrapper products={products} category={category} />

        <div className="my-6 border border-base-300 rounded-xl p-3 shadow-sm bg-base-100">
          <h2 className="text-sm font-bold mb-2">Why Trust Thorough Beauty</h2>
          <p className="text-xs mb-2">
            Rankings are based on real Reddit discussions using a Wilson Lower Bound (WLB) confidence score to reduce noise from products with very few mentions.
          </p>
          <p className="text-xs">
            AI helps summarize patterns, but the underlying sentiment and quotes come from human Reddit posts. See our <Link href="/about" className="underline">editorial approach</Link>.
          </p>
        </div>

        {/* FAQs */}
        {categoryData.faq && categoryData.faq.length > 0 && (
           <div className="mx-2 mb-4 mt-8"> 
              <h2 className="text-m font-bold mt-4 mb-2">Asked by Redditors</h2>
              <div className="card border">
              {categoryData.faq.map((item, index) => {
                if (typeof item === 'string') return null;
                return (
                  <div key={index} className="collapse collapse-arrow">
                    <input type="radio" name={`faq-accordion`} />
                    <div className="collapse-title font-semibold text-xs">{item.question || item.q || item.Q}</div>
                    <div className="collapse-content text-xs">{item.answer || item.a || item.A}</div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

        {/* Application Tips*/}
        <div className="mx-2 mb-4 mt-8"> 
          <h2 className="text-m font-bold mt-4 mb-2">Application Tips by Redditors:</h2>
          <div className="card border">
            {categoryData.application_tips && categoryData.application_tips.length > 0 ? (
              <ul className="m-4 mx-6">
              {categoryData.application_tips.map((tip, index) => (
                <li key={index} className="list-decimal mb-2 text-xs">{tip}</li>
              ))}
              </ul>
            ) : (
              " No application tips available."
            )}
          </div>
        </div>

        {/* Related Categories */}
        <div className="mx-2 mb-4 mt-8">
          <h2 className="text-m font-bold mt-4 mb-2">Related Categories:</h2>
          <div className="card border">
            {categoryData.related_categories && categoryData.related_categories.length > 0 ? (
              <ul className="m-4 mx-6">
                {categoryData.related_categories.map((slug, index) => {
                    const label = slug
                      .split(/[-_]/)
                      .filter(Boolean)
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");

                    return (
                      <li key={index} className="list-decimal mb-2 text-xs">
                      <Link href={`/category/${slug}`} className="hover:underline text-pink-600 hover:text-pink-700">
                        {label || slug}
                      </Link>
                      </li>
                    );
                })}
              </ul>
            ) : (
              " No related categories available."
            )}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mx-2 mb-4 mt-8">
          <h2 className="text-m font-bold mt-4 mb-2">Related Posts:</h2>
          <div className="card border">
            {categoryData.related_posts && categoryData.related_posts.length > 0 ? (
              <ul className="m-4 mx-6">
              {categoryData.related_posts
                .filter((post) => post?.slug)
                .map((post, index) => {
                const slug = post.slug!;
                const fallbackLabel = slug
                  .split(/[-_]/)
                  .filter(Boolean)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
                const label = post.title?.trim() || fallbackLabel || slug;

                return (
                  <li key={index} className="list-decimal mb-2 text-xs">
                  <Link
                    href={`/posts/${slug}`}
                    className="hover:underline text-pink-600 hover:text-pink-700"
                  >
                    {label}
                  </Link>
                  </li>
                );
                })}
              </ul>
            ) : (
              " No related posts available."
            )}
          </div>
        </div>

        {/* Discussions Box */}
        <DiscussionsBox discussion_data={discussion_data} />

      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return notFound();
  }
}
