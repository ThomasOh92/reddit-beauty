import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { APP_URL } from "@/constants";
import { thoroughlyAnalysedProducts } from "../data";

type PageProps = {
  params: { slug: string };
};

const baseUrl = async () => {
  const host = (await headers()).get("host");
  if (!host) return APP_URL;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
};

const fetchLinkPreview = async (url: string) => {
  const response = await fetch(
    `${await baseUrl()}/api/link-preview?url=${encodeURIComponent(url)}`,
    { next: { revalidate: 86400 } }
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    url?: string;
  };
};

export default async function ThoroughlyAnalysedProductPage({ params }: PageProps) {
  const product = thoroughlyAnalysedProducts.find(
    (item) => item.slug === params.slug
  );

  if (!product) return notFound();

  const previews = await Promise.all(
    product.infoLinks.map(async (link) => {
      const preview = await fetchLinkPreview(link.url);
      return {
        ...link,
        title: preview?.title ?? link.label,
        description: preview?.description,
        image: preview?.image,
        siteName: preview?.siteName,
      };
    })
  );

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4">
      <section className="rounded-2xl border border-base-200 bg-[linear-gradient(125deg,#fff7ed,#f8fafc)] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="144px"
              className="object-contain p-2"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Thoroughly Analysed
            </div>
            <h1 className="text-xl font-bold text-neutral-900">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Category: {product.category}
            </p>
          </div>
        </div>
        {product.curatorNote && (
          <div className="mt-4 text-xs text-neutral-700">
            {product.curatorNote
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={`curator-note-${index}`} className="mt-2 first:mt-0">
                  {paragraph}
                </p>
              ))}
          </div>
        )}
      </section>

      <div className="mt-4 grid gap-4">

        <div>
          <div className="items-center">
            <h2 className="text-sm font-semibold text-neutral-900 text-center">Hand Picked Posts and Comments from Reddit</h2>
          </div>
          <div className="mt-4 grid gap-4">
            {product.redditThreads.map((thread) => (
              <article
                key={thread.id}
                className="rounded-xl border border-base-200 bg-slate-100 p-4"
              >
                <p className="text-[11px] font-semibold text-neutral-500">
                  {thread.headerParts.join(" | ")}
                </p>
                <p className="text-[11px] text-neutral-500">
                  Poster&apos;s details as of {product.lastChecked}: {thread.posterDetails}
                </p>
                <blockquote className="mt-3 space-y-3 border-l-3 border-neutral-300 pl-3 text-[11px] text-neutral-900">
                  {thread.excerpt
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={`${thread.id}-excerpt-${index}`} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                </blockquote>
                <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                  <a
                    href={thread.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-neutral"
                  >
                    Read on Reddit
                  </a>
                  {thread.additionalNote && (
                    <span className="w-full text-right text-xs text-neutral-500">
                      {thread.additionalNote}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-900 text-center">
            Carefully Curated Further Reading
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {previews.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-2 rounded-xl border border-base-200 bg-[#fff7ed] p-2 transition hover:border-neutral-300"
              >
                {link.image && (
                  <div className="overflow-hidden rounded-lg bg-base-200">
                    <img
                      src={link.image}
                      alt={link.title}
                      className="h-24 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="grid gap-1">
                  <div className="text-xs font-semibold text-neutral-900">
                    {link.title}
                  </div>
                  {link.description && (
                    <p className="line-clamp-2 text-[11px] text-neutral-600">
                      {link.description}
                    </p>
                  )}
                  <div className="text-[11px] text-neutral-400">
                    {link.siteName ?? new URL(link.url).hostname}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = thoroughlyAnalysedProducts.find(
    (item) => item.slug === params.slug
  );

  if (!product) {
    return {
      title: "Thoroughly Analysed - Not Found",
    };
  }

  const title = `${product.name} - Thoroughly Analysed`;
  const description =
    "A deep Reddit read on this product: what people praise, what they question, and how the value debate shakes out.";
  const canonical = `${APP_URL}/thoroughly-analysed/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: product.imageUrl, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.imageUrl],
    },
  };
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return thoroughlyAnalysedProducts.map((product) => ({
    slug: product.slug,
  }));
}
