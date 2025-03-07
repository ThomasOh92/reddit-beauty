import Image
 from "next/image";
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
      <a href={`/category/${slug}`} className="card lg:card-side bg-base-100 shadow-sm w-full outline outline-2 outline-gray-500">
        <figure>
        <Image src={image} alt={title} style={{ maxHeight: '150px', objectFit: 'cover' }}/>
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
      </a>
    )
  } 
  
  //For Cards that are not ready yet
  else {
    return (
      <div className="card card-border bg-base-100 w-full outline outline-1 outline-gray-500 opacity-50">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>Reddit Reviews coming soon for this category</p>
        </div>
      </div>
    )
  }
}
