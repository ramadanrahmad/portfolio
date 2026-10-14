"use client";

import { useState } from "react";
import { type Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { Input } from "@/components/ui/input";
import { Search, FolderGit2, X, Sparkles } from "lucide-react";

interface ProjectsCatalogViewProps {
  initialProjects: Project[];
}

export function ProjectsCatalogView({
  initialProjects,
}: ProjectsCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Kumpulkan seluruh daftar tag teknologi unik
  const allTags = Array.from(
    new Set(initialProjects.flatMap((p) => p.tech_tags || []))
  );

  // Filter proyek
  const filtered = initialProjects.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      p.short_description.toLowerCase().includes(query) ||
      (p.tech_tags && p.tech_tags.some((t) => t.toLowerCase().includes(query)));

    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;

    const matchesTag =
      !selectedTag || (p.tech_tags && p.tech_tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search projects by title, description, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm focus-visible:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Tag Filter Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All Works" },
              { id: "game", label: "Games" },
              { id: "website", label: "Websites" },
              { id: "mobile", label: "Mobile" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/20"
                    : "bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">
            Showing {filtered.length} of {initialProjects.length} projects
          </span>
        </div>

        {/* Tech Tags Filter Row */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-2">
              Filter by Technology:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 font-semibold"
                        : "bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {tag} {isSelected && "✕"}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border border-slate-200 dark:border-slate-800">
          <FolderGit2 className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No projects found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or clearing the active filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
