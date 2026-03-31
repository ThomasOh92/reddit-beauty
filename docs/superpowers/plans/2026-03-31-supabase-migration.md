# Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate hardcoded `data.ts` product data to Supabase, making the app read from the database at build time.

**Architecture:** A `lib/thoroughlyAnalysed.ts` data-access module replaces direct imports of `data.ts`. Types are extracted to a standalone file. All consumers become async. A one-time seed script populates Supabase from the current data.

**Tech Stack:** Next.js 15, Supabase (JS client v2), TypeScript

**Spec:** `docs/superpowers/specs/2026-03-31-supabase-migration-design.md`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/app/thoroughly-analysed/types.ts` | All type definitions (extracted from data.ts) |
| Create | `lib/thoroughlyAnalysed.ts` | Data access module — Supabase queries + column mapping |
| Create | `scripts/seed-thoroughly-analysed.ts` | One-time seed script to populate Supabase |
| Modify | `src/app/thoroughly-analysed/page.tsx` | Switch import, make async |
| Modify | `src/app/thoroughly-analysed/[slug]/page.tsx` | Switch import for data + types, await in all functions |
| Modify | `src/components/thoroughly-analysed-grid.tsx` | Switch import, make async |
| Modify | `src/app/sitemap.ts` | Switch import, await data |
| Modify | `src/app/admin/thoroughly-analysed/page.tsx` | Client-side Supabase fetch + types import |
| Modify | `lib/supabaseClient.ts` | No changes needed (existing client works) |
| Delete | `src/app/thoroughly-analysed/data.ts` | Remove after migration confirmed |

---

### Task 1: Create Supabase Table

**Files:** None (Supabase dashboard SQL editor)

- [ ] **Step 1: Run the CREATE TABLE SQL in Supabase dashboard**

Go to Supabase dashboard → SQL Editor → Run:

```sql
CREATE TABLE thoroughly_analysed_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  product_link text,
  last_checked text NOT NULL,
  curator_note text,
  molecules jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE thoroughly_analysed_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON thoroughly_analysed_products
  FOR SELECT USING (true);
```

- [ ] **Step 2: Verify table exists**

In Supabase dashboard → Table Editor, confirm `thoroughly_analysed_products` appears with the correct columns.

---

### Task 2: Extract Types to Standalone File

**Files:**
- Create: `src/app/thoroughly-analysed/types.ts`

- [ ] **Step 1: Create types.ts with all type definitions**

```typescript
export type EvidenceAtomBase = {
  id: string;
  commentary?: string;
};

export type RedditEvidenceAtom = EvidenceAtomBase & {
  kind: "reddit";
  headerParts: string[];
  excerpt: string;
  postKind: "post" | "comment";
  url: string;
  upvotes: string;
  followOnComments?: number;
  posterDetails: string;
  additionalNote?: string;
};

export type LinkEvidenceAtom = EvidenceAtomBase & {
  kind: "link";
  label?: string;
  url: string;
  excerpt?: string;
  additionalNote?: string;
};

export type InstagramEvidenceAtom = EvidenceAtomBase & {
  kind: "instagramLink";
  user: string;
  excerptFromDescription: string;
  url: string;
  additionalNote?: string;
};

export type TikTokEvidenceAtom = EvidenceAtomBase & {
  kind: "tiktokLink";
  user: string;
  excerptFromDescription: string;
  url: string;
  additionalNote?: string;
};

export type EvidenceAtom = RedditEvidenceAtom | LinkEvidenceAtom | InstagramEvidenceAtom | TikTokEvidenceAtom;

export type EvidenceMolecule = {
  id: string;
  point: string;
  commentary?: string;
  atoms: EvidenceAtom[];
};

export type ThoroughlyAnalysedProduct = {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  productLink?: string;
  lastChecked: string;
  molecules: EvidenceMolecule[];
  curatorNote?: string;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to types.ts

- [ ] **Step 3: Commit**

```bash
git add src/app/thoroughly-analysed/types.ts
git commit -m "feat: extract thoroughly-analysed types to standalone file"
```

---

### Task 3: Create Data Access Module

**Files:**
- Create: `lib/thoroughlyAnalysed.ts`

- [ ] **Step 1: Create the data access module**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/thoroughlyAnalysed.ts
git commit -m "feat: add Supabase data access module for thoroughly-analysed products"
```

---

### Task 4: Create Seed Script

**Files:**
- Create: `scripts/seed-thoroughly-analysed.ts`

- [ ] **Step 1: Create the seed script**

```typescript
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
```

- [ ] **Step 2: Add SUPABASE_SERVICE_ROLE_KEY to .env.local**

Get the service role key from Supabase dashboard → Settings → API → `service_role` key.
Add to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

- [ ] **Step 3: Run the seed script**

Run: `npx tsx scripts/seed-thoroughly-analysed.ts`
Expected output:
```
Seeded 5 products:
  - skinceuticals-ce-ferulic
  - biore-uv-aqua-rich
  - medik8-crystal-retinal
  - omnilux-red-light-therapy
  - creme-de-la-mer
```

- [ ] **Step 4: Verify data in Supabase dashboard**

Check Table Editor → `thoroughly_analysed_products` → confirm 5 rows with correct data, molecules JSON populated.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-thoroughly-analysed.ts
git commit -m "feat: add one-time seed script for thoroughly-analysed products"
```

---

### Task 5: Update Index Page (`page.tsx`)

**Files:**
- Modify: `src/app/thoroughly-analysed/page.tsx`

- [ ] **Step 1: Update imports and make component async**

Replace the entire file content:

```typescript
import Image from "next/image";
import Link from "next/link";
import { getAllThoroughlyAnalysedProducts } from "@/lib/thoroughlyAnalysed";

export default async function ThoroughlyAnalysedIndexPage() {
	const thoroughlyAnalysedProducts = await getAllThoroughlyAnalysedProducts();

	return (
		<div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4">
			<section className="rounded-2xl border border-base-200 bg-[linear-gradient(125deg,#f8fafc,#fff7ed)] p-4">
				<div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
					Thoroughly Analysed
				</div>
				<h1 className="mt-1 text-xl font-bold text-neutral-900">
					Deep Reads
				</h1>
				<p className="mt-2 text-sm text-neutral-600">
					I surface valuable reviews from Reddit and include links to high-trust sources about the product. My goal is to help you buy skincare products with more confidence!
				</p>
			</section>

			<div className="mt-4 grid gap-4">
				{thoroughlyAnalysedProducts.map((product) => (
					<Link
						key={product.slug}
						href={`/thoroughly-analysed/${product.slug}`}
						className="group rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm transition hover:border-neutral-300"
					>
						<div className="flex flex-col gap-4 md:flex-row md:items-center">
							<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
								<Image
									src={product.imageUrl}
									alt={product.name}
									fill
									sizes="96px"
									className="object-contain p-2"
								/>
							</div>
							<div className="flex-1">
								<div className="text-xs font-semibold text-neutral-900">
									{product.name}
								</div>
								<p className="mt-1 text-xs text-neutral-500">
									Category: {product.category}
								</p>
								<div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
									<span>Checked {product.lastChecked}</span>
								</div>
							</div>
							<div className="text-xs font-semibold text-primary transition group-hover:translate-x-1">
								View analysis
							</div>
						</div>
					</Link>
				))}

				<div className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm transition hover:border-neutral-300 text-center">
					<p className="text-sm font-semibold text-neutral-900">
						More coming soon
					</p>
					<p className="mt-1 text-sm text-neutral-500">
						...
					</p>
				</div>
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/app/thoroughly-analysed/page.tsx
git commit -m "refactor: switch thoroughly-analysed index to Supabase data source"
```

---

### Task 6: Update Detail Page (`[slug]/page.tsx`)

**Files:**
- Modify: `src/app/thoroughly-analysed/[slug]/page.tsx`

- [ ] **Step 1: Update imports**

Replace lines 5-6:
```typescript
// OLD:
import type { LinkEvidenceAtom } from "../data";
import { thoroughlyAnalysedProducts } from "../data";

// NEW:
import type { LinkEvidenceAtom } from "../types";
import { getAllThoroughlyAnalysedProducts, getThoroughlyAnalysedProductBySlug } from "@/lib/thoroughlyAnalysed";
```

- [ ] **Step 2: Update the page component to use async data fetch**

Replace line 72-74:
```typescript
// OLD:
  const product = thoroughlyAnalysedProducts.find(
    (item) => item.slug === slug
  );

// NEW:
  const product = await getThoroughlyAnalysedProductBySlug(slug);
```

- [ ] **Step 3: Update generateMetadata to use async data fetch**

Replace lines 471-473:
```typescript
// OLD:
  const product = thoroughlyAnalysedProducts.find(
    (item) => item.slug === slug
  );

// NEW:
  const product = await getThoroughlyAnalysedProductBySlug(slug);
```

- [ ] **Step 4: Update generateStaticParams to use async data fetch**

Replace lines 507-510:
```typescript
// OLD:
export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return thoroughlyAnalysedProducts.map((product) =>
    Promise.resolve({ slug: product.slug })
  );
}

// NEW:
export async function generateStaticParams(): Promise<PageProps["params"][]> {
  const products = await getAllThoroughlyAnalysedProducts();
  return products.map((product) =>
    Promise.resolve({ slug: product.slug })
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add src/app/thoroughly-analysed/[slug]/page.tsx
git commit -m "refactor: switch thoroughly-analysed detail page to Supabase data source"
```

---

### Task 7: Update Grid Component

**Files:**
- Modify: `src/components/thoroughly-analysed-grid.tsx`

- [ ] **Step 1: Replace entire file content**

```typescript
import Image from "next/image";
import Link from "next/link";
import { APP_URL } from "@/constants";
import { getAllThoroughlyAnalysedProducts } from "@/lib/thoroughlyAnalysed";

export default async function ThoroughlyAnalysedGrid() {
  const products = await getAllThoroughlyAnalysedProducts();
  const featuredProducts = products.map((product) => ({
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    categoryLabel: product.category,
  }));

  return (
    <section className="mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Image
          src="/skin-type.png"
          alt="Featured Products Icon"
          width={24}
          height={24}
        />
        <h2 className="text-sm font-bold text-neutral text-center">
          <Link href="/thoroughly-analysed" className="hover:underline">
            Thoroughly Analysed
          </Link>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 rounded-box bg-base-100 p-3 shadow-md">
        {featuredProducts.map((product) => {
          const fallbackLabel = (product.name || "TB")
            .replace(/\s+/g, "")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Link
              key={`featured-${product.slug}`}
              href={`${APP_URL}/thoroughly-analysed/${product.slug}`}
              className="card bg-base-200 hover:bg-base-300 shadow-sm"
            >
              <figure className="relative h-24 w-full bg-base-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 176px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[0.7rem] font-semibold uppercase text-base-content/60">
                    {fallbackLabel}
                  </div>
                )}
              </figure>
              <div className="card-body p-3">
                <div className="text-xs font-semibold text-base-content line-clamp-2 text-center">
                  {product.name}
                </div>
                {product.categoryLabel ? (
                  <div className="mt-2 rounded-box px-2 py-1 text-[0.65rem] font-semibold opacity-70 text-center bg-primary-content">
                    {product.categoryLabel}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
        <div className="card border border-dashed border-base-300 bg-base-100 shadow-sm">
          <div className="flex h-full min-h-[140px] items-center justify-center p-3">
            <span className="text-xs font-semibold text-neutral-900 text-center">
              More coming soon...
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/thoroughly-analysed-grid.tsx
git commit -m "refactor: switch thoroughly-analysed grid to Supabase data source"
```

---

### Task 8: Update Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Update import**

Replace line 6:
```typescript
// OLD:
import { thoroughlyAnalysedProducts } from "./thoroughly-analysed/data";

// NEW:
import { getAllThoroughlyAnalysedProducts } from "@/lib/thoroughlyAnalysed";
```

- [ ] **Step 2: Add Supabase fetch to existing Promise.all (line 67)**

Replace lines 67-80:
```typescript
// OLD:
  const [posts, categories] = await Promise.all([
    // Blog posts (Sanity)
    client.fetch(groq`*[_type == "post"
      && defined(slug.current)
      && defined(publishedAt)
      && publishedAt <= now()
      && !(_id in path("drafts.**"))
    ]{
      "slug": slug.current,
      "lastmod": coalesce(dateModified, publishedAt)
    }`),
    // Categories (Firestore)
    fetchCategories()
  ]);

// NEW:
  const [posts, categories, thoroughlyAnalysedProducts] = await Promise.all([
    // Blog posts (Sanity)
    client.fetch(groq`*[_type == "post"
      && defined(slug.current)
      && defined(publishedAt)
      && publishedAt <= now()
      && !(_id in path("drafts.**"))
    ]{
      "slug": slug.current,
      "lastmod": coalesce(dateModified, publishedAt)
    }`),
    // Categories (Firestore)
    fetchCategories(),
    // Thoroughly Analysed (Supabase)
    getAllThoroughlyAnalysedProducts()
  ]);
```

- [ ] **Step 3: Update the entries block (lines 87-92) — remove the old import reference**

Replace lines 87-92:
```typescript
// OLD:
  const thoroughlyAnalysedEntries: SitemapEntry[] = [
    { url: `${APP_URL}/thoroughly-analysed` },
    ...thoroughlyAnalysedProducts.map((product) => ({
      url: `${APP_URL}/thoroughly-analysed/${product.slug}`,
    })),
  ];

// NEW (unchanged, but now uses the variable from Promise.all above):
  const thoroughlyAnalysedEntries: SitemapEntry[] = [
    { url: `${APP_URL}/thoroughly-analysed` },
    ...thoroughlyAnalysedProducts.map((product) => ({
      url: `${APP_URL}/thoroughly-analysed/${product.slug}`,
    })),
  ];
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "refactor: switch sitemap to Supabase for thoroughly-analysed products"
```

---

### Task 9: Update Admin Page (Client-Side Fetch)

**Files:**
- Modify: `src/app/admin/thoroughly-analysed/page.tsx`

- [ ] **Step 1: Update type imports**

Replace lines 3-12:
```typescript
// OLD:
import { useState, useEffect, useRef } from "react";
import type {
  ThoroughlyAnalysedProduct,
  EvidenceMolecule,
  EvidenceAtom,
  RedditEvidenceAtom,
  LinkEvidenceAtom,
  InstagramEvidenceAtom,
} from "../../thoroughly-analysed/data";
import { thoroughlyAnalysedProducts } from "../../thoroughly-analysed/data";

// NEW:
import { useState, useEffect, useRef } from "react";
import type {
  ThoroughlyAnalysedProduct,
  EvidenceMolecule,
  EvidenceAtom,
  RedditEvidenceAtom,
  LinkEvidenceAtom,
  InstagramEvidenceAtom,
} from "../../thoroughly-analysed/types";
import { supabase } from "@/lib/supabaseClient";
```

- [ ] **Step 2: Add state and useEffect for client-side data fetching**

After line 293 (`const exportDialogRef = useRef<HTMLDialogElement>(null);`), add:

```typescript
const [allProducts, setAllProducts] = useState<ThoroughlyAnalysedProduct[]>([]);

useEffect(() => {
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("thoroughly_analysed_products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch products:", error.message);
      return;
    }

    const mapped = (data ?? []).map((row: Record<string, unknown>) => ({
      name: row.name as string,
      slug: row.slug as string,
      category: row.category as string,
      imageUrl: row.image_url as string,
      productLink: (row.product_link as string) ?? undefined,
      lastChecked: row.last_checked as string,
      curatorNote: (row.curator_note as string) ?? undefined,
      molecules: row.molecules as EvidenceMolecule[],
    }));

    setAllProducts(mapped);
  }
  fetchProducts();
}, []);
```

- [ ] **Step 3: Replace all 3 references to `thoroughlyAnalysedProducts` with `allProducts`**

There are 3 locations that reference the old imported array:

**Line 443** — `loadExisting` function:
```typescript
// OLD:
    const found = thoroughlyAnalysedProducts.find((p) => p.slug === slug);
// NEW:
    const found = allProducts.find((p) => p.slug === slug);
```

**Line 515** — dropdown `<select>` options:
```typescript
// OLD:
              {thoroughlyAnalysedProducts.map((p) => (
// NEW:
              {allProducts.map((p) => (
```

**Lines 1696-1703** — export dialog helper text (update since `data.ts` no longer exists):
```typescript
// OLD:
            <p className="mb-3 text-xs text-gray-500">
              Paste this object into the{" "}
              <code className="rounded bg-gray-100 px-1">
                thoroughlyAnalysedProducts
              </code>{" "}
              array in{" "}
              <code className="rounded bg-gray-100 px-1">data.ts</code>
            </p>
// NEW:
            <p className="mb-3 text-xs text-gray-500">
              Export of the current product data:
            </p>
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/thoroughly-analysed/page.tsx
git commit -m "refactor: switch admin page to client-side Supabase fetch"
```

---

### Task 10: Delete data.ts and Verify Build

**Files:**
- Delete: `src/app/thoroughly-analysed/data.ts`

- [ ] **Step 1: Verify no remaining imports of data.ts**

Run: `grep -r "from.*thoroughly-analysed/data" src/ --include="*.ts" --include="*.tsx"`
Expected: No results (all imports have been migrated)

Run: `grep -r "from.*thoroughly-analysed/data" lib/ --include="*.ts"`
Expected: No results

- [ ] **Step 2: Delete data.ts**

```bash
rm src/app/thoroughly-analysed/data.ts
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run Next.js build**

Run: `npx next build`
Expected: Build succeeds (pages will attempt Supabase queries — ensure `.env.local` is populated)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove data.ts — all thoroughly-analysed data now served from Supabase"
```

---

### Task 11: Smoke Test

- [ ] **Step 1: Start dev server and test pages**

Run: `npx next dev`

Test these URLs in browser:
- `http://localhost:3000/thoroughly-analysed` — should list all 5 products
- `http://localhost:3000/thoroughly-analysed/skinceuticals-ce-ferulic` — should render full detail page
- `http://localhost:3000/thoroughly-analysed/creme-de-la-mer` — test another product
- `http://localhost:3000` — home page grid should show products
- `http://localhost:3000/admin/thoroughly-analysed` — should load products from Supabase

- [ ] **Step 2: Test sitemap**

Visit: `http://localhost:3000/sitemap.xml`
Confirm thoroughly-analysed product URLs are present.

- [ ] **Step 3: Commit any fixes if needed**
