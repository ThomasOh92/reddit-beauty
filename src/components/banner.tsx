"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CategoryDetails } from "../types";

type SkinType = {
  id: string;
  skin_type: string;
};

const Banner = () => {
  const [data, setData] = useState<CategoryDetails[]>([]);
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [skinTypesOpen, setSkinTypesOpen] = useState(false);
  const discoverRef = useRef<HTMLLIElement>(null);
  const categoriesRef = useRef<HTMLLIElement>(null);
  const skinTypesRef = useRef<HTMLLIElement>(null);

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

  // Fetch skin types
  useEffect(() => {
    async function fetchSkinTypes() {
      try {
        const response = await fetch("/api/getSkinTypes");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setSkinTypes(result.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchSkinTypes();
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
      if (
        skinTypesRef.current &&
        !skinTypesRef.current.contains(event.target as Node)
      ) {
        setSkinTypesOpen(false);
      }
    }
    if (categoriesOpen || discoverOpen || skinTypesOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoriesOpen, discoverOpen, skinTypesOpen]);

  return (
    <div className="navbar bg-base-100 shadow-sm justify-between max-w-[600px] mt-2 mx-auto ">
      {/* Left Side */}
      <Link href="/" className="flex items-center  ">
        <Image
          src="/tb-logo-4.png"
          alt="Icon"
          width={50}
          height={50}
          className="w-8 h-8 md:w-[50px] md:h-[50px]"
        />
        <h1 className="text-xs md:text-lg font-bold">Thorough Beauty</h1>
      </Link>

      {/* Right Side */}
      <div className="flex-none relative z-50">
        <ul className="menu menu-horizontal">
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
