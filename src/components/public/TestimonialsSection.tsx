import Image from "next/image";
import { type Testimonial } from "@/types";
import { Quote, Sparkles, User } from "lucide-react";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  // Sembunyikan otomatis jika belum ada testimoni
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Testimonials & Feedback
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg">
            Words from academic advisors, project teammates, and collaborators.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors relative"
            >
              <Quote className="w-8 h-8 text-cyan-500/20 mb-3" />
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 shrink-0 overflow-hidden relative">
                  {t.photo_url ? (
                    <Image
                      src={t.photo_url}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[11px] text-slate-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
