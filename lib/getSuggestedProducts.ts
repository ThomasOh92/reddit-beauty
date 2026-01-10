import { supabaseAdmin } from "./supabaseClient";

type Effect = "HELPFUL" | "AVOID";

type MappingRow = {
  ingredient_id: string | number;
  effect: Effect;
};

export type SuggestedProductReview = {
  review_link: string | null;
  review_text: string | null;
  sentiment: string | null;
  skin_type_reasoning: string | null;
  skin_concern_reasoning: string | null;
};

export type SuggestedProduct = {
  id: string | number;
  title: string;
  brand: string | null;
  reviews: SuggestedProductReview[];
};

export type SuggestedProductsResult = {
  message?: string;
  products: SuggestedProduct[];
};

function normalizePick(input: unknown): string {
  return String(input ?? "").trim();
}

function isNotSurePick(input: unknown): boolean {
  const v = normalizePick(input).toLowerCase();
  return v === "not sure" || v === "not-sure" || v === "not_sure" || v === "notsure";
}

function readString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function readNullableString(value: unknown): string | null {
  const s = readString(value).trim();
  return s ? s : null;
}

function readEffect(value: unknown): Effect | undefined {
  const v = readString(value).trim().toUpperCase();
  if (v === "HELPFUL" || v === "AVOID") return v;
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function getIdByTitle(options: {
  table: string;
  titleColumn: string;
  title: string;
}): Promise<number | null> {
  const title = normalizePick(options.title);
  if (!title) return null;

  const { data, error } = await supabaseAdmin
    .from(options.table)
    .select(`id, ${options.titleColumn}`)
    .ilike(options.titleColumn, title)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const rawId = isRecord(data) ? data.id : undefined;
  if (typeof rawId === "number") return rawId;
  if (typeof rawId === "string" && rawId.trim()) return Number(rawId);
  return null;
}

async function getMappingRows(options: {
  table: string;
  fkColumn: string;
  fkId: number;
}): Promise<MappingRow[]> {
  const { data, error } = await supabaseAdmin
    .from(options.table)
    .select("ingredient_id, effect")
    .eq(options.fkColumn, options.fkId);

  if (error) throw new Error(error.message);

  const rows = Array.isArray(data) ? data : [];

  const mapped: MappingRow[] = [];
  for (const r of rows as unknown[]) {
    if (!isRecord(r)) continue;
    const ingredientId = r.ingredient_id;
    if (ingredientId === null || ingredientId === undefined) continue;
    mapped.push({
      ingredient_id: ingredientId as string | number,
      effect: readEffect(r.effect) ?? "HELPFUL",
    });
  }
  return mapped;
}

function sentimentRank(sentiment: string | null): number {
  const s = (sentiment ?? "").trim().toLowerCase();
  if (s === "positive" || s === "pos" || s === "p") return 0;
  if (s === "neutral" || s === "neu" || s === "n") return 1;
  if (s === "negative" || s === "neg") return 2;
  return 3;
}

export async function getSuggestedProducts(input: {
  skinTypeTitle: string;
  skinConcernTitle: string;
  limit?: number;
}): Promise<SuggestedProductsResult> {
  const limit = Math.max(1, Math.min(3, Number(input.limit ?? 3)));

  const skinTypeTitle = normalizePick(input.skinTypeTitle);
  const skinConcernTitle = normalizePick(input.skinConcernTitle);

  const skinTypeNotSure = isNotSurePick(skinTypeTitle);
  const concernNotSure = isNotSurePick(skinConcernTitle);

  if (skinTypeNotSure && concernNotSure) {
    return {
      message:
        "If you're not sure about both, start by figuring out your skin type first — you'll get much more accurate recommendations.",
      products: [],
    };
  }

  if (skinTypeNotSure || concernNotSure) {
    return {
      message: "Pick both a skin type and a skin concern to see suggested products.",
      products: [],
    };
  }

  const skinTypeId = await getIdByTitle({
    table: "skin_types",
    titleColumn: "title",
    title: skinTypeTitle,
  });

  const concernId = await getIdByTitle({
    table: "skin_concerns",
    titleColumn: "title",
    title: skinConcernTitle,
  });

  if (skinTypeId === null || concernId === null) {
    return {
      message: "Could not match your selection to database IDs yet.",
      products: [],
    };
  }

  const concernRows = await getMappingRows({
    table: "concern_ingredients",
    fkColumn: "concern_id",
    fkId: concernId,
  });

  const skinTypeRows = await getMappingRows({
    table: "skin_type_ingredients",
    fkColumn: "skin_type_id",
    fkId: skinTypeId,
  });

  const concernById = new Map<string, Effect>();
  for (const r of concernRows) concernById.set(String(r.ingredient_id), r.effect);

  const skinTypeById = new Map<string, Effect>();
  for (const r of skinTypeRows) skinTypeById.set(String(r.ingredient_id), r.effect);

  const intersectionIds: string[] = [];
  for (const idKey of concernById.keys()) {
    if (skinTypeById.has(idKey)) intersectionIds.push(idKey);
  }

  if (intersectionIds.length === 0) {
    return {
      message: "Not enough ingredient guidance yet to suggest products for this selection.",
      products: [],
    };
  }

  const helpfulIngredientIds = intersectionIds.filter((id) => {
    const c = concernById.get(id);
    const s = skinTypeById.get(id);
    return c !== "AVOID" && s !== "AVOID";
  });

  const avoidIngredientIds = intersectionIds.filter((id) => {
    const c = concernById.get(id);
    const s = skinTypeById.get(id);
    return c === "AVOID" || s === "AVOID";
  });

  if (helpfulIngredientIds.length === 0) {
    return {
      message: "No clearly helpful ingredient matches yet to base product suggestions on.",
      products: [],
    };
  }

  // Find products containing any helpful/avoid ingredient from the intersection.
  const { data: piData, error: piError } = await supabaseAdmin
    .from("product_ingredients")
    .select("product_id, ingredient_id")
    .in("ingredient_id", [...new Set([...helpfulIngredientIds, ...avoidIngredientIds])]);

  if (piError) throw new Error(piError.message);

  const piRows: unknown[] = Array.isArray(piData) ? piData : [];

  const productToHelpfulCount = new Map<string, number>();
  const productToHasAvoid = new Map<string, boolean>();

  for (const row of piRows) {
    if (!isRecord(row)) continue;
    const productId = readString(row.product_id);
    const ingredientId = readString(row.ingredient_id);
    if (!productId) continue;

    if (avoidIngredientIds.includes(ingredientId)) {
      productToHasAvoid.set(productId, true);
    }

    if (helpfulIngredientIds.includes(ingredientId)) {
      productToHelpfulCount.set(productId, (productToHelpfulCount.get(productId) ?? 0) + 1);
    }
  }

  // Candidate products: at least 1 helpful match, and no avoid matches.
  const candidateProductIds = Array.from(productToHelpfulCount.entries())
    .filter(([productId, count]) => count > 0 && !productToHasAvoid.get(productId))
    .sort((a, b) => b[1] - a[1])
    .map(([productId]) => productId)
    .slice(0, 20); // grab a few extra before review filtering

  if (candidateProductIds.length === 0) {
    return {
      message: "No products found that contain helpful ingredients without avoid flags for this selection.",
      products: [],
    };
  }

  // Fetch reviews relevant to BOTH skin type and concern.
  const { data: reviewData, error: reviewError } = await supabaseAdmin
    .from("reviews")
    .select(
      "review_link, review_text, sentiment, skin_type_reasoning, skin_concern_reasoning, product_id"
    )
    .in("product_id", candidateProductIds)
    .eq("skin_type_id", skinTypeId)
    .eq("skin_concern_id", concernId);

  if (reviewError) throw new Error(reviewError.message);

  const reviewRows: unknown[] = Array.isArray(reviewData) ? reviewData : [];

  const reviewsByProduct = new Map<string, SuggestedProductReview[]>();
  for (const row of reviewRows) {
    if (!isRecord(row)) continue;
    const productId = readString(row.product_id);
    if (!productId) continue;
    const list = reviewsByProduct.get(productId) ?? [];
    list.push({
      review_link: readNullableString(row.review_link),
      review_text: readNullableString(row.review_text),
      sentiment: readNullableString(row.sentiment),
      skin_type_reasoning: readNullableString(row.skin_type_reasoning),
      skin_concern_reasoning: readNullableString(row.skin_concern_reasoning),
    });
    reviewsByProduct.set(productId, list);
  }

  // Keep only products with >=1 review, then take top N by helpful score.
  const productIdsWithReviews = candidateProductIds.filter((id) => {
    const list = reviewsByProduct.get(String(id));
    return Array.isArray(list) && list.length > 0;
  });

  if (productIdsWithReviews.length === 0) {
    return {
      message: "No relevant reviews found yet to support product suggestions for this selection.",
      products: [],
    };
  }

  const chosenProductIds = productIdsWithReviews
    .sort((a, b) => (productToHelpfulCount.get(String(b)) ?? 0) - (productToHelpfulCount.get(String(a)) ?? 0))
    .slice(0, limit);

  const { data: productData, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, title, brand")
    .in("id", chosenProductIds);

  if (productError) throw new Error(productError.message);

  const rawProducts: unknown[] = Array.isArray(productData) ? productData : [];
  const productById = new Map<string, { id: string | number; title: string; brand: string | null }>();

  for (const row of rawProducts) {
    if (!isRecord(row)) continue;
    const rawId = row.id;
    const idKey = readString(rawId);
    if (!idKey) continue;

    const id: string | number =
      typeof rawId === "number" || typeof rawId === "string" ? rawId : idKey;
    productById.set(idKey, {
      id,
      title: readString(row.title) || idKey,
      brand: readNullableString(row.brand),
    });
  }

  const products: SuggestedProduct[] = chosenProductIds
    .map((idKey) => {
      const p = productById.get(String(idKey));
      if (!p) return null;

      const allReviews = reviewsByProduct.get(String(idKey)) ?? [];
      const reviews = [...allReviews]
        .sort((a, b) => sentimentRank(a.sentiment) - sentimentRank(b.sentiment))
        .slice(0, 2);

      return {
        id: p.id,
        title: p.title,
        brand: p.brand,
        reviews,
      };
    })
    .filter(Boolean) as SuggestedProduct[];

  return { products };
}
