import { NextResponse } from "next/server";
import { getSkinTypes } from "../../../../lib/getSkinTypes";

export async function GET() {
  try {
    const data = await getSkinTypes();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
