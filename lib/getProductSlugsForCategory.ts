import { cache } from "react";
import { db } from "./firebaseAdmin";

export const getProductSlugsForCategory = cache(async function getProductSlugsForCategory(category: string){
    const snapshot = await db.collection(category).doc(`${category}-category`).collection('slugs').listDocuments();
    const slugs = snapshot.map(doc => doc.id);
    return slugs;
    }
)