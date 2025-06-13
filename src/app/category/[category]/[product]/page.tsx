import { QuotesDisplay } from "@/components/quotes-display";
import * as CONSTANTS from "../../../../constants";

type ProductPageProps = Promise<{
  category: string;
  product: string;
}>;

export default async function ProductPage({
  params,
}: {
  params: ProductPageProps;
}) {
  const { category, product } = await params;
  const API_URL = CONSTANTS.APP_URL;

  try {
    const res = await fetch(
      `${API_URL}/api/getProductData?category=${category}&slug=${product}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(
        `API responded with status: ${res.status} - ${await res.text()}`
      );
    }

    const { success, productData } = await res.json();
    if (!success) throw new Error("API request unsuccessful");
    

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
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
          {/* Title and Picture */}
          <h1 className="text-l font-bold mx-4">{productData.product_name}</h1>
          <div className="flex gap-4 mx-4">
            {productData.amazon_url_us && (
            <a
              href={productData.amazon_url_us}
              className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon
            </a>
            )}
            {productData.amazon_url_uk && (
            <a
              href={productData.amazon_url_uk}
              className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon UK
            </a>
            )}
            {productData.sephora_url && (
            <a
              href={productData.sephora_url}
              className="btn btn-neutral text-white font-bold h-8 flex-1 text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sephora
            </a>
            )}
            {productData.fallback_url && (
            <a
              href={productData.fallback_url}
              className="btn text-black font-bold h-8 flex-1 text-xs border border-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Product Site
            </a>
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
          
          {/* Positive and Negative Mentions */}
          <div>
            <h2 className="ml-4 text-m font-bold mt-4">Positive and Negative Mentions</h2>
            <p className="text-xs mx-4 mt-1">Calculated by the the number of posts or comments that have an opinion on this product</p>
          </div>
          <div className="stats border mx-4 mb-4">
            <div className="stat">
              <div className="stat-title">Positive Mentions</div>
              <div className="stat-value">{productData.positive_mentions}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Negative Mentions</div>
              <div className="stat-value">{productData.negative_mentions}</div>
            </div>
          </div>

          {/* Quotes */}
          {Array.isArray(productData.quotes) && productData.quotes.length > 0 && (
            <QuotesDisplay productData={{ quotes: productData.quotes }} />
          )}
          
        </div>
      </div>
    );
    
  } catch (error) {
    console.error("Error fetching product data:", error);
    return (
      <p className="text-red-600 text-center mt-4">Error fetching product data.</p>
    );
  }

}
