"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Only the public anon key is used in the browser; Row Level Security (supabase/schema.sql) protects every row.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(URL && KEY);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  client ??= createClient(URL!, KEY!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}
