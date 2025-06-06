import * as CONSTANTS from "../../../../constants";

export default async function ProductPage({
  params,
}: {
  params: { category: string; product: string };
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
        <div className="flex flex-col items-center gap-4">
          {productData.image_url && (
            <img
              src={productData.image_url}
              alt={productData.product_name}
              className="w-48 h-48 object-contain rounded shadow"
            />
          )}
          <h1 className="text-2xl font-bold">{productData.product_name}</h1>
          <div className="flex gap-4">
            <a
              href={productData.amazon_url_us}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Buy on Amazon US
            </a>
            <a
              href={productData.amazon_url_uk}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Buy on Amazon UK
            </a>
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            {productData.rank !== undefined && productData.rank !== null && (
              <div>
              <span className="font-semibold">Rank:</span> {productData.rank}
              </div>
            )}
            <div>
              <span className="font-semibold">Upvotes:</span>{" "}
              {productData.upvote_count}
            </div>
            <div>
              <span className="font-semibold">Positive Mentions:</span>{" "}
              {productData.positive_mentions}
            </div>
            <div>
              <span className="font-semibold">Negative Mentions:</span>{" "}
              {productData.negative_mentions}
            </div>
          </div>
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
