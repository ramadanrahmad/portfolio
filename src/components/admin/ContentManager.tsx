"use client";

import { useState } from "react";
import {
  type Skill,
  type Experience,
  type Certificate,
  type Testimonial,
  type SkillGroup,
  type ExperienceType,
} from "@/types";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  createExperience,
  updateExperience,
  deleteExperience,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/admin/content/actions";
import { SingleImageUploader } from "./ImageUploader";
import { DynamicIcon } from "@/components/public/DynamicIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Layers,
  GraduationCap,
  Award,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  ExternalLink,
  Sparkles,
  Save,
} from "lucide-react";

interface ContentManagerProps {
  initialSkills: Skill[];
  initialExperiences: Experience[];
  initialCertificates: Certificate[];
  initialTestimonials: Testimonial[];
}

export function ContentManager({
  initialSkills,
  initialExperiences,
  initialCertificates,
  initialTestimonials,
}: ContentManagerProps) {
  const [activeTab, setActiveTab] = useState<
    "skills" | "experiences" | "certificates" | "testimonials"
  >("skills");

  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [experiences, setExperiences] =
    useState<Experience[]>(initialExperiences);
  const [certificates, setCertificates] =
    useState<Certificate[]>(initialCertificates);
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);

  // Modal State for Add/Edit
  const [editingItem, setEditingItem] = useState<{
    type: "skill" | "experience" | "certificate" | "testimonial";
    item?: any;
  } | null>(null);

  // Modal State for Delete
  const [deletingItem, setDeletingItem] = useState<{
    type: "skill" | "experience" | "certificate" | "testimonial";
    id: string;
    title: string;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Skill Form State
  const [skillName, setSkillName] = useState("");
  const [skillGroup, setSkillGroup] = useState<SkillGroup>("Frontend");
  const [skillIcon, setSkillIcon] = useState("Code2");
  const [skillSort, setSkillSort] = useState(0);

  // Experience Form State
  const [expTitle, setExpTitle] = useState("");
  const [expInstitution, setExpInstitution] = useState("");
  const [expType, setExpType] = useState<ExperienceType>("education");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expSort, setExpSort] = useState(0);

  // Certificate Form State
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certUrl, setCertUrl] = useState("");
  const [certImage, setCertImage] = useState<string | null>(null);
  const [certSort, setCertSort] = useState(0);

  // Testimonial Form State
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testQuote, setTestQuote] = useState("");
  const [testPhoto, setTestPhoto] = useState<string | null>(null);
  const [testSort, setTestSort] = useState(0);

  const openModal = (
    type: "skill" | "experience" | "certificate" | "testimonial",
    item?: any
  ) => {
    if (type === "skill") {
      setSkillName(item?.name || "");
      setSkillGroup(item?.group_name || "Frontend");
      setSkillIcon(item?.icon || "Code2");
      setSkillSort(item?.sort_order || 0);
    } else if (type === "experience") {
      setExpTitle(item?.title || "");
      setExpInstitution(item?.institution || "");
      setExpType(item?.type || "education");
      setExpStart(item?.start_date || "");
      setExpEnd(item?.end_date || "");
      setExpDesc(item?.description || "");
      setExpSort(item?.sort_order || 0);
    } else if (type === "certificate") {
      setCertTitle(item?.title || "");
      setCertIssuer(item?.issuer || "");
      setCertDate(item?.issue_date || "");
      setCertUrl(item?.credential_url || "");
      setCertImage(item?.image_url || null);
      setCertSort(item?.sort_order || 0);
    } else if (type === "testimonial") {
      setTestName(item?.name || "");
      setTestRole(item?.role || "");
      setTestQuote(item?.quote || "");
      setTestPhoto(item?.photo_url || null);
      setTestSort(item?.sort_order || 0);
    }
    setEditingItem({ type, item });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);

    const isEdit = !!editingItem.item?.id;

    if (editingItem.type === "skill") {
      const payload = {
        name: skillName.trim(),
        group_name: skillGroup,
        icon: skillIcon.trim() || "Code2",
        sort_order: Number(skillSort) || 0,
      };

      if (isEdit) {
        await updateSkill(editingItem.item.id, payload);
        setSkills((prev) =>
          prev.map((s) =>
            s.id === editingItem.item.id ? { ...s, ...payload } : s
          )
        );
      } else {
        await createSkill(payload);
        window.location.reload();
      }
    } else if (editingItem.type === "experience") {
      const payload = {
        title: expTitle.trim(),
        institution: expInstitution.trim(),
        type: expType,
        start_date: expStart.trim(),
        end_date: expEnd.trim() || null,
        description: expDesc.trim() || null,
        sort_order: Number(expSort) || 0,
      };

      if (isEdit) {
        await updateExperience(editingItem.item.id, payload);
        setExperiences((prev) =>
          prev.map((e) =>
            e.id === editingItem.item.id ? { ...e, ...payload } : e
          )
        );
      } else {
        await createExperience(payload);
        window.location.reload();
      }
    } else if (editingItem.type === "certificate") {
      const payload = {
        title: certTitle.trim(),
        issuer: certIssuer.trim(),
        issue_date: certDate.trim(),
        credential_url: certUrl.trim() || null,
        image_url: certImage,
        sort_order: Number(certSort) || 0,
      };

      if (isEdit) {
        await updateCertificate(editingItem.item.id, payload);
        setCertificates((prev) =>
          prev.map((c) =>
            c.id === editingItem.item.id ? { ...c, ...payload } : c
          )
        );
      } else {
        await createCertificate(payload);
        window.location.reload();
      }
    } else if (editingItem.type === "testimonial") {
      const payload = {
        name: testName.trim(),
        role: testRole.trim(),
        quote: testQuote.trim(),
        photo_url: testPhoto,
        sort_order: Number(testSort) || 0,
      };

      if (isEdit) {
        await updateTestimonial(editingItem.item.id, payload);
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingItem.item.id ? { ...t, ...payload } : t
          )
        );
      } else {
        await createTestimonial(payload);
        window.location.reload();
      }
    }

    setIsSaving(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    if (deletingItem.type === "skill") {
      await deleteSkill(deletingItem.id);
      setSkills((prev) => prev.filter((s) => s.id !== deletingItem.id));
    } else if (deletingItem.type === "experience") {
      await deleteExperience(deletingItem.id);
      setExperiences((prev) => prev.filter((e) => e.id !== deletingItem.id));
    } else if (deletingItem.type === "certificate") {
      await deleteCertificate(deletingItem.id);
      setCertificates((prev) => prev.filter((c) => c.id !== deletingItem.id));
    } else if (deletingItem.type === "testimonial") {
      await deleteTestimonial(deletingItem.id);
      setTestimonials((prev) => prev.filter((t) => t.id !== deletingItem.id));
    }

    setIsDeleting(false);
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-cyan-400" />
          Manajemen Konten Portofolio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola keahlian teknologi, riwayat pendidikan/organisasi, sertifikat penghargaan, dan testimoni tanpa mengedit kode.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-card border border-slate-800">
        {[
          { id: "skills", label: "Skills & Tech", count: skills.length, icon: Layers },
          { id: "experiences", label: "Experience & Education", count: experiences.length, icon: GraduationCap },
          { id: "certificates", label: "Certifications", count: certificates.length, icon: Award },
          { id: "testimonials", label: "Testimonials", count: testimonials.length, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-500">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: SKILLS ================= */}
      {activeTab === "skills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Daftar keahlian teknologi dikelompokkan berdasarkan grup
            </span>
            <Button
              size="sm"
              variant="glow"
              onClick={() => openModal("skill")}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Skill</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="glass-card rounded-xl p-3.5 border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <DynamicIcon name={s.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {s.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {s.group_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => openModal("skill", s)}
                    className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setDeletingItem({ type: "skill", id: s.id, title: s.name })
                    }
                    className="p-1 text-slate-400 hover:text-red-400 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: EXPERIENCES ================= */}
      {activeTab === "experiences" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Riwayat pendidikan kampus, kepanitiaan, lomba/hackathon, dan kerja
            </span>
            <Button
              size="sm"
              variant="glow"
              onClick={() => openModal("experience")}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengalaman</span>
            </Button>
          </div>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" className="text-[10px] capitalize">
                      {exp.type}
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      {exp.start_date} - {exp.end_date || "Present"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                  <h4 className="text-xs text-cyan-400">{exp.institution}</h4>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    onClick={() => openModal("experience", exp)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeletingItem({
                        type: "experience",
                        id: exp.id,
                        title: exp.title,
                      })
                    }
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CERTIFICATES ================= */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Sertifikat kursus, kompetisi, dan lisensi keahlian
            </span>
            <Button
              size="sm"
              variant="glow"
              onClick={() => openModal("certificate")}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Sertifikat</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certificates.map((c) => (
              <div
                key={c.id}
                className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {c.issuer}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {c.issue_date}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2">
                    {c.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                  {c.credential_url ? (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Lihat Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-600">No URL</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal("certificate", c)}
                      className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({
                          type: "certificate",
                          id: c.id,
                          title: c.title,
                        })
                      }
                      className="p-1 text-slate-400 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: TESTIMONIALS ================= */}
      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Kutipan rekomendasi dari dosen, rekan proyek, atau klien
            </span>
            <Button
              size="sm"
              variant="glow"
              onClick={() => openModal("testimonial")}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Testimoni</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-colors"
              >
                <p className="text-xs text-slate-300 italic mb-4">
                  "{t.quote}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <span className="text-[10px] text-slate-500">{t.role}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal("testimonial", t)}
                      className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({
                          type: "testimonial",
                          id: t.id,
                          title: t.name,
                        })
                      }
                      className="p-1 text-slate-400 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL ADD / EDIT ================= */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent onClose={() => setEditingItem(null)}>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.item?.id ? "Edit" : "Tambah"}{" "}
              {editingItem?.type === "skill"
                ? "Skill"
                : editingItem?.type === "experience"
                ? "Pengalaman"
                : editingItem?.type === "certificate"
                ? "Sertifikat"
                : "Testimoni"}
            </DialogTitle>
            <DialogDescription>
              Isi data di bawah ini untuk memperbarui tampilan di sisi publik.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {/* Form SKILL */}
            {editingItem?.type === "skill" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Skill *
                  </label>
                  <Input
                    required
                    placeholder="misal: TypeScript / Next.js / Unity"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kelompok / Group *
                  </label>
                  <select
                    value={skillGroup}
                    onChange={(e) => setSkillGroup(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Game Engine">Game Engine</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nama Ikon Lucide
                    </label>
                    <Input
                      placeholder="misal: Code2, Server, Gamepad2"
                      value={skillIcon}
                      onChange={(e) => setSkillIcon(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Urutan Tampil
                    </label>
                    <Input
                      type="number"
                      value={skillSort}
                      onChange={(e) => setSkillSort(Number(e.target.value))}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Form EXPERIENCE */}
            {editingItem?.type === "experience" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tipe *
                    </label>
                    <select
                      value={expType}
                      onChange={(e) => setExpType(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="education">Education (Pendidikan)</option>
                      <option value="organization">Organization (Organisasi)</option>
                      <option value="competition">Competition (Lomba/Game Jam)</option>
                      <option value="work">Work (Kerja/Magang)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Urutan
                    </label>
                    <Input
                      type="number"
                      value={expSort}
                      onChange={(e) => setExpSort(Number(e.target.value))}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Judul / Peran *
                  </label>
                  <Input
                    required
                    placeholder="misal: S1 Teknik Informatika / Lead Programmer"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Institusi / Lembaga / Lomba *
                  </label>
                  <Input
                    required
                    placeholder="misal: Universitas Sriwijaya"
                    value={expInstitution}
                    onChange={(e) => setExpInstitution(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Waktu Mulai *
                    </label>
                    <Input
                      required
                      placeholder="misal: 2022"
                      value={expStart}
                      onChange={(e) => setExpStart(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Waktu Selesai
                    </label>
                    <Input
                      placeholder="misal: Sekarang / 2024"
                      value={expEnd}
                      onChange={(e) => setExpEnd(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Deskripsi Aktivitas
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Penjelasan singkat kontribusi..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </>
            )}

            {/* Form CERTIFICATE */}
            {editingItem?.type === "certificate" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Sertifikat / Penghargaan *
                  </label>
                  <Input
                    required
                    placeholder="misal: Finalis Game Development Competition"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Penerbit / Penyelenggara *
                    </label>
                    <Input
                      required
                      placeholder="misal: IT Fest / Dicoding"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tahun / Tanggal *
                    </label>
                    <Input
                      required
                      placeholder="misal: 2024"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    URL Verifikasi Kredensial (Opsional)
                  </label>
                  <Input
                    placeholder="https://credential.net/..."
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <SingleImageUploader
                    label="Foto / Sertifikat (Opsional)"
                    value={certImage}
                    onChange={(url) => setCertImage(url)}
                  />
                </div>
              </>
            )}

            {/* Form TESTIMONIAL */}
            {editingItem?.type === "testimonial" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nama Pemberi Testimoni *
                    </label>
                    <Input
                      required
                      placeholder="misal: Dr. Dosen Pembimbing"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Jabatan / Hubungan *
                    </label>
                    <Input
                      required
                      placeholder="misal: Dosen Rekayasa Web / Rekan Tim"
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kutipan Testimoni *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Kutipan pesan/apresiasi terhadap etos kerja Rahmad..."
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <SingleImageUploader
                    label="Foto Profil Pemberi Testimoni (Opsional)"
                    value={testPhoto}
                    onChange={(url) => setTestPhoto(url)}
                    aspectRatio="square"
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingItem(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="glow"
                size="sm"
                disabled={isSaving}
                className="gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL KONFIRMASI HAPUS ================= */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent onClose={() => setDeletingItem(null)}>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-white">"{deletingItem?.title}"</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeletingItem(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
