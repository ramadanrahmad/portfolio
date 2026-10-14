import { createClient } from "@/lib/supabase/server";
import { type Project } from "@/types";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const metadata = {
  title: "Kelola Proyek | Admin Portal",
};

// Revalidate 0 agar perubahan status selalu langsung ter-update
export const revalidate = 0;

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projectsData, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data proyek:", error.message);
  }

  const projects: Project[] = (projectsData as Project[]) || [];

  return (
    <div>
      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
