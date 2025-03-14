import HomePageCard from "@/components/homepagecard";

export default async function Home() {
  const API_URL = process.env.BASE_URL || "https://reddit-beauty.vercel.app";

  try {
    const res = await fetch(`${API_URL}/api/getData`, {
      next: { revalidate: 3600 }, // Revalidate every 1 hour
    });

    if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

    const { success, data } = await res.json();
    if (!success) throw new Error("API request unsuccessful");

    return (
      <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
        <div className="grid grid-cols-1 gap-6">
            {data
            .sort((a: { readyForDisplay?: boolean }, b: { readyForDisplay?: boolean }) => 
              Number(b.readyForDisplay || false) - Number(a.readyForDisplay || false)
            )
            .map((category: { id: string, title: string, image: string, slug: string, readyForDisplay?: boolean, subtitle: string }) => (
              <HomePageCard key={category.id} title={category.title} image={category.image} slug={category.slug} readyForDisplay={category.readyForDisplay} subtitle={category.subtitle}/>
            ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching categories</p>;
  }
}


// export default async function Home() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getData`);
//   const { success, data } = await res.json();

//   if (!success) return <p>Error fetching categories</p>;
  
//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <div className="grid grid-cols-1 gap-6">
//       {data
//         .sort((a: { readyForDisplay?: boolean }, b: { readyForDisplay?: boolean }) => 
//           Number(b.readyForDisplay || false) - Number(a.readyForDisplay || false)
//         )
//         .map((category: { id: string, title: string, image: string, slug: string, readyForDisplay?: boolean, subtitle: string }) => (
//           <HomePageCard key={category.id} title={category.title} image={category.image} slug={category.slug} readyForDisplay={category.readyForDisplay} subtitle={category.subtitle}/>
//         ))}
//       </div>
//     </div>
//   );
// }

