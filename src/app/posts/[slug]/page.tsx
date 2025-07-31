import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

// 👇 Static mode for SEO
export const dynamicParams = true;
export const revalidate = 3600;

const builder = imageUrlBuilder(client);
function urlFor(source: string) {
  return builder.image(source).url();
}

type Post = {
  title: string;
  body: PortableTextBlock[];
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
};

type Params = {
  slug: string;
};

// 🧠 1. Fetch single post by slug
const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      body
    }`,
    { slug }
  );
});

// 📄 2. Extract description
function extractPlainTextDescription(body: PortableTextBlock[]): string {
  return body
    .map((block) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children
          .map((child) => (typeof child.text === "string" ? child.text : ""))
          .join("");
      }
      return "";
    })
    .join(" ")
    .slice(0, 160);
}

// ⚙️ 3. generateStaticParams for pre-rendering static blog post pages
export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)]{
      slug
    }`
  );

  return slugs.map((s) => ({ slug: s.slug.current }));
}

// 🧠 4. Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<{
  title: string;
  description: string;
  openGraph?: { images: { url: string; alt: string }[] };
}> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
    };
  }

  const plainTextDescription = extractPlainTextDescription(post.body);

  return {
    title: post.title,
    description: plainTextDescription,
    openGraph: {
      images: post.mainImage
        ? [
            {
              url: urlFor(post.mainImage.asset._ref),
              alt: post.mainImage.alt || post.title,
            },
          ]
        : [],
    },
  };
}

// 🧾 5. Page Component
export default async function DeepDivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const plainTextDescription = extractPlainTextDescription(post.body);
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage.asset._ref)
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: plainTextDescription,
    ...(imageUrl && { image: imageUrl }),
    url: `https://beautyaggregate.com/posts/${slug}`,
  };

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <h1 className="font-bold m-2 text-neutral">{post.title}</h1>
      {post.mainImage && (
        <Image
          fetchPriority="high"
          priority={true}
          width={250}
          height={250}
          src={urlFor(post.mainImage.asset._ref)}
          alt={post.mainImage.alt || "Image"}
          className="w-full h-auto rounded-md"
        />
      )}
      <div className="card-body max-w-[600px] p-2 pl-0 prose prose-sm [&_p]:m-2 [&_p]:mt-0 [&_ul]:m-0 [&_blockquote]:m-0 [&_li]:m-0 [&_h1]:m-2 [&_h2]:m-2 [&_h3]:m-2 [&_h4]:m-2 [&_h5]:m-2 [&_h6]:m-2">
        <PortableText value={post.body} />
      </div>
    </div>
  );
}
