import React from "react";
import { client } from "../../sanity/lib/client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";

export const dynamicParams = true;
export const revalidate = 3600;

const builder = imageUrlBuilder(client);

function urlFor(source: string) {
  return builder.image(source).url();
}

type Post = {
  _id: string;
  title: string;
  body?: PortableTextBlock[];
  mainImage?: { asset?: { _ref?: string } };
  slug: { current: string };
  categories?: { title?: string }[] | null;
};

function getExcerpt(body?: PortableTextBlock[]): string {
  if (!body || !Array.isArray(body)) return "";
  const firstBlock = body.find(
    (block) => block._type === "block" && Array.isArray(block.children)
  );
  if (!firstBlock || !("children" in firstBlock)) return "";
  // children is PortableTextSpan[]
  const text = (firstBlock.children as { text?: string }[])
    .map((child) => child.text || "")
    .join("");
  return text.slice(0, 120) + (text.length > 120 ? "..." : "");
}

// Helper to normalize categories to an array of strings
function getCategoryTitles(categories: Post["categories"]): string[] {
  if (!categories || !Array.isArray(categories) || categories.length === 0) return ["Uncategorized"];
  return categories.map((cat) => (cat && cat.title ? cat.title : "Uncategorized"));
}

export default async function PostsPage() {
  const posts: Post[] = await client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      body,
      mainImage,
      slug,
      categories[]->{
        title
      }
    }`
  );

  // Group posts by category
  const categoryMap: Record<string, Post[]> = {};
  posts.forEach((post) => {
    const categories = getCategoryTitles(post.categories);
    categories.forEach((cat) => {
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(post);
    });
  });

  const categoryNames = Object.keys(categoryMap);


  const overviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Reddit Beauty and Skincare | Blog",
    "url": "https://redditbeauty.com/posts",
    "description": "Deep dives, data breakdowns, and honest skincare discussions from the Reddit Beauty team.",
    "blogPost": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://redditbeauty.com/posts/${post.slug.current}`,
      ...(post.mainImage?.asset?._ref && {
        "image": urlFor(post.mainImage.asset._ref)
      }),
      "description": getExcerpt(post.body),
    })),
  };


  return (
    <main className="max-w-[600px] mx-auto px-4 py-4 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(overviewJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <h1 className="text-2xl font-bold text-center mb-6">Blog Posts</h1>
      {categoryNames.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="text-sm mb-4 font-semibold text-info-content text-center">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryMap[cat].map((post) => (
              <Link
                key={post._id}
                href={`/posts/${post.slug.current}`}
                className="card bg-base-100 shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col h-full"
              >
                {post.mainImage?.asset?._ref && (
                  <Image
                    className="h-30 w-full object-cover"
                    src={urlFor(post.mainImage.asset._ref)}
                    alt={post.title}
                    width={250}
                    height={100}
                  />
                )}
                <div className="p-4 flex flex-col h-full">
                  <h3 className="text-m font-semibold mb-2">{post.title}</h3>
                  <p className="flex-grow text-gray-700 text-xs">{getExcerpt(post.body)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
