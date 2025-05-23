import HomePageCard from "@/components/homepagecard";
import * as CONSTANTS from "../constants";
import Testimonials from "@/components/testimonials";

export default async function Home() {
  const API_URL = CONSTANTS.APP_URL;

  try {
    const res = await fetch(`${API_URL}/api/getData`, {
      next: { revalidate: 3600 }, // Revalidate every 1 hour
    });

    if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

    const { success, data } = await res.json();
    if (!success) throw new Error("API request unsuccessful");

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <h1 className="text-lg font-bold m-2 text-neutral text-center">Beauty + Skincare Reviews from Reddit</h1>
        <h2 className="text-sm text-gray-600 text-center mb-4">
          Reddit is a treasure trove of beauty and skincare advice. We are here to surface the best of it for you.
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {data
            .sort(
              (
                a: { readyForDisplay?: boolean },
                b: { readyForDisplay?: boolean }
              ) =>
                Number(b.readyForDisplay || false) -
                Number(a.readyForDisplay || false)
            )
            .map(
              (category: {
                id: string;
                title: string;
                slug: string;
                readyForDisplay?: boolean;
                subtitle: string;
                lastUpdated: string;
              }) => (
                <HomePageCard
                  key={category.id}
                  title={category.title}
                  slug={category.slug}
                  readyForDisplay={category.readyForDisplay}
                  subtitle={category.subtitle}
                  lastUpdated={category.lastUpdated}
                />
              )
            )}
        </div>
        <Testimonials />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching categories</p>;
  }
}

