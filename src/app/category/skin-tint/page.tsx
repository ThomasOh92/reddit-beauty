import ProductsTable from "@/components/productstable"

export default function SkinTint() {

      return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-semibold mb-8 mt-4 bg-clip-text">
              Top Reddit Choices: <span className="bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Skin Tint</span>
          </h1>
          <div className="flex flex-wrap justify-center space-x-4 w-full">
            <p className="text-2xl font-bold mr-10 self-center">Top 5 <br/>Products</p>
            <ProductsTable />
          </div>
            <div className="divider w-full max-w-4xl mx-auto"></div>

        </div>
    )
}

  
  