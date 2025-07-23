// lib/getProductData.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";
import { Product } from "../src/types";
import type { DocumentSnapshot } from "firebase-admin/firestore"; // NEW: Import the type for the cursor

type Quote = {
  id: string; // Add id for the 'key' prop in React
  comment: string;
  author: string;
  url: string;
  helpfulness_score: number;
  sentiment: string;
  score: number;
};

type ProductWithPaginatedQuotes = Product & {
  quotes: Quote[];
  nextCursor: DocumentSnapshot | null;
};

export const getProductData = cache(async function getProductData(
  category: string,
  slug: string,
  options: { limit?: number; startAfter?: DocumentSnapshot } = {}
): Promise<ProductWithPaginatedQuotes | null> {
  if (!category || !slug) return null;

  try {
    const baseRef = db.collection(category).doc(`${category}-category`);
    const slugDocSnap = await baseRef.collection("slugs").doc(slug).get();
    if (!slugDocSnap.exists) throw new Error("Slug not found");

    const { productId } = slugDocSnap.data() as { productId: string };
    if (!productId) throw new Error("Missing productId in slug doc");

    // This block of logic to find the product is UNCHANGED
    let productDocRef = baseRef.collection("products").doc(productId);
    let productDocSnap = await productDocRef.get();
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
      editorial_rating: data.editorial_rating,
      editorial_summary: data.editorial_summary,
      faq: data.faq,
      lastUpdated: data.lastUpdated,
      methodology: data.methodology,
      one_sentence_definition: data.one_sentence_definition,
      pros_cons: data.pros_cons,
      sentiment_score: data.sentiment_score,
    };
    // End of unchanged block

    // --- NEW PAGINATION LOGIC FOR QUOTES ---
    const { limit = 10, startAfter = null } = options;

    // 1. Create the base query with ordering and a limit
    let quotesQuery = productDocRef
      .collection("quotes")
      .orderBy("score", "desc") // Ordering by score, as defined in your Quote type
      .limit(limit);

    // 2. If a cursor is provided, start the query after that document
    if (startAfter) {
      quotesQuery = quotesQuery.startAfter(startAfter);
    }

    // 3. Execute the paginated query
    const quotesSnap = await quotesQuery.get();
    // --- END OF NEW LOGIC ---

    const quotes: Quote[] = quotesSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, // NEW: Pass the document ID
        comment: d.comment ?? "",
        author: d.author ?? "",
        url: d.url ?? "",
        helpfulness_score: d.helpfulness_score ?? 0,
        sentiment: d.sentiment ?? "",
        score: d.score ?? 0,
      };
    });

    // NEW: Determine the cursor for the *next* page
    const lastVisible = quotesSnap.docs[quotesSnap.docs.length - 1] || null;

    // MODIFIED: Return the product, the first batch of quotes, and the next cursor
    return { ...product, quotes, nextCursor: lastVisible };
  } catch (err) {
    console.error("getProductData error:", err);
    return null;
  }
});