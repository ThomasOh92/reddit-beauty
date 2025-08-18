import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Post } from "../../../types"; 

// 👇 Static mode for SEO
export const dynamicParams = true;
export const revalidate = 3600;

const builder = imageUrlBuilder(client);
function urlFor(source: string) {
  return builder.image(source).url();
}

type Params = {
  slug: string;
};

// Minimal JSON-LD type helper
type JsonLd = { [key: string]: unknown };

// 🧠 1. Fetch single post by slug
const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      _createdAt,
      title,
      "slug": slug.current,
      body,
      excerpt,
      mainImage{asset, alt},
      publishedAt,
      dateModified,
      locale,

      // Relations
      author->{ _id, name, "slug": slug.current, image{asset, alt} },
      primaryCategory->{ _id, title, "slug": slug.current },
      categories[]->{ _id, title, "slug": slug.current },
      tags,
      relatedPosts[]->{ _id, title, "slug": slug.current, publishedAt, mainImage{asset, alt} },
      relatedLinks[]{ title, url, description },

      // Rich-result content
      faq[]{ question, answer },
      howTo{
        title,
        intro,
        totalTime,
        steps[]{ title, body, image{asset, alt} }
      },
      reviewBlock{ itemName, ratingValue, ratingCount },

      // E-E-A-T / Sources
      sources[]{ title, publisher, url, rel },
      reviewedBy->{ _id, name, "slug": slug.current, image{asset, alt} },
      lastReviewedAt,

      // SEO & Social
      seo{
        metaTitle,
        metaDescription,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage{asset, alt},
        twitterCard,
        structuredData
      },
      featured,
      ogImage{asset, alt},

      // Redirect & misc
      previousSlugs,
      readingTime
    }`,
    { slug }
  );
});

// Support 301 redirects from any previousSlugs
const getCanonicalSlugFromPrevious = cache(async (slug: string): Promise<string | null> => {
  return client.fetch(
    groq`*[_type == "post" && $slug in previousSlugs][0]{
      "slug": slug.current
    }.slug`,
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

// Full plaintext for word counting / timeRequired
function extractPlainTextFull(body: PortableTextBlock[]): string {
  return body
    .map((block) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children
          .map((child) => (typeof child.text === "string" ? child.text : ""))
          .join("");
      }
      return "";
    })
    .join(" ");
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
}): Promise<Metadata> {
  const { slug } = await params;
  let post = await getPostBySlug(slug);

  // If not found by current slug, see if this slug is an old one and redirect
  if (!post) {
    const canonical = await getCanonicalSlugFromPrevious(slug);
    if (canonical) {
      // Permanent redirect for SEO hygiene
      redirect(`/posts/${canonical}`);
    }
  }

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
    };
  }

  const baseUrl = "https://www.beautyaggregate.com";
  const url = `${baseUrl}/posts/${post.slug}`;

  const fallbackDesc = extractPlainTextDescription(post.body);
  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt || fallbackDesc;

  // Choose best image (seo.ogImage > ogImage > mainImage)
  const bestImageRef = post.seo?.ogImage?.asset?._ref
    || post.ogImage?.asset?._ref
    || post.mainImage?.asset?._ref;
  const bestImageAlt = post.seo?.ogImage?.alt || post.ogImage?.alt || post.mainImage?.alt || post.title;
  const bestImageUrl = bestImageRef ? urlFor(bestImageRef) : undefined;

  // Normalise twitter card to allowed values
  const twitterCard: "summary" | "summary_large_image" =
    post.seo?.twitterCard === "summary" || post.seo?.twitterCard === "summary_large_image"
      ? post.seo.twitterCard
      : "summary_large_image";

  // Guard canonical to HTTPS absolute only; otherwise fallback to local URL
  const canonicalFromCms = post.seo?.canonicalUrl;
  const canonicalUrl = canonicalFromCms && /^https:\/\/.+/i.test(canonicalFromCms)
    ? canonicalFromCms
    : url;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: post.tags && post.tags.length ? post.tags.slice(0, 5) : undefined,
    alternates: {
  canonical: canonicalUrl,
    },
    twitter: {
      card: twitterCard,
      title: post.seo?.ogTitle || metaTitle,
      description: post.seo?.ogDescription || metaDescription,
      images: bestImageUrl ? [bestImageUrl] : undefined,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.seo?.ogTitle || metaTitle,
      description: post.seo?.ogDescription || metaDescription,
      images: bestImageUrl ? [{ url: bestImageUrl, alt: bestImageAlt }] : [],
      locale: post.locale || 'en-GB',
      siteName: 'Beauty Aggregate',
      publishedTime: post.publishedAt,
      modifiedTime: post.dateModified || post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags && post.tags.length ? post.tags.slice(0, 5) : undefined,
      section: post.primaryCategory?.title,
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
  let post = await getPostBySlug(slug);

  if (!post) {
    const canonical = await getCanonicalSlugFromPrevious(slug);
    if (canonical) {
      redirect(`/posts/${canonical}`);
    }
  }

  if (!post) {
    notFound();
  }

  const baseUrl = "https://www.beautyaggregate.com";
  const pageUrl = `${baseUrl}/posts/${post.slug}`;
  const description = post.seo?.metaDescription || post.excerpt || extractPlainTextDescription(post.body);
  const heroImgRef = post.seo?.ogImage?.asset?._ref || post.ogImage?.asset?._ref || post.mainImage?.asset?._ref;
  const heroImgUrl = heroImgRef ? urlFor(heroImgRef) : undefined;
  const imgAlt = post.seo?.ogImage?.alt || post.ogImage?.alt || post.mainImage?.alt || post.title;

  // Compute wordCount & timeRequired (reading time)
  const fullText = extractPlainTextFull(post.body);
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingMinutes = post.readingTime ?? Math.max(1, Math.round(wordCount / 200));

  // BlogPosting JSON-LD
  const articleJsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    inLanguage: post.locale || 'en-GB',
    ...(heroImgUrl && { image: heroImgUrl }),
    url: pageUrl,
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.dateModified && { dateModified: post.dateModified }),
    ...(post.author?.name && { author: { "@type": "Person", name: post.author.name } }),
    ...(post.reviewedBy?.name && { editor: { "@type": "Person", name: post.reviewedBy.name } }),
    ...(post.primaryCategory?.title && { articleSection: post.primaryCategory.title }),
    ...(post.tags && post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(readingMinutes ? { timeRequired: `PT${readingMinutes}M` } : {}),
  };

  // AggregateRating if provided
  if (post.reviewBlock?.ratingValue && post.reviewBlock?.ratingCount) {
    articleJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: post.reviewBlock.ratingValue,
      ratingCount: post.reviewBlock.ratingCount,
    };
  }

  // FAQPage JSON-LD
  const faqJsonLd = post.faq && post.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.question || '',
          acceptedAnswer: { "@type": "Answer", text: f.answer || '' },
        })),
      }
    : null;

  // HowTo JSON-LD
  function blocksToPlainText(blocks?: PortableTextBlock[]): string {
    if (!blocks) return '';
    return extractPlainTextDescription(blocks);
  }
  const howToJsonLd = post.howTo && post.howTo.steps && post.howTo.steps.length >= 2
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: post.howTo.title || post.title,
        description: post.howTo.intro || undefined,
        totalTime: post.howTo.totalTime || undefined,
        step: post.howTo.steps.map((s) => ({
          "@type": "HowToStep",
          name: s.title || undefined,
          text: blocksToPlainText(s.body),
          ...(s.image?.asset?._ref ? { image: urlFor(s.image.asset._ref) } : {}),
        })),
      }
    : null;

  // Breadcrumbs JSON-LD
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    { "@type": "ListItem", position: 2, name: "Posts", item: `${baseUrl}/posts` },
  ];
  if (post.primaryCategory?.title && post.primaryCategory?.slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: post.primaryCategory.title,
      item: `${baseUrl}/category/${post.primaryCategory.slug}`,
    });
  }
  breadcrumbItems.push({ "@type": "ListItem", position: breadcrumbItems.length + 1, name: post.title, item: pageUrl });
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
      {/* Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* FAQ (optional) */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {/* HowTo (optional) */}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {/* Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsJsonLd).replace(/</g, "\\u003c"),
        }}
      />
  {/* Custom SEO structured data override removed per user preference */}

      <div className="flex flex-col items-center">
        <h1 className="font-bold m-2 text-neutral text-center mx-4">{post.title}</h1>
        <div className="text-[10px] text-gray-600 mb-4 text-center">
            {post.publishedAt && <span>Published: {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
            {post.dateModified && <span> • Updated: {new Date(post.dateModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
        </div>
        {(() => {
          const ref = post.mainImage?.asset?._ref;
          if (!ref) return null;
          return (
        <Image
          fetchPriority="high"
          priority={true}
          width={250}
          height={250}
          src={urlFor(ref)}
          alt={post.mainImage?.alt || "Image"}
          className="rounded-md h-[250px] w-[250px] object-cover mb-1"
        />
          );
        })()}
      </div>

      {/* FAQs */}
      {post.faq && post.faq.length > 0 && (
          <div className="mx-auto mb-4 mt-4 max-w-[450px]"> 
            <div className="card border">
            {post.faq.map((item, index) => {
              if (typeof item === 'string') return null;
              return (
                <div key={index} className="collapse collapse-arrow">
                  <input type="radio" name={`faq-accordion`}/>
                  <div className="collapse-title font-semibold text-xs">{item.question}</div>
                  <div className="collapse-content text-xs">{item.answer}</div>
                </div>
              );
            })}
            </div>
          </div>
        )}

      {/* Main Body */}
      <div className="max-w-[600px] prose prose-xs text-[12px] m-2 [&_p]:mb-2 [&_p]:mt-4 [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:font-normal [&_a]:not-italic [&_a]:text-[12px] [&_a]:text-gray-400 [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 [&_a]:decoration-gray-300 [&_blockquote]:font-normal [&_blockquote]:not-italic [&_blockquote]:text-[12px] [&_blockquote]:text-inherit">
        <PortableText value={post.body} />
      </div>

      {/* How to Steps */}
      <div className="divider"></div>

      <div className="mx-2 mb-4 max-w-[450px] mx-auto"> 
        <h2 className="text-m font-bold mt-4 mb-2 text-center"><strong className="text-secondary">Bonus:</strong> {post.howTo?.title}</h2>
        <div className="card border bg-secondary-content">
            {post.howTo?.steps && post.howTo.steps.length > 0 ? (
            <ul className="m-4 mx-6">
            {post.howTo.steps.map((step, index) => (
              <div key={index} className="mb-4">
                <li className="list-decimal text-xs font-bold">{step.title}</li>
                <div className="prose text-[11px]">
                  {step.body && <PortableText value={step.body} />}
                </div>
              </div>
            ))}
            </ul>
          ) : (
            " No application tips available."
          )}
        </div>
      </div>

      {/* Related Posts and Links */}
      <div className="divider"></div>
          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div>
              <h2 className="text-sm font-bold ml-2">Related Posts</h2>
              <ul className="menu menu-horizontal pt-1">
                {post.relatedPosts.map((relatedPost) => (
                  <li key={relatedPost._id} className="bg-base-300 rounded-box m-1">
                    <a href={`/posts/${relatedPost.slug}`} className="text-xs mb-1">
                      {relatedPost.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Links */}
          {post.relatedLinks && post.relatedLinks.length > 0 && (
            <div>
              <h2 className="text-sm font-bold ml-2 mt-2">Related Links</h2>
              <ul className="menu menu-horizontal pt-1">
                {post.relatedLinks.map((link, index) => (
                  <li key={index} className="bg-base-300 rounded-box m-1">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs"
                      title={link.description}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        
              {/* Sources */}
      {post.sources && post.sources.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold ml-2 mt-2 mb-2">Sources</h2>
          <ul className="text-[10px] text-gray-600 ml-4">
            {post.sources.map((source, index) => (
              <li key={index} className="mb-1 line-clamp-1">
                {source.url ? (
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {source.title}
                    {source.publisher && ` - ${source.publisher}`}
                  </a>
                ) : (
                  <span>
                    {source.title}
                    {source.publisher && ` - ${source.publisher}`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="divider"></div>
      {/* Author, Sources, and Review Info */}
      <div className="text-[10px] text-gray-600 mb-4 ml-2">
        {post.author?.name && <span> • Author: {post.author.name}</span>}
        <br />
        {post.reviewedBy?.name && <span> • Editor: {post.reviewedBy.name}</span>}
        {post.lastReviewedAt && <span>, last reviewed on {new Date(post.lastReviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
        <br />
        {readingMinutes && <span> • Reading Time: {readingMinutes} minutes</span>}
      </div>



    </div>
  );
}
