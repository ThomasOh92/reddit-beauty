// lib/getCategoryData.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";
import { Product, Discussion, SegmentBlock, RecommendationWithLinks } from "../src/types";

export type PositiveQuoteElement = {
    image_url: string;
    negative_quotes: number;
    neutral_quotes: number;
    positive_quotes: number;
    product_id: string;
    prouct_name: string;
}


export type SkinTypeCategoryData = {
  products?: Product[];
  positive_quote_rankings?: PositiveQuoteElement[]
};


export const getSkinTypesCategoryData = cache(async function getSkinTypesCategoryData(
  skin_type: string
): Promise<SkinTypeCategoryData | null> {
  if (!skin_type) return null;

  const categoryRef = db.collection('skin-types').doc(skin_type);

    const result: SkinTypeCategoryData = {
        products: [],
        positive_quote_rankings: [],
    };

    const categoryCollections = await categoryRef.listCollections();

    await Promise.all(
        categoryCollections.map(async (col) => {
            const categoryDocId = `${col.id}-category`;
            const categorySnap = await col.doc(categoryDocId).get();
            if (!categorySnap.exists) return;

            const data = categorySnap.data() as Partial<SkinTypeCategoryData> | undefined;
            if (!data) return;

            if (Array.isArray(data.products)) {
                result.products!.push(...data.products);
            }

            if (Array.isArray(data.positive_quote_rankings)) {
                result.positive_quote_rankings!.push(...data.positive_quote_rankings);
            }
        })
    );

    if (!result.products?.length) delete result.products;
    if (!result.positive_quote_rankings?.length) delete result.positive_quote_rankings;



  return result;
});
