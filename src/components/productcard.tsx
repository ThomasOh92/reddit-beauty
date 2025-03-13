import React from 'react';
import Link from "next/link";

interface Product {
  id: string;
  rank: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
      <Link href={`/category/skin-tint/${product.id}`} className="card card-side w-full bg-base-100 shadow-lg w-full rounded-none">
        <div className="badge badge-soft badge-secondary badge-sm mt-2 ml-2">{product.rank}</div>
        <figure className="h-30 overflow-hidden">
          <img
            src="https://cdn1.feelunique.com/img/products/183109/sub-products/sephora_collection_reveal_the_real_soft_radiant_skin_tint_30ml-88346-variant-1721287055.jpg"
            alt="Skin Tint"
            className="object-contain w-full h-full"
          />
        </figure>
        <div className="card-body pb-4">
          <p className="text-s font-semibold"> SEPHORA COLLECTION Reveal The Real Soft Radiant Skin Tint 30ml </p>
            <p className="text-xs">47 Reddit comments mentioned this product, 35 positive</p>
          <p className="text-xs">Key themes: Lightweight, Easy Application, Natural Finish</p>
        </div>
      </Link>
  );
};

export default ProductCard;