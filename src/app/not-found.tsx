import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Compass, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | Rahmad Ramadan",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07090e] text-slate-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-lg shadow-cyan-500/10">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
          Error 404 &bull; Signal Lost
        </span>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">
          The requested coordinate does not exist or has been relocated to another dimension.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="glow" size="default" className="w-full gap-2 text-xs">
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Button>
          </Link>
          <Link href="/projects" className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full gap-2 text-xs">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Browse Projects</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
