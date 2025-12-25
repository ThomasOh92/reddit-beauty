import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { getProductData } from "../../../../lib/getProductData";

/**
 * Handles fetching paginated quotes for a product.
 * @param {Request} request The incoming request object.
 */
export async function POST(request) {
  try {
    const { category, productSlug, cursorId, limit } = await request.json();

    if (!category || !productSlug) {
      return NextResponse.json(
        { error: "Missing category or productSlug" },
        { status: 400 }
      );
    }

    let startAfterDoc = null;

    // If a cursorId is provided, we fetch that specific document
    // to use it as the starting point for the next query.
    if (cursorId) {
      // 1. Resolve slug → productId (exactly like getProductData)
      const baseRef    = db.collection(category).doc(`${category}-category`);
      const slugSnap   = await baseRef.collection("slugs").doc(productSlug).get();
      if (slugSnap.exists) {
        const { productId } = slugSnap.data();
        // 2. Grab the real product doc
        const prodRef = baseRef.collection("products").doc(productId);
        // 3. Now fetch your “cursor” quote
        const cursorSnap = await prodRef
          .collection("quotes")
          .doc(cursorId)
          .get();
        if (cursorSnap.exists) {
          startAfterDoc = cursorSnap;
        }
      }
    }


    // Call your amended getProductData function, passing the cursor
    const pageLimit = Number.isFinite(limit) ? limit : 5;

    const data = await getProductData(category, productSlug, {
      limit: Math.max(1, Math.min(20, pageLimit)),
      startAfter: startAfterDoc,
    });

    if (!data) {
       return NextResponse.json({ quotes: [], nextCursorId: null });
    }

    // Prepare the response for the client
    const response = {
      quotes: data.quotes,
      nextCursorId: data.nextCursor ? data.nextCursor.id : null,
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("API Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}