import { MetadataRoute } from "next";
import { db } from "../../lib/firebaseAdmin"; 
import { client } from "../sanity/lib/client";
import { groq } from "next-sanity";
import { APP_URL } from "@/constants";

// For top-level Sitemap entries
type SitemapEntry = { url: string; lastModified?: string };

// Category from Firestore
type CategoryDoc = {
  slug: string;
  lastUpdated?: string;
};

// Product and Special Mention docs from Firestore
type ProductDoc = {
  id: string;
  slug: string;
  lastUpdated?: string;
};

// SkinType structure
type SkinTypeDoc = {
  id: string;
  products: ProductDoc[];
};

// --- Helper: Fetch all categories ---
async function fetchCategories(): Promise<CategoryDoc[]> {
  const snap = await db.collection("categories").get();
  return snap.docs.map(doc => ({
    slug: doc.data().slug || doc.id,
    lastUpdated: doc.data().lastUpdated,
  }));
}

// --- Helper: Fetch all subcollections under category ---
type SubcollectionsResult = {
  products?: ProductDoc[];
  "special-mentions"?: ProductDoc[];
  "skin-types"?: unknown[]; // will fetch in detail below
};

async function fetchAllSubcollections(category: string): Promise<SubcollectionsResult> {
  const docRef = db.collection(category).doc(`${category}-category`);
  const collections = await docRef.listCollections();

  const result: SubcollectionsResult = {};
  for (const subcollection of collections) {
    const snapshot = await subcollection.get();
    if (subcollection.id === "products" || subcollection.id === "special-mentions") {
      result[subcollection.id] = snapshot.docs.map((doc) => ({
        id: doc.id,
        slug: doc.data().slug ?? doc.id,
        lastUpdated: doc.data().lastUpdated,
      }));
    } else if (subcollection.id === "skin-types") {
      // handled later
      result["skin-types"] = snapshot.docs.map((doc) => ({ id: doc.id }));
    }
  }
  return result;
}

// --- Helper: Fetch skin type subcollections (deep structure) ---
async function fetchSkinTypeData(category: string): Promise<SkinTypeDoc[]> {
  const collectionRef = db.collection(category).doc(`${category}-category`).collection("skin-types");
  const snapshot = await collectionRef.get();
  const result: SkinTypeDoc[] = [];

  for (const doc of snapshot.docs) {
    const docRef = collectionRef.doc(doc.id);
    const productsCollection = docRef.collection("products");
    const productsSnapshot = await productsCollection.get();
    const products: ProductDoc[] = productsSnapshot.docs.map((prod) => ({
      id: prod.id,
      slug: prod.data().slug ?? prod.id,
      lastUpdated: prod.data().lastUpdated,
    }));
    result.push({ id: doc.id, products });
  }
  return result;
}

// --- Main Sitemap Generation ---
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticEntries: SitemapEntry[] = [
    { url: `${APP_URL}/` },
    { url: `${APP_URL}/about` },
    { url: `${APP_URL}/posts` },
  ];

  // Blog posts (Sanity)
  const posts: { slug: { current: string }; publishedAt: string }[] = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)]{slug, publishedAt}`
  );
  const postEntries: SitemapEntry[] = posts.map((post) => ({
    url: `${APP_URL}/posts/${post.slug.current}`,
    lastModified: post.publishedAt,
  }));

  // Categories + Products (Firestore)
  const categories = await fetchCategories();

  const categoryEntries: SitemapEntry[] = [];
  const productEntries: SitemapEntry[] = [];

  for (const category of categories) {
    // Category page
    categoryEntries.push({
      url: `${APP_URL}/category/${category.slug}`,
      // lastModified: category.lastUpdated ? new Date(category.lastUpdated).toISOString() : undefined,
    });

    const subcollectionsData = await fetchAllSubcollections(category.slug);

    // Products subcollection
    if (subcollectionsData.products) {
      for (const product of subcollectionsData.products) {
        productEntries.push({
          url: `${APP_URL}/category/${category.slug}/${product.slug}`,
          // lastModified: product.lastUpdated ? new Date(product.lastUpdated).toISOString() : undefined,
        });
      }
    }

    // Special Mentions subcollection
    if (subcollectionsData["special-mentions"]) {
      for (const mention of subcollectionsData["special-mentions"]) {
        productEntries.push({
          url: `${APP_URL}/category/${category.slug}/${mention.slug}`,
          // lastModified: mention.lastUpdated ? new Date(mention.lastUpdated).toISOString() : undefined,
        });
      }
    }

    // Skin-types subcollection
    if (subcollectionsData["skin-types"]) {
      const skinTypeData = await fetchSkinTypeData(category.slug);
      for (const skinType of skinTypeData) {
        for (const item of skinType.products) {
          productEntries.push({
            url: `${APP_URL}/category/${category.slug}/${item.slug}`,
            // lastModified: item.lastUpdated ? new Date(item.lastUpdated).toISOString() : undefined,
          });
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
