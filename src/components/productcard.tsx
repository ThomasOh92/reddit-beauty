import React from "react";
import { Product } from "../types";
import Link from "next/link";
import { ProductCardButton } from "@/components/productcardbutton";
import Image from "next/image";
import { SentimentBar } from "@/components/sentimentBar";

interface ProductCardProps {
  product: Product;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, category }) => {
  const productUrl = `/category/${category}/${product.slug}`;

  const externalUrl =
    product.amazon_url_us ||
    product.amazon_url_uk ||
    product.sephora_url ||
    product.fallback_url;

  const positiveMentions = product.positive_mentions ?? 0;
  const neutralMentions = product.neutral_mentions ?? 0;
  const negativeMentions = product.negative_mentions ?? 0;

  return (
    <Link href={productUrl} className="block">
      <div className="card card-side w-full bg-base-100 shadow-lg rounded mb-2 border-base-300 border relative transition-transform duration-300 hover:scale-[1.01] hover:bg-base-200 p-2">
        {/* Rank badge */}
        <div className="badge badge-sm badge-soft badge-secondary absolute top-2 left-2 z-10">
          {product.rank}
        </div>

        <div className="flex w-full">
          {/* Image Section - 40% */}
          <div className="flex items-center basis-[40%] justify-center p-2">
            <figure className="w-full h-full overflow-hidden">
              <Image
                width={250}
                height={250}
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 240px"
                quality={60}
                loading="lazy"
                decoding="async"
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
            <p className="text-s leading-tight">
              Score:{" "}
              {product.sentiment_score
                ? `${(product.sentiment_score * 10).toFixed(1)}/10`
                : "N/A"}
            </p>

            <SentimentBar
              positiveMentions={positiveMentions}
              neutralMentions={neutralMentions}
              negativeMentions={negativeMentions}
            />

            {/* External Link Button */}
            <div className="flex items-center justify-center">
              {externalUrl && <ProductCardButton externalUrl={externalUrl} />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
