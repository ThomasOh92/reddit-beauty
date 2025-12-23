// lib/data/getAllCategories.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";

export type SkinType = {
  id: string;
  skin_type: string;
};

export const getSkinTypes = cache(async function getSkinTypes(): Promise<SkinType[]> {
  const snapshot = await db.collection("skin-types").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SkinType[];
});
