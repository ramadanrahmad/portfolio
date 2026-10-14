import { createClient } from "@/lib/supabase/server";
import { type Profile } from "@/types";
import { ProfileEditor } from "@/components/admin/ProfileEditor";

export const metadata = {
  title: "Edit Profil & CV | Admin Portal",
};

export const revalidate = 0;

export default async function AdminProfilePage() {
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profile")
    .select("*")
    .maybeSingle();

  const profile = profileData as Profile | null;

  return (
    <div>
      <ProfileEditor initialProfile={profile} />
    </div>
  );
}
