import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

export async function GET() {
  try {
    const categoryMetaData = await db.collection("skintints").get();
    const categoryDiscussionData = await db.collection("skintints").doc("skintints-category").collection("discussions").get();
    const categoryProductData = await db.collection("skintints").doc("skintints-category").collection("products").get();
   
    const data = {
      ...categoryMetaData.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0],
      categoryDiscussionData: categoryDiscussionData.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      categoryProductData: categoryProductData.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
