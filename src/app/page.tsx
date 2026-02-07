import HomePageCard from "@/components/homepagecard";
import Testimonials from "@/components/testimonials";
import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "../../lib/getAllCategories";
import { getSkinTypes } from "../../lib/getSkinTypes";
import { getSkinTypesAllCategories } from "../../lib/getSkinTypesAllCategories";
import type { Category } from "../../lib/getAllCategories";
import type { Metadata } from "next";
import { APP_URL } from "@/constants";
import { PdfGuideOverlay } from "@/components/pdf-guide-overlay";
import FeaturedProductsCarousel from "@/components/featured-products-carousel";

export const dynamicParams = true;
export const revalidate = 7200;

export const metadata: Metadata = {
  alternates: {
    canonical: `${APP_URL}`,
  },
  description:
    "Explore skincare and beauty products ranked by Reddit reviews. Browse categories, compare top picks, and find what works for your skin.",
  openGraph: {
    description:
      "Explore skincare and beauty products ranked by Reddit reviews. Browse categories, compare top picks, and find what works for your skin.",
    url: `${APP_URL}`,
    type: "website",
  },
  twitter: {
    description:
      "Explore skincare and beauty products ranked by Reddit reviews. Browse categories, compare top picks, and find what works for your skin.",
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
    const skinTypes = await getSkinTypes();
    const sortedSkinTypes = [...skinTypes].sort((a, b) => {
      const normalize = (s: string) => s.trim().toLowerCase();

      const order: Record<string, number> = {
        oily: 0,
        dry: 1,
      };

      const aKey = normalize(a.skin_type);
      const bKey = normalize(b.skin_type);

      const aIsNotSure = aKey === "not sure";
      const bIsNotSure = bKey === "not sure";

      // Always push "Not sure" to the end
      if (aIsNotSure && !bIsNotSure) return 1;
      if (!aIsNotSure && bIsNotSure) return -1;

      const aOrder = order[aKey] ?? 999;
      const bOrder = order[bKey] ?? 999;

      // Priority: Oily, then Dry, then everything else (alphabetical)
      if (aOrder !== bOrder) return aOrder - bOrder;
      return aKey.localeCompare(bKey);
    });

    const skinTypeCategoryGroups = await Promise.all(
      sortedSkinTypes
        .filter((skinType) => skinType.skin_type.trim().toLowerCase() !== "not sure")
        .map(async (skinType) => {
          const data = await getSkinTypesAllCategories(skinType.id);
          const categories =
            data?.categories?.filter(
              (category) =>
                Array.isArray(category.positive_quote_rankings) &&
                category.positive_quote_rankings.length > 0
            ) ?? [];

          return {
            skinType,
            categories,
          };
        })
    );

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        {/* <h1 className="text-2xl font-bold mt-4 text-neutral text-center">
          Thorough Beauty 
        </h1>
        <h2 className="text-sm text-gray-600 text-center mb-4">
          {" "}
          Reddit Skincare and Beauty Reviews{" "}
        </h2> */}

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
            <div className="hero-overlay rounded-xl shadow-lg z-10 bg-black/20"></div>
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
          <PdfGuideOverlay backgroundSize="80%" />
        </div>

        <div className="grid grid-cols-1  mt-8">
          <FeaturedProductsCarousel />

          <section className="mt-2" id="data-haul">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Image
                src="/product-rankings.png"
                alt="Data Haul Icon"
                width={24}
                height={24}
              />
              <h2 className="text-sm font-bold text-neutral text-center">
                Data Haul
              </h2>
            </div>

            <div className="tabs tabs-border">
              <input
                type="radio"
                name="data-haul"
                className="tab font-bold"
                aria-label="Skincare"
                defaultChecked
              />
              <div className="tab-content">
                <div className="grid grid-cols-3 gap-4 p-4 bg-base-100 rounded-box shadow-md">
                  {skincareCategories.length === 0 ? (
                    <div className="col-span-3 p-4 text-sm opacity-60 text-center">
                      No skincare categories yet.
                    </div>
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
                </div>
              </div>

              <input
                type="radio"
                name="data-haul"
                className="tab font-bold"
                aria-label="Beauty"
              />
              <div className="tab-content">
                <div className="grid grid-cols-3 gap-4 p-4 bg-base-100 rounded-box shadow-md">
                  {beautyCategories.length === 0 ? (
                    <div className="col-span-3 p-4 text-sm opacity-60 text-center">
                      No beauty categories yet.
                    </div>
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
                </div>
              </div>

              <input
                type="radio"
                name="data-haul"
                className="tab font-bold"
                aria-label="Skin Types"
              />
              <div className="tab-content">
                <div className="bg-base-100 rounded-box shadow-md p-4">
                  {skinTypeCategoryGroups.length === 0 ? (
                    <p className="text-sm opacity-60 text-center">
                      No skin types available.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {skinTypeCategoryGroups
                        .filter((group) => group.categories.length > 0)
                        .map((group) => (
                          <div
                            key={group.skinType.id}
                            id={`data-haul-${group.skinType.id}`}
                            className="collapse collapse-arrow bg-base-200"
                          >
                            <input type="checkbox" />
                            <div className="collapse-title text-xs font-bold text-neutral">
                              {group.skinType.skin_type}
                            </div>
                            <div className="collapse-content">
                              <div className="flex flex-wrap gap-2">
                                {group.categories.map((category) => (
                                  <Link
                                    key={`${group.skinType.id}-${category.category_id}`}
                                    href={`/skin-type-category/${group.skinType.id}/${category.category_id}`}
                                    className="btn btn-soft btn-secondary"
                                  >
                                    {category.category_id.replace(/-/g, " ")}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="divider font-bold mt-10">Redditor Testimonials</div>
        <Testimonials />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching categories</p>;
  }
}
