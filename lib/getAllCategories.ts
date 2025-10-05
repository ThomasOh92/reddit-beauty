// lib/data/getAllCategories.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";

export type Category = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  lastUpdated: string;
  type: string;
  thumbnailUrl?: string;
  readyForDisplay?: boolean;
  top_product?: {
    url: string;
    image_url: string;
    name: string;
  };
};

export const getAllCategories = cache(async function getAllCategories(): Promise<Category[]> {
  const snapshot = await db.collection("categories").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
});
