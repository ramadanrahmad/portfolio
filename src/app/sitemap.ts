import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rahmadramadan.vercel.app";

  try {
    const supabase = await createClient();

    const { data: projects } = await supabase
      .from("projects")
      .select("slug, updated_at")
      .eq("status", "published");

    const projectUrls: MetadataRoute.Sitemap = (projects || []).map(
      (project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      ...projectUrls,
    ];
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];
  }
}
