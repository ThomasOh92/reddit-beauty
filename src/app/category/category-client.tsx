"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryPageWrapper from "@/components/categorypagewrapper";
import Link from "next/link";

export default function CategoryClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  interface CategoryData {
    categoryProductData: any[];
    categorySpecialMentionsData: any[];
    categoryDiscussionData: {
      thread_url: string;
      Subreddit: string;
      thread_title: string;
      date: string;
    }[];
  }

  const [data, setData] = useState<CategoryData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/getCategoryData?category=${category}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${res.status} - ${text}`);
        }
        const json = await res.json();
        if (!json.success) throw new Error("API request unsuccessful");
        setData(json.data);
      } catch (err: any) {
        console.error(err);
        setError("Error fetching category data");
      }
    };

    fetchData();
  }, [category]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  const categoryCapitalized =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
      <h1 className="text-l font-bold mb-4 mt-4 w-full bg-clip-text text-center">
        Category:{" "}
        <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
          {categoryCapitalized}
        </span>
      </h1>

      <div
        tabIndex={0}
        className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4"
      >
        <input type="checkbox" defaultChecked />
        <div className="collapse-title font-semibold">Discussions Analyzed</div>
        <div className="collapse-content">
          <ul className="text-xs mt-2">
            {data.categoryDiscussionData.map((d, index) => (
              <li key={index} className="mb-1 line-clamp-1">
                <a
                  href={d.thread_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                >
                  R/{d.Subreddit}: {d.thread_title}
                  <span className="text-gray-400">
                    {" "}
                    {new Date(parseFloat(d.date) * 1000).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
        products={data.categoryProductData}
        specialMentions={data.categorySpecialMentionsData}
      />
    </div>
  );
}
