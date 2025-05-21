// src/app/category/[category]/page.tsx

import CategoryPageWrapper from "@/components/categorypagewrapper";
import Link from "next/link";
import * as CONSTANTS from "../../../constants";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  const API_URL = CONSTANTS.APP_URL;

  const categoryCapitalized =
    category.charAt(0).toUpperCase() + category.slice(1);

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

    const discussion_data = data.categoryDiscussionData;
    const products = data.categoryProductData;
    const specialMentions = data.categorySpecialMentionsData;

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <h1 className="text-l font-bold mb-4 mt-4 w-full bg-clip-text text-center">
          Category:{" "}
          <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
            {categoryCapitalized}
          </span>
        </h1>

        {/* Discussions */}
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4"
        >
          <input type="checkbox" defaultChecked />
          <div className="collapse-title font-semibold">
            Discussions Analyzed
          </div>
          <div className="collapse-content">
            <ul className="text-xs mt-2">
              {discussion_data.map((discussion: any, index: any) => (
                <li key={index} className="mb-1 line-clamp-1">
                  <a
                    href={discussion.thread_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover"
                  >
                    R/{discussion.Subreddit}: {discussion.thread_title}
                    <span className="text-gray-400">
                      {" "}
                      {new Date(
                        parseFloat(discussion.date) * 1000
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products */}
        <p className="text-center my-4 font-semibold">
          Reddit Ranking (by upvotes)
        </p>
        <p className="text-center mb-4 text-sm">
          See Research Approach:{" "}
          <Link
            href="/posts/blushes-reddit-ranking"
            className="text-blue-500 underline font-semibold hover:text-blue-700"
          >
            Here
          </Link>
        </p>

        <CategoryPageWrapper
          products={products}
          specialMentions={specialMentions}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p className="text-red-600">Error fetching category data.</p>;
  }
}
