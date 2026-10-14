"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cek preferensi tersimpan atau kelas yang aktif di html
    const hasDarkClass = document.documentElement.classList.contains("dark");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme) {
      const dark = savedTheme === "dark";
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    } else {
      setIsDark(hasDarkClass);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("portfolio-theme", nextDark ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:border-cyan-500/40 shadow-sm transition-all duration-200"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12 text-slate-700" />
      )}
    </button>
  );
}
