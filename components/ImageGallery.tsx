"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const goNext = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % images.length);
    }, [lightboxIndex, images.length]);

    const goPrev = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }, [lightboxIndex, images.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [lightboxIndex, goNext, goPrev]);

    if (images.length === 0) return null;

    return (
        <>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => openLightbox(i)}
                        className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                    >
                        <Image
                            src={img}
                            alt={`${title} ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-3 text-white/80">
                        <span className="text-sm font-medium">
                            {lightboxIndex + 1} / {images.length}
                        </span>
                        <button
                            onClick={closeLightbox}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main image */}
                    <div className="flex-1 relative flex items-center justify-center px-4 min-h-0">
                        <div className="relative w-full h-full max-w-5xl">
                            <Image
                                src={images[lightboxIndex]}
                                alt={`${title} ${lightboxIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goPrev}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="px-4 py-3 overflow-x-auto">
                            <div className="flex gap-2 justify-center">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightboxIndex(i)}
                                        className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                                            i === lightboxIndex
                                                ? "ring-2 ring-white opacity-100"
                                                : "opacity-50 hover:opacity-80"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${title} thumb ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
