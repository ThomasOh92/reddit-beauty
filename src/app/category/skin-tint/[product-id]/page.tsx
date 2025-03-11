import { useParams } from "next/navigation";

// This is not working. Need to fix!

const products = [
    { id: "123124"},
    { id: "232432"},
    { id: "442332"},
    { id: "222124"},
    { id: "111112"},
    { id: "766632"},
  ];

export default function ProductPage({ params }: { params: { productId: string } }) {
  
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Product Name</h1>
      <p className="mt-4 text-lg">Product Description</p>
      <a href="/skin-tint" className="mt-6 text-blue-500">Go Back</a>
    </div>
  );
}
