import Image from "next/image";
import Link from "next/link";
import { APP_URL } from "@/constants";
import { thoroughlyAnalysedProducts } from "@/app/thoroughly-analysed/data";

const featuredProducts = thoroughlyAnalysedProducts.map((product) => ({
  name: product.name,
  slug: product.slug,
  imageUrl: product.imageUrl,
  categoryLabel: product.category,
}));

export default function FeaturedProductsCarousel() {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Image
          src="/skin-type.png"
          alt="Featured Products Icon"
          width={24}
          height={24}
        />
        <h2 className="text-sm font-bold text-neutral text-center">
          <Link href="/thoroughly-analysed" className="hover:underline">
            Thoroughly Analysed
          </Link>
        </h2>
      </div>
      <div className="carousel carousel-center w-full space-x-3 rounded-box bg-base-100 p-3 shadow-md">
        {featuredProducts.map((product) => {
          const fallbackLabel = (product.name || "TB")
            .replace(/\s+/g, "")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={`featured-${product.slug}`}
              className="carousel-item"
            >
              <Link
                href={`${APP_URL}/thoroughly-analysed/${product.slug}`}
                className="card w-44 bg-base-200 hover:bg-base-300 shadow-sm"
              >
                <figure className="relative h-24 w-full bg-base-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="176px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[0.7rem] font-semibold uppercase text-base-content/60">
                      {fallbackLabel}
                    </div>
                  )}
                </figure>
                <div className="card-body p-3">
                  <div className="text-xs font-semibold text-base-content line-clamp-2 text-center">
                    {product.name}
                  </div>
                  {product.categoryLabel ? (
                    <div
                      className="mt-2 rounded-box px-2 py-1 text-[0.65rem] font-semibold opacity-70 text-center bg-primary-content"
                    >
                      {product.categoryLabel}
                    </div>
                  ) : null}
                </div>
              </Link>
            </div>
          );
        })}
        <div className="carousel-item">
          <div className="flex w-44 items-center justify-center text-xs font-semibold text-neutral-500">
            (more coming...)
          </div>
        </div>
      </div>
    </section>
  );
}
