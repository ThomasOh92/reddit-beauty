import { db } from "../../../../lib/firebaseAdmin.js";
import { NextResponse } from "next/server";

// export async function GET(req) {
//   const authHeader = req.headers.get("Authorization");
//   const expected = `Bearer ${process.env.CRON_SECRET}`;

//   if (authHeader !== expected) {
//     return NextResponse.json(
//       { success: false, error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   try {
//     const categoriesSnap = await db.collection("categories").get();
//     const categories = categoriesSnap.docs.map((doc) => ({
//       id: doc.id,
//       slug: doc.data().slug,
//     }));

//     for (const category of categories) {
//       let slug = category.slug;
//       // get all products in the category
//       const productsSnapshot = await db
//         .collection(slug)
//         .doc(`${slug}-category`)
//         .collection("products")
//         .get();

//       const scoreMap = {};

//       // Get the the quotes for each product
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

//       // Save aggregate map (optional, for global use)
//       await db
//         .collection(slug)
//         .doc(`${slug}-category`)
//         .collection("aggregates")
//         .doc("productScoreMap")
//         .set(scoreMap, { merge: true });

//       // Compute ranking
//       const sortedProducts = Object.entries(scoreMap).sort(
//         (a, b) => b[1] - a[1]
//       );

//       for (let i = 0; i < sortedProducts.length; i++) {
//         const [productId, score] = sortedProducts[i];
//         const rank = i + 1;

//         await db
//           .collection(slug)
//           .doc(`${slug}-category`)
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

// Helper: Wilson Lower Bound score for positive/negative counts
function wilsonLowerBound(pos, neg, z = 1.96) {
  const n = pos + neg;
  if (n === 0) return 0;
  const phat = pos / n;
  const z2 = z * z;
  const numerator =
    phat + z2 / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z2 / (4 * n)) / n);
  const denominator = 1 + z2 / n;
  return numerator / denominator;
}

// Use this if you want to recompute scores for a specific category
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
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");
    if (!category) throw new Error("Missing 'category' parameter");

    // --- fetch one product or all in category ---
    let products;
    if (productId) {
      const prodRef = db
        .collection(category)
        .doc(`${category}-category`)
        .collection("products")
        .doc(productId);
      const doc = await prodRef.get();
      if (!doc.exists) {
        return NextResponse.json(
          { success: false, error: `Product ${productId} not found` },
          { status: 404 }
        );
      }
      products = [doc];
    } else {
      const snap = await db
        .collection(category)
        .doc(`${category}-category`)
        .collection("products")
        .get();
      products = snap.docs;
    }

    const scoreMap = {};

    // --- compute WLB per product ---
    for (const prodDoc of products) {
      const quotesSnap = await prodDoc.ref
        .collection("quotes")
        .select("sentiment")
        .get();

      let posCount = 0;
      let negCount = 0;
      quotesSnap.forEach((qDoc) => {
        const s = qDoc.data().sentiment;
        if (s === "positive") posCount++;
        else if (s === "negative") negCount++;
      });

      const wlbScore = wilsonLowerBound(posCount, negCount);
      scoreMap[prodDoc.id] = wlbScore;
    }

    // --- persist aggregate map (optional) ---
    await db
      .collection(category)
      .doc(`${category}-category`)
      .collection("aggregates")
      .doc("productScoreMap")
      .set(scoreMap, { merge: true });

    // --- sort by WLB descending & write back ---
    const sorted = Object.entries(scoreMap).sort(([, a], [, b]) => b - a);

    const batch = db.batch();
    sorted.forEach(([prodId, score], idx) => {
      const ref = db
        .collection(category)
        .doc(`${category}-category`)
        .collection("products")
        .doc(prodId);
      batch.set(
        ref,
        { sentiment_score: score, rank: idx + 1 },
        { merge: true }
      );
    });
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 recomputeScores error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
