import { CategoryDetails } from "../types";
import Image from "next/image";

export default function HomePageCard({
  slug,
  title,
  readyForDisplay,
  subtitle,
  lastUpdated,
  thumbnailUrl,
}: CategoryDetails) {
  //For Cards that are ready to go
  if (readyForDisplay) {
    return (
      <a
        href={`/category/${slug}`}
        className="card bg-white shadow-sm mx-2 my-4 rounded hover:scale-[1.02] hover:bg-[#faedf2] cursor-pointer transition-transform duration-300"
      >
        <div className="flex flex-col items-center text-center p-4 gap-2">
          <Image
            fetchPriority="high"
            priority={true}
            width={200}
            height={200}
            src={thumbnailUrl || '/beautyaggregateicon.png'}
            alt={title}
            className="w-20 h-20 aspect-square object-contain rounded-md"
          />

          <h2 className="text-xs font-bold">
            <span className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
              {title}
            </span>
          </h2>

          <p className="text-xs">{subtitle}</p>
          <p className="text-[10px] text-gray-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </a>
    );
  }

  //For Cards that are not ready yet
  else {
    return (
      <div className="card card-side bg-base-100 shadow-sm w-full opacity-50">
        <div className="card-body">
          <h2 className="card-title text-xs">{title}</h2>
          <p className="text-xs">
            Reddit Reviews coming soon for this category
          </p>
        </div>
      </div>
    );
  }
}
