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
      <div className="card card-side w-full bg-base-100 shadow rounded-none mb-1 relative transition-transform duration-300 hover:scale-[1.01] hover:bg-base-200">
        {/* Rank badge */}
        <div className="badge badge-sm badge-soft badge-secondary absolute top-2 left-2 z-10">
          {product.rank}
        </div>

        {/* Image */}
        <div className="flex items-center">
          <figure className="h-15 w-15 overflow-hidden flex ml-2">
            <img
              src={product.image_url}
              alt={product.product_name}
              className="object-contain w-full h-full"
            />
          </figure>
        </div>

        {/* Text */}
        <div className="card-body p-4">
          <p className="text-s font-bold line-clamp-2">
            {product.product_name}
          </p>

          <p className="text-xs line-clamp-1">
            <strong className="text-secondary">
              {product.upvote_count} Aggregated Upvotes
            </strong>
          </p>
          <p className="text-xs line-clamp-1">
            {product.positive_mentions} positive reviews,{" "}
            {product.negative_mentions} negative reviews
          </p>

          {/* See Product (external) */}
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent parent Link from triggering
                window.open(externalUrl, "_blank", "noopener,noreferrer");
              }}
              className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
            >
              See Product
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
