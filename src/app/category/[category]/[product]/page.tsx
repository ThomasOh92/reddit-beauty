import { notFound } from "next/navigation";
import { getAllCategories } from "../../../../../lib/getAllCategories";
import { getProductData } from "../../../../../lib/getProductData";
import { getProductSlugsForCategory } from "../../../../../lib/getProductSlugsForCategory";
import QuotesWrapper from "@/components/quoteswrapper";
import Image from "next/image";
import { APP_URL } from '@/constants';
import { shortenProductName } from "../../../../../lib/shortenProductName";
import Link from "next/link";

export const dynamicParams = true;
export const revalidate = 7200;

type ProductPageProps = Promise<{
  category: string;
  product: string;
}>;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Format date consistently for display (e.g., "September 2025")
function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Helper: smart truncate with ellipsis and whitespace cleanup
function smartTruncate(text: string, max: number): string {
  const clean = (text || "").toString().replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const boundary = clean.lastIndexOf(" ", Math.max(0, max - 1));
  const cut = boundary > 60 ? boundary : Math.max(0, max - 1);
  return clean.slice(0, cut).trimEnd() + "…";
}

// Build a meta description between 130–150 chars including editorial summary
function createMetaDescription(productName: string, editorial: string, updatedStr?: string): string {
  const prefix = `${productName}: `;
  const baseSuffix = " Read real Reddit opinions and sentiment.";
  const suffix = updatedStr ? `${baseSuffix} Updated ${updatedStr}.` : baseSuffix;
  const target = 145; // aim
  const min = 130;
  const max = 150;

  const maxEditorial = Math.max(0, target - prefix.length - suffix.length);
  const editorialPart = smartTruncate(editorial, maxEditorial);

  let desc = `${prefix}${editorialPart}${editorialPart ? " " : ""}${suffix}`;

  if (desc.length < min) {
    const extra = " See pros, cons, and FAQs.";
    const addLen = Math.min(extra.length, max - desc.length);
    desc += extra.slice(0, addLen);
  }

  return desc.length > max
    ? smartTruncate(`${productName}: ${editorial} ${suffix}`, max)
    : desc;
}

export async function generateMetadata({
  params,
}: {
  params: ProductPageProps;
}) {
  const { category, product } = await params;

  const productData = await getProductData(category, product);
  if (!productData) return notFound();

  const productName = productData.product_name;
  const categoryName = category.replace(/-/g, " ");
  const image = productData.image_url || "/opengraph-image.png";
  const shortenedProductName = shortenProductName(productName, 40);

  const updatedStr = productData.lastUpdated
    ? formatMonthYear(new Date(productData.lastUpdated.toDate?.() || productData.lastUpdated))
    : undefined;

  const metaDescription = createMetaDescription(
    productName,
    productData.editorial_summary || "",
    updatedStr
  );

  // Optional: Top quote - Future optimization
  // const topQuote = Array.isArray(productData.quotes) && productData.quotes.length > 0
  //   ? productData.quotes[0].text
  //   : undefined;

  return {
    title: `${shortenedProductName} – Reddit Analysis`,
    description: metaDescription,
    alternates: {
      canonical: `${APP_URL}/category/${category}/${product}`,
    },
    keywords: [productName, "Reddit", categoryName, "Reviews", "Beauty", "Skincare"],
    openGraph: {
      title: `${shortenedProductName} – Reddit Analysis`,
      description: metaDescription,
      images: [{ url: image, alt: `${productName}` }],
      url: `${APP_URL}/category/${category}/${product}`,
      type: "website"
    },
  };
}

export async function generateStaticParams(): Promise<
  { category: string; product: string }[]
> {
  try {
    // Step 1: Get categories
    const data = await getAllCategories();
    if (!Array.isArray(data)) return [];

    const categorySlugs = data
      .filter((c) => c.readyForDisplay && c.slug)
      .map((c) => c.slug);

    const allParams: { category: string; product: string }[] = [];

    // Step 2: For each category, fetch the product slugs
    for (const category of categorySlugs) {
      const slugs = await getProductSlugsForCategory(category);

      if (!slugs || !Array.isArray(slugs) || slugs.length === 0) continue;

      for (const slug of slugs) {
        if (slug) {
          allParams.push({ category, product: slug });
        }
      }

      await delay(200);
    }

    return allParams;
  } catch (err) {
    console.error("generateStaticParams() error:", err);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: ProductPageProps;
}) {
  const { category, product } = await params;
  const label = category.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  try {
    const productData = await getProductData(category, product); // First page of quotes

    if (
      !productData ||
      !productData.product_name || // core field missing
      !Array.isArray(productData.quotes) ||
      productData.quotes.length === 0
    ) {
      return notFound();
    }

    // Product JSON-LD Schema
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productData.product_name,
      image: productData.image_url,
      description: `See what Reddit users think about ${productData.product_name}.`,
      url: `https://www.thoroughbeauty.com/category/${category}/${product}`,
      review: [
        {
          "@type": "Review",
          name: productData.product_name + " Editorial Review",
          author: {
            "@type": "Organization",
            name: "Thorough Beauty Editorial Team",
          },
          reviewBody: productData.editorial_summary || "No editorial summary available.",
          positiveNotes:{
            "@type": "ItemList",
            itemListElement: productData.pros_cons ? 
              productData.pros_cons["pros"]?.map((pro, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": pro
              })) : []
          },
          negativeNotes:{
            "@type": "ItemList",
            itemListElement: productData.pros_cons ? 
              productData.pros_cons["cons"]?.map((con, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": con
              })) : []
          },
          datePublished: productData.lastUpdated ? new Date(productData.lastUpdated.toDate?.() || productData.lastUpdated).toISOString() : "not available",
        }
      ],

      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Total Upvotes",
          value: productData.upvote_count,
        },
        {
          "@type": "PropertyValue",
          name: "Positive Reviews",
          value: productData.positive_mentions,
        },
        {
          "@type": "PropertyValue",
          name: "Negative Reviews",
          value: productData.negative_mentions,
        },
      ],
    };
  
    // Webpage JSON-LD Schema
    const webpageLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: `https://www.thoroughbeauty.com/category/${category}/${product}`,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#one-sentence-definition"]
      },
    };

    //FAQ JSON-LD Schema
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: productData.faq?.map((item) => ({
      "@type": "Question",
      name: item["question"] || item["q"] || item["Q"],
      acceptedAnswer: {
        "@type": "Answer",
        text: item["answer"] || item["a"] || item["A"],
      },
      })) || [],
    };

    // The initial data to pass to the client component
    const initialQuotes = productData.quotes;
    const initialCursorId = productData.nextCursor
      ? productData.nextCursor.id
      : null;


    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webpageLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="flex flex-col gap-4">
          <div>
            {productData.image_url && (
            <div className="flex justify-center my-4">
              <Image
                fetchPriority="high"
                priority={true}
                src={productData.image_url}
                alt={productData.product_name}
                width={250}
                height={250}
                className="w-[50%] max-h-[250px] object-contain"
              />
            </div>
          )}
          
          <div className='mx-4'>
            <Link
              href={`/category/${category}`}
              className="badge badge-neutral badge-outline mb-1 hover:bg-gray-200 hover:text-gray-900"
            >
              {label}
            </Link>
            <h1 className="text-l font-bold">{productData.product_name}</h1>
            <p id="one-sentence-definition" className="mb-4 text-xs">{productData.one_sentence_definition}</p>
          </div>

          <div className="flex flex-col gap-1 mx-4">
            <>
              <a
                href={
                  productData.amazon_url_us ||
                  productData.amazon_url_uk ||
                  productData.sephora_url ||
                  productData.fallback_url
                }
                className="btn btn-warning text-white font-bold h-8 text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                See Product
              </a>

              <p className="text-[10px] text-gray-500 text-center leading-snug mt-1">
                We may earn a small commission if you click our link. It helps support the cost of running our
                analysis and keeping this site independent.
              </p>
            </>
          </div>


          </div>

          {/* Ranking by Upvotes */}
          <h2 className="ml-4 text-m font-bold mt-4">Rankings by Sentiment Analysis</h2>
          <div className="stats border mx-4">
            <div className="stat">
              <div className="stat-title">Reddit Rank</div>
              <div className="stat-value">#{productData.rank}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Score</div>
              <div className="stat-value">{productData.sentiment_score?.toFixed(2) ?? "N/A"}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Upvotes</div>
              <div className="stat-value">{productData.upvote_count}</div>
            </div>
          </div>

          {/* Editorial Summary */}
          <div className="mx-4 card border">
          <p className="text-xs m-4">
            <strong>Editorial Summary: </strong>{productData.editorial_summary || "No editorial summary available."}
          </p>
          {productData.pros_cons && (
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productData.pros_cons.pros && productData.pros_cons.pros.length > 0 && (
                  <div className="mx-4">
                    <h4 className="text-sm font-semibold text-green-600 mb-2">Pros</h4>
                    <ul className="text-xs space-y-1">
                      {productData.pros_cons.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {productData.pros_cons.cons && productData.pros_cons.cons.length > 0 && (
                  <div className="mx-4">
                    <h4 className="text-sm font-semibold text-red-600 mb-2">Cons</h4>
                    <ul className="text-xs space-y-1">
                      {productData.pros_cons.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

            <p className="text-xs mx-4 mb-4 text-gray-500">
              <strong>Methodology:</strong> {productData.methodology || "Not available right now."} 
            </p>
          
            <p className="text-xs mx-4 mb-4 text-center">
              This analysis contributed to one of our key compilations:<br />
              <strong><a href="/pdf-guide" className="text-primary" >Reddit Backed Starter Routine (PDF)</a></strong>
            </p>



          </div>

          {/* Related Products */}
          {((productData.related_alternatives?.length ?? 0) > 0 || (productData.related_complements?.length ?? 0) > 0) && (
            <div className="mx-4 mb-4">
              <h2 className="text-m font-bold mt-4 mb-2">Related Products</h2>
                <div
                  className={`grid gap-4 ${
                  (productData.related_complements?.length ?? 0) > 0 &&
                  (productData.related_alternatives?.length ?? 0) > 0
                    ? "grid-cols-2"
                    : "grid-cols-1"
                  }`}
                >

                  {(productData.related_complements?.length ?? 0) > 0 && (
                  <div className="card border h-full">
                    <p className="text-xs font-bold text-center mt-2">Complementary</p>
                    <ul className="m-4 mx-6 space-y-2">
                    {productData.related_complements?.map((related, index) => {
                      const label = related.slug
                        .split(/[-_]/)
                        .filter(Boolean)
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");

                      return (
                      <li key={index} className="list-decimal text-xs">
                        <Link
                        href={`/category/${related.category}/${related.slug}`}
                        className="underline text-pink-600 hover:text-pink-700"
                        >
                        {label || related.slug}
                        </Link>
                      </li>
                      );
                    })}
                    </ul>
                  </div>
                  )}

                  {(productData.related_alternatives?.length ?? 0) > 0 && (
                  <div className="card border h-full">
                    <p className="text-xs font-bold text-center mt-2">Alternatives</p>
                    <ul className="m-4 mx-6 space-y-2">
                    {productData.related_alternatives?.map((related, index) => {
                      const label = related.slug
                        .split(/[-_]/)
                        .filter(Boolean)
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");

                      return (
                      <li key={index} className="list-decimal text-xs">
                        <Link
                        href={`/category/${related.category}/${related.slug}`}
                        className="underline text-pink-600 hover:text-pink-700"
                        >
                        {label || related.slug}
                        </Link>
                      </li>
                      );
                    })}
                    </ul>
                  </div>
                  )}

                </div>

            </div>
          )}

          {/* FAQ Section */}
          {productData.faq && productData.faq.length > 0 && (
           <div className="mx-4"> 
              <h2 className="text-m font-bold mt-4 mb-2">Asked by Redditors</h2>
              <div className="card border">
              {productData.faq.map((item, index) => (
                <div key={index} className="collapse collapse-arrow">
                  <input type="radio" name={`faq-accordion`} />
                  <div className="collapse-title font-semibold text-xs">{item["question"] || item["q"] || item["Q"]}</div>
                  <div className="collapse-content text-xs">{item["answer"] || item["a"] || item["A"]}</div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Positive and Negative Reviews */}
          <div>
            <h2 className="ml-4 text-m font-bold mt-4">Reddit Reviews:</h2>
            <p className="text-xs mx-4 mt-1">
              Calculated by the the number of posts or comments that have an
              opinion on this product
            </p>
          </div>
          <div className="stats border mx-4">
            <div className="stat">
              <div className="stat-title">Positive</div>
              <div className="stat-value">{productData.positive_mentions}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Neutral</div>
              <div className="stat-value">{productData.neutral_mentions}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Negative</div>
              <div className="stat-value">{productData.negative_mentions}</div>
            </div>
          </div>

          {/* Quotes */}
          {/* {Array.isArray(productData.quotes) &&
            productData.quotes.length > 0 && (
              <QuotesDisplay productData={{ quotes: productData.quotes }} />
            )} */}
          <QuotesWrapper
            initialQuotes={initialQuotes}
            initialCursorId={initialCursorId}
            category={category}
            productSlug={product}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return notFound();
  }
}
