import { MetadataRoute } from "next";
import { db } from "../../lib/firebaseAdmin"; 
import { client } from "../sanity/lib/client";
import { groq } from "next-sanity";
import { APP_URL } from "@/constants";

export const dynamic = "force-dynamic";


// For top-level Sitemap entries
type SitemapEntry = { url: string; lastModified?: string };

// Category from Firestore
type CategoryDoc = {
  slug: string;
  lastUpdated?: string;
};

// Product docs from Firestore
type ProductDoc = {
  id: string;
  slug: string;
  lastUpdated?: string;
};

// Canonical for posts: always our site base + slug
function canonicalForPost(slug: string): string {
  return `${APP_URL}/posts/${slug}`;
}

// --- Helper: Fetch all categories ---
async function fetchCategories(): Promise<CategoryDoc[]> {
  try {
    const snap = await db.collection("categories").get();
    return snap.docs.map(doc => ({
      slug: doc.data().slug || doc.id,
      lastUpdated: doc.data().lastUpdated,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// --- Optimized: Batch fetch all data for a category ---
async function fetchCategoryDataOptimized(category: string): Promise<{
  products: ProductDoc[];
}> {
  try {
    const docRef = db.collection(category).doc(`${category}-category`);
    
    // Fetch products
    const productsSnap = await docRef.collection("products").get();

    const products: ProductDoc[] = productsSnap.docs.map(doc => ({
      id: doc.id,
      slug: doc.data().slug ?? doc.id,
      lastUpdated: doc.data().lastUpdated,
    }));

    return { products };
  } catch (error) {
    console.error(`Error fetching data for category ${category}:`, error);
    return { products: [] };
  }
}

// --- Main Sitemap Generation ---
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await generateSitemap();
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    // Return minimal sitemap on error
    return [
      { url: `${APP_URL}/` },
      { url: `${APP_URL}/about` },
      { url: `${APP_URL}/posts` },
      { url: `${APP_URL}/faq` },
      { url: `${APP_URL}/pdf-guide` }
    ];
  }
}

async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticEntries: SitemapEntry[] = [
    { url: `${APP_URL}/` },
    { url: `${APP_URL}/about` },
    { url: `${APP_URL}/posts` },
    { url: `${APP_URL}/faq` }
  ];

  // Parallel fetch of all data sources
  const [posts, categories] = await Promise.all([
    // Blog posts (Sanity)
    client.fetch(groq`*[_type == "post"
      && defined(slug.current)
      && defined(publishedAt)
      && publishedAt <= now()
      && !(_id in path("drafts.**"))
    ]{
      "slug": slug.current,
      "lastmod": coalesce(dateModified, publishedAt)
    }`),
    // Categories (Firestore)
    fetchCategories()
  ]);

  const postEntries: SitemapEntry[] = posts.map((post: { slug: string; lastmod?: string }) => ({
    url: canonicalForPost(post.slug),
    lastModified: post.lastmod,
  }));

  // Parallel fetch of all category data
  const categoryDataPromises = categories.map(category => 
    fetchCategoryDataOptimized(category.slug)
  );
  const categoryDataResults = await Promise.all(categoryDataPromises);

  const categoryEntries: SitemapEntry[] = [];
  const productEntries: SitemapEntry[] = [];

  categories.forEach((category, index) => {
    // Category page
    categoryEntries.push({
      url: `${APP_URL}/category/${category.slug}`,
    });

    const { products } = categoryDataResults[index];
    
    // All products for this category
    products.forEach(product => {
      productEntries.push({
        url: `${APP_URL}/category/${category.slug}/${product.slug}`,
      });
    });
  });

  return [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...productEntries,
  ];
}
