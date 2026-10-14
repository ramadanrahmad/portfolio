"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadMedia, deleteMediaByUrl } from "@/lib/storage";
import { UploadCloud, Image as ImageIcon, Trash2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SingleImageUploaderProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: "thumbnails" | "gallery" | "documents";
  aspectRatio?: "video" | "square";
}

export function SingleImageUploader({
  label,
  value,
  onChange,
  folder = "thumbnails",
  aspectRatio = "video",
}: SingleImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const { url, error } = await uploadMedia(file, folder);

    if (error) {
      setErrorMessage(error);
    } else if (url) {
      onChange(url);
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async () => {
    if (value) {
      await deleteMediaByUrl(value);
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-300">
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
          <div
            className={`relative w-full ${
              aspectRatio === "square" ? "aspect-square" : "aspect-video"
            }`}
          >
            <Image
              src={value}
              alt="Thumbnail Preview"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="gap-1.5 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Gambar</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-900/40 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <span className="text-xs text-slate-400">
                Mengompresi dan mengunggah gambar...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center py-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-200">
                Klik untuk upload thumbnail
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                PNG, JPG, WebP (Otomatis dikompres & diacak nama filenya)
              </p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

interface MultiImageUploaderProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: "gallery";
}

export function MultiImageUploader({
  label,
  values,
  onChange,
  folder = "gallery",
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const { url, error } = await uploadMedia(file, folder);
      if (error) {
        setErrorMessage(error);
      } else if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...values, ...uploadedUrls]);
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveOne = async (indexToRemove: number) => {
    const urlToRemove = values[indexToRemove];
    if (urlToRemove) {
      await deleteMediaByUrl(urlToRemove);
    }
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">
          {label} ({values.length} foto)
        </label>
        <span className="text-[11px] text-slate-500">
          Dapat memilih banyak gambar sekaligus
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {values.map((url, index) => (
          <div
            key={url + index}
            className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video"
          >
            <Image
              src={url}
              alt={`Galeri ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemoveOne(index)}
                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30 transition-colors"
                title="Hapus foto ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Tombol Tambah Gambar */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 text-slate-400 hover:text-cyan-400 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          ) : (
            <>
              <Plus className="w-6 h-6 mb-1 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <span className="text-[11px] font-medium">Tambah Foto</span>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
