import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

async function fetchData(category, collectionName) {
  const data = await db
    .collection(category)
    .doc(`${category}-category`)
    .collection(collectionName)
    .get();

  return data;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category parameter is missing" },
        { status: 400 }
      );
    }

    const categoryMetaData = await db.collection(category).get();
    const categoryDiscussionData = await fetchData(category, "discussions");
    const categoryProductData = await fetchData(category, "products");
    let categorySpecialMentionsData = [];
    try {
      const specialMentionsSnapshot = await fetchData(
        category,
        "special-mentions"
      );

      if (!specialMentionsSnapshot.empty) {
        categorySpecialMentionsData = specialMentionsSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );
      }
    } catch (error) {
      console.warn(
        "Special mentions collection might not exist:",
        error.message
      );
    }

    const data = {
      ...categoryMetaData.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0],
      categoryDiscussionData: categoryDiscussionData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      categoryProductData: categoryProductData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      categorySpecialMentionsData,
    };
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error in getCategoryData API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
