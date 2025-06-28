import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

async function fetchQuotes(productDocRef) {
  try {
    const quotesSnap = await productDocRef.collection("quotes").get();
    const result = [];

    quotesSnap.forEach((quoteDoc) => {
      const quoteData = quoteDoc.data();
      result.push({
        ...quoteData,
        id: quoteDoc.id,
      });
    });

    return result;
  } catch (e) {
    console.error("Error fetching quotes:", e);
    return {};
  }
}

async function fetchProductBySlug(category, slug) {
  const slugDocRef = db
    .collection(category)
    .doc(`${category}-category`)
    .collection("slugs")
    .doc(slug);

  const slugDocSnap = await slugDocRef.get();

  if (!slugDocSnap.exists) throw new Error("Slug not found");

  const { productId } = slugDocSnap.data();
  const basePath = db.collection(category).doc(`${category}-category`);

  let productDocRef = basePath.collection("products").doc(productId);
  let productDocSnap = await productDocRef.get();

  if (!productDocSnap.exists) {
    const skinTypesSnap = await basePath.collection("skin-types").get();
    let found = false;

    for (const skinTypeDoc of skinTypesSnap.docs) {
      const skinTypeProductRef = skinTypeDoc.ref.collection("products").doc(productId);
      const skinTypeProductSnap = await skinTypeProductRef.get();
      if (skinTypeProductSnap.exists) {
        productDocRef = skinTypeProductRef;
        productDocSnap = skinTypeProductSnap;
        found = true;
        break;
      }
    }

    if (!found) throw new Error("Product not found");
  }

  if (!productDocSnap.exists) throw new Error("Product not found");

  const productData = productDocSnap.data();
  const quotes = await fetchQuotes(productDocRef);

  return {
    ...productData,
    quotes,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (!category || !slug) {
      return NextResponse.json(
        { success: false, error: "Category or Slug parameter missing" },
        { status: 400 }
      );
    }

    const productData = await fetchProductBySlug(category, slug);
    return NextResponse.json({ success: true, productData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
