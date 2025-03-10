import ProductCard from "@/components/productcard"

export default function SkinTint() {

      return (
        <div className="flex flex-col md:flex-row min-h-screen items-center md:items-start">
              {/* Left section */}
              <div className="text-2xl mb-8 mt-8 ml-4 bg-clip-text font-semibold">
                <p>Discussions Analyzed</p>
              </div>
               {/* Divider */}
              <div className="divider divider-horizontal"></div>
              {/* Right section */}
                <div className="w-3/4 p-4 flex flex-wrap">
                <h1 className="text-4xl font-semibold mb-8 mt-4 w-full bg-clip-text">
                Reddit Most Talked About: <span className="bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Skin Tint</span>
                </h1>
                <div className="flex flex-wrap">
                  <ProductCard />
                  <ProductCard />
                  <ProductCard />
                  <ProductCard />
                  <ProductCard />
                  <ProductCard />
                  <ProductCard />
                </div>
                </div>
        </div>
    )
}

  
  