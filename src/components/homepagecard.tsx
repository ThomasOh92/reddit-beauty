import Image from "next/image";
import Link from "next/link";
import { CategoryDetails } from "../types";

const formatLastUpdated = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function HomePageCard({
  slug,
  title,
  readyForDisplay,
  subtitle,
  lastUpdated,
  thumbnailUrl,
}: CategoryDetails) {
  const formattedDate = formatLastUpdated(lastUpdated);
  const imageSrc = thumbnailUrl || "/tb-logo.png";

  const content = (
    <>
      <div className="relative w-3/4 mx-auto aspect-square overflow-hidden rounded-box bg-base-200 mb-2">
        <Image
          src={imageSrc}
          alt={`${title} thumbnail`}
          fill
          sizes="(max-width: 640px) 120px, 150px"
          className="rounded-box object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[0.65rem] sm:text-xs font-semibold line-clamp-2">
          {title}
        </span>
        <span className="text-[0.55rem] sm:text-[0.65rem] opacity-60 line-clamp-2">
          {subtitle}
        </span>
        {formattedDate ? (
          <span className="text-[0.5rem] sm:text-[0.6rem] opacity-50 mt-1">
            Updated {formattedDate}
          </span>
        ) : null}
        {!readyForDisplay ? (
          <span className="text-[0.5rem] sm:text-[0.6rem] opacity-60 mt-1">
            Reddit reviews coming soon
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="flex flex-col">
      {readyForDisplay ? (
        <Link
          href={`/category/${slug}`}
          className="flex flex-col 1 sm:p-3 rounded-box hover:bg-base-200 transition-colors"
          aria-label={`View ${title} category`}
        >
          {content}
        </Link>
      ) : (
        <div className="flex flex-col p-1 sm:p-3 opacity-60">{content}</div>
      )}
    </div>
  );
}
