'use client';
import { useState } from 'react';
import { QuotesDisplay } from '@/components/quotes-display';
import { Quote } from '@/types';

interface QuotesWrapperProps {
  initialQuotes: Quote[];
  initialCursorId: string | null;
  category: string;
  productSlug: string;
}

export default function QuotesWrapper({
  initialQuotes,
  initialCursorId,
  category,
  productSlug,
}: QuotesWrapperProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [cursorId, setCursorId] = useState<string | null>(initialCursorId);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load more quotes
  const loadMoreQuotes = async () => {
    if (!cursorId) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/getQuotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, productSlug, cursorId }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      console.log(`Fetched ${data.quotes.length} new quotes`, data.quotes);

      if (data.quotes && data.quotes.length > 0) {
        setQuotes(prev => {
          const existing = new Set(prev.map(q => q.id));
          const deduped = data.quotes.filter((q: Quote) => !existing.has(q.id));
          return [...prev, ...deduped];
        });
        setCursorId(data.nextCursorId);
      } else {
        // no more to load
        setCursorId(null);
      }
    } catch (error) {
      console.error('Failed to load more quotes', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <QuotesDisplay productData={{ quotes }} />

      <div className="text-center mt-4">
        <div className="text-sm mx-4 text-center">
          Currently Showing <b>{quotes.length}</b> Reviews
        </div>
        <button
          onClick={loadMoreQuotes}
          disabled={isLoading || !cursorId}
          className={`mb-4 btn btn-neutral ${
            isLoading || !cursorId ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading
            ? 'Loading...'
            : !cursorId
            ? 'No more quotes'
            : 'Load More Quotes'}
        </button>
      </div>
    </div>
  );
}
