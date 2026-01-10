import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Standard client for public/authenticated access
export const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side client.
// NOTE: This currently uses the *publishable* key, so reads/writes are still subject to RLS policies.
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey
);