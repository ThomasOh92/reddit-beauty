import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ 'product-id': string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  return (
    <div className="p-8">
      <h1>Product ID: {resolvedParams['product-id']}</h1>
      <h1 className="text-4xl font-bold">Product Name</h1>
      <p className="mt-4 text-lg">Product Description</p>
      <Link href="/category/skin-tint" className="mt-6 text-blue-500">Go Back</Link>
    </div>
  );
}

