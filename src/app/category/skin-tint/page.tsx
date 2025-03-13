import ProductCard from "@/components/productcard"

export default function SkinTint() {

      const products = [
        { id: "123124"},
        { id: "232432"},
        { id: "442332"},
        { id: "222124"},
        { id: "111112"},
        { id: "766632"},
      ];
      
      return (
        <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-4">
          {/* Title */}
            <h1 className="text-l font-bold mb-8 mt-4 w-full bg-clip-text text-center">
            Reddit Most Discussed: <span className="text-4xl bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Skin Tint</span>
            </h1>

          {/* Discussions Analyzed */}
          <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border rounded-none">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title font-semibold">Discussions Analyzed</div>
            <ul className="collapse-content text-xs mt-2">
              <li className="pb-1">r/MakeUpAddiction: How to stop makeup slipping on oily skin? - Latest comment 24 Jan 2025</li>
              <li className="pb-1">r/SkincareAddiction: Best products for dry skin? - Latest comment 18 Feb 2025</li>
              <li className="pb-1">r/BeautyGuru: Is this product worth the price? - Latest comment 10 Mar 2025</li>
              <li className="pb-1">r/MakeupLovers: Dewy finish recommendations? - Latest comment 05 Apr 2025</li>
              <li className="pb-1">r/BeautyAddicts: How to blend foundation seamlessly? - Latest comment 22 May 2025</li>
              <li className="pb-1">r/MakeupAddicts: Best lightweight foundations? - Latest comment 15 Jun 2025</li>
              <li className="pb-1">r/SkincareJunkie: Limited shade range issues? - Latest comment 30 Jul 2025</li>
            </ul>

          </div>
             


              <div className="flex flex-wrap">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
        </div>
    )
}

  
  