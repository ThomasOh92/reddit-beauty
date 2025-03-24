import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

export async function GET() {
  try {
    const snapshot = await db.collection("sunblocks").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      subcollections: {
        discussions: doc.ref.collection("discussions").get().then((subSnapshot) =>
          subSnapshot.docs.map((subDoc) => ({
            id: subDoc.id,
            ...subDoc.data(),
          }))
        ),
        products: doc.ref.collection("products").get().then((subSnapshot) =>
          subSnapshot.docs.map((subDoc) => ({
            id: subDoc.id,
            ...subDoc.data(),
          }))
        ),
      },
    }));
    // const resolvedData = await Promise.all(
    //   rawData.map(async (item) => ({
    //     ...item,
    //     subcollections: {
    //       discussions: await item.subcollections.discussions,
    //       products: await item.subcollections.products,
    //     },
    //   }))
    // );
    // const data = resolvedData;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
