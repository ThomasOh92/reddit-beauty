import React from "react";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    
    <div className="navbar bg-base-100 shadow-sm justify-between max-w-[600px] mt-2 mx-auto border-b border-gray-300 pb-4">
      {/* Left Side */}
      <Link href="/" className="btn text-xl pl-0">
        <Image src="/redditbeautyicon.png" alt="Icon" width={60} height={60}/>
        <div className="flex flex-col items-start">
            <p className="text-xl mb-[-10px]">Reddit</p>
          <p className="text-xl">Beauty</p>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex-none relative z-50">
        <ul className="menu menu-horizontal bg-base-200">
            <li><Link href="/about" className="text-xs px-1">About</Link></li>
            <li><Link href="https://forms.gle/ND4jt144jW5Z6bkC9" className="text-xs px-1">Feedback</Link></li>
            <li>
            <details>
            <summary className="text-xs px-1">Categories</summary>
            <ul className="bg-base-200 z-50 mt-0">
              <li><Link href="/category/sunblocks" className="text-xs">Sunblocks</Link></li>
              <li><Link href="/category/skintints" className="text-xs">Skin Tints</Link></li>
              <li><Link href="/category/blushes" className="text-xs">Blushes</Link></li>
            </ul>
            </details>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Banner;



