import { createClient } from "@supabase/supabase-js";

// Fallbacks keep `next build` from crashing when env vars aren't set yet.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-anon-key";

export const supabase = createClient(url, key);
