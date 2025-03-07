import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

export async function GET() {
  try {
    const snapshot = await db.collection("categories").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
