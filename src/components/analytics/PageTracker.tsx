"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Komponen pelacak pageviews otomatis untuk sisi klien
 * Hanya aktif pada rute publik, mengabaikan rute /admin
 */
export function PageTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Mencegah multiple triggering pada re-render komponen yang sama
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    const isProjectDetail = pathname.startsWith("/projects/") && pathname !== "/projects";
    const slug = isProjectDetail ? pathname.replace("/projects/", "").split("/")[0] : undefined;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: isProjectDetail ? "project_view" : "pageview",
        path: pathname,
        projectSlug: slug,
      }),
      keepalive: true,
    }).catch(() => {
      // Ignore network errors on background analytics
    });
  }, [pathname]);

  return null;
}
