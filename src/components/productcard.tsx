import React from "react";

interface Product {
  id: string;
  product_name: string;
  negative_keywords: Array<string>;
  positive_keywords: Array<string>;
  positive_mentions: number;
  negative_mentions: number;
  amazon_url: string;
  image_url: string;
  sephora_url?: string; // Optional property
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card card-side w-full bg-base-100 shadow w-full rounded-none mb-1">
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
        <p className="text-s font-bold line-clamp-1">{product.product_name}</p>
        <div>
          <div className="pr-2">
            <p className="flex flex-wrap text-xs line-clamp-1">
              {product.positive_mentions} positive mentions on Reddit,{" "}
              {product.negative_mentions} negative mentions
            </p>
            <p className="text-xs text-success">
              <strong>+</strong> {product.positive_keywords.join(", ")}
            </p>
            <p className="text-xs text-error">
              <strong>-</strong> {product.negative_keywords.join(", ")}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center">
            {product.amazon_url ? (
              <a
                href={product.amazon_url}
                className="btn btn-warning text-white font-bold h-8 w-11/12 text-xs"
              >
                Amazon
              </a>
            ) : product.sephora_url ? (
              <a
                href={product.sephora_url}
                className="btn btn-neutral text-white font-bold h-8 w-11/12 text-xs"
              >
                Sephora
              </a>
            ) : (
              <button
                className="btn btn-disabled font-bold h-8 w-11/12 text-xs"
                disabled
              >
                No Link Available
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
