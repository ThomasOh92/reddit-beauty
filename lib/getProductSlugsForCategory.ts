import { cache } from "react";
import { db } from "./firebaseAdmin";

export const getProductSlugsForCategory = cache(async function getProductSlugsForCategory(category: string){
    const snapshot = await db.collection(category).doc(`${category}-category`).collection('slugs').listDocuments();
    const slugs = snapshot.map(doc => doc.id);
    return slugs;
    }
)

export const getProductIdToSlugMapForCategory = cache(async function getProductIdToSlugMapForCategory(
    category: string
): Promise<Record<string, string>> {
    if (!category) return {};

    const baseRef = db.collection(category).doc(`${category}-category`);
    const slugsSnap = await baseRef.collection("slugs").get();

    const map: Record<string, string> = {};
    for (const doc of slugsSnap.docs) {
        const slug = doc.id;
        const data = doc.data() as { productId?: string };
        const productId = data?.productId;
        if (productId && slug) {
            map[productId] = slug;
        }
    }

    return map;
});