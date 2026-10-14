import { z } from "zod";

/**
 * Skema validasi formulir proyek (Zod)
 */
export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Judul proyek minimal 2 karakter")
    .max(120, "Judul proyek maksimal 120 karakter"),
  slug: z
    .string()
    .min(2, "Slug URL minimal 2 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan strip (-)"),
  category: z.enum(["game", "website", "mobile", "other"], {
    errorMap: () => ({ message: "Pilih kategori proyek yang valid" }),
  }),
  short_description: z
    .string()
    .min(5, "Deskripsi singkat minimal 5 karakter")
    .max(300, "Deskripsi singkat maksimal 300 karakter"),
  description_md: z
    .string()
    .min(10, "Deskripsi lengkap (Markdown) minimal 10 karakter"),
  thumbnail_url: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([]),
  tech_tags: z.array(z.string()).min(1, "Minimal pilih atau masukkan 1 tag teknologi"),
  role: z.string().nullable().optional(),
  team_size: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  demo_url: z.string().nullable().optional(),
  repo_url: z.string().nullable().optional(),
  download_url: z.string().nullable().optional(),
  video_url: z.string().nullable().optional(),
  store_url: z.string().nullable().optional(),
  embed_url: z.string().nullable().optional(),
  extra: z.record(z.any()).default({}),
  notes: z.string().optional().default(""), // Catatan pribadi admin
});

export type ProjectFormData = z.infer<typeof projectSchema>;

/**
 * Skema validasi form kontak publik
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().email("Format email tidak valid"),
  message: z.string().min(5, "Pesan minimal 5 karakter").max(2000),
  honeypot: z.string().max(0, "Spam terdeteksi"), // Field jebakan anti-bot
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
