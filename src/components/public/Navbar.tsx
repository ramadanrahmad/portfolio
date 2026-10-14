"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Sparkles, FolderGit2 } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo / Branding */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-md shadow-cyan-500/10 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
            RR
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide text-white group-hover:text-cyan-300 transition-colors">
              Rahmad Ramadan
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Fullstack & Game Dev
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-inner">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/projects"
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              pathname === "/projects"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>All Projects</span>
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle & Contact Button */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/#contact">
            <Button variant="glow" size="sm" className="text-xs h-9 px-4">
              Get in Touch
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-5 py-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>All Projects Catalog</span>
            </Link>
          </nav>
          <div className="pt-3 border-t border-slate-800/80">
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="glow" size="default" className="w-full text-xs">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
