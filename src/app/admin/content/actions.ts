"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  type Skill,
  type Experience,
  type Certificate,
  type Testimonial,
} from "@/types";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/content");
}

// ================= SKILLS =================
export async function createSkill(skillData: Omit<Skill, "id">) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").insert([skillData]);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateSkill(id: string, skillData: Partial<Skill>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("skills")
    .update(skillData)
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

// ================= EXPERIENCES =================
export async function createExperience(expData: Omit<Experience, "id">) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").insert([expData]);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateExperience(
  id: string,
  expData: Partial<Experience>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("experiences")
    .update(expData)
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

// ================= CERTIFICATES =================
export async function createCertificate(certData: Omit<Certificate, "id">) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").insert([certData]);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateCertificate(
  id: string,
  certData: Partial<Certificate>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("certificates")
    .update(certData)
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

// ================= TESTIMONIALS =================
export async function createTestimonial(testData: Omit<Testimonial, "id">) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert([testData]);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  testData: Partial<Testimonial>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update(testData)
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}
