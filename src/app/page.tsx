import HomePageCard from "@/components/homepagecard";
import Testimonials from "@/components/testimonials";
import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "../../lib/getAllCategories";
import type { Category } from "../../lib/getAllCategories";
import type { Metadata } from "next";
import { APP_URL } from '@/constants';
import { PdfGuideOverlay } from "@/components/pdf-guide-overlay";

export const dynamicParams = true;
export const revalidate = 7200

export const metadata: Metadata = {
 alternates: { 
  canonical: `${APP_URL}`
  },
  description: "Explore skincare and beauty products ranked by Reddit reviews. Browse categories, compare top picks, and find what works for your skin.",
  openGraph: {
    description: "Explore skincare and beauty products ranked by Reddit reviews. Browse categories, compare top picks, and find what works for your skin.",
    url: `${APP_URL}`,
    type: "website"
  },
  twitter: {
    description: "Explore skincare and beauty products ranked by Reddit reviews. Browse categories, compare top picks, and find what works for your skin.",
    card: "summary_large_image",
  },
};

export default async function Home() {
  try {
    const data = await getAllCategories();

    const categorize = (type: Category["type"]) =>
      data
        .filter((category) => category.type === type)
        .sort(
          (
            a: { readyForDisplay?: boolean },
            b: { readyForDisplay?: boolean }
          ) =>
            Number(b.readyForDisplay || false) -
            Number(a.readyForDisplay || false)
        );

    const skincareCategories = categorize("skincare");
    const beautyCategories = categorize("beauty");

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <h1 className="text-lg font-bold m-2 mt-4 text-neutral text-center">
          Thorough Beauty | Reddit Skincare and Beauty Reviews
        </h1>
        <h2 className="text-sm m-2 text-gray-600 text-center mb-4">
          {" "}
          No influencers. No ads. Insights straight from the top skincare and
          beauty subreddits.{" "}
        </h2>

        
        <div className="flex justify-center mb-2">
          {/* Link to Blog */}
            <div className="relative hero rounded-xl max-w-[500px] mx-1 shadow-lg h-15 md:h-24 overflow-hidden">
              <Image
                src="https://cdn.sanity.io/images/898a6tzr/production/ba0c204adfa35ea6b6212c3a64b6ca74c56c4c65-1066x300.jpg"
                alt="Link to Thorough Beauty Blog posts"
                fill
                sizes="(max-width: 640px) 300px, 500px"
                quality={60}
                loading="lazy"
                className="object-contain z-0 scale-80"
                priority={false}
              />
              <div className="hero-overlay rounded-xl shadow-lg z-10 bg-black/40"></div>
              <div className="hero-content z-20 text-neutral-content text-center p-2 relative">
                <div className="flex flex-row items-center justify-center">
                  <Link href="/posts">
                    <h2 className="text-sm font-bold leading-tight">
                      Discover More <span className="text-error">Blog</span>
                    </h2>
                  </Link>
                </div>
              </div>
            </div>

          {/* Link to PDF Guide */}
            <PdfGuideOverlay backgroundSize="80%"/>
        </div>


        <div className="grid grid-cols-1  mt-8">
          <h2 className="text-sm font-bold text-neutral text-center">
            Product Rankings by Category
          </h2>
          <div className="tabs tabs-border">
            <input
              type="radio"
              name="skincare-or-beauty"
              className="tab font-bold"
              aria-label="Skincare"
              defaultChecked
            />
            <div className="tab-content">
              <ul className="list bg-base-100 rounded-box shadow-md">
                {skincareCategories.length === 0 ? (
                  <li className="p-4 text-sm opacity-60">
                    No skincare categories yet.
                  </li>
                ) : (
                  skincareCategories.map((category) => (
                    <HomePageCard
                      key={category.id}
                      title={category.title}
                      slug={category.slug}
                      type={category.type}
                      readyForDisplay={category.readyForDisplay}
                      subtitle={category.subtitle}
                      lastUpdated={category.lastUpdated}
                      thumbnailUrl={category.thumbnailUrl}
                    />
                  ))
                )}
              </ul>
            </div>

            <input
              type="radio"
              name="skincare-or-beauty"
              className="tab font-bold"
              aria-label="Beauty"
            />
            <div className="tab-content">
              <ul className="list bg-base-100 rounded-box shadow-md">
                {beautyCategories.length === 0 ? (
                  <li className="p-4 text-sm opacity-60">
                    No beauty categories yet.
                  </li>
                ) : (
                  beautyCategories.map((category) => (
                    <HomePageCard
                      key={category.id}
                      title={category.title}
                      slug={category.slug}
                      type={category.type}
                      readyForDisplay={category.readyForDisplay}
                      subtitle={category.subtitle}
                      lastUpdated={category.lastUpdated}
                      thumbnailUrl={category.thumbnailUrl}
                    />
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-8">
            <div className="text-sm font-bold text-neutral mb-3 text-center">
            Explore Reddit's Top Choices
            </div>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {data
              .filter((category) => Boolean(category.top_product))
              .sort((a, b) => {
              const typeOrder: Record<string, number> = { skincare: 0, beauty: 1 };
              const aOrder = typeOrder[a.type ?? ""] ?? 2;
              const bOrder = typeOrder[b.type ?? ""] ?? 2;
              return aOrder - bOrder;
              })
              .map((category) => {
              const product = category.top_product;
              if (!product) return null;
              const fallbackLabel = (product.name || category.title || category.slug || "TB")
                .replace(/\s+/g, "")
                .slice(0, 2)
                .toUpperCase();

              return (
                <li
                  key={`${category.slug}-${product.url}`}
                  className="hover:bg-base-300"
                >
                  <Link
                    href={`${APP_URL}/category/${category.slug}/${product.url}`}
                    className="list-row"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <div className="relative size-10 overflow-hidden rounded-box bg-base-200 items-center">
                    {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                    ) : (
                    <span className="flex h-full w-full items-center justify-center text-[0.65rem] font-semibold uppercase text-base-content/60">
                      {fallbackLabel}
                    </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-base-content text-center">
                    {product.name}
                    </span>
                  </div>

                  <div
                    className={`flex w-35 shrink-0 flex-col rounded-box p-2 justify-center ${
                    category.type === "beauty"
                      ? "bg-secondary-content"
                      : "bg-primary-content"
                    }`}
                  >
                    <span className="text-xs font-semibold opacity-60 break-words items-center text-center">
                    {category.title}
                    </span>
                  </div>
                  </Link>
                </li>
              );
              })}
          </ul>
        </section>

        <div className="divider font-bold mt-10">Redditor Testimonials</div>
        <Testimonials />
            </div>
          );
        } catch (error) {
          console.error("Error fetching data:", error);
          return <p>Error fetching categories</p>;
        }
      }
