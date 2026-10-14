import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client dengan Service Role Key
 * HANYA digunakan di Server Components, API Routes, dan Server Actions
 * untuk mutasi data sistem internal seperti analytics dan storage.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    console.warn("⚠️ Kredensial Supabase URL atau Key belum disetel.");
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
