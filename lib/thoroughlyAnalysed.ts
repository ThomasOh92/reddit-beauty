import { supabase } from "./supabaseClient";
import type { ThoroughlyAnalysedProduct, EvidenceMolecule } from "@/app/thoroughly-analysed/types";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_url: string;
  product_link: string | null;
  last_checked: string;
  curator_note: string | null;
  molecules: unknown;
  created_at: string;
};

function mapRowToProduct(row: ProductRow): ThoroughlyAnalysedProduct {
  return {
    name: row.name,
    slug: row.slug,
    category: row.category,
    imageUrl: row.image_url,
    productLink: row.product_link ?? undefined,
    lastChecked: row.last_checked,
    curatorNote: row.curator_note ?? undefined,
    molecules: row.molecules as EvidenceMolecule[],
  };
}

export async function getAllThoroughlyAnalysedProducts(): Promise<ThoroughlyAnalysedProduct[]> {
  const { data, error } = await supabase
    .from("thoroughly_analysed_products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch thoroughly analysed products: ${error.message}`);
  }

  return (data as ProductRow[]).map(mapRowToProduct);
}

export async function getThoroughlyAnalysedProductBySlug(
  slug: string
): Promise<ThoroughlyAnalysedProduct | null> {
  const { data, error } = await supabase
    .from("thoroughly_analysed_products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // no rows found
    throw new Error(`Failed to fetch product "${slug}": ${error.message}`);
  }

  return mapRowToProduct(data as ProductRow);
}
