import React from "react";
import { Product } from "../types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  userCountry: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userCountry,
  category,
}) => {
  const productUrl = `/category/${category}/${product.slug}`;

  const externalUrl =
    userCountry === "US"
      ? product.amazon_url_us
      : product.amazon_url_uk || product.sephora_url || product.fallback_url;

  return (
    <Link href={productUrl} className="block">
      <div className="card card-side w-full bg-base-100 shadow rounded-none mb-1 relative transition-transform duration-300 hover:scale-[1.01] hover:bg-base-200 p-2">
        {/* Rank badge */}
        <div className="badge badge-sm badge-soft badge-secondary absolute top-2 left-2 z-10">
          {product.rank}
        </div>

        <div className="flex w-full">
          {/* Image Section - 40% */}
          <div className="flex items-center basis-[40%] justify-center p-2">
            <figure className="w-full h-full overflow-hidden">
              <img
                src={product.image_url}
                alt={product.product_name}
                className="object-contain w-full h-28 sm:h-32"
              />
            </figure>
          </div>

          {/* Text Section - 60% */}
          <div className="basis-[60%] card-body p-2">
            <p className="text-s font-bold line-clamp-2 leading-tight">
              {product.product_name}
            </p>

            <p className="text-xs line-clamp-1">
              <strong className="text-secondary">
                {product.upvote_count} Aggregated Upvotes
              </strong>
            </p>
            <p className="text-xs">
              {product.positive_mentions} positive,{" "}
              {product.negative_mentions} negative reviews
            </p>

            {/* External Link Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(externalUrl, "_blank", "noopener,noreferrer");
                }}
                className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              >
                See Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
