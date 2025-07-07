// lib/data/getAllCategories.ts
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
};

export async function getAllCategories(): Promise<Category[]> {
  const snapshot = await db.collection("categories").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}
