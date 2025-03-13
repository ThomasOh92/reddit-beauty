interface ProductPageProps {
  params: Promise<{ 'product-id': string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4 space-y-4">
      {/* Image */}
      <div className="flex flex-col space-y-4 items-center">
        <img
          src="https://cdn1.feelunique.com/img/products/183109/sub-products/sephora_collection_reveal_the_real_soft_radiant_skin_tint_30ml-88346-variant-1721287055.jpg"
          alt="Product Image"
          className="w-80 h-80 "
        />
      </div>

      {/* Text Descriptions */}
      <div className='pl-4 pr mb-8 flex justify-between items-center'>
        <div className='max-w-[400px]'>
          <p className="text-l font-bold truncate">SEPHORA COLLECTION Reveal The Real Soft Radiant Skin Tint 30ml</p>
          <p className="text-xs">Discover the Sephora Collection skin tint: Reveal the Real. This ultra-sensorial serum texture offers the perfect combination of a radiant blurred finish with instant correction.</p>
        </div>
        <a href="#" className="btn btn-outline btn-warning mr-8">Amazon</a>
      </div>



      {/* Reddit Reviews Section */}
      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border rounded-none shadow-lg">
          <input type="checkbox" defaultChecked />
          <div className="collapse-title font-semibold">Reddit Threads about this product</div>
          <ul className="collapse-content text-xs ">
            <li className="pb-1 truncate">r/MakeUpAddiction: How to stop makeup slipping on oily skin? - Latest comment 24 Jan 2025</li>
            <li className="pb-1 truncate">r/SkincareAddiction: Best products for dry skin? - Latest comment 18 Feb 2025</li>
            <li className="pb-1 truncate">r/BeautyGuru: Is this product worth the price? - Latest comment 10 Mar 2025</li>
            <li className="pb-1 truncate">r/MakeupLovers: Dewy finish recommendations? - Latest comment 05 Apr 2025</li>
            <li className="pb-1 truncate">r/BeautyAddicts: How to blend foundation seamlessly? - Latest comment 22 May 2025</li>
            <li className="pb-1 truncate">r/MakeupAddicts: Best lightweight foundations? - Latest comment 15 Jun 2025</li>
            <li className="pb-1 truncate">r/SkincareJunkie: Limited shade range issues? - Latest comment 30 Jul 2025</li>
          </ul>
      </div>

      {/* Key Themes from Reviews */}
      <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
        <h2 className="text-l font-semibold">Key Themes from Reviews</h2>
        <ul className="mt-4 text-xs list-disc list-inside">
          <li>Natural and lightweight coverage</li>
          <li>Better for dry skin</li>
          <li>Long-lasting with proper setting</li>
          <li>Some find it pricey but worth it</li>
        </ul>

        {/* Likes and Dislikes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
          <div className="bg-green-100 p-6 rounded-lg shadow">
        <h2 className="text-l font-semibold text-green-700">Likes</h2>
        <ul className="mt-4 text-xs list-inside space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Lightweight and breathable
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Gives a dewy, natural finish
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Blends effortlessly
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Gives a dewy, natural finish
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✔</span> Blends effortlessly
          </li>
        </ul>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow">
        <h2 className="text-l font-semibold text-red-700">Dislikes</h2>
        <ul className="mt-4 text-xs list-disc list-inside space-y-2">
          <li>Not ideal for oily skin</li>
          <li>Can be expensive</li>
          <li>Limited shade range</li>
        </ul>
          </div>
        </div>
      </div>

      {/* For reference - Params Usage */}
      <p className='text-xs'>Product ID: {resolvedParams['product-id']}</p>
      
    </div>
  );
}
