
export default function ProductPage({ params }: { params: { productId: string } }) {
  
  return (
    <div className="p-8">
      <h1>Product ID: {params.productId}</h1>
      <h1 className="text-4xl font-bold">Product Name</h1>
      <p className="mt-4 text-lg">Product Description</p>
      <a href="/category/skin-tint" className="mt-6 text-blue-500">Go Back</a>
    </div>
  );
}
