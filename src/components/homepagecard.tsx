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
  const imageSrc = thumbnailUrl || "/thoroughbeautyicon.png";

  const content = (
    <>
      <div className="relative size-10 overflow-hidden rounded-box bg-base-200">
        <Image
          src={imageSrc}
          alt={`${title} thumbnail`}
          fill
          sizes="40px"
          className="rounded-box object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-xs font-semibold">{title}</span>
        <span className="text-xs opacity-60">
          {subtitle}
        </span>
        {formattedDate ? (
          <span className="text-[0.65rem] opacity-50">
            Updated {formattedDate}
          </span>
        ) : null}
        {!readyForDisplay ? (
          <span className="text-[0.65rem] opacity-60">
            Reddit reviews coming soon
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <li className="hover:bg-base-300">
      {readyForDisplay ? (
        <Link
          href={`/category/${slug}`}
          className="list-row flex flex-1 items-center gap-3"
          aria-label={`View ${title} category`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </Link>
      ) : (
        <div className="flex flex-1 items-center gap-3 opacity-60">
          {content}
        </div>
      )}
    </li>
  );
}
