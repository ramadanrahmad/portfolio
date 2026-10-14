"use client";

import { useState } from "react";
import { type Experience, type ExperienceType } from "@/types";
import {
  GraduationCap,
  Briefcase,
  Users,
  Trophy,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ExperienceSectionProps {
  experiences: Experience[];
}

const TYPE_CONFIG: Record<
  ExperienceType,
  { label: string; icon: any; color: string; badge: string }
> = {
  education: {
    label: "Education",
    icon: GraduationCap,
    color: "text-cyan-400",
    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  },
  work: {
    label: "Work & Internship",
    icon: Briefcase,
    color: "text-emerald-400",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  organization: {
    label: "Organization & Committee",
    icon: Users,
    color: "text-indigo-400",
    badge: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  },
  competition: {
    label: "Competition & Game Jam",
    icon: Trophy,
    color: "text-amber-400",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const sorted = [...experiences].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((e) => e.type === activeFilter);

  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career & Campus Track</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience & Education
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Timeline of formal education, leadership roles, and hackathons/game jams.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All
            </button>
            {(["education", "organization", "competition", "work"] as ExperienceType[]).map(
              (type) => {
                const config = TYPE_CONFIG[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeFilter === type
                        ? "bg-cyan-500 text-slate-950 font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {config.label.split(" ")[0]}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-slate-800/80 space-y-8">
          {filtered.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.education;
            const Icon = config.icon;

            return (
              <div key={item.id} className="relative group">
                {/* Node Bullet Glowing */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${config.badge} flex items-center gap-1`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{config.label}</span>
                    </span>

                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {item.start_date} - {item.end_date || "Present"}
                      </span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <h4 className="text-xs font-semibold text-cyan-400 mt-0.5">
                      {item.institution}
                    </h4>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line pt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
