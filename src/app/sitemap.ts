import { MetadataRoute } from "next";
import { APP_URL } from "@/constants";
import { client } from "../sanity/lib/client";
import { groq } from "next-sanity";

type Post = {
    slug: { current: string };
    publishedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    //===============================
    // PRODUCTS SITEMAP GENERATION
    // Fetch all products
    const productsRes = await fetch(`${APP_URL}/api/getAllProductsData`);
    const productsJSON = await productsRes.json();
    const products = productsJSON.data as Array<{
        slug: string;
        category: string;
        skinType?: string;
        specialMention?: boolean;
        // lastUpdated: string; **FUTURE OPTIMIZATION > ONCE WE HAVE A LAST UPDATED FIELD
    }>;

    // Build sitemap entries for each product
    const productEntries = products.map((product) => ({
        url: `${APP_URL}/category/${product.category}/${product.slug}`
    }))


    //===============================
    // CATEGORY SITEMAP GENERATION
    // Fetch all categories
    const categoriesRes = await fetch(`${APP_URL}/api/getData`);
    const categoriesJSON = await categoriesRes.json();
    const categories = categoriesJSON.data as Array<{
        slug: string;
        lastUpdated: string;
    }>;

    // Build sitemap entries for each category
    const categoryEntries = categories.map((cat) => ({
        url: `${APP_URL}/category/${cat.slug}`,
        lastModified: cat.lastUpdated,
    }));

    //===============================
    // BLOG POSTS SITEMAP GENERATION
    // Fetch all posts
    const posts: Post[] = await client.fetch(
        groq`*[_type == "post" && defined(slug.current)]{
            slug,
            publishedAt
        }`
    );

    // Build sitemap entries for each post
    const postEntries = posts.map((post) => ({
        url: `${APP_URL}/posts/${post.slug.current}`,
        lastModified: post.publishedAt,
    }));

    //===============================
    // STATIC PAGES
    // Add static pages if needed (e.g. about)
    const staticEntries = [
        { url: `${APP_URL}/` },
        { url: `${APP_URL}/about` },
        { url: `${APP_URL}/posts` }
    ];

    return [
        ...staticEntries,
        ...postEntries,
        ...categoryEntries,
        ...productEntries
    ];
}