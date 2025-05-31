import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin.js";

// Utility: Fetch all subcollections under the main category document
async function fetchAllSubcollections(category) {
  const docRef = db.collection(category).doc(`${category}-category`);
  const collections = await docRef.listCollections();

  const result = {};

  for (const subcollection of collections) {
    const snapshot = await subcollection.get();
    result[subcollection.id] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  return result;
}

// Utility: Fetch skin type data for the given category
async function fetchSkinTypeData(category) {
  const collectionRef = db.collection(category).doc(`${category}-category`).collection("skin-types");
  const snapshot = await collectionRef.get();
  const result = [];

  for (const doc of snapshot.docs) {  
    const docRef = collectionRef.doc(doc.id);
    const collections = await docRef.listCollections();
    const subresult = {id: doc.id};
    for (const subcollection of collections) {
      const snapshot = await subcollection.get();
      subresult[subcollection.id] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    result.push(subresult);
  }

  return result;

}

// Main API handler
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


    // Get all subcollections dynamically
    const subcollectionsData = await fetchAllSubcollections(category);


    // If "skinTypes" is a subcollection, call the utility to fetch skin type data
    if (subcollectionsData.hasOwnProperty("skin-types")) {
      const skinTypeData = await fetchSkinTypeData(category);
      subcollectionsData["skin-types"] = skinTypeData;
    }

    const data = {
      ...subcollectionsData,
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
