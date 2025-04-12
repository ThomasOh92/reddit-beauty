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
          <li><Link href="/about" className="text-xs">About</Link></li>
          <li>
            <details>
            <summary className="text-xs">Categories</summary>
            <ul className="bg-base-200 z-50 mt-0">
              <li><Link href="/category/sunblocks" className="text-xs">Sunblocks</Link></li>
            </ul>
            </details>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Banner;



