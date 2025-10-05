"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CategoryDetails } from "../types";

const Banner = () => {
  const [data, setData] = useState<CategoryDetails[]>([]);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const discoverRef = useRef<HTMLLIElement>(null);
  const categoriesRef = useRef<HTMLLIElement>(null);

  // Fetch categories
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/getData");
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  // Click-away to close dropdown
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
      if (
        discoverRef.current &&
        !discoverRef.current.contains(event.target as Node)
      ) {
        setDiscoverOpen(false);
      }
    }
    if (categoriesOpen || discoverOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoriesOpen, discoverOpen]);

  return (
    <div className="navbar bg-base-100 shadow-sm justify-between max-w-[600px] mt-2 mx-auto border-b border-gray-300 pb-4">
      {/* Left Side */}
      <Link href="/" className="btn text-xl pl-0 overflow-hidden min-h-[50px] min-w-[150px]">
        <Image src="/thoroughbeautyicon.png" alt="Icon" width={40} height={40}/>
        <div className="flex flex-col items-start">
          <p className="text-xl font-bold mb-[-10px]">Thorough</p>
          <p className="text-xl font-bold">Beauty</p>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex-none relative z-50">
        <ul className="menu menu-horizontal bg-base-200">
          {/* Discover Dropdown */}
          <li ref={discoverRef} className="relative">
            <button
              type="button"
              className="text-xs px-1 flex items-center gap-1 select-none"
              onClick={() => setDiscoverOpen((v) => !v)}
              aria-expanded={discoverOpen}
              aria-haspopup="menu"
            >
              Discover
              <ChevronDown
                size={16}
                className={`transition-transform ${discoverOpen ? "rotate-180" : ""}`}
              />
            </button>

            {discoverOpen && (
              <ul
                className="bg-base-200 z-50 absolute right-0 top-10 min-w-[140px] border border-gray-200 rounded shadow-lg"
                role="menu"
              >
                <li>
                  <Link
                    href="/pdf-guide"
                    className="text-xs block px-4 py-2 hover:bg-base-300"
                    role="menuitem"
                    onClick={() => setDiscoverOpen(false)}
                  >
                    Reddit Backed Routine (PDF)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-xs block px-4 py-2 hover:bg-base-300"
                    role="menuitem"
                    onClick={() => setDiscoverOpen(false)}
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="text-xs block px-4 py-2 hover:bg-base-300"
                    role="menuitem"
                    onClick={() => setDiscoverOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-xs block px-4 py-2 hover:bg-base-300"
                    role="menuitem"
                    onClick={() => setDiscoverOpen(false)}
                  >
                    About Thorough Beauty
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {/* Categories Dropdown */}
          <li ref={categoriesRef} className="relative">
            <button
              type="button"
              className="text-xs px-1 flex items-center gap-1 select-none"
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-expanded={categoriesOpen}
              aria-haspopup="menu"
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {categoriesOpen && (
                <ul
                className="bg-base-200 z-50 mt-0 absolute right-0 top-10 min-w-[140px] border border-gray-200 rounded shadow-lg"
                role="menu"
                >
                {data
                  ?.filter((category) => category.readyForDisplay)
                  .sort((a, b) => {
                  const weight = (category: CategoryDetails) => {
                    const type = category.type;
                    if (type === "skincare") return 0;
                    if (type === "beauty") return 1;
                    return 2;
                  };
                  return weight(a) - weight(b);
                  })
                  .map((category, idx) => {
                  const type = category.type;
                  const textColor =
                    type === "skincare"
                    ? "text-info"
                    : type === "beauty"
                      ? "text-secondary"
                      : "";
                  return (
                    <li key={category.slug || idx}>
                    <Link
                      href={`/category/${category.slug}`}
                      className={`text-xs block px-4 py-2 hover:bg-base-300 ${textColor}`}
                      onClick={() => setCategoriesOpen(false)}
                      role="menuitem"
                    >
                      {category.title}
                    </Link>
                    </li>
                  );
                  })}
                </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Banner;
