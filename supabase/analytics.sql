-- ==============================================================================
-- SKEMA TABEL ANALYTICS (STATISTIK KUNJUNGAN & UNDUHAN CV)
-- Jalankan skrip ini di Supabase SQL Editor jika ingin tabel dedicated
-- (Catatan: Portofolio sudah memiliki fallback otomatis jika tabel ini belum dibuat)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL CHECK (event_type IN ('pageview', 'project_view', 'cv_download')),
    path TEXT NOT NULL,
    project_slug TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indeks untuk query analitik berkecepatan tinggi
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.site_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_project_slug ON public.site_analytics(project_slug);

-- RLS: Publik boleh INSERT (mencatat kunjungan anonim); Hanya Admin yang boleh SELECT/baca
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publik dapat mencatat analitik" ON public.site_analytics
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin dapat melihat data analitik" ON public.site_analytics
    FOR SELECT TO authenticated USING (public.is_admin());
