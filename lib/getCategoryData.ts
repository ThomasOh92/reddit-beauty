// lib/getCategoryData.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";
import { Product, Discussion } from "../src/types";

type SkinTypeData = {
  id: string;
  discussions: Discussion[];
  products: Product[];
};

export type CategoryData = {
  products?: Product[];
  discussions?: Discussion[];
  "skin-types"?: SkinTypeData[];
};

function mapProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
  const d = doc.data()!;
  return {
    id: doc.id,
    slug: d.slug ?? "",
    product_name: d.product_name ?? "",
    image_url: d.image_url ?? "",
    positive_mentions: d.positive_mentions ?? 0,
    negative_mentions: d.negative_mentions ?? 0,
    neutral_mentions: d.neutral_mentions ?? 0,
    // spread only fields you truly need:
    amazon_url_us: d.amazon_url_us,
    amazon_url_uk: d.amazon_url_uk,
    sephora_url: d.sephora_url,
    fallback_url: d.fallback_url,
    rank: d.rank ?? 0,
    upvote_count: d.upvote_count ?? 0,
  };
}

function mapDiscussion(doc: FirebaseFirestore.DocumentSnapshot): Discussion {
  const d = doc.data()!;
  return {
    permalink: d.permalink ?? "",
    Subreddit: d.Subreddit ?? "",
    thread_title: d.thread_title ?? "",
    date: d.date ?? "",
  };
}

export const getCategoryData = cache(async function getCategoryData(
  category: string
): Promise<CategoryData | null> {
  if (!category) return null;

  const categoryRef = db.collection(category).doc(`${category}-category`);

  // kick off reads in parallel:
  const [prodSnap, categoryDoc, skinTypeIndex] = await Promise.all([
    categoryRef.collection("products").get(),
    categoryRef.get(),
    categoryRef.collection("skin-types").listDocuments(), // just get doc refs
  ]);

  const discussionsArray = categoryDoc.data()?.[`discussions-index-1`] || [];

  const result: CategoryData = {
    products: prodSnap.docs.map(mapProduct),
    discussions: discussionsArray.map((discussionData: Discussion) => ({
      permalink: discussionData.permalink ?? "",
      Subreddit: discussionData.Subreddit ?? "",
      thread_title: discussionData.thread_title ?? "",
      date: discussionData.date ?? "",
    })),
  };

  if (skinTypeIndex.length) {
    // fetch each skin-type’s products & discussions in parallel
    result["skin-types"] = await Promise.all(
      skinTypeIndex.map(async (skinDocRef) => {
        const [stProdSnap, stDiscSnap] = await Promise.all([
          skinDocRef.collection("products").get(),
          skinDocRef.collection("discussions").get(),
        ]);

        return {
          id: skinDocRef.id,
          products: stProdSnap.docs.map(mapProduct),
          discussions: stDiscSnap.docs.map(mapDiscussion),
        };
      })
    );
  }

  return result;
});
