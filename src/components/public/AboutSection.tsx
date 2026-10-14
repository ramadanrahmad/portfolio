import Image from "next/image";
import { type Profile } from "@/types";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  MapPin,
  Briefcase,
  Sparkles,
  FileDown,
  Terminal,
  Code2,
  Gamepad2,
} from "lucide-react";

interface AboutSectionProps {
  profile?: Profile | null;
}

export function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const quickFacts = [
    {
      label: "University",
      value: "Universitas Sriwijaya (UNSRI)",
      sub: "Informatics Engineering",
      icon: GraduationCap,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Location",
      value: profile.location || "Palembang, Indonesia",
      sub: "Available for remote & on-site",
      icon: MapPin,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Career Focus",
      value: "Web Fullstack & Game Dev",
      sub: "Scalable Systems & Interactive 2D/3D",
      icon: Terminal,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Availability",
      value: profile.open_to_work ? "Open for Opportunities" : "Currently Engaged",
      sub: "Internship & Junior Fullstack Engineer",
      icon: Briefcase,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Background & Story</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg">
            A glimpse into my academic journey, passion for technology, and aspirations.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Bio Card (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs">
              <Code2 className="w-4 h-4" />
              <span>whoami --verbose</span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {profile.bio ||
                "Informatics Engineering student at Universitas Sriwijaya with a strong passion for modern web architecture and interactive game development. I enjoy building end-to-end digital experiences—from responsive client interfaces to robust relational databases and multiplayer real-time logic."}
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-4">
              {profile.cv_url && (
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="glow" size="default" className="gap-2 text-xs">
                    <FileDown className="w-4 h-4" />
                    <span>Download Formal Resume (PDF)</span>
                  </Button>
                </a>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                <span>Passionate about Clean Code & Architecture</span>
              </div>
            </div>
          </div>

          {/* Right Quick Facts Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {quickFacts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <div
                  key={index}
                  className="glass-card rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${fact.bg} ${fact.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                      {fact.label}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {fact.value}
                    </h4>
                    <span className="text-xs text-slate-600 dark:text-slate-400 block mt-0.5">
                      {fact.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
