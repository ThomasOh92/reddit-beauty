import { db } from "../../../../lib/firebaseAdmin.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authHeader = req.headers.get("Authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
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
      // get all products in the category
      const productsSnapshot = await db
        .collection(category.slug)
        .doc(`${category}-category`)
        .collection("products")
        .get();

      const scoreMap = {};

      // Get the the quotes for each product
      for (const productDoc of productsSnapshot.docs) {
        let total = 0;

        const quotesSnapshot = await productDoc.ref
          .collection("quotes")
          .select("sentiment", "score")
          .get();

        quotesSnapshot.forEach((doc) => {
          const q = doc.data();
          if (q.sentiment === "positive" && typeof q.score === "number") {
            total += q.score;
          }
        });

        scoreMap[productDoc.id] = total;
      }

      // Save aggregate map (optional, for global use)
      await db
        .collection(category)
        .doc(`${category}-category`)
        .collection("aggregates")
        .doc("productScoreMap")
        .set(scoreMap, { merge: true });

      // Compute ranking
      const sortedProducts = Object.entries(scoreMap).sort(
        (a, b) => b[1] - a[1]
      );

      for (let i = 0; i < sortedProducts.length; i++) {
        const [productId, score] = sortedProducts[i];
        const rank = i + 1;

        await db
          .collection(category)
          .doc(`${category}-category`)
          .collection("products")
          .doc(productId)
          .set({ upvote_count: score, rank }, { merge: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// export async function GET(req) {
//   const authHeader = req.headers.get("Authorization");
//   const expected = `Bearer ${process.env.CRON_SECRET}`;

//   if (authHeader !== expected) {
//     return NextResponse.json(
//       { success: false, error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const { searchParams } = new URL(req.url);
//   const testCategory = searchParams.get("category");

//   try {
//     const categories = [];

//     if (testCategory) {
//       categories.push(testCategory);
//     } else {
//       const categoriesSnap = await db.collection("categories").get();
//       categories.push(...categoriesSnap.docs.map((doc) => doc.id));
//     }

//     for (const category of categories) {
//       const productsSnapshot = await db
//         .collection(category)
//         .doc(`${category}-category`)
//         .collection("products")
//         .get();

//       const scoreMap = {};

//       for (const productDoc of productsSnapshot.docs) {
//         let total = 0;

//         const quotesSnapshot = await productDoc.ref
//           .collection("quotes")
//           .select("sentiment", "score")
//           .get();

//         quotesSnapshot.forEach((doc) => {
//           const q = doc.data();
//           if (q.sentiment === "positive" && typeof q.score === "number") {
//             total += q.score;
//           }
//         });

//         scoreMap[productDoc.id] = total;
//       }

//       await db
//         .collection(category)
//         .doc(`${category}-category`)
//         .collection("aggregates")
//         .doc("productScoreMap")
//         .set(scoreMap, { merge: true });

//       const sortedProducts = Object.entries(scoreMap).sort(
//         (a, b) => b[1] - a[1]
//       );

//       for (let i = 0; i < sortedProducts.length; i++) {
//         const [productId, score] = sortedProducts[i];
//         const rank = i + 1;

//         await db
//           .collection(category)
//           .doc(`${category}-category`)
//           .collection("products")
//           .doc(productId)
//           .set({ upvote_count: score, rank }, { merge: true });
//       }
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("🔥 recomputeScores error:", err);
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }
