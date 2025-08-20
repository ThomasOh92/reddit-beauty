"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Optionally, use a react icon library
import { ChevronDown } from "lucide-react";
import { CategoryDetails } from "../types";

const Banner = () => {
  const [data, setData] = useState<CategoryDetails[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
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
    }
    if (categoriesOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoriesOpen]);

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
          <li>
            <Link href="/about" className="text-xs px-1">
              About
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-xs px-1">
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/posts" className="text-xs px-1">
              Blog
            </Link>
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
                  .map((category, idx) => (
                    <li key={category.slug || idx}>
                      <Link
                        href={`/category/${category.slug}`}
                        className="text-xs block px-4 py-2 hover:bg-base-300"
                        onClick={() => setCategoriesOpen(false)}
                        role="menuitem"
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Banner;
