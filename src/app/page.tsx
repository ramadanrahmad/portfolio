import { createClient } from "@/lib/supabase/server";
import {
  type Project,
  type Profile,
  type Skill,
  type Experience,
  type Certificate,
  type Testimonial,
} from "@/types";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { FeaturedProjectsSection } from "@/components/public/FeaturedProjectsSection";
import { ExperienceSection } from "@/components/public/ExperienceSection";
import { CertificatesSection } from "@/components/public/CertificatesSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";

// Revalidasi data setiap 60 detik untuk performa prima dan data selalu segar
export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  // Ambil seluruh data sisi publik secara paralel untuk performa kencang
  const [
    { data: profileData },
    { data: projectsData },
    { data: skillsData },
    { data: experiencesData },
    { data: certificatesData },
    { data: testimonialsData },
  ] = await Promise.all([
    supabase.from("profile").select("*").maybeSingle(),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const profile = profileData as Profile | null;
  const projects = (projectsData as Project[]) || [];
  const skills = (skillsData as Skill[]) || [];
  const experiences = (experiencesData as Experience[]) || [];
  const certificates = (certificatesData as Certificate[]) || [];
  const testimonials = (testimonialsData as Testimonial[]) || [];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#07090e] text-slate-800 dark:text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:text-cyan-300 scroll-smooth transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full">
        {/* 1. Hero Section */}
        <HeroSection profile={profile} />

        {/* 2. About Me Section (Otomatis tersembunyi jika kosong) */}
        <AboutSection profile={profile} />

        {/* 3. Skills Section (Otomatis tersembunyi jika kosong) */}
        <SkillsSection skills={skills} />

        {/* 4. Featured Projects Section (Otomatis tersembunyi jika kosong) */}
        <FeaturedProjectsSection projects={projects} />

        {/* 5. Experience & Education Section (Otomatis tersembunyi jika kosong) */}
        <ExperienceSection experiences={experiences} />

        {/* 6. Certifications & Achievements Section (Otomatis tersembunyi jika kosong) */}
        <CertificatesSection certificates={certificates} />

        {/* 7. Testimonials Section (Opsional / Otomatis tersembunyi jika kosong) */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 8. Contact Section */}
        <ContactSection
          socialLinks={profile?.social_links}
          email={profile?.email}
        />
      </main>

      <Footer socialLinks={profile?.social_links} />
    </div>
  );
}
