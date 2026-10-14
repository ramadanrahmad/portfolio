"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  photo_url: string | null;
  cv_url: string | null;
  email: string;
  location: string;
  open_to_work: boolean;
  social_links: Record<string, string>;
}) {
  const supabase = await createClient();

  // Cek apakah data profil sudah ada di tabel profile
  const { data: existing } = await supabase
    .from("profile")
    .select("id")
    .maybeSingle();

  let error = null;

  if (existing) {
    const res = await supabase
      .from("profile")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    error = res.error;
  } else {
    const res = await supabase.from("profile").insert([data]);
    error = res.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  revalidatePath("/admin");

  return { success: true };
}
