import { notFound } from "next/navigation";
import { getAllCategories } from "../../../../../lib/getAllCategories";
import { getProductData } from "../../../../../lib/getProductData";
import { getProductSlugsForCategory } from "../../../../../lib/getProductSlugsForCategory";
import QuotesWrapper from "@/components/quoteswrapper";

export const dynamicParams = true;
export const revalidate = 7200;

type ProductPageProps = Promise<{
  category: string;
  product: string;
}>;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  const image = productData.image_url || "/opengraph-image.png";

  // Optional: Top quote - Future optimization
  // const topQuote = Array.isArray(productData.quotes) && productData.quotes.length > 0
  //   ? productData.quotes[0].text
  //   : undefined;

  return {
    title: `${productName} (${categoryName}) – Reddit Reviews, Rankings & Real Quotes (${year})`,
    description: `See what Reddit users think about ${productName}. Read real quotes, upvotes, and honest reviews from the Reddit beauty community. Updated ${month} ${year}.`,
    openGraph: {
      title: `${productName} (${categoryName}) – Reddit Reviews, Rankings & Real Quotes (${year})`,
      description: `See what Reddit users think about ${productName}. Read real quotes, upvotes, and honest reviews from the Reddit beauty community. Updated ${month} ${year}.`,
      images: [{ url: image, alt: `${productName}` }],
      url: `https://redditbeauty.com/category/${category}/${product}`,
    },
  };
}

export async function generateStaticParams(): Promise<{ category: string; product: string }[]> {

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

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productData.product_name,
      image: productData.image_url,
      description:
        `See what Reddit users think about ${productData.product_name}.`,
      url: `https://redditbeauty.com/category/${category}/${product}`,
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
  
    // The initial data to pass to the client component
    const initialQuotes = productData.quotes;
    const initialCursorId = productData.nextCursor ? productData.nextCursor.id : null;


    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="flex flex-col gap-4">
          {productData.image_url && (
            <div className="flex justify-center">
              <img
                src={productData.image_url}
                alt={productData.product_name}
                className="w-[50%] h-auto object-contain"
              />
            </div>
          )}

          <h1 className="text-l font-bold mx-4">{productData.product_name}</h1>

          <div className="flex flex-col gap-1 mx-4">
            {productData.amazon_url_us && (
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
                  We may earn a small commission if you click our link. It
                  doesn’t cost you anything - but it helps support the cost of
                  running our analysis and keeping this site independent.
                </p>
              </>
            )}
          </div>

          {/* Ranking by Upvotes */}
          <h2 className="ml-4 text-m font-bold mt-4">Rankings by Upvotes</h2>
          <div className="stats border mx-4">
            <div className="stat">
              <div className="stat-title">Reddit Rank</div>
              <div className="stat-value">#{productData.rank}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Upvotes</div>
              <div className="stat-value">{productData.upvote_count}</div>
            </div>
          </div>

          {/* Positive and Negative Reviews */}
          <div>
            <h2 className="ml-4 text-m font-bold mt-4">Reddit Reviews</h2>
            <p className="text-xs mx-4 mt-1">
              Calculated by the the number of posts or comments that have an
              opinion on this product
            </p>
          </div>
          <div className="stats border mx-4 mb-4">
            <div className="stat">
              <div className="stat-title">Positive Reviews</div>
              <div className="stat-value">{productData.positive_mentions}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Negative Reviews</div>
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
