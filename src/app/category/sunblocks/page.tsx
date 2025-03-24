import ProductCard from "@/components/productcard"

export default async function Sunblock() {

  const API_URL = process.env.BASE_URL || "https://reddit-beauty.vercel.app";
  const products = [
    { id: "123124", rank: 1},
    { id: "232432", rank: 2},
    { id: "442332", rank: 3},
    { id: "222124", rank: 4},
    { id: "111112", rank: 5},
    { id: "766632", rank: 6},
  ];

  try {
    const res = await fetch(`${API_URL}/api/getSunblockCategoryData`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

    const { success, data } = await res.json();
    const discussion_data = data.categoryDiscussionData;
    if (!success) throw new Error("API request unsuccessful");

    return (
        <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
          {/* Title */}
            <h1 className="text-l font-bold mb-4 mt-4 w-full bg-clip-text text-center">
            Category: <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Sun Block</span>
            </h1>

          {/* Discussions Analyzed */}
          <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title font-semibold">Discussions Analyzed</div>
            <div className="collapse-content">
                <ul className="text-xs mt-2">
                {discussion_data.map((discussion: {id: string, Subreddit: string, thread_url: string, date: string, thread_title: string}, index: number) => (
                    <li key={index} className="mb-1 line-clamp-1">
                      <a href={discussion.thread_url} target="_blank" rel="noopener noreferrer" className="link link-hover">
                        R/{discussion.Subreddit}: {discussion.thread_title}  
                        <span className="text-gray-400"> {new Date(parseFloat(discussion.date) * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} </span>
                      </a>
                    </li>
                ))}
                </ul>
            </div>
          </div>
          
          {/* Individual Products */}
          {products.map((product: { id: string; rank: number }) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
        </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching category data</p>;
  }
}
     
      
    //   return (
    //     <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
    //       {/* Title */}
    //         <h1 className="text-l font-bold mb-4 mt-4 w-full bg-clip-text text-center">
    //         Category: <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Sun Block</span>
    //         </h1>

    //       {/* Discussions Analyzed */}
    //       <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border shadow-lg mb-4">
    //         <input type="checkbox" defaultChecked />
    //         <div className="collapse-title font-semibold">Discussions Analyzed</div>
    //         <div className="collapse-content">
    //           <ul className="text-xs mt-2">
    //             <li className="mb-1 line-clamp-1">r/MakeUpAddiction: How to stop making? - Latest comment 24 Jan 2025</li>
    //             <li className="mb-1 line-clamp-1">r/SkincareAddiction: Best products for dry skin? - Latest comment 18 Feb 2025</li>
    //             <li className="mb-1 line-clamp-1">r/BeautyGuru: Is this product worth the price? - Latest comment 10 Mar 2025</li>
    //             <li className="mb-1 line-clamp-1">r/MakeupLovers: Dewy finish recommendations? - Latest comment 05 Apr 2025</li>
    //             <li className="mb-1 line-clamp-1">r/BeautyAddicts: How to blend foundation seamlessly? - Latest comment 22 May 2025</li>
    //             <li className="mb-1 line-clamp-1">r/MakeupAddicts: Best lightweight foundations? - Latest comment 15 Jun 2025</li>
    //             <li className="mb-1 line-clamp-1">r/SkincareJunkie: Limited shade range issues? - Latest comment 30 Jul 2025</li>
    //           </ul>
    //         </div>
    //       </div>
          
    //       {/* Individual Products */}
    //       {products.map((product) => (
    //         <ProductCard key={product.id} product={product} />
    //       ))}
          
    //     </div>
    // )


  
  