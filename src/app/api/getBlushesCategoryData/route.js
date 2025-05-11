import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

export async function GET() {
  try {
    const categoryMetaData = await db.collection("blushes").get();
    const categoryDiscussionData = await db.collection("blushes").doc("blushes-category").collection("discussions").get();
    const categoryProductData = await db.collection("blushes").doc("blushes-category").collection("products").get();
    const categorySpecialMentionsData = await db.collection("blushes").doc("blushes-category").collection("special-mentions").get();

    const data = {
      ...categoryMetaData.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0],
      categoryDiscussionData: categoryDiscussionData.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      categoryProductData: categoryProductData.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      categorySpecialMentionsData: categorySpecialMentionsData.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
