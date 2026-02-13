import { MetadataRoute } from "next";
import { db } from "../../lib/firebaseAdmin"; 
import { client } from "../sanity/lib/client";
import { groq } from "next-sanity";
import { APP_URL } from "@/constants";
import { thoroughlyAnalysedProducts } from "./thoroughly-analysed/data";

export const dynamic = "force-dynamic";


// For top-level Sitemap entries
type SitemapEntry = { url: string; lastModified?: string };

// Category from Firestore
type CategoryDoc = {
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

// --- Main Sitemap Generation ---
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await generateSitemap();
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    // Return minimal sitemap on error
    return [
      { url: `${APP_URL}` },
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
    { url: `${APP_URL}` },
    { url: `${APP_URL}/about` },
    { url: `${APP_URL}/posts` },
    { url: `${APP_URL}/faq` },
    { url: `${APP_URL}/pdf-guide` }
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

  const thoroughlyAnalysedEntries: SitemapEntry[] = [
    { url: `${APP_URL}/thoroughly-analysed` },
    ...thoroughlyAnalysedProducts.map((product) => ({
      url: `${APP_URL}/thoroughly-analysed/${product.slug}`,
    })),
  ];

  const categoryEntries: SitemapEntry[] = [];

  categories.forEach((category) => {
    // Category page
    categoryEntries.push({
      url: `${APP_URL}/category/${category.slug}`,
    });
  });

  return [
    ...staticEntries,
    ...postEntries,
    ...thoroughlyAnalysedEntries,
    ...categoryEntries,
  ];
}
