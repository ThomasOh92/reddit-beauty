import { db } from "../../../../lib/firebaseAdmin.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authHeader = req.headers.get("Authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    console.warn("🚫 Unauthorized access attempt.");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const categoriesSnap = await db.collection("categories").get();
    const categories = categoriesSnap.docs.map((doc) => ({
      id: doc.id,
      slug: doc.data().slug,
    }));

    for (const category of categories) {
      console.log(`🔄 Recomputing thread count for category: ${category.slug}`);
      const discussionsSnapshot = await db
        .collection(category.slug)
        .doc(`${category.slug}-category`)
        .collection("discussions")
        .get();

      const subtitle = `Latest results based on ${discussionsSnapshot.size} Reddit threads.`;

      await db
        .collection("categories")
        .doc(`${category.id}`)
        .set({ subtitle }, { merge: true });
    }
    console.log("✅ Thread count recomputation completed successfully.");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 Error in cron route:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
