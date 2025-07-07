import { db } from "./firebaseAdmin";
import { Product, Discussion } from "../src/types";

type SkinTypeData = {
  id: string;
  discussions: Discussion[];
  products: Product[];
};

type CategoryData = {
  products?: Product[];
  discussions?: Discussion[];
  "skin-types"?: SkinTypeData[];
};

export async function getCategoryData(category: string): Promise<CategoryData | null> {
  if (!category) return null;

  try {
    const docRef = db.collection(category).doc(`${category}-category`);
    const collections = await docRef.listCollections();

    const result: CategoryData = {};

    for (const subcollection of collections) {
      const snapshot = await subcollection.get();

      if (subcollection.id === "products") {
        result.products = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug ?? "",
            product_name: data.product_name ?? "",
            image_url: data.image_url ?? "",
            positive_mentions: data.positive_mentions ?? 0,
            negative_mentions: data.negative_mentions ?? 0,
            ...data,
          } as Product;
        });
      }

      else if (subcollection.id === "discussions") {
        result.discussions = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            thread_url: data.thread_url ?? "",
            Subreddit: data.Subreddit ?? "",
            thread_title: data.thread_title ?? "",
            date: data.date ?? "",
            ...data,
          } as Discussion;
        });
      }
    }

    const hasSkinTypes = collections.some((c) => c.id === "skin-types");
    if (hasSkinTypes) {
      const skinTypeSnapshot = await docRef.collection("skin-types").get();
      const skinTypes: SkinTypeData[] = [];

      for (const doc of skinTypeSnapshot.docs) {
        const skinTypeRef = docRef.collection("skin-types").doc(doc.id);
        const subcollections = await skinTypeRef.listCollections();

        const skinTypeObj: SkinTypeData = {
          id: doc.id,
          discussions: [],
          products: [],
        };

        for (const subcollection of subcollections) {
          const subSnap = await subcollection.get();

          if (subcollection.id === "products") {
            skinTypeObj.products = subSnap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                slug: data.slug ?? "",
                product_name: data.product_name ?? "",
                image_url: data.image_url ?? "",
                positive_mentions: data.positive_mentions ?? 0,
                negative_mentions: data.negative_mentions ?? 0,
                ...data,
              } as Product;
            });
          }

          else if (subcollection.id === "discussions") {
            skinTypeObj.discussions = subSnap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                thread_url: data.thread_url ?? "",
                Subreddit: data.Subreddit ?? "",
                thread_title: data.thread_title ?? "",
                date: data.date ?? "",
                ...data,
              } as Discussion;
            });
          }
        }

        skinTypes.push(skinTypeObj);
      }

      result["skin-types"] = skinTypes;
    }

    return result;
  } catch (err) {
    console.error("getCategoryData error:", err);
    return null;
  }
}
