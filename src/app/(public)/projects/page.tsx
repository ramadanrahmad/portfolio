import { createClient } from "@/lib/supabase/server";
import { type Project } from "@/types";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectsCatalogView } from "@/components/public/ProjectsCatalogView";
import { FolderGit2, Sparkles } from "lucide-react";

export const metadata = {
  title: "Projects Catalog | Rahmad Ramadan",
  description:
    "Complete portfolio archive of web applications, interactive games, and software experiments built by Rahmad Ramadan.",
};

// Revalidate 60 detik untuk performa caching maksimal
export const revalidate = 60;

export default async function ProjectsPage() {
  const supabase = await createClient();

  // 1. Ambil semua proyek yang berstatus published
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  // 2. Ambil data profil untuk link footer
  const { data: profile } = await supabase
    .from("profile")
    .select("social_links")
    .maybeSingle();

  const projects = (projectsData as Project[]) || [];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#07090e]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            All Projects
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
            Explore games, fullstack web architectures, APIs, and client projects built with modern technologies.
          </p>
        </div>

        {/* Catalog View */}
        <ProjectsCatalogView initialProjects={projects} />
      </main>

      <Footer socialLinks={profile?.social_links} />
    </div>
  );
}
