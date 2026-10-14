"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ShieldAlert, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      const savedTheme = localStorage.getItem("portfolio-theme");
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Coba login dengan kredensial Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setErrorMessage(
          authError.message === "Invalid login credentials"
            ? "Email atau kata sandi salah. Silakan periksa kembali."
            : authError.message
        );
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setErrorMessage("Gagal mengidentifikasi pengguna.");
        setIsLoading(false);
        return;
      }

      // 2. Verifikasi ganda: Periksa apakah user terdaftar di tabel 'admins'
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .single();

      if (adminError || !adminData) {
        // Jika bukan admin, logout paksa
        await supabase.auth.signOut();
        setErrorMessage(
          "Akses Ditolak: Akun Anda tidak memiliki izin Administrator."
        );
        setIsLoading(false);
        return;
      }

      // 3. Login sukses dan terverifikasi admin -> redirect ke dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(
        err.message || "Terjadi kesalahan yang tidak terduga saat login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07090e] relative overflow-hidden">
      {/* Background Glow Circles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Tombol kembali ke beranda */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Tampilan Publik
        </Link>

        {/* Card Login Glassmorphism */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-800/80 relative overflow-hidden">
          {/* Top subtle gradient highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
              <Lock className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-cyan-400 mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Restricted Area</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Masuk untuk mengelola portofolio & proyek Rahmad Ramadan
            </p>
          </div>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="ramadanrahmad1910@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-slate-950/60 border-slate-800 focus-visible:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-slate-950/60 border-slate-800 focus-visible:border-cyan-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="glow"
              className="w-full mt-2 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-500">
              Dilindungi oleh Supabase Auth & PostgreSQL Row Level Security (RLS)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
