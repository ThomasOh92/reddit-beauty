import CategoryPageWrapper from "@/components/categorypagewrapper";
import * as CONSTANTS from "../../../constants";
import DiscussionsBox from "@/components/discussionsbox";
import { Discussion, Product } from "../../../types";

type CategoryPageProps = Promise<{
  category: string;
}>;

export async function generateMetadata({ params }: { params: CategoryPageProps }) {
  const { category } = await params;
  const categoryWithSpaces = category.replace(/-/g, " ");
  const categoryCapitalized = categoryWithSpaces
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  // Optionally fetch top products here for future enhancements

  return {
    title: `${categoryCapitalized} – Ranked by Reddit: Top Products, Experiences & Discussions (${year})`,
    description: `Discover the top ${categoryWithSpaces} as voted and reviewed by Reddit users. See which ${categoryWithSpaces} are popular, read real experiences, and compare upvotes, quotes, and discussions. Updated ${month} ${year}.`,
    openGraph: {
      title: `${categoryCapitalized} – Ranked by Reddit: Top Products, Experiences & Discussions (${year})`,
      description: `Discover the top ${categoryWithSpaces} as voted and reviewed by Reddit users. See which ${categoryWithSpaces} are popular, read real experiences, and compare upvotes, quotes, and discussions. Updated ${month} ${year}.`,
      url: `https://redditbeauty.com/category/${category}`,
      
      // Dynamically create or assign an image in the future
    },

    // Optionally add structured data (inject via <Script type="application/ld+json"> in layout)
  };
}


export default async function CategoryPage({
  params,
}: {
  params: CategoryPageProps;
}) {
  const { category } = await params;
  const API_URL = CONSTANTS.APP_URL;

  const categoryCapitalized = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const res = await fetch(
      `${API_URL}/api/getCategoryData?category=${category}`,
      {
        next: { revalidate: 3600 }, // Optional: revalidate every hour
      }
    );

    if (!res.ok) {
      throw new Error(
        `API responded with status: ${res.status} - ${await res.text()}`
      );
    }

    const { success, data } = await res.json();
    if (!success) throw new Error("API request unsuccessful");

    const discussion_data = data.discussions;
    const products = data.products;
    const skinTypeData = data["skin-types"];

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <h1 className="text-l font-bold mb-2 mt-4 w-full bg-clip-text text-center">
          Category:{" "}
          <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
            {categoryCapitalized}
          </span>
        </h1>
        <h2 className="text-center mb-4 text-sm">Reddit Rankings (by upvotes)</h2>

        {/* Navigation for skin type if available */}
        {skinTypeData && Array.isArray(skinTypeData) && skinTypeData.length > 0 && (
            <div className="text-center mb-4 sticky top-0 z-10">
            <ul className="menu menu-horizontal bg-base-200 rounded-box text-xs">
              <li>
                <a href="#general">General</a>
              </li>
            {skinTypeData.map((skinType: { id: string; discussions: Discussion[]; products: Product[] }, idx: number) => (
              <li key={skinType.id || idx}>
              <a href={`#${skinType.id}`}>{skinType.id}</a>
              </li>
            ))}
          </ul>
          </div>
        )}



        {/* General Section */}
        {skinTypeData && Array.isArray(skinTypeData) && skinTypeData.length > 0 && (
            <p className="text-secondary font-bold text-sm ml-4 mb-2" id="general">General</p>
        )}
        <DiscussionsBox discussion_data={discussion_data} />
        <CategoryPageWrapper products={products} category={category}/>

        {/* Skin Type Data */}
        {skinTypeData && Array.isArray(skinTypeData) && skinTypeData.length > 0 && (
          <div className="mt-8">
            {skinTypeData.map((skinType: { id: string; discussions: Discussion[]; products: Product[] }, idx: number) => (
                <div key={skinType.id || idx} className="mb-6">
                <p className="text-secondary font-bold text-sm ml-4 mb-2" id={skinType.id}>{skinType.id}</p>
                
                {skinType.discussions && skinType.discussions.length > 0 && (
                  <DiscussionsBox discussion_data={skinType.discussions || []} />
                )}

                {skinType.products && skinType.products.length > 0 && (
                  <CategoryPageWrapper products={skinType.products} category={category}/>
                )}
                
                </div>
            ))}
          </div>
        )}
        
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p className="text-red-600">Error fetching category data.</p>;
  }
}
