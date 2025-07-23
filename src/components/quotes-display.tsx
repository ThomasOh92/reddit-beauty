import React from "react";

import { Quote } from "../types";

type ProductData = {
  quotes: Quote[];
};

type QuotesDisplayProps = {
  productData: ProductData;
};

export const QuotesDisplay: React.FC<QuotesDisplayProps> = ({
  productData,
}) => {
  const quotes = productData.quotes || [];

  return (
    <div>
      {quotes.map((quote) => (
        <div className="card bg-base-100 mb-8 mx-6" key={quote.id}>
          <div className="card-body p-0 !gap-0 !space-y-0">
            <a
              href={`https://reddit.com${quote.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline hover:underline transition"
            >
              <p className="text-xs mb-1">{quote.comment}</p>
            </a>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>u/{quote.author ? quote.author : "[deleted]"}</span>
              <span
                className={
                  quote.sentiment === "positive"
                    ? "text-green-600"
                    : quote.sentiment === "negative"
                      ? "text-red-500"
                      : "text-gray-500"
                }
              >
                Sentiment: likely {quote.sentiment}{" "}
              </span>
              <span>Upvotes: {quote.score}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
