"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FolderGit2,
  UserCircle,
  Layers,
  Inbox,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Code2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Profile & CV", href: "/admin/profile", icon: UserCircle },
  { label: "Skills & Experiences", href: "/admin/content", icon: Layers },
  { label: "Inbox Messages", href: "/admin/messages", icon: Inbox },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Jika sedang di halaman login, tampilkan halaman penuh tanpa sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
            RR
          </div>
          <span className="font-semibold text-sm tracking-wide">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-950/95 border-r border-slate-800/80 p-5 flex flex-col justify-between z-40 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-wide">
                Rahmad Ramadan
              </h2>
              <span className="text-[11px] text-cyan-400 font-mono">
                Administrator
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-cyan-400" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          {/* Tombol Lihat sebagai Pengunjung */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              Lihat Pengunjung
            </span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">
              Baru
            </span>
          </Link>

          {/* Tombol Logout */}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar (Sign Out)"}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
