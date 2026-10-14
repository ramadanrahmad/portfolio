"use client";

import { useState } from "react";
import Link from "next/link";
import { type Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, FolderGit2 } from "lucide-react";

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Prioritaskan proyek yang ditandai Featured. Jika belum ada yang ditandai, tampilkan proyek yang sudah Published.
  const featuredList = projects.filter((p) => p.is_featured);
  const displayList = featuredList.length > 0 ? featuredList : projects;

  // Jika tidak ada proyek published sama sekali, sembunyikan section ini otomatis
  if (displayList.length === 0) {
    return null;
  }

  const filtered =
    activeCategory === "all"
      ? displayList
      : displayList.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg">
              Explore key games and fullstack web platforms I designed, engineered, and shipped.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md self-start md:self-auto shadow-sm">
            {[
              { id: "all", label: "All" },
              { id: "game", label: "Game Dev" },
              { id: "website", label: "Website" },
              { id: "mobile", label: "Mobile" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link href="/projects">
            <Button
              variant="outline"
              size="lg"
              className="gap-2.5 text-sm h-11 px-6 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-500/50 shadow-sm hover:shadow-md transition-all group"
            >
              <FolderGit2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">View All Projects in Catalog</span>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
