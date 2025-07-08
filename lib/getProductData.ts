// lib/getProductData.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";
import { Product } from "../src/types";

type Quote = {
  comment: string;
  author: string;
  url: string;
  helpfulness_score: number;
  sentiment: string;
  score: number;
};

type ProductWithQuotes = Product & {
  quotes: Quote[];
};

export const getProductData = cache(async function getProductData(
  category: string,
  slug: string
): Promise<ProductWithQuotes | null> {
  if (!category || !slug) return null;

  try {
    const baseRef = db.collection(category).doc(`${category}-category`);
    const slugDocSnap = await baseRef.collection("slugs").doc(slug).get();
    if (!slugDocSnap.exists) throw new Error("Slug not found");

    const { productId } = slugDocSnap.data() as { productId: string };
    if (!productId) throw new Error("Missing productId in slug doc");

    // Try top-level products
    let productDocRef = baseRef.collection("products").doc(productId);
    let productDocSnap = await productDocRef.get();

    // Fallback: skin-types/*/products
    if (!productDocSnap.exists) {
      const skinTypesSnap = await baseRef.collection("skin-types").get();
      for (const skinTypeDoc of skinTypesSnap.docs) {
        const altSnap = await skinTypeDoc
          .ref
          .collection("products")
          .doc(productId)
          .get();
        if (altSnap.exists) {
          productDocRef = altSnap.ref;
          productDocSnap = altSnap;
          break;
        }
      }
    }

    if (!productDocSnap.exists) throw new Error("Product not found");
    const data = productDocSnap.data()!;
    const product: Product = {
      id: productDocSnap.id,
      slug: data.slug ?? "",
      product_name: data.product_name ?? "",
      image_url: data.image_url ?? "",
      upvote_count: data.upvote_count ?? 0,
      positive_mentions: data.positive_mentions ?? 0,
      negative_mentions: data.negative_mentions ?? 0,
      rank: data.rank ?? 0,
      amazon_url_us: data.amazon_url_us,
      amazon_url_uk: data.amazon_url_uk,
      sephora_url: data.sephora_url,
      fallback_url: data.fallback_url,
    };

    const quotesSnap = await productDocRef.collection("quotes").get();
    const quotes: Quote[] = quotesSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        comment: d.comment ?? "",
        author: d.author ?? "",
        url: d.url ?? "",
        helpfulness_score: d.helpfulness_score ?? 0,
        sentiment: d.sentiment ?? "",
        score: d.score ?? 0,
      };
    });

    return { ...product, quotes };
  } catch (err) {
    console.error("getProductData error:", err);
    return null;
  }
});
