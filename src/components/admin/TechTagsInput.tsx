"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Sparkles } from "lucide-react";

interface TechTagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

const COMMON_PRESETS = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Node.js",
  "Express",
  "Unity",
  "C#",
  "Godot",
  "GDScript",
  "Python",
  "Docker",
  "Figma",
  "WebGL",
  "Pixel Art",
  "Socket.io",
];

export function TechTagsInput({ value, onChange, error }: TechTagsInputProps) {
  const [customTag, setCustomTag] = useState("");

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustomTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(customTag);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Tech Stack & Tags ({value.length} terpilih)
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Tekan Enter atau klik Tambah
        </span>
      </div>

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 min-h-[46px] items-center">
        {value.length === 0 ? (
          <span className="text-xs text-slate-500 italic">
            Belum ada tag yang dipilih. Pilih dari rekomendasi di bawah atau ketik tag baru.
          </span>
        ) : (
          value.map((tag) => (
            <Badge
              key={tag}
              variant="cyan"
              className="pl-2.5 pr-1.5 py-1 text-xs gap-1.5 flex items-center"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-cyan-500/20 p-0.5 rounded-full text-cyan-600 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Input untuk custom tag */}
      <div className="flex gap-2">
        <Input
          placeholder="Ketik tag teknologi baru (mis. Zustand, GraphQL)..."
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-xs h-9 bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleAddTag(customTag)}
          className="shrink-0 gap-1 text-xs h-9"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </Button>
      </div>

      {/* Presets rekomendasi cepat */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 mb-2 font-medium">
          <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Pilihan Cepat (Klik untuk menambah):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {COMMON_PRESETS.map((preset) => {
            const isSelected = value.includes(preset);
            return (
              <button
                type="button"
                key={preset}
                onClick={() =>
                  isSelected ? handleRemoveTag(preset) : handleAddTag(preset)
                }
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-medium"
                    : "bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {isSelected ? `✓ ${preset}` : `+ ${preset}`}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
