import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  FolderGit2,
  FileCheck2,
  FileClock,
  Mail,
  Plus,
  ArrowUpRight,
  Sparkles,
  Database,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnalyticsSummary } from "@/lib/analytics";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

// Memastikan data dashboard selalu segar saat dimuat
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Ambil data analitik dan status Resend secara aman
  const analytics = await getAnalyticsSummary();

  const hasResend = !!process.env.RESEND_API_KEY;

  // 2. Ambil statistik proyek
  const { data: projectsData } = await supabase
    .from("projects")
    .select("id, status");

  const totalProjects = projectsData?.length || 0;
  const publishedProjects =
    projectsData?.filter((p) => p.status === "published").length || 0;
  const draftProjects =
    projectsData?.filter((p) => p.status === "draft").length || 0;

  // 3. Ambil statistik pesan kontak yang belum dibaca
  const { count: unreadMessagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  // 4. Ambil data profil singkat
  const { data: profile } = await supabase
    .from("profile")
    .select("name, headline, email, open_to_work")
    .maybeSingle();

  const stats = [
    {
      label: "Total Proyek",
      value: totalProjects,
      desc: "Semua proyek terdaftar",
      icon: FolderGit2,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Proyek Terbit (Published)",
      value: publishedProjects,
      desc: "Tampil di website publik",
      icon: FileCheck2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Draft Privat",
      value: draftProjects,
      desc: "Hanya terlihat oleh Anda",
      icon: FileClock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Pesan Masuk Belum Dibaca",
      value: unreadMessagesCount || 0,
      desc: "Dari formulir kontak",
      icon: Mail,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Sambutan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Selamat Datang, {profile?.name || "Rahmad Ramadan"}!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {profile?.headline ||
              "Informatics Engineering Student | Web Fullstack & Game Developer"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/projects/new">
            <Button variant="glow" size="default" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Baru</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Statistik Kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-card rounded-xl p-5 border border-slate-200 dark:border-slate-800/80 glass-card-hover shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border ${stat.bg} ${stat.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Bagian Statistik Kunjungan & Notifikasi Email */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Statistik Kunjungan & Interaksi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pelacakan tayangan halaman, unduhan berkas CV, dan tren popularitas proyek
            </p>
          </div>
        </div>
        <AnalyticsDashboard
          analytics={analytics}
          hasResend={hasResend}
          notificationEmail={profile?.email || "ramadanrahmad1910@gmail.com"}
        />
      </div>

      {/* Aksi Cepat / Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box Kelola Proyek */}
        <div className="glass-card rounded-xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Manajemen Proyek
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 group font-medium"
            >
              Buka Katalog
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Atur status draft atau publikasi, tandai proyek pilihan (featured),
            upload screenshot galeri, dan tulis dokumentasi proyek berbasis
            Markdown.
          </p>
          <div className="flex gap-2">
            <Link href="/admin/projects" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Lihat Semua Proyek
              </Button>
            </Link>
            <Link href="/admin/projects/new" className="w-full">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                + Buat Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Box Kontak & Profil */}
        <div className="glass-card rounded-xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Pesan Kontak & Profil
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group font-medium"
            >
              Buka Inbox
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Periksa pesan yang dikirim oleh recruiter, dosen, atau calon klien.
            Anda juga dapat memperbarui CV, tautan GitHub/LinkedIn, dan keahlian
            teknologi kapan saja.
          </p>
          <div className="flex gap-2">
            <Link href="/admin/messages" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Kotak Masuk ({unreadMessagesCount || 0})
              </Button>
            </Link>
            <Link href="/admin/profile" className="w-full">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Edit Profil & CV
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
