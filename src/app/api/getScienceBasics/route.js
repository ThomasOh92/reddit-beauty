import { NextResponse } from "next/server";
import { getScienceBasics } from "../../../../lib/getScienceBasics";

export const dynamic = "force-dynamic";

function normalizePick(input) {
  return String(input ?? "").trim();
}

export async function POST(request) {
  try {
    const body = await request.json();

    const skinTypeTitle = normalizePick(body?.skinType ?? body?.skin_type ?? body?.skinTypeTitle);
    const skinConcernTitle = normalizePick(body?.skinConcern ?? body?.skin_concern ?? body?.skinConcernTitle);

    if (!skinTypeTitle || !skinConcernTitle) {
      return NextResponse.json(
        { success: false, error: "Missing skinType and/or skinConcern" },
        { status: 400 }
      );
    }

    const data = await getScienceBasics({ skinTypeTitle, skinConcernTitle });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// Optional GET for quick manual testing:
// /api/getScienceBasics?skinType=Oily&skinConcern=Acne
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skinTypeTitle = normalizePick(searchParams.get("skinType") ?? searchParams.get("skin_type"));
    const skinConcernTitle = normalizePick(searchParams.get("skinConcern") ?? searchParams.get("skin_concern"));

    if (!skinTypeTitle || !skinConcernTitle) {
      return NextResponse.json(
        { success: false, error: "Missing skinType and/or skinConcern" },
        { status: 400 }
      );
    }

    const data = await getScienceBasics({ skinTypeTitle, skinConcernTitle });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
