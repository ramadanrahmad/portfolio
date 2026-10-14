"use client";

import Link from "next/link";
import { type SocialLinks } from "@/types";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  Gamepad2,
  ArrowUp,
  Heart,
  Lock,
} from "lucide-react";

interface FooterProps {
  socialLinks?: SocialLinks;
}

export function Footer({ socialLinks }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const githubUrl = socialLinks?.github || "https://github.com/ramadanrahmad";
  const linkedinUrl = socialLinks?.linkedin;
  const instagramUrl = socialLinks?.instagram;
  const itchIoUrl = socialLinks?.itch_io;
  const emailUrl = socialLinks?.email || "mailto:ramadanrahmad1910@gmail.com";

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Bio / Branding */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                RR
              </div>
              <span className="font-bold text-base text-white tracking-wide">
                Rahmad Ramadan
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Informatics Engineering Student at Universitas Sriwijaya. Building high-performance web applications and interactive games.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {itchIoUrl && (
                <a
                  href={itchIoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                  aria-label="itch.io"
                >
                  <Gamepad2 className="w-4 h-4" />
                </a>
              )}
              {emailUrl && (
                <a
                  href={emailUrl.startsWith("mailto:") ? emailUrl : `mailto:${emailUrl}`}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#home" className="hover:text-cyan-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-cyan-300 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/#skills" className="hover:text-cyan-300 transition-colors">
                  Skills & Tech
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-cyan-300 transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-300 transition-colors">
                  All Projects Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Back to top */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Restricted
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-xs"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Rahmad Ramadan. Built with Next.js 15, Tailwind CSS & Supabase.
          </p>
          <p className="flex items-center gap-1">
            Universitas Sriwijaya &bull; Palembang, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
