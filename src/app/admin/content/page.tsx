import { createClient } from "@/lib/supabase/server";
import {
  type Skill,
  type Experience,
  type Certificate,
  type Testimonial,
} from "@/types";
import { ContentManager } from "@/components/admin/ContentManager";

export const metadata = {
  title: "Kelola Konten & Skills | Admin Portal",
};

export const revalidate = 0;

export default async function AdminContentPage() {
  const supabase = await createClient();

  const [
    { data: skillsData },
    { data: experiencesData },
    { data: certificatesData },
    { data: testimonialsData },
  ] = await Promise.all([
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

  return (
    <div>
      <ContentManager
        initialSkills={(skillsData as Skill[]) || []}
        initialExperiences={(experiencesData as Experience[]) || []}
        initialCertificates={(certificatesData as Certificate[]) || []}
        initialTestimonials={(testimonialsData as Testimonial[]) || []}
      />
    </div>
  );
}
