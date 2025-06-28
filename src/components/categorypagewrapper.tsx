"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productcard";
import { Product } from "../types";

export default function CategoryPageWrapper({
  products,
  category
}: {
  products: Product[];
  category: string;
}) {
  const [userCountry, setUserCountry] = useState("US"); // Default fallback

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country) {
          setUserCountry(data.country);
        }
      })
      .catch(() => setUserCountry("US")); // Fallback if geo lookup fails
  }, []);

  return (
    <>
      {products
        .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
        .map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            userCountry={userCountry}
            category={category}
          />
        ))}

    </>
  );
}
