import { NextResponse } from "next/server";
import { getTestTableRows } from "../../../../lib/getTestTable";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // This endpoint uses the project's public Supabase credentials.
    // It will return 0 rows unless `public."Test Table"` has an RLS policy allowing public SELECT,
    const data = await getTestTableRows(10);
    return NextResponse.json(
      { success: true, rowCount: data.length, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
