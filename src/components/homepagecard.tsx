import Image from "next/image";

interface HomePageCardProps {
  image: string;
  slug: string;
  title: string;
  subtitle: string;
  readyForDisplay?: boolean;
}

export default function HomePageCard({ image, slug, title, readyForDisplay, subtitle }: HomePageCardProps) {
  //For Cards that are ready to go
  if (readyForDisplay) {
    return (
      <a href={`/category/${slug}`} className="card card-side shadow-lg w-full rounded-none">
        <figure className="w-60">
          <Image src={image} alt={title} objectFit="cover" width={150} height={150}/>
        </figure>
        <div className="card-body">
          <h2 className="card-title text-sm">{title}</h2>
          <p className="text-xs">{subtitle}</p>
        </div>
      </a>
    )
  } 
  
  //For Cards that are not ready yet
  else {
    return (
      <div className="card card-side bg-base-100 shadow-sm w-full opacity-50">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>Reddit Reviews coming soon for this category</p>
        </div>
      </div>
    )
  }
}
