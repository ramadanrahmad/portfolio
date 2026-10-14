"use client";

import { type AnalyticsSummary } from "@/lib/analytics";
import {
  Eye,
  TrendingUp,
  FileDown,
  Activity,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface AnalyticsDashboardProps {
  analytics: AnalyticsSummary;
  hasResend: boolean;
  notificationEmail?: string;
}

export function AnalyticsDashboard({
  analytics,
  hasResend,
  notificationEmail = "ramadanrahmad1910@gmail.com",
}: AnalyticsDashboardProps) {
  const maxViews = Math.max(
    ...analytics.dailyTrend.map((d) => d.views),
    5
  );

  const formatTimeAgo = (timestamp: string) => {
    try {
      const now = new Date().getTime();
      const past = new Date(timestamp).getTime();
      const diffSec = Math.floor((now - past) / 1000);

      if (diffSec < 60) return "Baru saja";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
      return `${Math.floor(diffSec / 86400)} hari lalu`;
    } catch {
      return "Beberapa waktu lalu";
    }
  };

  return (
    <div className="space-y-6">
      {/* Resend Status Banner */}
      <div className="p-4 rounded-xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              hasResend
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            }`}
          >
            {hasResend ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Notifikasi Email Resend:
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  hasResend
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                }`}
              >
                {hasResend ? "● Siap & Aktif" : "Belum Ada API Key"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasResend
                ? `Setiap pesan baru dari formulir kontak otomatis dikirim ke ${notificationEmail}`
                : "Tambahkan RESEND_API_KEY di .env.local dan Vercel untuk mengaktifkan notifikasi instan ke email Anda."}
            </p>
          </div>
        </div>

        {!hasResend && (
          <a
            href="https://resend.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0"
          >
            <span>Daftar Resend Gratis (30 Detik)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Grid KPI Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Pageviews */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Total Kunjungan (Pageviews)
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {analytics.totalViews}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{analytics.todayViews} hari ini</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Unduhan CV */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Total Unduhan CV
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {analytics.cvDownloads}
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 mt-1">
              <FileDown className="w-3 h-3" />
              <span>Dari Tombol Hero & About</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FileDown className="w-5 h-5" />
          </div>
        </div>

        {/* Proyek Paling Populer */}
        <div className="glass-card rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Proyek Paling Banyak Dilihat
            </span>
            <div className="text-base font-bold text-slate-900 dark:text-white truncate">
              {analytics.topProjects[0]?.title || "Belum ada kunjungan"}
            </div>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium block mt-1">
              {analytics.topProjects[0]
                ? `${analytics.topProjects[0].views} kali dilihat`
                : "Mulai lacak sekarang"}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Grafik & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Grafik Tren 7 Hari Terakhir */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tren Kunjungan 7 Hari Terakhir
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Otomatis diperbarui secara real-time
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 px-2">
              {analytics.dailyTrend.map((day, idx) => {
                const heightPercentage = Math.max(
                  Math.round((day.views / maxViews) * 100),
                  8
                );
                const isToday = idx === analytics.dailyTrend.length - 1;

                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    {/* Tooltip on hover */}
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                      {day.views} view
                    </span>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-sm ${
                        isToday
                          ? "bg-gradient-to-t from-cyan-600 to-indigo-500 dark:from-cyan-400 dark:to-indigo-400 shadow-cyan-500/20"
                          : "bg-slate-200 dark:bg-slate-800/80 group-hover:bg-cyan-500/40"
                      }`}
                    />

                    {/* Day Label */}
                    <span
                      className={`text-[10px] font-medium text-center truncate ${
                        isToday
                          ? "text-cyan-600 dark:text-cyan-400 font-bold"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom 3: Proyek Terpopuler & Feed Aktivitas */}
        <div className="space-y-6">
          {/* Proyek Terpopuler */}
          <div className="glass-card rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Proyek Terpopuler</span>
            </h3>

            <div className="space-y-2">
              {analytics.topProjects.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  Belum ada proyek yang dikunjungi.
                </p>
              ) : (
                analytics.topProjects.slice(0, 3).map((project, index) => (
                  <div
                    key={project.slug}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="font-semibold text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 truncate block"
                      >
                        {index + 1}. {project.title}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-mono">
                        /projects/{project.slug}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shrink-0">
                      {project.views} views
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Aktivitas Terkini */}
          <div className="glass-card rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Aktivitas Kunjungan Terakhir</span>
            </h3>

            <div className="space-y-2.5">
              {analytics.recentActivity.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  Belum ada aktivitas tercatat.
                </p>
              ) : (
                analytics.recentActivity.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-2.5 text-xs pb-2 border-b border-slate-200/60 dark:border-slate-800/60 last:border-0 last:pb-0"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        act.type === "cv_download"
                          ? "bg-purple-500"
                          : act.type === "project_view"
                          ? "bg-indigo-500"
                          : "bg-cyan-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {act.type === "cv_download"
                          ? "Unduhan Berkas CV"
                          : act.title || act.path}
                      </p>
                      <span className="text-[10px] text-slate-500 block">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
