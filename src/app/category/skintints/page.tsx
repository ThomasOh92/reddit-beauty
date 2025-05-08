import CategoryPageWrapper from "@/components/categorypagewrapper";

export default async function Skintint() {

  const API_URL = process.env.BASE_URL || "https://reddit-beauty.vercel.app";

  try {
    const res = await fetch(`${API_URL}/api/getSkintintCategoryData`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

    const { success, data } = await res.json();
    const discussion_data = data.categoryDiscussionData;
    const products = data.categoryProductData;
    if (!success) throw new Error("API request unsuccessful");

    return (
        <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
          {/* Title */}
            <h1 className="text-l font-bold mb-4 mt-4 w-full bg-clip-text text-center">
            Category: <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Skin Tints</span>
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
                        <span className="text-gray-400"> 
                          {" "}
                          {isNaN(Date.parse(discussion.date))
                          ? new Date(parseFloat(discussion.date) * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : new Date(discussion.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </a>
                    </li>
                ))}
                </ul>
            </div>
          </div>
          
          {/* Individual Products */}
          <p className="text-center text-xs text-gray-500 mb-4 ml-8 mr-8">Sorry we are facing some errors with the upvote calculation and rankings for this category. We will fix this asap</p>

          <CategoryPageWrapper products={products} /> 
          
        </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching category data</p>;
  }
}
  
  