import { createClient } from "@supabase/supabase-js";
import { thoroughlyAnalysedProducts } from "../src/app/thoroughly-analysed/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  const rows = thoroughlyAnalysedProducts.map((p) => ({
    name: p.name,
    slug: p.slug,
    category: p.category,
    image_url: p.imageUrl,
    product_link: p.productLink ?? null,
    last_checked: p.lastChecked,
    curator_note: p.curatorNote ?? null,
    molecules: p.molecules,
  }));

  const { data, error } = await supabase
    .from("thoroughly_analysed_products")
    .upsert(rows, { onConflict: "slug" })
    .select("slug");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data.length} products:`);
  data.forEach((row) => console.log(`  - ${row.slug}`));
}

seed();
