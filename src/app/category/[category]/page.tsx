import { notFound } from 'next/navigation';
import CategoryPageWrapper from "@/components/categorypagewrapper";
import DiscussionsBox from "@/components/discussionsbox";
import { Discussion, Product } from "../../../types";
import { getAllCategories } from '../../../../lib/getAllCategories';
import { getCategoryData } from "../../../../lib/getCategoryData";
import { APP_URL } from '@/constants';

export const dynamicParams = true;
export const revalidate = 7200; // optional, for ISR support

type CategoryPageProps = Promise<{
  category: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: CategoryPageProps;
}) {
  const { category } = await params;
  const categoryWithSpaces = category.replace(/-/g, " ");
  const categoryCapitalized = categoryWithSpaces
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  // Optionally fetch top products here for future enhancements

  return {
    title: `${categoryCapitalized} – Product Rankings on Reddit (${year})`,
    description: `Discover the top ${categoryWithSpaces} as voted and reviewed by Reddit users. See which ${categoryWithSpaces} are popular, read real experiences, and compare upvotes, quotes, and discussions. Updated ${month} ${year}.`,
    alternates: {
      canonical: `${APP_URL}/category/${category}`,
    },
    openGraph: {
      title: `${categoryCapitalized} – Product Rankings on Reddit  (${year})`,
      description: `Discover the top ${categoryWithSpaces} as voted and reviewed by Reddit users. See which ${categoryWithSpaces} are popular, read real experiences, and compare upvotes, quotes, and discussions. Updated ${month} ${year}.`,
      url: `${APP_URL}/category/${category}`,

      // Dynamically create or assign an image in the future
    },

    // Optionally add structured data (inject via <Script type="application/ld+json"> in layout)
  };
}

export async function generateStaticParams() {

  try {
    const data = await getAllCategories();

    const categories = data
      .filter(
        (category: { slug: string; readyForDisplay?: boolean }) =>
          category.slug && category.readyForDisplay
      )
      .map((category: { slug: string }) => ({
        category: category.slug,
      }));

    return categories;
  } catch (err) {
    console.error("Error generating static params for category:", err);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: CategoryPageProps;
}) {
  const { category } = await params;

  const categoryCapitalized = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  try {

    const data = await getCategoryData(category);

    if (
      !data ||
      !Array.isArray(data.products) ||
      data.products.length === 0
    ) {
      return notFound();
    }

    const discussion_data = data.discussions;
    const products = data.products;
    const categoryData = data.categoryData || {} as {
      editorial_summary?: string;
      application_tips?: string[];
      faq?: Array<{
        question?: string;
        q?: string;
        Q?: string;
        answer?: string;
        a?: string;
        A?: string;
      }>;
      recommendations?: string[];
    };

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${categoryCapitalized} – Reddit Rankings`,
      description: `Discover the top ${categoryCapitalized} as voted and reviewed by Reddit users. See which ${categoryCapitalized} are popular, read real experiences, and compare upvotes, quotes, and discussions.`,
      url: `https://beautyaggregate.com/category/${category}`,
      itemListElement: products
        ? products.map((product: Product) => ({
            "@type": "ListItem",
            name: product.product_name,
            url: `https://beautyaggregate.com/category/${category}/${product.slug}`,
            image: product.image_url,
          }))
        : [],
    };

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <h1 className="text-l font-bold mb-2 mt-4 w-full bg-clip-text text-center">
          <span className="text-2xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
            {categoryCapitalized}
          </span>
        </h1>
        <h2 className="text-center mb-4 text-sm">
          Reddit Rankings (by upvotes)
        </h2>

        {/* Discussions Box */}
        <DiscussionsBox discussion_data={discussion_data} />


        {/* Analysis Section */}
        <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
          <input type="checkbox" defaultChecked={false} />
          <div className="collapse-title text-sm font-bold">Reddit Analysis </div>
          <div className="collapse-content">
            <div className="text-xs mb-4">
              <p>
                <strong>Editorial Summary:</strong> {categoryData.editorial_summary ||
                  "No editorial summary available."}
              </p>
            </div>
            <div className="text-xs">
                <strong>Recommendations:</strong>
                  {categoryData.recommendations && categoryData.recommendations.length > 0 ? (
                    <ul className="mt-1 ml-4">
                    {categoryData.recommendations.map((tip, index) => (
                      <li key={index} className="list-disc mb-2">{tip}</li>
                    ))}
                    </ul>
                  ) : (
                    " No recommendations available."
                  )}
            </div>
          </div>

        </div>

        {/* Rankings */}
        <CategoryPageWrapper products={products} category={category} />

        {/* FAQs */}
        {categoryData.faq && categoryData.faq.length > 0 && (
           <div className="mx-2 mb-4 mt-8"> 
              <h2 className="text-m font-bold mt-4 mb-2">Asked by Redditors</h2>
              <div className="card border">
              {categoryData.faq.map((item, index) => {
                if (typeof item === 'string') return null;
                return (
                  <div key={index} className="collapse collapse-arrow">
                    <input type="radio" name={`faq-accordion`} />
                    <div className="collapse-title font-semibold text-xs">{item.question || item.q || item.Q}</div>
                    <div className="collapse-content text-xs">{item.answer || item.a || item.A}</div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

        {/* Application Tips*/}

        <div className="mx-2 mb-4 mt-8"> 
          <h2 className="text-m font-bold mt-4 mb-2">Application Tips by Redditors:</h2>
          <div className="card border">
            {categoryData.application_tips && categoryData.application_tips.length > 0 ? (
              <ul className="m-4 mx-6">
              {categoryData.application_tips.map((tip, index) => (
                <li key={index} className="list-decimal mb-2 text-xs">{tip}</li>
              ))}
              </ul>
            ) : (
              " No application tips available."
            )}
          </div>
        </div>

      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return notFound();
  }
}
