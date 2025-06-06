import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

async function fetchProductBySlug(category, slug) {
  console.log(category);
  console.log(slug);

  // Reference to the slug document
  const slugDocRef = db
    .collection(category)
    .doc(`${category}-category`)
    .collection("slugs")
    .doc(slug);

  const slugDocSnap = await slugDocRef.get();

  if (!slugDocSnap.exists) throw new Error("Slug not found");

  const { productId } = slugDocSnap.data();

  // Reference to the product document using retrieved productId
  // Try to find the product in "products" collection
  let productDocRef = db
    .collection(category)
    .doc(`${category}-category`)
    .collection("products")
    .doc(productId);

  let productDocSnap = await productDocRef.get();

  // If not found, try "special-mentions"
  if (!productDocSnap.exists) {
    productDocRef = db
      .collection(category)
      .doc(`${category}-category`)
      .collection("special-mentions")
      .doc(productId);

    productDocSnap = await productDocRef.get();
  }

  // If still not found, try "skin-types" subcollections
  if (!productDocSnap.exists) {
    const skinTypesColRef = db
      .collection(category)
      .doc(`${category}-category`)
      .collection("skin-types");

    const skinTypesSnap = await skinTypesColRef.get();
    let found = false;

    for (const skinTypeDoc of skinTypesSnap.docs) {
      const skinTypeProductsRef = skinTypeDoc.ref.collection("products").doc(productId);
      const skinTypeProductSnap = await skinTypeProductsRef.get();
      if (skinTypeProductSnap.exists) {
        productDocRef = skinTypeProductsRef;
        productDocSnap = skinTypeProductSnap;
        found = true;
        break;
      }
    }
    if (!found) throw new Error("Product not found");
  }

  if (!productDocSnap.exists) throw new Error("Product not found");

  return productDocSnap.data();
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
