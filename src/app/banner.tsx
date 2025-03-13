import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex justify-center items-center max-w-[600px] md:mx-auto my-[0] bg-white shadow-lg p-4 mb-0.5">
      <div className="flex items-center">
      <Image src="/redditbeautyicon.png" alt="Icon" width={60} height={60} className="mr-2" />
      <div className="flex flex-col">
        <h1 className="m-0 font-bold uppercase">Reddit Beauty</h1>
        <h3 className="m-0 text-sm">Skincare and Beauty Recommendations from Reddit</h3>
      </div>
      </div>
    </div>
  );
};

export default Banner;



