"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryDetails } from "../types";

const Banner = () => {
  const [data, setData] = useState<CategoryDetails[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/getData");
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm justify-between max-w-[600px] mt-2 mx-auto border-b border-gray-300 pb-4">
      {/* Left Side */}
      <Link href="/" className="btn text-xl pl-0">
        <Image src="/redditbeautyicon.png" alt="Icon" width={60} height={60} />
        <div className="flex flex-col items-start">
          <p className="text-xl mb-[-10px]">Reddit</p>
          <p className="text-xl">Beauty</p>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex-none relative z-50">
        <ul className="menu menu-horizontal bg-base-200">
          <li>
            <Link href="/about" className="text-xs px-1">
              About
            </Link>
          </li>
          <li>
            <Link
              href="https://forms.gle/ND4jt144jW5Z6bkC9"
              className="text-xs px-1"
            >
              Feedback
            </Link>
          </li>
          <li>
            <details className="relative">
              <summary className="text-xs px-1 text-right">Categories</summary>
              <ul className="bg-base-200 z-50 mt-0 absolute right-0">
              {data
                ?.filter((category: CategoryDetails) => category.readyForDisplay)
                .map((category: CategoryDetails, idx: number) => (
                <li key={category.slug || idx}>
                  <Link
                  href={`/category/${category.slug}`}
                  className="text-xs"
                  >
                  {category.title}
                  </Link>
                </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Banner;
