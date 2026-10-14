import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Edit Proyek | Admin Portal",
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Ambil data proyek
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // 2. Ambil catatan privat proyek dari tabel project_notes
  const { data: noteData } = await supabase
    .from("project_notes")
    .select("notes")
    .eq("project_id", id)
    .maybeSingle();

  const initialData = {
    ...project,
    notes: noteData?.notes || "",
  };

  return (
    <div>
      <ProjectForm mode="edit" initialData={initialData} />
    </div>
  );
}
