"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleMessageRead(id: string, is_read: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");

  return { success: true };
}
