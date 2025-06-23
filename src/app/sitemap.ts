import { MetadataRoute } from "next";
import { db } from "../../lib/firebaseAdmin"; 
import { client } from "../sanity/lib/client";
import { groq } from "next-sanity";
import { APP_URL } from "@/constants";

// --- Helper: Fetch all categories ---
async function fetchCategories() {
  const snap = await db.collection("categories").get();
  return snap.docs.map(doc => ({
    slug: doc.data().slug || doc.id,
    lastUpdated: doc.data().lastUpdated,
  }));
}

// --- Helper: Fetch all subcollections under category ---
async function fetchAllSubcollections(category: string) {
  const docRef = db.collection(category).doc(`${category}-category`);
  const collections = await docRef.listCollections();

  const result: Record<string, any[]> = {};
  for (const subcollection of collections) {
    const snapshot = await subcollection.get();
    result[subcollection.id] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
  return result;
}

// --- Helper: Fetch skin type subcollections (deep structure) ---
async function fetchSkinTypeData(category: string) {
  const collectionRef = db.collection(category).doc(`${category}-category`).collection("skin-types");
  const snapshot = await collectionRef.get();
  const result: any[] = [];

  for (const doc of snapshot.docs) {
    const docRef = collectionRef.doc(doc.id);
    const productsCollection = docRef.collection("products");
    const productsSnapshot = await productsCollection.get();
    const subresult: Record<string, any> = { id: doc.id };
    subresult["products"] = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    result.push(subresult);
  }
  return result;
}

// --- Main Sitemap Generation ---
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- 1. Static pages ---
  const staticEntries = [
    { url: `${APP_URL}/` },
    { url: `${APP_URL}/about` },
    { url: `${APP_URL}/posts` },
  ];

  // --- 2. Blog Posts (Sanity) ---
  const posts: { slug: { current: string }; publishedAt: string }[] = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)]{slug, publishedAt}`
  );
  const postEntries = posts.map((post) => ({
    url: `${APP_URL}/posts/${post.slug.current}`,
    lastModified: post.publishedAt
  }));

  // --- 3. Categories + Products (Firestore) ---
  const categories = await fetchCategories();

  const categoryEntries = [];
  const productEntries = [];

  for (const category of categories) {
    // Category page
    categoryEntries.push({
      url: `${APP_URL}/category/${category.slug}`
      // lastModified: product.lastUpdated ? new Date(product.lastUpdated).toISOString() : undefined, // Uncomment if you have lastUpdated field
    });

    // Subcollections
    const subcollectionsData = await fetchAllSubcollections(category.slug);

    // Products subcollection
    if (subcollectionsData.products) {
      for (const product of subcollectionsData.products) {
        productEntries.push({
          url: `${APP_URL}/category/${category.slug}/${product.slug}`
          // lastModified: product.lastUpdated ? new Date(product.lastUpdated).toISOString() : undefined, // Uncomment if you have lastUpdated field
        });
      }
    }

    // Special Mentions Subcollection
    if (subcollectionsData["special-mentions"]) {
      for (const mention of subcollectionsData["special-mentions"]) {
        productEntries.push({
          url: `${APP_URL}/category/${category.slug}/${mention.slug}`,
          //   lastModified: mention.lastUpdated ? new Date(mention.lastUpdated).toISOString() : undefined,
        });
      }
    }

    // Skin-types subcollection (if present, with deeper links if needed)
    if (subcollectionsData["skin-types"]) {
      // Deep fetch for each skin type (see your API)
      const skinTypeData = await fetchSkinTypeData(category.slug);
      for (const skinType of skinTypeData) {
        for (const [sub, items] of Object.entries(skinType)) {
          if (sub === "id") continue;
          for (const item of items as any[]) {
            // e.g. /category/{category.slug}/skin-types/{skinType.id}/{sub}/{item.id}
            productEntries.push({
                url: `${APP_URL}/category/${category.slug}/${item.slug}`
            //   lastModified: item.lastUpdated ? new Date(item.lastUpdated).toISOString() : undefined,
            });
          }
        }
      }
    }
  }

  return [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...productEntries,
  ];
}
