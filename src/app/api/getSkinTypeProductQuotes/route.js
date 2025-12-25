import { NextResponse } from "next/server";
import { getSkinTypeProductQuotesPage } from "../../../../lib/getSkinTypesAllCategories";

/**
 * POST body:
 *  - skinTypeId | skin_type_id
 *  - categoryId | category_id
 *  - productId  | product_id
 *  - limit? (default 5, max 20)
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const skin_type_id = body?.skinTypeId ?? body?.skin_type_id;
    const category_id = body?.categoryId ?? body?.category_id;
    const product_id = body?.productId ?? body?.product_id;
    const limit = body?.limit;
    const offset = body?.offset;

    if (!skin_type_id || !category_id || !product_id) {
      return NextResponse.json(
        { error: "Missing skin_type_id/category_id/product_id" },
        { status: 400 }
      );
    }

    const page = await getSkinTypeProductQuotesPage(
      skin_type_id,
      category_id,
      product_id,
      { limit, offset }
    );

    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    console.error("API Error fetching skin-type product quotes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
