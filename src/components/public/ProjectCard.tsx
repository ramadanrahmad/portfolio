import Image from "next/image";
import Link from "next/link";
import { type Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  Gamepad2,
  Globe,
  ArrowRight,
  FolderGit2,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isGame = project.category === "game";

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 glass-card-hover flex flex-col justify-between group relative shadow-sm">
      {/* Thumbnail Container */}
      <Link
        href={`/projects/${project.slug}`}
        className="block relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950"
      >
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-950/80">
            <FolderGit2 className="w-8 h-8 mb-2" />
            <span className="text-xs">No preview image</span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge
            variant={isGame ? "cyan" : "indigo"}
            className="uppercase tracking-wider text-[10px] font-bold shadow-md shadow-black/20 backdrop-blur-md"
          >
            {isGame ? (
              <span className="flex items-center gap-1">
                <Gamepad2 className="w-3 h-3" /> Game Dev
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> Website
              </span>
            )}
          </Badge>

          {project.is_featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 backdrop-blur-md shadow-md shadow-black/20">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
              {project.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {project.short_description}
          </p>
        </div>

        {/* Tech Stack Chips & Action Links */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-2">
          {/* Tech Tags */}
          <div className="flex flex-wrap gap-1 max-w-[65%]">
            {project.tech_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
            {project.tech_tags.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{project.tech_tags.length - 3}
              </span>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-1.5 shrink-0">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href={`/projects/${project.slug}`}
              className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              title="View Details"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
