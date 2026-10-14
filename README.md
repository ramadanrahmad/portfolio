# Rahmad Ramadan — Personal Portfolio & Projects Platform 🚀

A modern, high-performance personal portfolio and projects showcase engineered with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth & Storage)**. Designed specifically for fullstack web and game development projects with a cyber dark tech aesthetic.

---

## 🌟 Fitur Utama

### 1. Sisi Publik (Bilingual / English UI)
- **Desain Modern Cyber Dark**: Skema warna modern `#07090e` dengan aksen neon *cyan* (`#06b6d4`), indigo, dan sentuhan *glassmorphism*. Mendukung toggle mode Gelap/Terang.
- **Auto-Hiding Sections**: Bagian yang belum memiliki data (misal: testimoni / sertifikat kosong) otomatis disembunyikan agar tampilan selalu rapi.
- **Hero Section**: Foto berbingkai cybernetic, headline dinamis, status *"Open to Work"*, tombol unduh CV instan, dan tautan sosial media.
- **Skills Arsenal**: Dikelompokkan rapi ke dalam 5 kategori (*Languages*, *Frontend*, *Backend*, *Game Engine*, *Tools*) dengan ikon dinamis Lucide.
- **Featured Projects**: Menampilkan proyek-proyek pilihan terbaik dengan badge kategori (*Game*, *Website*, *Mobile*) dan chip teknologi.
- **All Projects Catalog (`/projects`)**: Pencarian instan dan filter multi-kategori serta filter tag teknologi.
- **Halaman Detail Proyek (`/projects/[slug]`)**:
  - Lightbox galeri gambar resolusi tinggi dengan navigasi keyboard.
  - Pemutar video YouTube responsif.
  - *Playable Web Game Frame* (HTML5 / WebGL / Godot / Unity) terintegrasi langsung.
  - Dokumentasi teknis berbasis Markdown lengkap dengan daftar fitur dan kontribusi peran.
  - Tautan navigasi proyek Sebelumnya / Selanjutnya.
- **Vertical Experience & Education Timeline**: Garis waktu vertikal bercahaya dengan filter kategori (*Education*, *Organization*, *Competition*, *Work*).
- **Formulir Kontak Anti-Spam**: Validasi Zod, proteksi *honeypot*, pesan masuk langsung tersimpan di Supabase, dan konfirmasi pengiriman instan.

### 2. Sisi Admin Privat (`/admin`)
- **Proteksi Ganda**: Middleware Next.js memeriksa sesi Supabase Auth dan mencocokkan UID dengan tabel whitelist `admins`. Dilengkapi header `X-Robots-Tag: noindex, nofollow`.
- **Dashboard Statistik**: Memantau total proyek terdaftar, proyek yang telah terbit (*published*), draft privat, dan jumlah pesan baru.
- **Manajemen Proyek Lengkap (CRUD)**:
  - Form proyek dengan peringatan *dirty form* jika berpindah halaman sebelum menyimpan.
  - Pemilihan tag teknologi preset dan custom.
  - Kompresi gambar sisi klien (*Canvas to WebP < 500KB*) sebelum diunggah ke Supabase Storage.
  - Editor Markdown interaktif lengkap dengan toolbar dan *Live Preview* berdampingan.
  - Catatan privat admin (*project_notes*) yang disimpan terpisah dari data publik untuk keamanan maksimal.
  - Aksi instan: Toggle status Draft/Published, Toggle Featured, Duplikasi proyek, dan Reordering urutan.
- **Manajemen Profil & CV (`/admin/profile`)**: Mengubah biodata, foto avatar, mengunggah file resume/CV (PDF), dan memperbarui tautan sosial media.
- **Manajemen Konten (`/admin/content`)**: Mengelola data *Skills*, *Experience & Education*, *Certificates*, dan *Testimonials*.
- **Kotak Masuk Pesan (`/admin/messages`)**: Membaca pesan dari pengunjung, menandai telah dibaca, dan opsi hapus.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL dengan Row Level Security)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (`portfolio-assets` bucket)
- **Form Validation**: Zod
- **Markdown Parser**: ReactMarkdown

---

## 📁 Struktur Direktori

```text
├── .github/
│   └── workflows/
│       └── keep-alive.yml       # Otomasi ping Supabase gratis setiap 4 hari
├── src/
│   ├── app/
│   │   ├── (public)/            # Route group halaman publik
│   │   │   └── projects/        # Katalog & Detail Proyek
│   │   ├── admin/               # Portal admin privat
│   │   │   ├── content/         # CRUD Skills, Experience, Certs, Testimonials
│   │   │   ├── messages/        # Inbox pesan kontak
│   │   │   ├── profile/         # Edit bio, avatar & CV
│   │   │   └── projects/        # CRUD Proyek
│   │   ├── api/
│   │   │   └── contact/         # API handler formulir kontak
│   │   ├── layout.tsx           # Root Layout & Metadata SEO
│   │   ├── page.tsx             # Beranda Utama (8 Bagian)
│   │   ├── not-found.tsx        # 404 Cyber Not Found Page
│   │   ├── robots.ts            # Dynamic robots.txt
│   │   └── sitemap.ts           # Dynamic sitemap.xml
│   ├── components/
│   │   ├── admin/               # Komponen form, tabel, uploader admin
│   │   ├── public/              # Komponen halaman beranda & detail
│   │   └── ui/                  # Primitif UI (Button, Input, Badge, Dialog)
│   ├── lib/
│   │   ├── supabase/            # Client, Server & Middleware Supabase
│   │   ├── storage.ts           # Kompresi Canvas & Upload Helper
│   │   ├── validations.ts       # Skema Zod
│   │   └── utils.ts
│   └── types/                   # Definisi TypeScript
├── supabase/
│   ├── schema.sql               # Skema PostgreSQL 9 tabel + RLS Policies
│   └── seed.sql                 # Data awal contoh
├── public/
│   └── og-image.jpg             # Kartu OpenGraph pratinjau media sosial
└── .env.local                   # Kredensial lingkungan lokal
```

---

## 🚀 Panduan Menjalankan di Lokal

### 1. Prasyarat
- Node.js versi 20 atau yang lebih baru.
- Akun [Supabase](https://supabase.com).

### 2. Kloning dan Instalasi
```bash
git clone https://github.com/ramadanrahmad/portfolio.git
cd portfolio
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu isi kredensial proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh......
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Setup Basis Data di Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor**, salin seluruh isi [supabase/schema.sql](file:///d:/Project%20Website/Portofolio/supabase/schema.sql), lalu klik **Run**.
3. (Opsional) Salin dan jalankan [supabase/seed.sql](file:///d:/Project%20Website/Portofolio/supabase/seed.sql) untuk data permulaan.
4. Buka **Authentication -> Users**, tambahkan user admin Anda.
5. Jalankan query berikut di SQL Editor untuk memberikan hak akses admin:
   ```sql
   INSERT INTO public.admins (user_id, email)
   VALUES ('<UID_USER_DARI_AUTH>', 'email-anda@gmail.com');
   ```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser pada `http://localhost:3000`.

---

## 🌐 Panduan Deploy ke Vercel

1. **Push ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete personal portfolio system"
   git push origin main
   ```
2. **Import Proyek di Vercel**:
   - Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New Project**.
   - Pilih repositori GitHub portofolio Anda.
3. **Konfigurasi Environment Variables**:
   Pada menu **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon/Public key Supabase Anda.
   - `NEXT_PUBLIC_SITE_URL`: Domain Vercel Anda (misal `https://rahmadramadan.vercel.app`).
4. **Klik Deploy**: Vercel akan otomatis meng-compile dan website Anda langsung online dengan HTTPS aktif!

---

## 🛡️ Otomasi Supabase Keep-Alive

Untuk mencegah database tier gratis Supabase masuk ke status *paused* setelah 7 hari tidak ada traffic:
1. Masuk ke repositori GitHub Anda -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Tambahkan 2 Repository Secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Alur kerja GitHub Actions di `.github/workflows/keep-alive.yml` akan otomatis melakukan ping database setiap 4 hari sekali tanpa perlu login manual.

---

## 📄 Lisensi
Hak Cipta © 2026 Rahmad Ramadan. Dibuat dengan Next.js 15, Tailwind CSS, dan Supabase.
