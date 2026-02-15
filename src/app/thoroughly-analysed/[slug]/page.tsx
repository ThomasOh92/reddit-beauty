import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { APP_URL } from "@/constants";
import type { LinkEvidenceAtom } from "../data";
import { thoroughlyAnalysedProducts } from "../data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const baseUrl = async () => APP_URL;

const isInstagramUrl = (url: string) => {
  try {
    const { hostname } = new URL(url);
    const normalizedHost = hostname.toLowerCase();
    return normalizedHost === "instagram.com" || normalizedHost === "www.instagram.com";
  } catch {
    return false;
  }
};

const fetchLinkPreview = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(
      `${await baseUrl()}/api/link-preview?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 86400 }, signal: controller.signal }
    );
    clearTimeout(timeoutId);

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
  } catch {
    return null;
  }
};

export default async function ThoroughlyAnalysedProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = thoroughlyAnalysedProducts.find(
    (item) => item.slug === slug
  );

  if (!product) return notFound();

  const linkAtoms = product.molecules.flatMap((molecule) =>
    molecule.atoms.filter(
      (atom): atom is LinkEvidenceAtom => atom.kind === "link"
    )
  );

  const uniqueLinkAtoms = Array.from(
    new Map(linkAtoms.map((atom) => [atom.url, atom])).values()
  );

  const previews = await Promise.all(
    uniqueLinkAtoms.map(async (link) => {
      if (isInstagramUrl(link.url)) {
        return {
          ...link,
          title: link.label,
          description: undefined,
          image: undefined,
          siteName: "Instagram",
        };
      }

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

  const previewByUrl = new Map(
    previews.map((preview) => [preview.url, preview])
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
            {product.productLink && (
              <a
                href={product.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-neutral mt-3 w-full text-white"
              >
                See Product
              </a>
            )}
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
        {product.molecules.map((molecule) => (
          <section
            key={molecule.id}
            className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm"
          >
            <h2 className="mt-1 text-sm font-semibold text-neutral-900">
              {molecule.point}
            </h2>
            {molecule.commentary && (
              <p className="mt-1 text-xs text-neutral-600">{molecule.commentary}</p>
            )}
            <div className="mt-3 grid gap-2">
              {molecule.atoms.map((atom) => {
                if (atom.kind === "reddit") {
                  return (
                    <article
                      key={atom.id}
                      className="rounded-xl bg-error/10 px-3 py-2"
                    >
                      <div className="flex gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg flex items-center justify-center">
                          <img
                            src="/reddit-icon.png"
                            alt="Reddit"
                            className="h-8 w-8 object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-[11px] font-semibold text-neutral-500">
                            {atom.headerParts.join(" | ")}
                          </p>
                          <p className="line-clamp-1 text-[11px] text-neutral-500">
                            Poster&apos;s details as of {product.lastChecked}: {atom.posterDetails}
                          </p>
                          {atom.commentary && (
                            <p className="line-clamp-1 text-[11px] text-neutral-700">
                              {atom.commentary}
                            </p>
                          )}
                          <details>
                            <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                              Read Quote
                            </summary>
                            <blockquote className="mt-3 space-y-3 border-l-3 border-neutral-300 pl-3 text-[11px] text-neutral-900">
                              {atom.excerpt
                                .split(/\n\s*\n/)
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                  <p
                                    key={`${atom.id}-excerpt-${index}`}
                                    className="whitespace-pre-line"
                                  >
                                    {paragraph}
                                  </p>
                                ))}
                            </blockquote>
                            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                              {atom.additionalNote && (
                                <span className="w-full text-right text-xs text-neutral-500">
                                  {atom.additionalNote}
                                </span>
                              )}
                              <a
                                href={atom.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-neutral"
                              >
                                Read on Reddit
                              </a>
                            </div>
                          </details>
                        </div>
                      </div>
                    </article>
                  );
                }

                if (atom.kind === "instagramLink") {
                  return (
                    <article
                      key={atom.id}
                      className="rounded-xl bg-secondary/10 px-3 py-2"
                    >
                      <a
                        href={atom.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex gap-3 transition hover:opacity-90"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <img
                            src="/instagram-icon.png"
                            alt="Instagram"
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold text-neutral-500">
                            Instagram
                          </div>
                          <div className="text-[11px] font-semibold text-neutral-900">
                            {atom.user}
                          </div>
                          <p className="line-clamp-1 text-[11px] text-neutral-500">
                            {atom.excerptFromDescription}
                          </p>
                          {atom.commentary && (
                            <p className="line-clamp-1 text-[11px] text-neutral-700">
                              {atom.commentary}
                            </p>
                          )}
                        </div>
                      </a>
                      {atom.additionalNote && (
                        <details className="mt-2 rounded-lg border border-base-200 bg-white p-2">
                          <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                            See Note from Thorough Beauty
                          </summary>
                          <p className="mt-2 whitespace-pre-line text-[11px] text-neutral-600">
                            {atom.additionalNote}
                          </p>
                        </details>
                      )}
                    </article>
                  );
                }

                const preview = previewByUrl.get(atom.url);
                const isInstagram = isInstagramUrl(atom.url);
                const thumbnailSrc = isInstagram ? "/instagram-icon.png" : preview?.image;

                return (
                  <article
                    key={atom.id}
                    className="rounded-xl bg-info/10 px-3 py-2"
                  >
                    <a
                      href={atom.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-3 transition hover:opacity-90"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-200">
                        {thumbnailSrc && (
                          <img
                            src={thumbnailSrc}
                            alt={preview?.title ?? atom.label}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-neutral-500">
                          {isInstagram ? "Instagram" : preview?.siteName ?? new URL(atom.url).hostname}
                        </div>
                        <div className="text-[11px] font-semibold text-neutral-900">
                          {preview?.title ?? atom.label}
                        </div>
                        {preview?.description && (
                          <p className="line-clamp-1 text-[11px] text-neutral-500">
                            {preview.description}
                          </p>
                        )}
                        {atom.commentary && (
                          <p className="line-clamp-1 text-[11px] text-neutral-700">
                            {atom.commentary}
                          </p>
                        )}
                      </div>
                    </a>
                    {atom.additionalNote && (
                      <details className="mt-2 rounded-lg border border-base-200 bg-white p-2">
                        <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                          See Note from Thorough Beauty
                        </summary>
                        <p className="mt-2 whitespace-pre-line text-[11px] text-neutral-600">
                          {atom.additionalNote}
                        </p>
                      </details>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = thoroughlyAnalysedProducts.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return {
      title: "Thoroughly Analysed - Not Found",
    };
  }

  const title = `${product.name} - Thoroughly Analysed`;
  const description = product.curatorNote;
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
  return thoroughlyAnalysedProducts.map((product) =>
    Promise.resolve({ slug: product.slug })
  );
}
