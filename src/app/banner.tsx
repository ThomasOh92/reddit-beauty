import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
          <Image src="/redditbeautyicon.png" alt="Icon"  width={60} height={60} style={{ marginRight: "10px" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ margin: 0, fontWeight: "bold", textTransform: "uppercase" }}>Reddit Beauty</h1>
            <h3 style={{ margin: 0, fontSize: "14px"}}>Skincare and Beauty Recommendations from Reddit</h3>
          </div>
      </div>
    </div>
  );
};

export default Banner;



