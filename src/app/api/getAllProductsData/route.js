import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

export async function GET() {
  try {
    // Get all categories
    const categoriesSnap = await db.collection("categories").get();
    const categories = categoriesSnap.docs.map(doc => doc.data());

    const allProducts = [];

    for (const category of categories) {
      if (!category.readyForDisplay) continue;

      // Fetch normal products
      const normalProductsSnap = await db
        .collection(category.slug)
        .doc(`${category.slug}-category`)
        .collection("products")
        .get();

      normalProductsSnap.docs.forEach(doc => {
        const productData = doc.data();
        if (productData.slug) {
          allProducts.push({
            slug: productData.slug,
            category: category.slug,
          });
        }
      });

      // Fetch skin-type products if skin-types exists
      const categoryDoc = await db.collection(category.slug).doc(`${category.slug}-category`).get();
      // Check if 'skin-types' subcollection exists
      const skinTypesSnap = await categoryDoc.ref.collection("skin-types").limit(1).get();
      
      if (!skinTypesSnap.empty) {
        const skinTypesSnap = await db
          .collection(category.slug)
          .doc(`${category.slug}-category`)
          .collection("skin-types")
          .get();

        // Loop through each skin type doc
        for (const skinTypeDoc of skinTypesSnap.docs) {
          const skinType = skinTypeDoc.id;
          // For each subcollection under this skinType (should be "products" or similar)
          const skinTypeProductsSnap = await skinTypeDoc.ref.collection("products").get();
          // Fetch products for this skin type
          skinTypeProductsSnap.docs.forEach(doc => {
            const productData = doc.data();
            if (productData.slug) {
              allProducts.push({
                slug: productData.slug,
                category: category.slug,
                skinType: skinType
              });
            }
          });
        }


      }

      // Fetch special mention products if they exist
      const specialMentionExistsSnap = await db
          .collection(category.slug)
          .doc(`${category.slug}-category`)
          .collection("special-mentions")
          .limit(1)
          .get();
      if (!specialMentionExistsSnap.empty) {
          const specialMentionSnap = await db
            .collection(category.slug)
            .doc(`${category.slug}-category`)
            .collection("special-mentions")
            .get();
          specialMentionSnap.docs.forEach(doc => {
            const productData = doc.data();
            if (productData.slug) {
            allProducts.push({
              slug: productData.slug,
              category: category.slug,
              specialMention: true
            });
            }
          });
      }
        
    }

    return NextResponse.json({ success: true, data: allProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
