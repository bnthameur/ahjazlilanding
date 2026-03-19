"use client";

import { useState, useCallback, useEffect, useRef, TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, Play } from "lucide-react";

export interface MediaItem {
    url: string;
    type: "image" | "video";
    thumbnail_url?: string | null;
    caption?: string | null;
}

interface ImageGalleryProps {
    // Legacy: accept plain string array for backward-compat
    images?: string[];
    // New: accept rich media items
    media?: MediaItem[];
    title: string;
}

function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export default function ImageGallery({ images, media, title }: ImageGalleryProps) {
    // Normalise all sources into a single MediaItem array
    const items: MediaItem[] = media && media.length > 0
        ? media
        : (images || []).map((url) => ({
            url,
            type: isVideoUrl(url) ? "video" : "image",
        }));

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [scale, setScale] = useState(1);

    // Touch state for swipe + pinch
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const touchStartDist = useRef<number>(0);
    const isSwiping = useRef(false);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setScale(1);
    };
    const closeLightbox = () => {
        setLightboxIndex(null);
        setScale(1);
    };

    const goNext = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % items.length);
        setScale(1);
    }, [lightboxIndex, items.length]);

    const goPrev = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
        setScale(1);
    }, [lightboxIndex, items.length]);

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

    // Touch handlers for swipe navigation
    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1) {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            isSwiping.current = false;
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchStartDist.current = Math.sqrt(dx * dx + dy * dy);
        }
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) {
            // Pinch to zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ratio = dist / (touchStartDist.current || 1);
            setScale(Math.min(Math.max(ratio, 0.5), 4));
        } else if (e.touches.length === 1) {
            const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
            const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
            if (diffX > diffY && diffX > 10) isSwiping.current = true;
        }
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (e.changedTouches.length === 1 && scale <= 1.1) {
            const diffX = e.changedTouches[0].clientX - touchStartX.current;
            if (isSwiping.current && Math.abs(diffX) > 50) {
                if (diffX < 0) goNext();
                else goPrev();
            }
        }
        isSwiping.current = false;
    };

    if (items.length === 0) return null;

    const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

    return (
        <>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {items.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => openLightbox(i)}
                        className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                        aria-label={item.caption || `${title} ${i + 1}`}
                    >
                        {item.type === "video" ? (
                            <>
                                {item.thumbnail_url ? (
                                    <Image
                                        src={item.thumbnail_url}
                                        alt={item.caption || `${title} video ${i + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 640px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-800" />
                                )}
                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Image
                                    src={item.url}
                                    alt={item.caption || `${title} ${i + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                </div>
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && currentItem && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-3 text-white/80 shrink-0">
                        <span className="text-sm font-medium">
                            {lightboxIndex + 1} / {items.length}
                        </span>
                        <button
                            onClick={closeLightbox}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main media */}
                    <div className="flex-1 relative flex items-center justify-center px-4 min-h-0 overflow-hidden">
                        <div
                            className="relative w-full h-full max-w-5xl transition-transform duration-150"
                            style={{ transform: `scale(${scale})`, touchAction: "none" }}
                        >
                            {currentItem.type === "video" ? (
                                <video
                                    key={currentItem.url}
                                    src={currentItem.url}
                                    controls
                                    playsInline
                                    className="w-full h-full object-contain"
                                    style={{ maxHeight: "calc(100vh - 160px)" }}
                                />
                            ) : (
                                <Image
                                    src={currentItem.url}
                                    alt={currentItem.caption || `${title} ${lightboxIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            )}
                        </div>

                        {/* Navigation arrows */}
                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={goPrev}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Caption */}
                    {currentItem.caption && (
                        <div className="shrink-0 px-4 py-2 text-center text-white/70 text-sm">
                            {currentItem.caption}
                        </div>
                    )}

                    {/* Thumbnail strip */}
                    {items.length > 1 && (
                        <div className="shrink-0 px-4 py-3 overflow-x-auto">
                            <div className="flex gap-2 justify-center">
                                {items.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setLightboxIndex(i); setScale(1); }}
                                        className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                                            i === lightboxIndex
                                                ? "ring-2 ring-white opacity-100"
                                                : "opacity-50 hover:opacity-80"
                                        }`}
                                        aria-label={`Go to item ${i + 1}`}
                                    >
                                        {item.type === "video" ? (
                                            <>
                                                {item.thumbnail_url ? (
                                                    <Image
                                                        src={item.thumbnail_url}
                                                        alt={`thumb ${i + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-slate-700" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="w-3 h-3 text-white fill-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <Image
                                                src={item.url}
                                                alt={`${title} thumb ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        )}
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
