import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client dengan Service Role Key
 * HANYA digunakan di Server Components, API Routes, dan Server Actions
 * untuk mutasi data sistem internal seperti analytics dan storage.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL belum disetel."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
