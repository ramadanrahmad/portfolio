-- ==============================================================================
-- SKEMA BASIS DATA PORTOFOLIO - RAHMAD RAMADAN
-- Supabase PostgreSQL + Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL ADMINS (Menyimpan UID Supabase Auth yang memiliki hak akses admin)
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Helper Function untuk memeriksa apakah pengguna yang aktif adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TABEL PROFILE (Informasi personal, bio, link sosial)
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    headline TEXT NOT NULL,
    tagline TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT,
    cv_url TEXT,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    open_to_work BOOLEAN DEFAULT TRUE,
    social_links JSONB DEFAULT '{"github": "https://github.com/ramadanrahmad", "linkedin": "", "instagram": "", "itch_io": ""}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. TABEL PROJECTS (Proyek Web, Game, Mobile, dll.)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('game', 'website', 'mobile', 'other')),
    short_description TEXT NOT NULL,
    description_md TEXT NOT NULL,
    thumbnail_url TEXT,
    gallery TEXT[] DEFAULT '{}',
    tech_tags TEXT[] DEFAULT '{}',
    role TEXT,
    team_size TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    demo_url TEXT,
    repo_url TEXT,
    download_url TEXT,
    video_url TEXT,
    store_url TEXT,
    embed_url TEXT,
    extra JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indeks untuk performa query publik
CREATE INDEX IF NOT EXISTS idx_projects_status_featured ON public.projects(status, is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

-- 5. TABEL PROJECT_NOTES (Catatan privat admin per proyek - TERPISAH untuk keamanan)
CREATE TABLE IF NOT EXISTS public.project_notes (
    project_id UUID PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
    notes TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. TABEL SKILLS (Tech stack dikelompokkan)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    group_name TEXT NOT NULL CHECK (group_name IN ('Languages', 'Frontend', 'Backend', 'Game Engine', 'Tools')),
    icon TEXT NOT NULL, -- Nama icon lucide atau SVG identifier
    sort_order INT DEFAULT 0
);

-- 7. TABEL EXPERIENCES (Pendidikan, organisasi, kerja, kompetisi)
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('education', 'work', 'organization', 'competition')),
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    description TEXT,
    sort_order INT DEFAULT 0
);

-- 8. TABEL CERTIFICATES (Sertifikat dan pencapaian)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    credential_url TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0
);

-- 9. TABEL TESTIMONIALS (Opsional: testimoni dosen / rekan / klien)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,
    photo_url TEXT,
    sort_order INT DEFAULT 0
);

-- 10. TABEL MESSAGES (Pesan dari formulir kontak)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: ADMINS
CREATE POLICY "Admin dapat melihat data admin" ON public.admins
    FOR SELECT TO authenticated USING (public.is_admin());

-- Policy: PROFILE (Publik hanya bisa baca, Admin bisa ubah)
CREATE POLICY "Publik dapat membaca profil" ON public.profile
    FOR SELECT USING (TRUE);
CREATE POLICY "Admin dapat mengelola profil" ON public.profile
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policy: PROJECTS (Publik hanya bisa baca proyek published; Admin akses penuh)
CREATE POLICY "Publik dapat membaca proyek yang published" ON public.projects
    FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admin dapat menambah proyek" ON public.projects
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin dapat memperbarui proyek" ON public.projects
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin dapat menghapus proyek" ON public.projects
    FOR DELETE TO authenticated USING (public.is_admin());

-- Policy: PROJECT_NOTES (HANYA ADMIN yang bisa baca & tulis)
CREATE POLICY "Admin akses penuh catatan proyek" ON public.project_notes
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policy: SKILLS (Publik bisa baca, Admin akses penuh)
CREATE POLICY "Publik dapat membaca skills" ON public.skills
    FOR SELECT USING (TRUE);
CREATE POLICY "Admin dapat mengelola skills" ON public.skills
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policy: EXPERIENCES (Publik bisa baca, Admin akses penuh)
CREATE POLICY "Publik dapat membaca experience" ON public.experiences
    FOR SELECT USING (TRUE);
CREATE POLICY "Admin dapat mengelola experience" ON public.experiences
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policy: CERTIFICATES (Publik bisa baca, Admin akses penuh)
CREATE POLICY "Publik dapat membaca sertifikat" ON public.certificates
    FOR SELECT USING (TRUE);
CREATE POLICY "Admin dapat mengelola sertifikat" ON public.certificates
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policy: TESTIMONIALS (Publik bisa baca, Admin akses penuh)
CREATE POLICY "Publik dapat membaca testimoni" ON public.testimonials
    FOR SELECT USING (TRUE);
CREATE POLICY "Admin dapat mengelola testimoni" ON public.testimonials
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Policy: MESSAGES (Publik boleh kirim pesan/INSERT; Admin boleh baca/kelola)
CREATE POLICY "Publik dapat mengirim pesan kontak" ON public.messages
    FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin dapat membaca dan mengelola pesan kontak" ON public.messages
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKET & POLICIES
-- ==============================================================================

-- Buat storage bucket 'portfolio-assets' (jika belum ada)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Publik boleh melihat/mengunduh aset gambar & dokumen
CREATE POLICY "Publik dapat melihat asset portfolio" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio-assets');

-- Policy: Hanya Admin yang boleh mengunggah berkas
CREATE POLICY "Admin dapat upload asset portfolio" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

-- Policy: Hanya Admin yang boleh memperbarui berkas
CREATE POLICY "Admin dapat update asset portfolio" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.is_admin())
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

-- Policy: Hanya Admin yang boleh menghapus berkas
CREATE POLICY "Admin dapat menghapus asset portfolio" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.is_admin());
