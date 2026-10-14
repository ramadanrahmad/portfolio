"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface LightboxGalleryProps {
  images: string[];
  title: string;
}

export function LightboxGallery({ images, title }: LightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;

  // Keyboard navigation untuk lightbox (Esc, Left, Right)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span>Project Gallery</span>
        <span className="text-xs font-mono font-normal text-slate-500">
          ({images.length} screenshots)
        </span>
      </h3>

      {/* Grid Thumbnail Gambar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imgUrl, index) => (
          <div
            key={imgUrl + index}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-cyan-500/50 transition-all shadow-md"
          >
            <Image
              src={imgUrl}
              alt={`${title} screenshot ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-cyan-400">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {isOpen && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* Top Bar Lightbox */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-50">
            <span className="text-xs font-mono text-slate-400">
              {title} &bull; Image {selectedIndex + 1} of {images.length}
            </span>
            <button
              onClick={() => setSelectedIndex(null)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tombol Sebelumnya (Left) */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Active Image */}
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
            <Image
              src={images[selectedIndex]}
              alt={`${title} preview enlarged`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Tombol Selanjutnya (Right) */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors z-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
