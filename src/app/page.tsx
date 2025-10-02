import HomePageCard from "@/components/homepagecard";
import Testimonials from "@/components/testimonials";
import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "../../lib/getAllCategories";
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
            <div className="relative hero rounded-xl max-w-[500px] mx-1 shadow-lg h-20 md:h-24 overflow-hidden">
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


        <div className="grid grid-cols-1 gap-6">
          <div className="tabs tabs-border">
            <input
              type="radio"
              name="skincare-or-beauty"
              className="tab font-bold"
              aria-label="Skincare"
              defaultChecked
            />
            <div className="tab-content">
              {data
                .filter(
                  (category: { type: string }) => category.type === "skincare"
                )
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
                    type: string;
                    thumbnailUrl?: string;
                  }) => (
                    <HomePageCard
                      key={category.id}
                      title={category.title}
                      slug={category.slug}
                      readyForDisplay={category.readyForDisplay}
                      subtitle={category.subtitle}
                      lastUpdated={category.lastUpdated}
                      thumbnailUrl={category.thumbnailUrl}
                    />
                  )
                )}
            </div>

            <input
              type="radio"
              name="skincare-or-beauty"
              className="tab font-bold"
              aria-label="Beauty"
            />
            <div className="tab-content">
              {data
                .filter(
                  (category: { type: string }) => category.type === "beauty"
                )
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
                    type: string;
                    thumbnailUrl?: string;
                  }) => (
                    <HomePageCard
                      key={category.id}
                      title={category.title}
                      slug={category.slug}
                      readyForDisplay={category.readyForDisplay}
                      subtitle={category.subtitle}
                      lastUpdated={category.lastUpdated}
                      thumbnailUrl={category.thumbnailUrl}
                    />
                  )
                )}
            </div>
          </div>
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
