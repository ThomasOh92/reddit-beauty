import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    
    <div className="navbar bg-base-100 shadow-sm justify-between max-w-[600px] mt-2 mx-auto border-b border-gray-300 pb-4">
      {/* Left Side */}
      <a href="/" className="btn btn-ghost text-xl pl-0">
        <Image src="/redditbeautyicon.png" alt="Icon" width={60} height={60}/>
        <p className="text-xl">Reddit Beauty </p>
      </a>

      {/* Right Side */}
      <div className="flex-none relative z-50">
        <ul className="menu menu-horizontal bg-base-200">
          <li>
          <details>
          <summary className="text-xs">Categories</summary>
          <ul className="bg-base-200 z-50 mt-0">
            <li><a href="/category/skin-tint" className="text-xs">Skin Tint</a></li>
          </ul>
          </details>
          </li>
        </ul>
      </div>

    </div>
    // <div className="navbar flex justify-center items-center max-w-[600px] md:mx-auto my-[0] bg-white shadow-lg p-4 mb-0.5">

    //   <Image src="/redditbeautyicon.png" alt="Icon" width={60} height={60} className="mr-2" />
    //   <div className="flex flex-col">
    //     <h1 className="m-0 font-bold uppercase">Reddit Beauty</h1>
    //     <h3 className="m-0 text-sm">Skincare and Beauty Recommendations from Reddit</h3>
    //   </div>
    // </div>
  );
};

export default Banner;



