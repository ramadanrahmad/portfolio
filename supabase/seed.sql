-- ==============================================================================
-- SEED DATA CONTOH PORTOFOLIO - RAHMAD RAMADAN
-- 4 Proyek Dummy (2 Game, 2 Website) + Profil + Skills + Experience
-- ==============================================================================

-- 1. PROFIL
INSERT INTO public.profile (
    name,
    headline,
    tagline,
    bio,
    photo_url,
    cv_url,
    email,
    location,
    open_to_work,
    social_links
) VALUES (
    'Rahmad Ramadan',
    'Informatics Engineering Student | Web Fullstack & Game Developer',
    'Crafting high-performance web applications and immersive interactive gaming experiences.',
    'Mahasiswa Teknik Informatika Universitas Sriwijaya dengan antusiasme tinggi pada rekayasa web modern, pengembangan game, dan arsitektur sistem berbasis cloud. Terbiasa memecahkan masalah kompleks dengan kode yang bersih, scalable, dan berorientasi pada kepuasan pengguna.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    '',
    'ramadanrahmad1910@gmail.com',
    'Palembang, Indonesia',
    TRUE,
    '{"github": "https://github.com/ramadanrahmad", "linkedin": "", "instagram": "", "itch_io": ""}'::jsonb
) ON CONFLICT DO NOTHING;

-- 2. DUMMY PROJECTS (2 Game, 2 Website)
INSERT INTO public.projects (
    title,
    slug,
    category,
    short_description,
    description_md,
    thumbnail_url,
    gallery,
    tech_tags,
    role,
    team_size,
    start_date,
    end_date,
    status,
    is_featured,
    sort_order,
    demo_url,
    repo_url,
    download_url,
    video_url,
    store_url,
    embed_url,
    extra
) VALUES
-- Proyek 1: Game
(
    'Chronicles of Sriwijaya',
    'chronicles-of-sriwijaya',
    'game',
    'A 2D action-adventure platformer inspired by ancient Nusantara maritime history with combat mechanics and puzzle dungeons.',
    '# Chronicles of Sriwijaya

**Chronicles of Sriwijaya** adalah game *action-platformer* 2D dengan cerita yang diadaptasi dari kejayaan maritim Nusantara.

### Fitur Utama:
- **Combat Fluid**: Mekanisme serangan kombo dengan senjata tradisional Keris dan Tombak.
- **Dungeon Puzzle**: Menyusuri kuil-kuil kuno yang dipenuhi jebakan mekanik.
- **Original Synth-Ethnic Soundtrack**: Menggabungkan gamelan dengan nada synthesizer modern.

### Peran & Kontribusi:
- Mendesain *player controller*, sistem state machine pergerakan, dan algoritma *enemy AI*.
- Mengimplementasikan sistem save/load berbasis serialisasi JSON.
- Optimasi render tilemap dan partikel untuk mempertahankan 60 FPS pada perangkat spesifikasi rendah.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    ],
    ARRAY['Unity', 'C#', 'Pixel Art', 'Aseprite'],
    'Lead Game Programmer',
    '3 Orang',
    '2024-02-01',
    '2024-06-30',
    'published',
    TRUE,
    1,
    'https://itch.io',
    'https://github.com/ramadanrahmad',
    '',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    '',
    '',
    '{"engine": "Unity 2022 LTS", "genre": "Action Adventure / Metroidvania", "platform": "PC (Windows / Linux)"}'::jsonb
),
-- Proyek 2: Website Fullstack
(
    'EduSync - Campus LMS & Collaboration Platform',
    'edusync-campus-platform',
    'website',
    'Fullstack academic management platform featuring real-time discussion rooms, automated assignments, and calendar synchronization.',
    '# EduSync

Platform manajemen pembelajaran kampus terintegrasi yang dirancang untuk mempermudah koordinasi perkuliahan antara mahasiswa dan dosen.

### Tech Stack & Arsitektur:
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, shadcn/ui.
- **Backend & Database**: Supabase PostgreSQL dengan Row Level Security (RLS).
- **Realtime**: Supabase Realtime Channels untuk notifikasi tugas dan forum diskusi.

### Tantangan & Solusi:
- **Keamanan Data Mahasiswa**: Menerapkan kebijakan RLS PostgreSQL yang memastikan mahasiswa hanya bisa mengakses nilai dan berkas tugas pribadi mereka.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    ],
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    'Fullstack Developer',
    'Solo Project',
    '2024-07-01',
    '2024-10-15',
    'published',
    TRUE,
    2,
    'https://vercel.com',
    'https://github.com/ramadanrahmad',
    '',
    '',
    '',
    '',
    '{"frontend": "Next.js App Router, Tailwind CSS", "backend": "Supabase, Edge Functions"}'::jsonb
),
-- Proyek 3: Game 2
(
    'CyberDash: Neon Runner',
    'cyberdash-neon-runner',
    'game',
    'Fast-paced cyberpunk endless runner featuring procedural obstacle generation, dynamic synthwave beat-matching, and leaderboard system.',
    '# CyberDash: Neon Runner

Game arcade bertempo tinggi dengan estetika visual synthwave neon 80-an yang dapat dimainkan langsung di web browser melalui WebGL.

### Fitur:
- Rintangan prosedural tanpa batas.
- Integrasi audio reaktif sesuai irama musik.
- Leaderboard skor global.',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
    ],
    ARRAY['Godot Engine', 'GDScript', 'WebGL', 'GLSL Shaders'],
    'Solo Game Developer',
    'Solo Project',
    '2023-09-01',
    '2023-11-20',
    'published',
    FALSE,
    3,
    'https://itch.io',
    'https://github.com/ramadanrahmad',
    '',
    '',
    '',
    '',
    '{"engine": "Godot 4.2", "genre": "Arcade Endless Runner", "platform": "Web (HTML5/WebGL)"}'::jsonb
),
-- Proyek 4: Website Fullstack 2
(
    'RestoQ - Real-time QR Restaurant Ordering',
    'restoq-restaurant-ordering',
    'website',
    'Contactless dining management system with digital menus, instant table QR checkout, and real-time kitchen order display.',
    '# RestoQ

Aplikasi pemesanan restoran berbasis web yang memangkas waktu tunggu tamu dengan alur *scan QR meja*, memilih menu, dan membayar secara instan.

### Fitur:
- **Kitchen Display System (KDS)**: Dapur menerima pesanan secara *real-time* tanpa jeda.
- **Admin Dashboard**: Laporan penjualan harian, manajemen stok menu, dan analitik pendapatan.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    ],
    ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io'],
    'Backend Engineer',
    '2 Orang',
    '2023-12-01',
    '2024-03-10',
    'published',
    TRUE,
    4,
    'https://example.com',
    'https://github.com/ramadanrahmad',
    '',
    '',
    '',
    '',
    '{"frontend": "React, Tailwind", "backend": "Node.js, Express, Socket.io, Postgres"}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Catatan privat untuk proyek (hanya bisa dibaca admin)
INSERT INTO public.project_notes (project_id, notes)
SELECT id, 'Catatan pribadi: Proyek ini mendapat apresiasi tinggi saat presentasi kelas. Rencana update: tambahkan integrasi Payment Gateway Midtrans.'
FROM public.projects WHERE slug = 'restoq-restaurant-ordering'
ON CONFLICT (project_id) DO NOTHING;

-- 3. SKILLS CONTOH
INSERT INTO public.skills (name, group_name, icon, sort_order) VALUES
-- Languages
('TypeScript', 'Languages', 'FileCode2', 1),
('JavaScript', 'Languages', 'FileCode', 2),
('Python', 'Languages', 'Terminal', 3),
('C#', 'Languages', 'Hash', 4),
('SQL / PostgreSQL', 'Languages', 'Database', 5),
-- Frontend
('Next.js', 'Frontend', 'Globe', 6),
('React', 'Frontend', 'Atom', 7),
('Tailwind CSS', 'Frontend', 'Palette', 8),
('HTML5 / CSS3', 'Frontend', 'Layout', 9),
-- Backend
('Node.js / Express', 'Backend', 'Server', 10),
('Supabase', 'Backend', 'Zap', 11),
('RESTful APIs', 'Backend', 'Cpu', 12),
-- Game Engine
('Unity Engine', 'Game Engine', 'Gamepad2', 13),
('Godot Engine', 'Game Engine', 'Box', 14),
-- Tools
('Git / GitHub', 'Tools', 'GitBranch', 15),
('Docker', 'Tools', 'Container', 16),
('Figma', 'Tools', 'Figma', 17),
('Postman', 'Tools', 'Send', 18)
ON CONFLICT DO NOTHING;

-- 4. EXPERIENCES CONTOH
INSERT INTO public.experiences (type, title, institution, start_date, end_date, description, sort_order) VALUES
(
    'education',
    'S1 Teknik Informatika',
    'Universitas Sriwijaya',
    '2022',
    'Sekarang',
    'Fokus studi pada Rekayasa Perangkat Lunak, Struktur Data & Algoritma, Basis Data Terdistribusi, dan Pengembangan Game.',
    1
),
(
    'organization',
    'Anggota Divisi Pemrograman & Web',
    'Himpunan Mahasiswa Teknik Informatika (HMIF)',
    '2023',
    '2024',
    'Mengelola situs web kegiatan kampus, mengadakan workshop pengenalan web development dasar untuk mahasiswa baru.',
    2
),
(
    'competition',
    'Finalis Game Development Competition',
    'National IT Festival',
    '2024',
    '2024',
    'Membangun prototipe game edukasi sejarah dalam durasi 48 jam (Game Jam) dan lolos ke babak presentasi nasional.',
    3
)
ON CONFLICT DO NOTHING;
