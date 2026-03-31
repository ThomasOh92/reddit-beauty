# Thoroughly Analysed Products: Supabase Migration

**Date:** 2026-03-31
**Status:** Approved

## Goal

Move the hardcoded `data.ts` product data into Supabase so the app reads from the database instead of a local file. A separate project handles writing/admin. This project becomes read-only.

## Decisions

- **Approach:** Direct Supabase calls via a data-access module (no API route intermediary)
- **Table design:** Hybrid — top-level columns for queryable fields, JSONB for nested molecules/atoms
- **Rendering:** Static generation (SSG) at build time, redeploy to pick up changes
- **RLS:** Public read (anon SELECT), no auth required
- **Seed:** One-time script to populate Supabase from current data.ts

## Supabase Table: `thoroughly_analysed_products`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, `gen_random_uuid()` | Auto-generated |
| `name` | `text` | NOT NULL | Product name |
| `slug` | `text` | UNIQUE, NOT NULL | URL slug, used for lookups and static params |
| `category` | `text` | NOT NULL | Product category |
| `image_url` | `text` | NOT NULL | Product image URL |
| `product_link` | `text` | nullable | Affiliate/product link |
| `last_checked` | `text` | NOT NULL | Human-readable date string |
| `curator_note` | `text` | nullable | Curator's summary note |
| `molecules` | `jsonb` | NOT NULL, default `'[]'` | Full nested molecules/atoms structure |
| `created_at` | `timestamptz` | default `now()` | Row creation timestamp |

### RLS Policy

```sql
ALTER TABLE thoroughly_analysed_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON thoroughly_analysed_products
  FOR SELECT USING (true);
```

### SQL to Create Table

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

## Types File: `src/app/thoroughly-analysed/types.ts`

Extract all type definitions from `data.ts` into a standalone file. Exported types:

- `EvidenceAtomBase`
- `RedditEvidenceAtom`
- `LinkEvidenceAtom`
- `InstagramEvidenceAtom`
- `TikTokEvidenceAtom`
- `EvidenceAtom`
- `EvidenceMolecule`
- `ThoroughlyAnalysedProduct`

No changes to type shapes — just moved to their own file.

## Data Access Module: `lib/thoroughlyAnalysed.ts`

```typescript
import { supabase } from "./supabaseClient";
import type { ThoroughlyAnalysedProduct } from "@/app/thoroughly-analysed/types";

export async function getAllThoroughlyAnalysedProducts(): Promise<ThoroughlyAnalysedProduct[]> {
  // SELECT all, ordered by created_at ASC (preserves original array order)
  // map snake_case DB columns to camelCase types
  // Cast molecules JSONB to EvidenceMolecule[] (trusted curator-managed data)
  // Throw on query error (fail build loudly)
}

export async function getThoroughlyAnalysedProductBySlug(slug: string): Promise<ThoroughlyAnalysedProduct | null> {
  // SELECT by slug, map to type
  // Throw on query error
}
```

### Column Mapping (DB → TypeScript)
- `image_url` → `imageUrl`
- `product_link` → `productLink`
- `last_checked` → `lastChecked`
- `curator_note` → `curatorNote`

### Design Decisions
- **Ordering:** `ORDER BY created_at ASC` to preserve insertion order
- **JSONB typing:** Simple `as EvidenceMolecule[]` cast — data is written by our own curator tooling, not user input
- **Error handling:** Throw on Supabase errors so builds fail loudly rather than producing empty pages

## Consumer Changes

| File | Current Import | New Import | Other Changes |
|------|---------------|------------|---------------|
| `src/app/thoroughly-analysed/page.tsx` | `./data` | `@/lib/thoroughlyAnalysed` | Make component async, await data |
| `src/app/thoroughly-analysed/[slug]/page.tsx` | `../data` | `@/lib/thoroughlyAnalysed` + `../types` | Await data in page, generateStaticParams, and generateMetadata |
| `src/components/thoroughly-analysed-grid.tsx` | `@/app/thoroughly-analysed/data` | `@/lib/thoroughlyAnalysed` | Make component async, await data |
| `src/app/sitemap.ts` | `./thoroughly-analysed/data` | `@/lib/thoroughlyAnalysed` | Await data |
| `src/app/admin/thoroughly-analysed/page.tsx` | `../../thoroughly-analysed/data` | Direct Supabase client call + `../types` | Client-side fetch (see note below) |

### Admin Page Note

The admin page is a `"use client"` component, so it cannot use the async server-side data access module directly. Instead, it will:
1. Import `supabase` from `@/lib/supabaseClient` directly
2. Fetch products client-side in a `useEffect` with the same query/mapping logic
3. Import types only from `../types`

This is acceptable because (a) the admin page is being moved to a separate project soon, and (b) the data is publicly readable via RLS anyway.

## Seed Script: `scripts/seed-thoroughly-analysed.ts`

One-time script that:
1. Imports the current `thoroughlyAnalysedProducts` array from data.ts
2. Maps each product to the DB schema (camelCase → snake_case)
3. Upserts into Supabase using `slug` as the conflict key

Run: `npx tsx scripts/seed-thoroughly-analysed.ts`

The script creates its own Supabase client using `SUPABASE_SERVICE_ROLE_KEY` env var (not the publishable key from `supabaseClient.ts`), since RLS only allows SELECT for the anon role.

## Deletion

After confirming the migration works:
- Delete `src/app/thoroughly-analysed/data.ts`
- Delete `scripts/seed-thoroughly-analysed.ts` (optional, one-time use)

## Out of Scope

- Admin/write functionality (handled by separate project)
- Real-time updates or ISR
- Normalized table design for molecules/atoms
