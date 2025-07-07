import { NextResponse } from "next/server";
import { getAllCategories } from "../../../../lib/getAllCategories.ts";


export async function GET() {
  try {
    const data = await getAllCategories();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
