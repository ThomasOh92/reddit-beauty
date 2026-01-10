import { supabaseAdmin } from "./supabaseClient";

export type IngredientEffect = "HELPFUL" | "AVOID";

export type ScienceBasicsIngredient = {
  id: string | number;
  name: string;
  description: string | null;
  effect: IngredientEffect;
  concernEffect?: IngredientEffect;
  concernNote?: string | null;
  skinTypeEffect?: IngredientEffect;
  skinTypeNote?: string | null;
};

export type ScienceBasicsResult = {
  message?: string;
  ingredients: ScienceBasicsIngredient[];
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

function readEffect(value: unknown): IngredientEffect | undefined {
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

  if (error) {
    throw new Error(error.message);
  }

  const rawId = isRecord(data) ? data.id : undefined;
  if (typeof rawId === "number") return rawId;
  if (typeof rawId === "string" && rawId.trim()) return Number(rawId);
  return null;
}

type MappingRow = {
  ingredient_id: string | number;
  effect: IngredientEffect;
  note: string | null;
};

async function getMappingRows(options: {
  table: string;
  fkColumn: string;
  fkId: number;
}): Promise<MappingRow[]> {
  const { data, error } = await supabaseAdmin
    .from(options.table)
    .select("ingredient_id, effect, note")
    .eq(options.fkColumn, options.fkId);

  if (error) {
    throw new Error(error.message);
  }

  const rows = Array.isArray(data) ? data : [];
  const parsed = rows.map((r) => {
    const row = (r ?? {}) as Record<string, unknown>;

    return {
      ingredient_id: row["ingredient_id"],
      effect: readEffect(row["effect"]) ?? "HELPFUL",
      note: readNullableString(row["note"]),
    };
  });

  return parsed.filter((r): r is MappingRow => {
    const id = r.ingredient_id;
    return typeof id === "number" || (typeof id === "string" && id.trim().length > 0);
  });
}

export async function getScienceBasics(input: {
  skinTypeTitle: string;
  skinConcernTitle: string;
}): Promise<ScienceBasicsResult> {
  const skinTypeTitle = normalizePick(input.skinTypeTitle);
  const skinConcernTitle = normalizePick(input.skinConcernTitle);

  const skinTypeNotSure = isNotSurePick(skinTypeTitle);
  const concernNotSure = isNotSurePick(skinConcernTitle);

  if (skinTypeNotSure && concernNotSure) {
    return {
      message:
        "If you're not sure about both, start by figuring out your skin type first — you'll get much more accurate ingredient guidance.",
      ingredients: [],
    };
  }

  if (skinTypeNotSure) {
    return {
      message: "Pick a skin type to see ingredient guidance.",
      ingredients: [],
    };
  }

  if (concernNotSure) {
    return {
      message: "Pick a skin concern to see ingredient guidance.",
      ingredients: [],
    };
  }

  const skinTypeId = skinTypeNotSure
    ? null
    : await getIdByTitle({ table: "skin_types", titleColumn: "title", title: skinTypeTitle });

  const concernId = concernNotSure
    ? null
    : await getIdByTitle({ table: "skin_concerns", titleColumn: "title", title: skinConcernTitle });

  const concernRows =
    concernId === null ? [] : await getMappingRows({ table: "concern_ingredients", fkColumn: "concern_id", fkId: concernId });

  const skinTypeRows =
    skinTypeId === null ? [] : await getMappingRows({ table: "skin_type_ingredients", fkColumn: "skin_type_id", fkId: skinTypeId });

  const byIngredientId = new Map<string, ScienceBasicsIngredient>();

  const concernById = new Map<string, MappingRow>();
  for (const r of concernRows) concernById.set(String(r.ingredient_id), r);

  const skinTypeById = new Map<string, MappingRow>();
  for (const r of skinTypeRows) skinTypeById.set(String(r.ingredient_id), r);

  // Only include ingredients that match BOTH the selected concern and skin type.
  const intersectionIds = new Set<string>();
  for (const idKey of concernById.keys()) {
    if (skinTypeById.has(idKey)) intersectionIds.add(idKey);
  }

  if (intersectionIds.size === 0) {
    return {
      message: "No ingredient matches found for this selection yet.",
      ingredients: [],
    };
  }

  // Fetch ingredient descriptions. We select `*` to avoid coupling to exact column names.
  const { data: ingredientData, error: ingredientError } = await supabaseAdmin
    .from("ingredients")
    .select("*")
    .in("id", Array.from(intersectionIds));

  if (ingredientError) {
    throw new Error(ingredientError.message);
  }

  const ingredientsRaw: unknown[] = Array.isArray(ingredientData) ? ingredientData : [];
  for (const row of ingredientsRaw) {
    if (!isRecord(row)) continue;

    const rawId = row.id;
    const idKey = readString(rawId) || String(rawId);
    const id: string | number =
      typeof rawId === "number" || typeof rawId === "string" ? rawId : idKey;
    const name =
      readString(row.title) ||
      readString(row.name) ||
      readString(row.ingredient) ||
      idKey;

    byIngredientId.set(idKey, {
      id,
      name,
      description: readNullableString(row.description),
      effect: "HELPFUL",
    });
  }

  for (const idKey of intersectionIds) {
    const concern = concernById.get(idKey);
    const skinType = skinTypeById.get(idKey);

    const existing = byIngredientId.get(idKey) ?? {
      id: idKey,
      name: idKey,
      description: null,
      effect: "HELPFUL" as const,
    };

    const concernEffect = concern?.effect;
    const skinTypeEffect = skinType?.effect;

    const overall: IngredientEffect =
      concernEffect === "AVOID" || skinTypeEffect === "AVOID" ? "AVOID" : "HELPFUL";

    byIngredientId.set(idKey, {
      ...existing,
      effect: overall,
      concernEffect,
      concernNote: concern?.note ?? null,
      skinTypeEffect,
      skinTypeNote: skinType?.note ?? null,
    });
  }

  const effectRank = (e: IngredientEffect) => (e === "HELPFUL" ? 0 : 1);

  const ingredients = Array.from(byIngredientId.values()).sort((a, b) => {
    const diff = effectRank(a.effect) - effectRank(b.effect);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });

  return { ingredients };
}
