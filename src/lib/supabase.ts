import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project-id") &&
      !supabaseAnonKey.includes("your-supabase-anon-key")
  );
}

let browserClient: SupabaseClient | null = null;

/**
 * Returns the public Supabase client (uses anon key + RLS).
 * Safe for client components and public server reads.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

/**
 * Server-side Supabase client. Uses service role key ONLY on the server
 * when available, otherwise falls back to the anon key.
 * NEVER import or call this from client components.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const keyToUse =
    serviceRoleKey && !serviceRoleKey.includes("your-supabase-service-role-key")
      ? serviceRoleKey
      : supabaseAnonKey;

  return createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

