import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { type Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { LightboxGallery } from "@/components/public/LightboxGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Gamepad2,
  Globe,
  Calendar,
  Users,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Download,
  Play,
  Video,
  Layers,
  Cpu,
} from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Helper untuk mengonversi URL YouTube biasa ke URL Embed
function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube-nocookie.com/embed/${match[2]}`
      : null;
  } catch {
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title, short_description, thumbnail_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Rahmad Ramadan`,
    description: project.short_description,
    openGraph: {
      title: `${project.title} - Portfolio of Rahmad Ramadan`,
      description: project.short_description,
      images: project.thumbnail_url ? [project.thumbnail_url] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Ambil data proyek aktif
  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!projectData) {
    notFound();
  }

  const project = projectData as Project;

  // 2. Ambil daftar proyek lain untuk navigasi sebelumnya/berikutnya
  const { data: allProjects } = await supabase
    .from("projects")
    .select("title, slug, category, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  const currentIndex =
    allProjects?.findIndex((p) => p.slug === project.slug) ?? -1;
  const prevProject =
    currentIndex > 0 ? allProjects?.[currentIndex - 1] : null;
  const nextProject =
    allProjects && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  // 3. Ambil data profil untuk footer
  const { data: profile } = await supabase
    .from("profile")
    .select("social_links")
    .maybeSingle();

  const isGame = project.category === "game";
  const youtubeEmbedUrl = getYouTubeEmbedUrl(project.video_url);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#07090e] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        {/* Breadcrumb & Back Link */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link
            href="/projects"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>All Projects</span>
          </Link>
          <span>/</span>
          <span className="text-slate-300 truncate">{project.title}</span>
        </div>

        {/* Project Header */}
        <header className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={isGame ? "cyan" : "indigo"}
              className="text-xs uppercase tracking-wider font-semibold"
            >
              {isGame ? (
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" /> Game Development
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Web Application
                </span>
              )}
            </Badge>

            {project.is_featured && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
                Featured Work
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            {project.short_description}
          </p>

          {/* Quick Meta Row (Role, Team, Dates) */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            {project.role && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>
                  Role: <strong className="text-slate-200">{project.role}</strong>
                </span>
              </div>
            )}
            {project.team_size && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>
                  Team: <strong className="text-slate-200">{project.team_size}</strong>
                </span>
              </div>
            )}
            {(project.start_date || project.end_date) && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>
                  Timeline:{" "}
                  <strong className="text-slate-200">
                    {formatDate(project.start_date)} -{" "}
                    {project.end_date ? formatDate(project.end_date) : "Present"}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Action Links Toolbar */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="glow" size="default" className="gap-2 text-xs">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </Button>
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="default" className="gap-2 text-xs">
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </Button>
              </a>
            )}
            {project.store_url && (
              <a href={project.store_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="default" className="gap-2 text-xs">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <span>itch.io / Store Page</span>
                </Button>
              </a>
            )}
            {project.download_url && (
              <a href={project.download_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="default" className="gap-2 text-xs">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Build</span>
                </Button>
              </a>
            )}
          </div>
        </header>

        {/* Thumbnail Utama / Hero Image */}
        {project.thumbnail_url && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 mb-12 shadow-2xl">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Playable Web Game Embed (Jika Ada) */}
        {project.embed_url && (
          <div className="mb-12 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Play className="w-4 h-4" />
              <h2 className="text-base font-bold text-white">
                Play Instantly in Browser
              </h2>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-black shadow-2xl">
              <iframe
                src={project.embed_url}
                className="w-full h-full border-0"
                allowFullScreen
                title={`${project.title} Playable Game`}
              />
            </div>
          </div>
        )}

        {/* Video Demo / Trailer Embed (Jika Ada) */}
        {youtubeEmbedUrl && (
          <div className="mb-12 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Video className="w-4 h-4" />
              <h2 className="text-base font-bold text-white">
                Gameplay Demo / Video Trailer
              </h2>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${project.title} Video Preview`}
              />
            </div>
          </div>
        )}

        {/* Spesifikasi Teknis Khusus (Extra Jsonb) */}
        {project.extra && Object.keys(project.extra).length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-12">
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {Object.entries(project.extra).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono block">
                    {key}
                  </span>
                  <span className="text-slate-200 font-medium">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dokumentasi Markdown Utama */}
        <section className="mb-14">
          <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800/80">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-6">
              About the Project & Technical Architecture
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h2 className="text-xl font-bold text-white mt-6 mb-3 border-b border-slate-800 pb-2">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-lg font-bold text-cyan-300 mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-base font-semibold text-indigo-300 mt-4 mb-2">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-300 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-3 text-slate-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-3 text-slate-300">
                      {children}
                    </ol>
                  ),
                  code: ({ children }) => (
                    <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl overflow-x-auto text-xs my-4 text-cyan-300">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-cyan-500 pl-4 italic text-slate-400 my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {project.description_md}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Tech Stack Tags */}
        <section className="mb-14">
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Technologies & Tools Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-cyan-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Galeri Gambar dengan Lightbox */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-14">
            <LightboxGallery images={project.gallery} title={project.title} />
          </section>
        )}

        {/* Navigasi Proyek Sebelumnya & Selanjutnya */}
        <div className="pt-10 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="glass-card rounded-xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col"
            >
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Previous Project
              </span>
              <span className="font-semibold text-sm text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="glass-card rounded-xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col text-right items-end sm:col-start-2"
            >
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                Next Project
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="font-semibold text-sm text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      <Footer socialLinks={profile?.social_links} />
    </div>
  );
}
