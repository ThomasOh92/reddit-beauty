import { db } from "./firebaseAdmin";
import { FieldPath } from "firebase-admin/firestore";
import type { Product } from "../src/types";

type ProductUrlFields = Pick<
  Product,
  | "id"
  | "product_name"
  | "image_url"
  | "amazon_url_us"
  | "amazon_url_uk"
  | "sephora_url"
  | "fallback_url"
>;

/**
 * Fetch only the product docs we need for a category (chunked by 10 IDs due to Firestore `in` limits).
 * Matches the same Firestore path used by getCategoryData():
 *   {category}/{category}-category/products/{productId}
 */
export async function getCategoryProductsByIds(
  category: string,
  productIds: string[]
): Promise<Map<string, ProductUrlFields>> {
  if (!category) return new Map();

  const ids = Array.from(new Set((productIds || []).filter(Boolean)));
  if (ids.length === 0) return new Map();

  const baseRef = db.collection(category).doc(`${category}-category`);
  const productsCol = baseRef.collection("products");

  const out = new Map<string, ProductUrlFields>();

  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    if (chunk.length === 0) continue;

    const snap = await productsCol
      .where(FieldPath.documentId(), "in", chunk)
      .get();

    for (const doc of snap.docs) {
      const d = doc.data() as Partial<Product>;
      out.set(doc.id, {
        id: doc.id,
        product_name: d?.product_name ?? "",
        image_url: d?.image_url ?? "",
        amazon_url_us: d?.amazon_url_us,
        amazon_url_uk: d?.amazon_url_uk,
        sephora_url: d?.sephora_url,
        fallback_url: d?.fallback_url,
      });
    }
  }

  return out;
}
