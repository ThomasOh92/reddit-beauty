import ProductsTable from "@/components/productstable"

export default function SkinTint() {

      return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold mb-8">Skin Tint</h1>
          <div className="flex flex-wrap justify-center space-x-4">
            <ProductsTable />
          </div>
        </div>
    )
}

  
  