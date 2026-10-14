import Image from "next/image";
import { type Certificate } from "@/types";
import { Award, ExternalLink, Calendar, Sparkles } from "lucide-react";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export function CertificatesSection({
  certificates,
}: CertificatesSectionProps) {
  // Sembunyikan otomatis jika belum ada sertifikat (sesuai instruksi prompt)
  if (!certificates || certificates.length === 0) {
    return null;
  }

  const sorted = [...certificates].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honors & Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certifications & Achievements
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg">
            Recognitions, competition awards, and verified technical competencies.
          </p>
        </div>

        {/* Grid Sertifikat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((cert) => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              {cert.image_url && (
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden border-b border-slate-800">
                  <Image
                    src={cert.image_url}
                    alt={cert.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-cyan-400 font-mono">
                      {cert.issuer}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cert.issue_date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                </div>

                {cert.credential_url && (
                  <div className="pt-4 mt-3 border-t border-slate-800/60">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      <span>Show Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
