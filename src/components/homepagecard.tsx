interface HomePageCardProps {
  slug: string;
  title: string;
  subtitle: string;
  readyForDisplay?: boolean;
  lastUpdated: string;
}

export default function HomePageCard({ slug, title, readyForDisplay, subtitle, lastUpdated }: HomePageCardProps) {
  //For Cards that are ready to go
  if (readyForDisplay) {
    return (
      <a href={`/category/${slug}`} className="card shadow-lg w-full rounded-none bg-secondary-content">
        <div className="card-body p-4">
          <h2 className="text-xs font-bold card-title">
            <span className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">{title}</span>
          </h2>
          <p className="text-xs">{subtitle}</p>
          <p className="text-xs">Last Updated On: {lastUpdated}</p>
        </div>
      </a>
    )
  } 
  
  //For Cards that are not ready yet
  else {
    return (
      <div className="card card-side bg-base-100 shadow-sm w-full opacity-50">
        <div className="card-body">
          <h2 className="card-title text-xs">{title}</h2>
          <p className="text-xs">Reddit Reviews coming soon for this category</p>
        </div>
      </div>
    )
  }
}
