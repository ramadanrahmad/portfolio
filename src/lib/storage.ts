import { createClient } from "./supabase/client";

/**
 * Kompresi gambar di sisi klien menggunakan HTML5 Canvas
 * Mengurangi ukuran file drastis (misal 5MB menjadi ~200-300KB) dengan format WebP/JPEG berkualitas tinggi
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Jika file SVG atau GIF (animasi), jangan dikompresi lewat canvas agar animasinya tidak hilang
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung rasio resolusi maksimal
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP jika didukung browser, atau fallback ke JPEG
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

/**
 * Mengunggah file media ke Supabase Storage (portfolio-assets) dengan nama acak UUID
 */
export async function uploadMedia(
  file: File,
  folder: "thumbnails" | "gallery" | "documents" = "thumbnails"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();

    // 1. Validasi tipe file
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (folder !== "documents" && !isImage) {
      return { url: null, error: "Hanya file gambar (PNG, JPG, WebP) yang diizinkan." };
    }

    if (folder === "documents" && !isPdf) {
      return { url: null, error: "Hanya dokumen PDF yang diizinkan untuk CV." };
    }

    // 2. Validasi ukuran maksimal awal (sebelum kompresi: 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { url: null, error: "Ukuran file terlalu besar (maksimal 10MB)." };
    }

    // 3. Kompresi gambar jika berupa file gambar
    let uploadPayload: Blob = file;
    let fileExt = file.name.split(".").pop()?.toLowerCase() || "webp";

    if (isImage && file.type !== "image/svg+xml" && file.type !== "image/gif") {
      uploadPayload = await compressImage(file);
      fileExt = "webp";
    }

    // 4. Buat nama file acak berbasis UUID untuk mencegah tebakan file publik
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${uniqueFileName}`;

    // 5. Upload ke Supabase Storage bucket 'portfolio-assets'
    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, uploadPayload, {
        cacheControl: "31536000",
        upsert: false,
        contentType: isImage ? (fileExt === "webp" ? "image/webp" : file.type) : file.type,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    // 6. Dapatkan Public URL
    const { data: publicUrlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "Gagal mengunggah file." };
  }
}

/**
 * Menghapus file dari Supabase Storage berdasarkan URL publik
 */
export async function deleteMediaByUrl(url: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const bucketName = "portfolio-assets";

    // Ekstrak path dari URL publik
    const marker = `${bucketName}/`;
    const index = url.indexOf(marker);
    if (index === -1) return false;

    const filePath = url.substring(index + marker.length);
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    return !error;
  } catch {
    return false;
  }
}
