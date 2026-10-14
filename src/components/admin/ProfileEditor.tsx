"use client";

import { useState } from "react";
import { type Profile } from "@/types";
import { updateProfile } from "@/app/admin/profile/actions";
import { uploadMedia, deleteMediaByUrl } from "@/lib/storage";
import { SingleImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  UploadCloud,
  Trash2,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Gamepad2,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react";

interface ProfileEditorProps {
  initialProfile: Profile | null;
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [name, setName] = useState(initialProfile?.name || "Rahmad Ramadan");
  const [headline, setHeadline] = useState(
    initialProfile?.headline ||
      "Informatics Engineering Student | Web Fullstack & Game Developer"
  );
  const [tagline, setTagline] = useState(
    initialProfile?.tagline ||
      "Crafting scalable web applications and immersive interactive gaming experiences."
  );
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    initialProfile?.photo_url || null
  );
  const [cvUrl, setCvUrl] = useState<string | null>(
    initialProfile?.cv_url || null
  );
  const [email, setEmail] = useState(
    initialProfile?.email || "ramadanrahmad1910@gmail.com"
  );
  const [location, setLocation] = useState(
    initialProfile?.location || "Palembang, Indonesia"
  );
  const [openToWork, setOpenToWork] = useState(
    initialProfile?.open_to_work ?? true
  );

  // Social Links
  const [github, setGithub] = useState(
    initialProfile?.social_links?.github || "https://github.com/ramadanrahmad"
  );
  const [linkedin, setLinkedin] = useState(
    initialProfile?.social_links?.linkedin || ""
  );
  const [instagram, setInstagram] = useState(
    initialProfile?.social_links?.instagram || ""
  );
  const [itchIo, setItchIo] = useState(
    initialProfile?.social_links?.itch_io || ""
  );

  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle CV PDF Upload
  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMessage("File CV harus berformat dokumen PDF.");
      return;
    }

    setIsUploadingCv(true);
    setErrorMessage(null);

    const { url, error } = await uploadMedia(file, "documents");

    if (error) {
      setErrorMessage(error);
    } else if (url) {
      setCvUrl(url);
    }

    setIsUploadingCv(false);
  };

  const handleRemoveCv = async () => {
    if (cvUrl) {
      await deleteMediaByUrl(cvUrl);
      setCvUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        headline: headline.trim(),
        tagline: tagline.trim(),
        bio: bio.trim(),
        photo_url: photoUrl,
        cv_url: cvUrl,
        email: email.trim(),
        location: location.trim(),
        open_to_work: openToWork,
        social_links: {
          github: github.trim(),
          linkedin: linkedin.trim(),
          instagram: instagram.trim(),
          itch_io: itchIo.trim(),
          email: email.trim(),
        },
      };

      const result = await updateProfile(payload);

      if (!result.success) {
        setErrorMessage(result.error || "Gagal memperbarui profil.");
      } else {
        setSuccessMessage("Profil dan tautan publik berhasil diperbarui!");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan internal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-cyan-400" />
            Pengaturan Profil & CV
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ubah headline, bio, upload resume PDF, foto profil, dan tautan sosial media tanpa edit kode.
          </p>
        </div>

        <Button
          type="submit"
          variant="glow"
          disabled={isSubmitting}
          className="gap-2 text-xs h-10 px-6 self-start sm:self-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </>
          )}
        </Button>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid Konten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Informasi Personal & Bio (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">
              Informasi Personal & Headline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nama Lengkap *
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Kontak Utama *
                </label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/80 border-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Headline Hero (Sub-nama) *
              </label>
              <Input
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Informatics Engineering Student | Web Fullstack & Game Developer"
                className="bg-slate-950/80 border-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tagline Singkat (1 Kalimat) *
              </label>
              <Input
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Crafting scalable web systems and immersive interactive gaming experiences."
                className="bg-slate-950/80 border-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Lokasi Domisili
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Palembang, Indonesia"
                className="bg-slate-950/80 border-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Biografi Lengkap (About Me)
              </label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan latar belakang kampus UNSRI, minat mendalam di web development & game, serta tujuan karier..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Social Media Links Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Github className="w-4 h-4 text-cyan-400" />
              Tautan Media Sosial & Profil
            </h2>
            <p className="text-[11px] text-slate-400">
              Kosongkan input jika belum ingin menampilkan link sosial tersebut di web publik.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  GitHub URL
                </label>
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/ramadanrahmad"
                  className="bg-slate-950/80 border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  LinkedIn URL
                </label>
                <Input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-slate-950/80 border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  Instagram URL
                </label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="bg-slate-950/80 border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-red-400" />
                  itch.io URL
                </label>
                <Input
                  value={itchIo}
                  onChange={(e) => setItchIo(e.target.value)}
                  placeholder="https://username.itch.io"
                  className="bg-slate-950/80 border-slate-800 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Foto Profil, Upload CV, Status Open to Work (1 col) */}
        <div className="space-y-6">
          {/* Status Open to Work */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Status Ketersediaan
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-medium text-slate-200">
                  Open to Work
                </span>
                <span className="text-[11px] text-slate-500">
                  Tampilkan badge ketersediaan di Hero
                </span>
              </div>
              <Switch
                checked={openToWork}
                onCheckedChange={(checked) => setOpenToWork(checked)}
              />
            </div>
          </div>

          {/* Foto Profil */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <SingleImageUploader
              label="Foto Profil (Hero & About)"
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
              aspectRatio="square"
            />
          </div>

          {/* Upload Resume / CV PDF */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Dokumen Curriculum Vitae (CV)
            </h2>

            {cvUrl ? (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-xs text-slate-200 block truncate">
                      Resume-Rahmad-Ramadan.pdf
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Dokumen Terunggah
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs h-8"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Lihat PDF</span>
                    </Button>
                  </a>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveCv}
                    className="gap-1.5 text-xs h-8 px-2.5"
                    title="Hapus CV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-900/40 group block">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleCvChange}
                    disabled={isUploadingCv}
                  />
                  {isUploadingCv ? (
                    <div className="flex flex-col items-center py-2">
                      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mb-2" />
                      <span className="text-xs text-slate-400">
                        Mengunggah dokumen PDF...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                      <span className="text-xs font-medium text-slate-200">
                        Upload Dokumen CV (PDF)
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Maksimal ukuran 10MB
                      </span>
                    </div>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
