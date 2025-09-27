const TITLE_MAX = 60;

const PRODUCT_TERMS = new Set([
  "serum","essence","cleanser","toner","moisturizer","cream","gel","lotion",
  "sunscreen","spf","mask","oil","ampoule","treatment","balm","peel","exfoliant"
]);

const PHRASE_MAP: Array<[RegExp,string]> = [
  [/\bHyaluronic Acid\b/gi, "HA"],
  [/\bSodium Hyaluronate\b/gi, "HA"],
  [/\bSalicylic Acid\b/gi, "SA"],
  [/\bBenzoyl Peroxide\b/gi, "BPO"],
  [/\bVitamin\s*C\b/gi, "Vit C"],
];

const FLUFF = new Set([
  "the","a","an","with","for","and","plus","new","advanced","original","formula",
  "solution","care","natural","organic","intense","ultra","deep","daily","premium",
  "power","complex","hydration","of","on"
]);

function clean(s: string) {
  return s
    .replace(/\s*[\(\[\{][^\)\]\}]{0,80}[\)\]\}]\s*/g," ")
    .replace(/\b\d+(\.\d+)?\s*(ml|g|mg|oz|fl\s*oz|pcs|ct|pack|x\s*\d+)\b/gi,"")
    .replace(/[–—]/g,"-")
    .replace(/\s+/g," ")
    .trim();
}

function applyMap(s: string) {
  for (const [re, sub] of PHRASE_MAP) s = s.replace(re, sub);
  return s.replace(/\s+/g," ").trim();
}

function splitBrandRest(name: string): { brand: string; rest: string } {
  const tokens = name.split(" ");
  // Expand brand until we hit a product term (heuristic)
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i].toLowerCase().replace(/[^\w\-+]/g,"");
    if (PRODUCT_TERMS.has(t) || t === "spf") break;
    i++;
    // limit: don’t call the whole name “brand”
    if (i >= 4) break; // up to 4 tokens (handles “La Roche-Posay” / “The Inkey List”)
  }
  if (i === 0) i = 1; // at least keep first token as brand
  return { brand: tokens.slice(0,i).join(" ").trim(), rest: tokens.slice(i).join(" ").trim() };
}

function dropFluff(s: string) {
  return s
    .split(" ")
    .filter(w => !FLUFF.has(w.toLowerCase().replace(/[^\w\-+]/g,"")))
    .join(" ")
    .replace(/\s+/g," ")
    .trim();
}

function smartEllipsis(s: string, max: number) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const i = cut.lastIndexOf(" ");
  const head = (i > 20 ? cut.slice(0, i) : cut).replace(/[.,;:\-–—\s]+$/,"");
  return head + "…";
}

export function shortenProductName(raw: string, max = TITLE_MAX) {
  const s = clean(raw);
  const { brand } = splitBrandRest(s);
  let { rest } = splitBrandRest(s);

  // If brand alone blows the budget, truncate brand (rare, but safe)
  if (brand.length > max) return smartEllipsis(brand, max);

  // Work the rest first
  rest = applyMap(rest);
  rest = dropFluff(rest);

  // Compose and adjust
  let combined = rest ? `${brand} ${rest}` : brand;
  if (combined.length <= max) return combined;

  // If still long, try truncating the rest but keep brand intact
  const budgetForRest = max - (brand.length + 1); // space
  if (budgetForRest <= 0) return brand; // no room for rest
  const trimmedRest = smartEllipsis(rest, budgetForRest);
  combined = `${brand} ${trimmedRest}`;
  if (combined.length <= max) return combined;

  // Absolute fallback
  return smartEllipsis(combined, max);
}
