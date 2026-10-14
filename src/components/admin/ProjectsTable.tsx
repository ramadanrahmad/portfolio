"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Project } from "@/types";
import {
  toggleProjectStatus,
  toggleProjectFeatured,
  deleteProject,
  duplicateProject,
} from "@/app/admin/projects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Star,
  ExternalLink,
  FolderGit2,
  Gamepad2,
  Globe,
  Loader2,
  ArrowUpDown,
} from "lucide-react";

interface ProjectsTableProps {
  initialProjects: Project[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"sort_order" | "date_desc" | "title">("sort_order");

  // State untuk modal konfirmasi hapus
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Optimistic Toggle Status
  const handleToggleStatus = (id: string, currentStatus: "draft" | "published") => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
    startTransition(async () => {
      await toggleProjectStatus(id, nextStatus);
    });
  };

  // Optimistic Toggle Featured
  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: nextFeatured } : p))
    );
    startTransition(async () => {
      await toggleProjectFeatured(id, nextFeatured);
    });
  };

  // Duplicate Project
  const handleDuplicate = async (id: string) => {
    startTransition(async () => {
      const res = await duplicateProject(id);
      if (res.success) {
        window.location.reload();
      }
    });
  };

  // Delete Project Confirm
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    await deleteProject(projectToDelete.id);
    setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
    setIsDeleting(false);
    setProjectToDelete(null);
  };

  // Filter & Search Logic
  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech_tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "sort_order") {
        return (a.sort_order || 0) - (b.sort_order || 0);
      }
      if (sortBy === "date_desc") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const categoryCounts = {
    all: projects.length,
    game: projects.filter((p) => p.category === "game").length,
    website: projects.filter((p) => p.category === "website").length,
    mobile: projects.filter((p) => p.category === "mobile").length,
    other: projects.filter((p) => p.category === "other").length,
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Buat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Manajemen Proyek
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Kelola {projects.length} proyek, atur status draft/publikasi, dan urutan tampil.
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="glow" size="default" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Baru</span>
          </Button>
        </Link>
      </div>

      {/* Kontrol Filter & Pencarian */}
      <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari judul, tag teknologi, atau slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs h-9"
            />
          </div>

          {/* Sortir & Filter Status */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Status</option>
              <option value="published">Hanya Published</option>
              <option value="draft">Hanya Draft</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="sort_order">Urutkan: Prioritas (Sort Order)</option>
              <option value="date_desc">Urutkan: Tanggal Terbaru</option>
              <option value="title">Urutkan: Judul (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          {[
            { id: "all", label: "Semua Kategori", count: categoryCounts.all },
            { id: "game", label: "Game Dev", count: categoryCounts.game },
            { id: "website", label: "Website", count: categoryCounts.website },
            { id: "mobile", label: "Mobile", count: categoryCounts.mobile },
            { id: "other", label: "Lainnya", count: categoryCounts.other },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-cyan-50 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabel Proyek */}
      <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/90 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Proyek</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4">Tech Tags</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FolderGit2 className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-300">
                      Tidak ada proyek yang sesuai filter.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coba sesuaikan kata kunci pencarian atau buat proyek baru.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group"
                  >
                    {/* Sort Order */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-center">
                      {project.sort_order || index + 1}
                    </td>

                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 relative">
                          {project.thumbnail_url ? (
                            <Image
                              src={project.thumbnail_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                              <FolderGit2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate block"
                          >
                            {project.title}
                          </Link>
                          <span className="text-[11px] font-mono text-slate-500 truncate block">
                            /projects/{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          project.category === "game"
                            ? "cyan"
                            : project.category === "website"
                            ? "indigo"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {project.category}
                      </Badge>
                    </td>

                    {/* Toggle Status (Published/Draft) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        <Switch
                          size="sm"
                          checked={project.status === "published"}
                          onCheckedChange={() =>
                            handleToggleStatus(project.id, project.status)
                          }
                        />
                        <span
                          className={`text-[10px] font-medium ${
                            project.status === "published"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          {project.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </td>

                    {/* Toggle Featured */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleFeatured(project.id, project.is_featured)
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.is_featured
                            ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                            : "text-slate-600 hover:text-slate-400 hover:bg-slate-800"
                        }`}
                        title={
                          project.is_featured
                            ? "Featured di Homepage (Klik untuk matikan)"
                            : "Bukan featured (Klik untuk tampilkan di homepage)"
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            project.is_featured ? "fill-amber-400" : ""
                          }`}
                        />
                      </button>
                    </td>

                    {/* Tech Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {project.tech_tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tech_tags.length > 2 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{project.tech_tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit */}
                        <Link href={`/admin/projects/${project.id}`}>
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            title="Edit Proyek"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* Duplikat */}
                        <button
                          onClick={() => handleDuplicate(project.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          title="Duplikat Proyek"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Hapus */}
                        <button
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Konfirmasi Hapus */}
      <Dialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <DialogContent onClose={() => setProjectToDelete(null)}>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Proyek</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus proyek{" "}
              <strong className="text-white">"{projectToDelete?.title}"</strong>?
              Tindakan ini permanen dan akan menghapus semua foto serta catatan
              privat terkait proyek ini.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setProjectToDelete(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Permanen</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
