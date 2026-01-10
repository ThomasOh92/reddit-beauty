import { supabaseAdmin } from "./supabaseClient";

export type TestTableRow = {
  id: number;
  created_at: string | null;
  content: string | null;
};

export async function getTestTableRows(limit = 10): Promise<TestTableRow[]> {
  // NOTE: This read currently relies on an RLS policy scoped to `public."Test Table"` that allows public SELECTs, e.g.
  // alter policy "Enable read access for all users" on "public"."Test Table" to public using (true);
  const { data, error } = await supabaseAdmin
    .from("Test Table")
    .select("id, created_at, content")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as TestTableRow[];
}
