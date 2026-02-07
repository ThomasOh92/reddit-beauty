import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import CategoryPageWrapper from "@/components/categorypagewrapper";
import { PdfGuideOverlay } from "@/components/pdf-guide-overlay";

import { APP_URL } from "@/constants";
import { Product } from "@/types";

import { getSkinTypes } from "../../../../../lib/getSkinTypes";
import { getSkinTypesAllCategories } from "../../../../../lib/getSkinTypesAllCategories";
import { getProductIdToSlugMapForCategory } from "../../../../../lib/getProductSlugsForCategory";
import { getCategoryProductsByIds } from "../../../../../lib/getCategoryProductsByIds";

export const dynamicParams = true;
export const revalidate = 7200;

type SkinTypeCategoryPageProps = Promise<{
  // Next param key is derived from folder name: `[skin-type]`
  "skin-type"?: string;
  // tolerate older/alternative usage
  skin_type?: string;
  category: string;
}>;

const getCachedSkinTypeAllCategories = cache((skin_type: string) =>
  getSkinTypesAllCategories(skin_type)
);

function titleCaseFromSlug(slug: string) {
  return (slug || "")
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: SkinTypeCategoryPageProps;
}) {
  const rawParams = await params;
  const skin_type = rawParams["skin-type"] ?? rawParams.skin_type;
  const category = rawParams.category;

  if (!skin_type || !category) {
    return {};
  }

  const normalized = skin_type.trim().toLowerCase();
  if (
    normalized === "not-sure" ||
    normalized === "not_sure" ||
    normalized === "notsure" ||
    normalized === "not sure"
  ) {
    return {};
  }

  const skinTypeName = titleCaseFromSlug(skin_type);
  const categoryName = titleCaseFromSlug(category);

  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  const description = `Explore ${categoryName} mentions tied to ${skinTypeName} from Reddit discussions (positive, neutral, and negative). Updated ${month} ${year}.`;
  const canonical = `${APP_URL}/skin-type-category/${skin_type}/${category}`;

  return {
    title: `${categoryName} mentions for ${skinTypeName} ranked by Reddit`,
    description,
    alternates: {
      canonical,
    },
    keywords: [
      categoryName,
      skinTypeName,
      "Reddit rankings",
      `best ${categoryName} for ${skinTypeName}`,
    ],
    openGraph: {
      title: `${categoryName} mentions for ${skinTypeName} ranked by Reddit`,
      description,
      url: canonical,
      type: "website",
      images: [
        {
          url: "https://www.thoroughbeauty.com/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
    },
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateStaticParams(): Promise<
  { "skin-type": string; category: string }[]
> {
  try {
    const skinTypes = await getSkinTypes();
    if (!Array.isArray(skinTypes) || skinTypes.length === 0) return [];

    const allParams: { "skin-type": string; category: string }[] = [];

    for (const st of skinTypes) {
      const skin_type_id = st.id;
      if (!skin_type_id) continue;

      const data = await getSkinTypesAllCategories(skin_type_id);
      const categories = data?.categories ?? [];

      for (const c of categories) {
        if (
          c?.category_id &&
          Array.isArray(c.positive_quote_rankings) &&
          c.positive_quote_rankings.length > 0
        ) {
          allParams.push({
            "skin-type": skin_type_id,
            category: c.category_id,
          });
        }
      }

      // light throttle to reduce Firestore pressure during builds
      await delay(150);
    }

    return allParams;
  } catch (err) {
    console.error("Error generating static params for skin-type category:", err);
    return [];
  }
}

export default async function SkinTypeCategoryPage({
  params,
}: {
  params: SkinTypeCategoryPageProps;
}) {
  const rawParams = await params;
  const skin_type = rawParams["skin-type"] ?? rawParams.skin_type;
  const category = rawParams.category;

  if (!skin_type || !category) {
    return notFound();
  }

  const normalized = skin_type.trim().toLowerCase();
  if (
    normalized === "not-sure" ||
    normalized === "not_sure" ||
    normalized === "notsure" ||
    normalized === "not sure"
  ) {
    return notFound();
  }

  const skinTypeName = titleCaseFromSlug(skin_type);
  const categoryName = titleCaseFromSlug(category);
  const skinTypeTitleLabel = (() => {
    const cleaned = skinTypeName.replace(/\s*Skin\s*Type\s*$/i, "").trim();
    return /skin/i.test(cleaned) ? cleaned : `${cleaned} Skin`;
  })();
  const skinTypeMentionsLabel = skinTypeTitleLabel.toLowerCase();

  try {
    const data = await getCachedSkinTypeAllCategories(skin_type);
    const categorySummary = data?.categories?.find(
      (c) => c.category_id === category
    );

    if (
      !categorySummary ||
      !Array.isArray(categorySummary.positive_quote_rankings) ||
      categorySummary.positive_quote_rankings.length === 0
    ) {
      return notFound();
    }

    // Map skin-type rankings into Product shape so we can reuse CategoryPageWrapper + ProductCard.
    // NOTE: ranking `product_id` is a Firestore productId; slug is stored in the category's `slugs` collection.
    const productIdToSlug = await getProductIdToSlugMapForCategory(category);
    const rankedProductIds = categorySummary.positive_quote_rankings
      .map((r) => r.product_id)
      .filter(Boolean) as string[];
    const productById = await getCategoryProductsByIds(category, rankedProductIds);

    const products: Product[] = categorySummary.positive_quote_rankings
      .map((r, index) => {
        const positive = r.positive_quotes ?? 0;
        const neutral = r.neutral_quotes ?? 0;
        const negative = r.negative_quotes ?? 0;
        const slug = (r.product_id && productIdToSlug[r.product_id]) || "";
        const base = r.product_id ? productById.get(r.product_id) : undefined;

        return {
          id: r.product_id || `${index}`,
          slug,
          product_name: r.product_name || base?.product_name || "",
          image_url: r.image_url || base?.image_url || "",
          positive_mentions: positive,
          neutral_mentions: neutral,
          negative_mentions: negative,
          amazon_url_us: base?.amazon_url_us,
          amazon_url_uk: base?.amazon_url_uk,
          sephora_url: base?.sephora_url,
          fallback_url: base?.fallback_url,
          rank: index + 1,
        };
      })
      .filter((p) => Boolean(p.slug));

    if (products.length === 0) {
      return notFound();
    }

    const pageUrl = `${APP_URL}/skin-type-category/${skin_type}/${category}`;
    const byId = (suffix: string) => `${pageUrl}#${suffix}`;

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": byId("webpage"),
        url: pageUrl,
        name: `${categoryName} mentions for ${skinTypeName} – Reddit Rankings`,
        description: `Mentions of ${categoryName} tied to ${skinTypeName}, including positive, neutral, and negative Reddit comments.`,
        inLanguage: "en",
        dateModified: new Date().toISOString(),
        about: [
          { "@type": "Thing", name: categoryName },
          { "@type": "Thing", name: skinTypeName },
        ],
        mainEntity: { "@id": byId("rankings") },
        hasPart: [{ "@id": byId("rankings") }],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": byId("rankings"),
        itemListOrder: "ItemListOrderDescending",
        numberOfItems: products.length,
        isPartOf: { "@id": byId("webpage") },
        itemListElement: products.slice(0, 10).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.product_name,
            url: `${APP_URL}/category/${category}/${p.slug}`,
            image: p.image_url,
          },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Data Haul",
            item: `${APP_URL}/#data-haul`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryName,
            item: pageUrl,
          },
        ],
      },
    ];

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="mt-4 mb-2 text-center">
          <h1 className="text-l font-bold w-full bg-clip-text">
            <span className="text-2xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
              {categoryName} mentions for {skinTypeTitleLabel}
            </span>
          </h1>
        </div>

        <div className="mb-4 mx-8 md:mx-0 flex justify-center items-center">
          <PdfGuideOverlay backgroundSize="80%" />
        </div>

        <CategoryPageWrapper
          products={products}
          category={category}
          showScore={false}
          mentionsMode="total"
          mentionsContextLabel={skinTypeMentionsLabel}
          skinTypeId={skin_type}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching skin-type category data:", error);
    return notFound();
  }
}
