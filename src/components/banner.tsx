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
            <details>
              <summary className="text-xs px-1">Categories</summary>
              <ul className="bg-base-200 z-50 mt-0">
                {data?.map((category: CategoryDetails) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-xs"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
                {/* <li>
                  <Link href="/category/sunblocks" className="text-xs">
                    Sunblocks
                  </Link>
                </li>
                <li>
                  <Link href="/category/skintints" className="text-xs">
                    Skin Tints
                  </Link>
                </li>
                <li>
                  <Link href="/category/blushes" className="text-xs">
                    Blushes
                  </Link>
                </li>
                <li>
                  <Link href="/category/setting-powders" className="text-xs">
                    Setting Powders
                  </Link>
                </li>
                <li>
                  <Link href="/category/face-serums" className="text-xs">
                    Face Serums
                  </Link>
                </li>
                <li>
                  <Link href="/category/face-moisturizers" className="text-xs">
                    Face Moisturizers
                  </Link>
                </li> */}
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Banner;
