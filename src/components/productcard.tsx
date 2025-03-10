import React from 'react';

const ProductCard: React.FC = () => {
    return (
      <div className="card w-60 shadow-sm m-4 max-h-80 border-2 border-gray-300">
        <figure className="h-40 overflow-hidden">
          <img
            src="https://cdn1.feelunique.com/img/products/183109/sub-products/sephora_collection_reveal_the_real_soft_radiant_skin_tint_30ml-88346-variant-1721287055.jpg"
            alt="Skin Tint"
            className="object-contain w-full h-full"
          />
        </figure>
        <div className="card-body">
          <p className="text-m font-semibold"> SEPHORA COLLECTION Reveal The Real Soft Radiant Skin Tint 30ml </p>
            <p className="text-xs">47 Reddit comments mentioned this product, 35 positive</p>
          <p className="text-xs">Key themes: Lightweight, Easy Application, Natural Finish</p>
        </div>
      </div>
  );
};

export default ProductCard;