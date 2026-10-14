import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Tambah Proyek Baru | Admin Portal",
};

export default function NewProjectPage() {
  return (
    <div>
      <ProjectForm mode="create" />
    </div>
  );
}
