import React from "react";

type Quote = {
  comment: string;
  author: string;
  url: string;
  helpfulness_score: number;
  sentiment: string;
  score: number;
};

type ProductData = {
  quotes: Quote[];
};

type QuotesDisplayProps = {
  productData: ProductData;
};

export const QuotesDisplay: React.FC<QuotesDisplayProps> = ({
  productData,
}) => {
  const sortedQuotes = productData.quotes
    .slice()
    .sort((a, b) => b.helpfulness_score - a.helpfulness_score);

  return (
    <div className='mx-4'>
      <h2 className="text-m font-bold mb-2"> Reddit Reviews</h2>
      {sortedQuotes.slice(0, 5).map((quote, idx) => (
        <div className="card bg-base-100 mb-6" key={idx}>
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
              <span>u/{quote.author}</span>
              <span>Sentiment: {quote.sentiment} </span>
              <span>Upvotes: {quote.score}</span>
            </div>
          </div>
        </div>
      ))}
      {sortedQuotes.length > 5 && (
        <div className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mt-8">
          <input type="checkbox" className="collapse-toggle p-0" />
          <div className="collapse-title text-xs font-bold">More</div>
          <div className="collapse-content">
            {sortedQuotes.slice(5).map((quote, idx) => (
              <div className="card bg-base-100" key={idx}>
                <div className="card-body p-0">
                    <a
                    href={`https://reddit.com${quote.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block no-underline hover:underline transition"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                    <p className="text-xs mb-1 whitespace-pre-line break-words">{quote.comment}</p>
                    </a>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>u/{quote.author}</span>
                    <span>Sentiment: {quote.sentiment}</span>
                    <span>Upvotes: {quote.score}</span>
                  </div>
                </div>
                <div className="divider mx-10 my-0"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
