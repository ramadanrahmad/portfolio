"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { projectSchema, type ProjectFormData } from "@/lib/validations";

/**
 * Membuat proyek baru beserta catatan privatnya
 */
export async function createProject(formData: ProjectFormData) {
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const { notes, ...projectData } = parsed.data;
  const supabase = await createClient();

  // 1. Simpan ke tabel projects
  const { data: createdProject, error: projectError } = await supabase
    .from("projects")
    .insert([projectData])
    .select("id, slug")
    .single();

  if (projectError) {
    return {
      success: false,
      error:
        projectError.code === "23505"
          ? "Slug URL sudah digunakan. Harap gunakan slug yang berbeda."
          : projectError.message,
    };
  }

  // 2. Simpan catatan privat ke tabel project_notes jika ada
  if (notes && notes.trim().length > 0) {
    await supabase.from("project_notes").insert({
      project_id: createdProject.id,
      notes: notes.trim(),
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true, id: createdProject.id, slug: createdProject.slug };
}

/**
 * Memperbarui proyek yang sudah ada beserta catatan privatnya
 */
export async function updateProject(id: string, formData: ProjectFormData) {
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const { notes, ...projectData } = parsed.data;
  const supabase = await createClient();

  // 1. Perbarui data tabel projects
  const { error: projectError } = await supabase
    .from("projects")
    .update({ ...projectData, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (projectError) {
    return {
      success: false,
      error:
        projectError.code === "23505"
          ? "Slug URL sudah digunakan oleh proyek lain."
          : projectError.message,
    };
  }

  // 2. Upsert catatan privat ke tabel project_notes
  if (notes !== undefined) {
    await supabase.from("project_notes").upsert({
      project_id: id,
      notes: notes.trim(),
      updated_at: new Date().toISOString(),
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectData.slug}`);

  return { success: true };
}

/**
 * Menghapus proyek berdasarkan ID
 */
export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true };
}

/**
 * Toggle cepat status Published / Draft
 */
export async function toggleProjectStatus(
  id: string,
  newStatus: "draft" | "published"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true };
}

/**
 * Toggle cepat status Featured
 */
export async function toggleProjectFeatured(id: string, is_featured: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ is_featured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true };
}

/**
 * Duplikat proyek (membuat salinan dengan status Draft dan slug unik)
 */
export async function duplicateProject(id: string) {
  const supabase = await createClient();

  // 1. Ambil proyek yang ingin diduplikat
  const { data: original, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !original) {
    return { success: false, error: "Proyek tidak ditemukan." };
  }

  const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const newTitle = `${original.title} (Copy)`;

  const { id: _origId, created_at: _c, updated_at: _u, ...rest } = original;

  const duplicatePayload = {
    ...rest,
    title: newTitle,
    slug: newSlug,
    status: "draft" as const,
    is_featured: false,
    sort_order: (original.sort_order || 0) + 1,
  };

  const { data: created, error: insertError } = await supabase
    .from("projects")
    .insert([duplicatePayload])
    .select("id")
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");

  return { success: true, newId: created.id };
}

/**
 * Update urutan tampil (sort_order) seluruh proyek
 */
export async function updateProjectOrder(orderedIds: string[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase
      .from("projects")
      .update({ sort_order: index + 1 })
      .eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true };
}
