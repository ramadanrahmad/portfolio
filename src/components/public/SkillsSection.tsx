import { type Skill, type SkillGroup } from "@/types";
import { DynamicIcon } from "./DynamicIcon";
import { Sparkles, Cpu, Layers } from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

const GROUP_ORDER: SkillGroup[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Game Engine",
  "Tools",
];

const GROUP_META: Record<
  SkillGroup,
  { label: string; desc: string; color: string; badgeColor: string }
> = {
  Languages: {
    label: "Programming Languages",
    desc: "Core syntax and foundational logic",
    color: "from-cyan-500/20 to-blue-500/10",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  Frontend: {
    label: "Frontend & UI Engineering",
    desc: "Interactive, accessible, and responsive interfaces",
    color: "from-indigo-500/20 to-purple-500/10",
    badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  Backend: {
    label: "Backend, Database & Cloud",
    desc: "Relational persistence, auth, and RESTful APIs",
    color: "from-emerald-500/20 to-teal-500/10",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  "Game Engine": {
    label: "Game Engines & Interactive",
    desc: "2D/3D physics, game loops, shaders, and audio",
    color: "from-amber-500/20 to-orange-500/10",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  Tools: {
    label: "DevOps & Developer Tools",
    desc: "Version control, containerization, and design",
    color: "from-rose-500/20 to-pink-500/10",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Sembunyikan otomatis jika belum ada skill (sesuai instruksi prompt!)
  if (!skills || skills.length === 0) {
    return null;
  }

  // Kelompokkan skill berdasarkan group_name
  const groupedSkills = GROUP_ORDER.map((group) => {
    const items = skills
      .filter((s) => s.group_name === group)
      .sort((a, b) => a.sort_order - b.sort_order);
    return {
      group,
      meta: GROUP_META[group],
      items,
    };
  }).filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg">
            Languages, frameworks, database systems, and game engines I work with on daily builds.
          </p>
        </div>

        {/* Grouped Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedSkills.map(({ group, meta, items }) => (
            <div
              key={group}
              className="glass-card rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${meta.badgeColor}`}
                  >
                    {group}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {items.length} skills
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {meta.label}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{meta.desc}</p>
              </div>

              {/* Items Chip Grid */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/60">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all group/item shadow-sm"
                  >
                    <DynamicIcon
                      name={skill.icon}
                      className="w-4 h-4 text-cyan-400 group-hover/item:scale-110 transition-transform"
                    />
                    <span className="text-xs font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
