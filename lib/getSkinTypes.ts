// lib/data/getAllCategories.ts
import { cache } from "react";
import { db } from "./firebaseAdmin";

export type SkinType = {
  id: string;
  skin_type: string;
};

function isExcludedSkinType(input: { id?: unknown; skin_type?: unknown }): boolean {
  const id = String(input?.id ?? "").trim().toLowerCase();
  const name = String(input?.skin_type ?? "").trim().toLowerCase();

  const excludedIds = new Set([
    "not-sure",
    "not_sure",
    "notsure",
    "not-sure-skin-type",
    "not_sure_skin_type",
  ]);
  const excludedNames = new Set([
    "not sure",
    "not-sure",
    "not sure skin type",
    "not sure-skin-type",
    "not-sure skin type",
    "notsure",
  ]);

  return excludedIds.has(id) || excludedNames.has(name);
}

export const getSkinTypes = cache(async function getSkinTypes(): Promise<SkinType[]> {
  const snapshot = await db.collection("skin-types").get();

  const skinTypes = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SkinType[];

  return skinTypes.filter((st) => !isExcludedSkinType(st));
});
