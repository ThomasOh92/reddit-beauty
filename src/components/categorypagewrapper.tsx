"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productcard";
import { Product, SpecialMention } from "../types";

export default function CategoryPageWrapper({
  products,
  specialMentions,
  category
}: {
  products: Product[];
  specialMentions?: SpecialMention[];
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

      {specialMentions && specialMentions.length > 0 && (
        <div>
          <table className="table-xs mx-auto">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th>Upvotes</th>
              </tr>
            </thead>
            <tbody>
              {specialMentions
                .sort((a, b) => (b.upvote_count ?? 0) - (a.upvote_count ?? 0))
                .map((mention) => {
                  let mentionUrl: string | undefined;

                  if (userCountry === "UK") {
                    mentionUrl = mention.amazon_url_uk || mention.amazon_url_us;
                  } else {
                    mentionUrl = mention.amazon_url_us || mention.amazon_url_uk;
                  }

                  return (
                    <tr key={mention.id}>
                      <td>
                        {mentionUrl ? (
                          <a
                            href={mentionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {mention.product_name}
                          </a>
                        ) : (
                          mention.product_name
                        )}
                      </td>
                      <td className="text-center">
                        {mention.upvote_count ?? "N/A"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
