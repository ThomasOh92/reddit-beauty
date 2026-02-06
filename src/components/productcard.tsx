import React from "react";
import { Product } from "../types";
import Link from "next/link";
import { ProductCardButton } from "@/components/productcardbutton";
import Image from "next/image";
import { SentimentBar } from "@/components/sentimentBar";
import ProductQuotesDropdown from "@/components/product-quotes-dropdown";

interface ProductCardProps {
  product: Product;
  category: string;
  showScore?: boolean;
  mentionsMode?: "positive" | "total";
  mentionsContextLabel?: string;
  skinTypeId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  category,
  showScore = true,
  mentionsMode = "positive",
  mentionsContextLabel,
  skinTypeId,
}) => {
  const productUrl = `/category/${category}/${product.slug}`;

  const isSkinTypeMode = Boolean(skinTypeId);

  const externalUrl =
    product.amazon_url_us ||
    product.amazon_url_uk ||
    product.sephora_url ||
    product.fallback_url;

  const affiliatePlaceholder = "";
  const affiliateUrl = externalUrl || affiliatePlaceholder;

  const positiveMentions = product.positive_mentions ?? 0;
  const neutralMentions = product.neutral_mentions ?? 0;
  const negativeMentions = product.negative_mentions ?? 0;
  const totalMentions = positiveMentions + neutralMentions + negativeMentions;

  const card = (
      <div className="card bg-base-100 shadow-md rounded border-base-300 border relative transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg p-3 flex flex-col h-full">
        {/* Rank badge */}
        <div className="badge badge-xs badge-soft badge-secondary absolute top-2 right-2 z-10">
          #{product.rank}
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center mb-3 mt-2">
          <div className="relative w-full aspect-square max-h-32">
            <Image
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              quality={60}
              loading="lazy"
              decoding="async"
              src={product.image_url}
              alt={product.product_name}
              className="object-contain"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-xs font-bold line-clamp-2 leading-tight min-h-[2rem]">
            {product.product_name}
          </p>
          
          {showScore && (
            <div className="flex items-center gap-1">
              <span className="text-[0.7rem] font-semibold">Score:</span>
              <span className="text-sm font-bold text-secondary">
                {product.sentiment_score
                  ? (product.sentiment_score * 10).toFixed(1)
                  : "N/A"}
              </span>
              <span className="text-[0.65rem] opacity-60">/10</span>
            </div>
          )}
          
          {!showScore && (
            <p className="text-[0.65rem] leading-tight font-medium">
              {mentionsMode === "total" ? (
                <>
                  {totalMentions} mentions
                  {mentionsContextLabel ? (
                    <> from users with {mentionsContextLabel}</>
                  ) : null}
                </>
              ) : (
                <>{positiveMentions} positive mentions</>
              )}
            </p>
          )}

          <SentimentBar
            positiveMentions={positiveMentions}
            neutralMentions={neutralMentions}
            negativeMentions={negativeMentions}
            variant="bar"
          />

          {isSkinTypeMode ? (
            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Link
                  href={productUrl}
                  className="btn btn-soft btn-neutral btn-sm flex-1 text-[0.65rem]"
                >
                  More info
                </Link>
                <ProductCardButton
                  externalUrl={affiliateUrl}
                  disabled={!affiliateUrl}
                  variant="warning"
                />
              </div>

              <ProductQuotesDropdown
                category={category}
                productSlug={product.slug}
                skinTypeId={skinTypeId}
                productId={product.id}
                pageSize={5}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center mt-auto">
              {externalUrl ? (
                <ProductCardButton externalUrl={externalUrl} />
              ) : null}
            </div>
          )}
        </div>
      </div>
	);

  if (isSkinTypeMode) return card;

  return (
    <Link href={productUrl} className="block">
      {card}
    </Link>
  );
};

export default ProductCard;
