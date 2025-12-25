import { getSkinTypesAllCategories } from "../../../../lib/getSkinTypesAllCategories";
import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from "next/link";

export const dynamicParams = true;
export const revalidate = 7200;

type SkinTypeCategoryPageProps = Promise<{
  // Next param key is derived from folder name: `[skin-type]`
  "skin-type"?: string;
  // tolerate older/alternative usage
  skin_type?: string;
}>;

const getCachedSkinTypeCategoryData = cache((skin_type: string) => getSkinTypesAllCategories(skin_type));

function titleCaseFromSlug(slug: string) {
  return (slug || "")
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function SkinTypeCategoryPage({
  params,
}: {
  params: SkinTypeCategoryPageProps;
}) {
  const rawParams = await params;
  const skin_type = rawParams["skin-type"] ?? rawParams.skin_type;

  if (!skin_type) {
    return notFound();
  }

  const normalized = skin_type.trim().toLowerCase();
  if (normalized === "not-sure" || normalized === "not_sure" || normalized === "notsure" || normalized === "not sure") {
    return notFound();
  }

  try {

    const data = await getCachedSkinTypeCategoryData(skin_type);

    if (
      !data ||
      !Array.isArray(data.categories) ||
      data.categories.length === 0
    ) {
      return notFound();
    }
    const skinTypeName = titleCaseFromSlug(skin_type);
    const categoriesWithRankings = data.categories.filter(
      (c) => Array.isArray(c.positive_quote_rankings) && c.positive_quote_rankings.length > 0
    );

    if (categoriesWithRankings.length === 0) {
      return notFound();
    }

    return (
      <div className="max-w-[600px] md:mx-auto my-0 bg-base-100 shadow-md items-center p-3">
        <div className="grid grid-cols-1 mt-6">
          <h1 className="text-lg font-bold text-neutral text-center">Product Recommendations for </h1>
          <h1 className="text-lg font-bold text-secondary text-center">{skinTypeName}</h1>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {categoriesWithRankings.map((category) => {
            const categoryName = titleCaseFromSlug(category.category_id);
            return (
              <Link
                key={category.category_id}
                href={`/skin-type/${skin_type}/category/${category.category_id}`}
                className="block"
              >
                <div className="card w-full bg-base-100 shadow-lg rounded border-base-300 border transition-transform duration-300 hover:scale-[1.01] hover:bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-xs font-bold text-neutral line-clamp-2">
                        {categoryName}
                      </h2>
                      <span className="badge badge-sm badge-soft badge-neutral text-xs">
                        {category.positive_quote_rankings.length}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );

  } catch (error) {
    console.error("Error fetching data:", error);
    return notFound();
  }
}

