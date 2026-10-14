import { createAdminClient } from "@/lib/supabase/admin";

export type AnalyticsEventType = "pageview" | "project_view" | "cv_download";

export interface AnalyticsEventParams {
  eventType: AnalyticsEventType;
  path: string;
  projectSlug?: string;
  title?: string;
}

export interface DailyTrendItem {
  date: string;
  label: string;
  views: number;
}

export interface TopProjectItem {
  slug: string;
  title: string;
  views: number;
}

export interface RecentActivityItem {
  id: string;
  type: AnalyticsEventType;
  path: string;
  title?: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  cvDownloads: number;
  topProjects: TopProjectItem[];
  dailyTrend: DailyTrendItem[];
  recentActivity: RecentActivityItem[];
}

/**
 * Catat event analitik (Pageview, Project View, atau CV Download)
 * Bekerja dengan tabel `site_analytics` jika ada, dan otomatis fallback ke JSON stats di `profile`.
 */
export async function recordAnalyticsEvent({
  eventType,
  path,
  projectSlug,
  title,
}: AnalyticsEventParams) {
  try {
    const supabase = createAdminClient();

    // 1. Coba catat ke tabel `site_analytics`
    const { error: tableError } = await supabase.from("site_analytics").insert([
      {
        event_type: eventType,
        path,
        project_slug: projectSlug || null,
        created_at: new Date().toISOString(),
      },
    ]);

    // Jika tabel site_analytics belum dibuat di Supabase, fallback ke penyimpanan di profile
    if (tableError) {
      const { data: profileData } = await supabase
        .from("profile")
        .select("id, social_links")
        .maybeSingle();

      if (profileData) {
        const socialLinks = (profileData.social_links as Record<string, any>) || {};
        const stats = socialLinks._analytics || {
          totalViews: 0,
          todayViews: 0,
          cvDownloads: 0,
          lastDate: "",
          dailyViews: {},
          projectViews: {},
          recentActivity: [],
        };

        const today = new Date().toISOString().split("T")[0];

        // Hitung views
        if (eventType === "pageview" || eventType === "project_view") {
          stats.totalViews = (stats.totalViews || 0) + 1;
          stats.dailyViews = stats.dailyViews || {};
          stats.dailyViews[today] = (stats.dailyViews[today] || 0) + 1;
        }

        if (eventType === "cv_download") {
          stats.cvDownloads = (stats.cvDownloads || 0) + 1;
        }

        if (projectSlug) {
          stats.projectViews = stats.projectViews || {};
          stats.projectViews[projectSlug] =
            (stats.projectViews[projectSlug] || 0) + 1;
        }

        // Catat aktivitas terbaru (maksimal 20 data)
        const newActivity: RecentActivityItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: eventType,
          path,
          title: title || (projectSlug ? `Proyek: ${projectSlug}` : path),
          timestamp: new Date().toISOString(),
        };

        const activityList = [newActivity, ...(stats.recentActivity || [])].slice(
          0,
          20
        );
        stats.recentActivity = activityList;

        socialLinks._analytics = stats;

        await supabase
          .from("profile")
          .update({ social_links: socialLinks })
          .eq("id", profileData.id);
      }
    }

    // Jika ini project_view, perbarui juga counter di kolom extra proyek
    if (eventType === "project_view" && projectSlug) {
      const { data: project } = await supabase
        .from("projects")
        .select("id, extra")
        .eq("slug", projectSlug)
        .maybeSingle();

      if (project) {
        const extra = (project.extra as Record<string, any>) || {};
        extra.views = (extra.views || 0) + 1;
        await supabase
          .from("projects")
          .update({ extra })
          .eq("id", project.id);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Gagal mencatat analitik:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Ambil data ringkasan analitik untuk dashboard admin
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = createAdminClient();

  // Siapkan rentang 7 hari terakhir
  const last7Days: { dateStr: string; label: string }[] = [];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;
    last7Days.push({ dateStr, label });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Cek apakah tabel `site_analytics` ada & berisi data
  const { data: tableData, error: tableError } = await supabase
    .from("site_analytics")
    .select("id, event_type, path, project_slug, created_at")
    .order("created_at", { ascending: false });

  // Ambil list proyek untuk mapping nama proyek
  const { data: allProjects } = await supabase
    .from("projects")
    .select("id, title, slug, extra");

  const projectMap = new Map<string, string>();
  const projectViewsMap = new Map<string, number>();

  (allProjects || []).forEach((p) => {
    projectMap.set(p.slug, p.title);
    const extra = (p.extra as Record<string, any>) || {};
    if (extra.views) {
      projectViewsMap.set(p.slug, extra.views);
    }
  });

  if (!tableError && tableData && tableData.length > 0) {
    let totalViews = 0;
    let todayViews = 0;
    let cvDownloads = 0;
    const dailyMap = new Map<string, number>();

    tableData.forEach((row) => {
      const datePart = row.created_at ? row.created_at.split("T")[0] : "";

      if (row.event_type === "pageview" || row.event_type === "project_view") {
        totalViews++;
        if (datePart === todayStr) {
          todayViews++;
        }
        dailyMap.set(datePart, (dailyMap.get(datePart) || 0) + 1);
      }

      if (row.event_type === "cv_download") {
        cvDownloads++;
      }

      if (row.project_slug) {
        projectViewsMap.set(
          row.project_slug,
          (projectViewsMap.get(row.project_slug) || 0) + 1
        );
      }
    });

    const dailyTrend: DailyTrendItem[] = last7Days.map(({ dateStr, label }) => ({
      date: dateStr,
      label,
      views: dailyMap.get(dateStr) || 0,
    }));

    const topProjects: TopProjectItem[] = Array.from(projectViewsMap.entries())
      .map(([slug, views]) => ({
        slug,
        title: projectMap.get(slug) || slug,
        views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const recentActivity: RecentActivityItem[] = tableData.slice(0, 10).map((r) => ({
      id: r.id,
      type: r.event_type as AnalyticsEventType,
      path: r.path,
      title: r.project_slug
        ? projectMap.get(r.project_slug) || r.project_slug
        : r.path === "/"
        ? "Beranda Publik"
        : r.path,
      timestamp: r.created_at,
    }));

    return {
      totalViews,
      todayViews,
      cvDownloads,
      topProjects,
      dailyTrend,
      recentActivity,
    };
  }

  // 2. Fallback: baca dari profile.social_links._analytics
  const { data: profileData } = await supabase
    .from("profile")
    .select("social_links")
    .maybeSingle();

  const socialLinks = (profileData?.social_links as Record<string, any>) || {};
  const stats = socialLinks._analytics || {};

  const dailyViews = stats.dailyViews || {};
  const dailyTrend: DailyTrendItem[] = last7Days.map(({ dateStr, label }) => ({
    date: dateStr,
    label,
    views: dailyViews[dateStr] || 0,
  }));

  const topProjects: TopProjectItem[] = (allProjects || []).map((p) => {
    const extra = (p.extra as Record<string, any>) || {};
    const viewsFromStats = stats.projectViews?.[p.slug] || 0;
    const views = Math.max(extra.views || 0, viewsFromStats);
    return {
      slug: p.slug,
      title: p.title,
      views,
    };
  }).sort((a, b) => b.views - a.views);

  return {
    totalViews: stats.totalViews || 0,
    todayViews: dailyViews[todayStr] || 0,
    cvDownloads: stats.cvDownloads || 0,
    topProjects,
    dailyTrend,
    recentActivity: stats.recentActivity || [],
  };
}
