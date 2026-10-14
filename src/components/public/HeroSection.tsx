"use client";

import Image from "next/image";
import Link from "next/link";
import { type Profile } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  FileDown,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Gamepad2,
  Code2,
} from "lucide-react";

interface HeroSectionProps {
  profile?: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.name || "Rahmad Ramadan";
  const headline =
    profile?.headline ||
    "Informatics Engineering Student | Web Fullstack & Game Developer";
  const tagline =
    profile?.tagline ||
    "Crafting scalable web applications and immersive interactive gaming experiences.";
  const photoUrl =
    profile?.photo_url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
  const cvUrl = profile?.cv_url;
  const openToWork = profile?.open_to_work ?? true;
  const socialLinks = profile?.social_links || {};

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center"
    >
      {/* Background Radial Glow Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Open to Work Badge */}
            {openToWork && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Open to Internship / Full-time Roles</span>
              </div>
            )}

            {/* Headline & Name */}
            <div>
              <p className="text-sm font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase font-mono mb-2">
                Hello, I am
              </p>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                {name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-300 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mt-2">
                {headline}
              </p>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {tagline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/#projects">
                <Button variant="glow" size="lg" className="gap-2 text-sm shadow-lg shadow-cyan-500/20">
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {cvUrl ? (
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="gap-2 text-sm bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                    <FileDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Download CV</span>
                  </Button>
                </a>
              ) : (
                <Link href="/#contact">
                  <Button variant="outline" size="lg" className="gap-2 text-sm bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                    <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Contact Me</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Social Links Row */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:scale-110 shadow-sm"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:scale-110 shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-pink-500 hover:border-pink-500/40 transition-all hover:scale-110 shadow-sm"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialLinks.itch_io && (
                <a
                  href={socialLinks.itch_io}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500/40 transition-all hover:scale-110 shadow-sm"
                  aria-label="itch.io Games"
                >
                  <Gamepad2 className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={
                    socialLinks.email.startsWith("mailto:")
                      ? socialLinks.email
                      : `mailto:${socialLinks.email}`
                  }
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:scale-110 shadow-sm"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Profile Photo with Techy Frame (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-3xl blur-xl opacity-20 dark:opacity-30 group-hover:opacity-50 dark:group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />

              {/* Main Photo Card */}
              <div className="relative w-72 h-88 sm:w-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-950 p-2 shadow-xl dark:shadow-2xl">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={photoUrl}
                    alt={name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Floating Corner Badges */}
                <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-3 border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">Universitas Sriwijaya</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-medium">UNSRI &bull; IF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
