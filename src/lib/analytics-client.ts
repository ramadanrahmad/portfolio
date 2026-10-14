"use client";

/**
 * Memicu event pelacakan saat pengunjung mengunduh berkas CV
 */
export function trackCvDownload() {
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "cv_download",
        path: typeof window !== "undefined" ? window.location.pathname : "/",
        title: "Unduhan Berkas CV",
      }),
      keepalive: true,
    }).catch((err) => {
      console.warn("Gagal mencatat unduhan CV:", err);
    });
  } catch (err) {
    // Fail silently
  }
}
