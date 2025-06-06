import React from "react";
import { Product } from "../types"
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  userCountry: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userCountry, category }) => {
  return (
    <div className="card card-side w-full bg-base-100 shadow w-full rounded-none mb-1">
      <div className="badge badge-sm badge-soft badge-secondary absolute top-2 left-2">{product.rank}</div>
      <div className="flex items-center">
        <figure className="h-15 w-15 overflow-hidden flex ml-2 ">
          <img
            src={product.image_url}
            alt={product.product_name}
            className="object-contain w-full h-full"
          />
        </figure>
      </div>
      <div className="card-body p-4">
        <Link href={`${category}/${product.slug}`} className="link link-hover text-s font-bold line-clamp-2 pl-3">{product.product_name}</Link>
        <div>
          <div className="pl-3">
            <p className="flex flex-wrap text-xs line-clamp-1">
              <strong className="text-secondary">{product.upvote_count} upvotes&nbsp;</strong> across analyzed Reddit threads
            </p>
            <p className="flex flex-wrap text-xs line-clamp-1">
              {product.positive_mentions} positive mentions,{" "}
              {product.negative_mentions} negative mentions
            </p>
          </div>
          
          {/* Links */}
            <div className="mt-4 flex items-center justify-center overflow-x-auto w-full">
            <div className="flex gap-5 w-full">
              <a href={`${category}/${product.slug}`} className="btn btn-soft font-bold h-8 flex-1 text-xs">Deep Dive</a>
              {userCountry === "US" && product.amazon_url_us ? (
              <a
                href={product.amazon_url_us}
                className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              >
                Amazon
              </a>
              ) : userCountry === "GB" && product.amazon_url_uk ? (
              <a
                href={product.amazon_url_uk}
                className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              >
                Amazon UK
              </a>
              ) : product.amazon_url_us ? (
              <a
                href={product.amazon_url_us}
                className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              >
                Amazon
              </a>
              ) : product.amazon_url_uk ? (
              <a
                href={product.amazon_url_uk}
                className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
              >
                Amazon UK
              </a>
              ) : product.sephora_url ? (
              <a
                href={product.sephora_url}
                className="btn btn-neutral text-white font-bold h-8 flex-1 text-xs"
              >
                Sephora
              </a>
              ) : product.fallback_url ? (
              <a
                href={product.fallback_url}
                className="btn text-black font-bold h-8 flex-1 text-xs border border-gray-300"
              >
                Product Site
              </a>
              ) : (
              <button
                className="btn btn-disabled font-bold h-8 flex-1 text-xs"
                disabled
              >
                No Link Available
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
