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
            <div className="mt-3 grid gap-4">
              {molecule.atoms.map((atom) => {
                if (atom.kind === "reddit") {
                  return (
                    <article
                      key={atom.id}
                      className="rounded-xl border border-base-200 bg-slate-100 p-4"
                    >
                      <p className="text-[11px] font-semibold text-neutral-500">
                        {atom.headerParts.join(" | ")}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Poster&apos;s details as of {product.lastChecked}: {atom.posterDetails}
                      </p>
                      {atom.commentary && (
                        <p className="mt-2 text-xs text-neutral-600">
                          {atom.commentary}
                        </p>
                      )}
                      <details className="mt-3 rounded-lg border border-base-200 bg-white p-3">
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
                          <a
                            href={atom.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-neutral"
                          >
                            Read on Reddit
                          </a>
                          {atom.additionalNote && (
                            <span className="w-full text-right text-xs text-neutral-500">
                              {atom.additionalNote}
                            </span>
                          )}
                        </div>
                      </details>
                    </article>
                  );
                }

                const preview = previewByUrl.get(atom.url);

                return (
                  <a
                    key={atom.id}
                    href={atom.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex gap-3 rounded-xl border border-base-200 bg-[#fff7ed] p-3 transition hover:border-neutral-300"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-200">
                      {preview?.image && (
                        <img
                          src={preview.image}
                          alt={preview.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-neutral-500">
                        {preview?.siteName ?? new URL(atom.url).hostname}
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
