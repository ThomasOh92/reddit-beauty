"use client";

import { useEffect, useMemo, useState } from "react";

type Quote = {
  comment: string;
  quote_id: string;
  sentiment: string;
};

type Props = {
  category: string;
  productSlug: string;
  skinTypeId?: string;
  productId?: string;
  pageSize?: number;
};

export default function ProductQuotesDropdown({
  category,
  productSlug,
  skinTypeId,
  productId,
  pageSize = 5,
}: Props) {
  const effectivePageSize = Math.max(1, Math.min(10, pageSize));
  const useSkinTypeApi = Boolean(skinTypeId && productId);

  const [isOpen, setIsOpen] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nextCursorId, setNextCursorId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const endpoint = useMemo(() => {
    return useSkinTypeApi ? "/api/getSkinTypeProductQuotes" : "/api/getQuotes";
  }, [useSkinTypeApi]);

  async function fetchMore() {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const body = useSkinTypeApi
        ? {
            skinTypeId,
            categoryId: category,
            productId,
            limit: effectivePageSize,
            offset,
          }
        : {
            category,
            productSlug,
            limit: effectivePageSize,
            cursorId: nextCursorId,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();

      if (useSkinTypeApi) {
        const newQuotes: Quote[] = Array.isArray(data?.quotes) ? data.quotes : [];
        setQuotes((prev) => [...prev, ...newQuotes]);

        const next = typeof data?.nextOffset === "number" ? data.nextOffset : null;
        const more = Boolean(data?.hasMore);

        if (typeof next === "number") setOffset(next);
        setHasMore(more);
      } else {
        const newQuotes: Quote[] = Array.isArray(data?.quotes)
          ? data.quotes.map((q: Partial<Quote>) => ({
              comment: q?.comment ?? "",
              quote_id: q?.quote_id ?? "",
              sentiment: q?.sentiment ?? "",
            }))
          : [];

        setQuotes((prev) => [...prev, ...newQuotes]);

        const next = data?.nextCursorId ?? null;
        setNextCursorId(next);
        setHasMore(Boolean(next));
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load quotes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    if (quotes.length > 0) return;
    void fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <details
      className="mt-2"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer text-xs font-semibold">Quotes</summary>

      <div className="mt-2 space-y-3">
        {error ? <p className="text-xs text-error">{error}</p> : null}

        {quotes.length === 0 && isLoading ? (
          <p className="text-xs opacity-60">Loading…</p>
        ) : null}

        {quotes.length === 0 && !isLoading && !error ? (
          <p className="text-xs opacity-60">No quotes found yet.</p>
        ) : null}

        {quotes.slice(0).map((q) => (
          <div key={q.quote_id} className="leading-snug">
            <p className="text-[11px] italic opacity-90">{q.comment}</p>
            {q.sentiment ? (
              <p className="text-[11px] opacity-60">Sentiment: {q.sentiment}</p>
            ) : null}
          </div>
        ))}

        {hasMore ? (
          <button
            type="button"
            className="btn btn-neutral text-xs h-7"
            onClick={(ev) => {
              ev.preventDefault();
              void fetchMore();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading…" : "More quotes"}
          </button>
        ) : null}
      </div>
    </details>
  );
}
