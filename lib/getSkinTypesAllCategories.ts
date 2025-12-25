import { cache } from "react";
import { db } from "./firebaseAdmin";

type PositiveQuoteElementRaw = {
  image_url?: string;
  negative_quotes?: number;
  neutral_quotes?: number;
  positive_quotes?: number;
  product_id?: string;
  product_name?: string;
};

type SkinTypeCategoryDocData = FirebaseFirestore.DocumentData & {
  positive_quote_rankings?: unknown;
};

type SkinTypeProductQuoteRaw = FirebaseFirestore.DocumentData & {
  comment?: string;
  quote_id?: string;
  id?: string;
  sentiment?: string;
};

type SkinTypeProductDocData = FirebaseFirestore.DocumentData & {
  quotes?: unknown;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export type PositiveQuoteElement = {
    image_url: string;
    negative_quotes: number;
    neutral_quotes: number;
    positive_quotes: number;
    product_id: string;
    product_name?: string;
}

export type SkinTypeCategory = {
  positive_quote_rankings?: PositiveQuoteElement[]
}

export type SkinTypeCategorySummary = {
  category_id: string;
  category_doc_id: string;
  positive_quote_rankings: PositiveQuoteElement[];
};

export type SkinTypeAllCategoriesData = {
  skin_type_id: string;
  categories: SkinTypeCategorySummary[];
};

export type SkinTypeProductQuote = {
  comment: string;
  quote_id: string;
  sentiment: string;
};

function normalizePositiveQuoteElement(input: PositiveQuoteElementRaw | null | undefined): PositiveQuoteElement {
  const product_name = readString(input?.product_name) 
  return {
    image_url: readString(input?.image_url),
    negative_quotes: readNumber(input?.negative_quotes),
    neutral_quotes: readNumber(input?.neutral_quotes),
    positive_quotes: readNumber(input?.positive_quotes),
    product_id: readString(input?.product_id),
    product_name,
  };
}

function readPositiveQuoteRankingsFromDocData(docData: SkinTypeCategoryDocData | undefined): PositiveQuoteElement[] {
  const raw =
    docData?.positive_quote_rankings ??
    [];

  if (!Array.isArray(raw)) return [];
  return raw.map((item) => normalizePositiveQuoteElement(item as PositiveQuoteElementRaw));
}

async function getSkinTypeAllCategoriesUncached(
  skin_type_id: string
): Promise<SkinTypeAllCategoriesData | null> {
  if (!skin_type_id) return null;

  const skinTypeRef = db.collection("skin-types").doc(skin_type_id);
  const skinTypeDoc = await skinTypeRef.get();
  if (!skinTypeDoc.exists) return null;

  const categoryCollections = await skinTypeRef.listCollections();

  const categories: SkinTypeCategorySummary[] = await Promise.all(
    categoryCollections.map(async (categoryCol) => {
      const category_id = categoryCol.id;
      const preferredDocId = `${category_id}-category`;

      // preferred: the conventional doc id
      const preferredSnap = await categoryCol.doc(preferredDocId).get();
      if (preferredSnap.exists) {
        const positive_quote_rankings = readPositiveQuoteRankingsFromDocData(preferredSnap.data());
        return {
          category_id,
          category_doc_id: preferredDocId,
          positive_quote_rankings,
        };
      }

      // fallback: find any doc in this subcollection that has rankings
      const anyDocs = await categoryCol.limit(10).get();
      for (const doc of anyDocs.docs) {
        const positive_quote_rankings = readPositiveQuoteRankingsFromDocData(doc.data());
        if (positive_quote_rankings.length > 0) {
          return {
            category_id,
            category_doc_id: doc.id,
            positive_quote_rankings,
          };
        }
      }

      return {
        category_id,
        category_doc_id: preferredDocId,
        positive_quote_rankings: [],
      };
    })
  );
  return {
    skin_type_id,
    categories,
  };
}

// Existing import expects this name + signature
export const getSkinTypesAllCategories = cache(async function getSkinTypesAllCategories(
  skin_type_id: string
): Promise<SkinTypeAllCategoriesData | null> {
  return getSkinTypeAllCategoriesUncached(skin_type_id);
});

function normalizeSkinTypeProductQuote(
  input: SkinTypeProductQuoteRaw | null | undefined,
  fallbackId: string
): SkinTypeProductQuote {
  return {
    comment: readString(input?.comment),
    quote_id: readString(input?.quote_id) || readString(input?.id) || fallbackId,
    sentiment: readString(input?.sentiment),
  };
}

async function getSkinTypeProductDocData(
  skin_type_id: string,
  category_id: string,
  product_id: string
): Promise<SkinTypeProductDocData | null> {
  const skinTypeRef = db.collection("skin-types").doc(skin_type_id);
  const categoryRef = skinTypeRef.collection(category_id);

  // Option A (most likely): category doc + products subcollection
  const categoryDocId = `${category_id}-category`;
  const productInProductsSubcol = await categoryRef
    .doc(categoryDocId)
    .collection("products")
    .doc(product_id)
    .get();
  if (productInProductsSubcol.exists) {
    return (productInProductsSubcol.data() ?? null) as SkinTypeProductDocData | null;
  }

  // Option B (fallback): product doc directly under the category collection
  const productDoc = await categoryRef.doc(product_id).get();
  if (productDoc.exists) {
    return (productDoc.data() ?? null) as SkinTypeProductDocData | null;
  }

  return null;
}

/**
 * Fetches the first N quotes for a product under a skin-type category.
 *
 * Firestore path assumed:
 *   skin-types/{skin_type_id}/{category_id}/{product_id}
 * where the product doc contains a field `quotes: Array<{comment, quote_id, sentiment, ...}>`.
 */
export async function getSkinTypeProductQuotes(
  skin_type_id: string,
  category_id: string,
  product_id: string,
  options?: { limit?: number; offset?: number }
): Promise<SkinTypeProductQuote[]> {
  if (!skin_type_id || !category_id || !product_id) return [];

  const limitRaw = options?.limit ?? 5;
  const limit = Math.max(1, Math.min(20, Number.isFinite(limitRaw) ? limitRaw : 5));

  const offsetRaw = options?.offset ?? 0;
  const offset = Math.max(0, Number.isFinite(offsetRaw) ? offsetRaw : 0);

  const data = await getSkinTypeProductDocData(skin_type_id, category_id, product_id);
  if (!data) return [];
  const rawQuotes = data.quotes;
  if (!Array.isArray(rawQuotes) || rawQuotes.length === 0) return [];

  return rawQuotes
    .slice(offset, offset + limit)
    .map((q, idx) => normalizeSkinTypeProductQuote(q as SkinTypeProductQuoteRaw, String(idx)));
}

export async function getSkinTypeProductQuotesPage(
  skin_type_id: string,
  category_id: string,
  product_id: string,
  options?: { limit?: number; offset?: number }
): Promise<{ quotes: SkinTypeProductQuote[]; hasMore: boolean; nextOffset: number }> {
  const limitRaw = options?.limit ?? 5;
  const limit = Math.max(1, Math.min(20, Number.isFinite(limitRaw) ? limitRaw : 5));

  const offsetRaw = options?.offset ?? 0;
  const offset = Math.max(0, Number.isFinite(offsetRaw) ? offsetRaw : 0);

  const data = await getSkinTypeProductDocData(skin_type_id, category_id, product_id);
  if (!data) return { quotes: [], hasMore: false, nextOffset: offset };
  const rawQuotes = data.quotes;
  if (!Array.isArray(rawQuotes) || rawQuotes.length === 0) {
    return { quotes: [], hasMore: false, nextOffset: offset };
  }

  const slice = rawQuotes.slice(offset, offset + limit);
  const quotes = slice.map((q, idx) =>
    normalizeSkinTypeProductQuote(q as SkinTypeProductQuoteRaw, String(offset + idx))
  );
  const nextOffset = offset + slice.length;
  const hasMore = nextOffset < rawQuotes.length;

  return { quotes, hasMore, nextOffset };
}




