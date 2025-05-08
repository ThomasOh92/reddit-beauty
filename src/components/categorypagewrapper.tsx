'use client';

import { useEffect, useState } from "react";
import ProductCard from "@/components/productcard";

interface Product {
  id: string;
  product_name: string;
  positive_mentions: number;
  negative_mentions: number;
  amazon_url_us?: string;
  amazon_url_uk?: string;
  image_url: string;
  sephora_url?: string;
  upvote_count?: number;
  rank?: number;
}

export default function CategoryPageWrapper({ products }: { products: Product[] }) {
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
        <ProductCard key={product.id} product={product} userCountry={userCountry} />
      ))}
    </>
  );
}
