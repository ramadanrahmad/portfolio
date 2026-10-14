import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan utility class Tailwind dengan aman tanpa konflik class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format string tanggal ke format yang mudah dibaca (mis. "Januari 2024" atau "2024")
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  
  // Jika format hanya tahun misal "2024" atau teks "Sekarang"
  if (dateString.length <= 4 || isNaN(Date.parse(dateString))) {
    return dateString;
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Membuat slug URL ramah SEO dari judul teks
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Ganti spasi dengan strip
    .replace(/[^\w\-]+/g, "")    // Hapus karakter non-kata selain strip
    .replace(/\-\-+/g, "-");     // Ganti multi strip dengan strip tunggal
}
