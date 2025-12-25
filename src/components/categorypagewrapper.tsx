import ProductCard from "@/components/productcard";
import { Product } from "../types";

export default function CategoryPageWrapper({
  products,
  category,
  showScore = true,
  mentionsMode,
  mentionsContextLabel,
  skinTypeId,
}: {
  products?: Product[]; // ✅ make optional to handle undefined
  category: string;
  showScore?: boolean;
  mentionsMode?: "positive" | "total";
  mentionsContextLabel?: string;
  skinTypeId?: string;
}) {

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <>
      {safeProducts
        .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
        .map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            category={category}
            showScore={showScore}
            mentionsMode={mentionsMode}
            mentionsContextLabel={mentionsContextLabel}
            skinTypeId={skinTypeId}
          />
        ))}
    </>
  );
}
