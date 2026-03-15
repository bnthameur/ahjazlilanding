"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "@/components/ImageGallery";

interface MediaStripProps {
    items: MediaItem[];
    title: string;
}

export default function MediaStrip({ items, title }: MediaStripProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (items.length === 0) return null;

    const open = (i: number) => setLightboxIndex(i);
    const close = () => setLightboxIndex(null);
    const goNext = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex + 1) % items.length);
    const goPrev = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);

    const current = lightboxIndex !== null ? items[lightboxIndex] : null;

    // Scroll the strip with arrow buttons
    const scrollBy = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    };

    return (
        <>
            {/* Strip */}
            <div className="relative bg-slate-900 border-b border-slate-800">
                {/* Left arrow */}
                <button
                    onClick={() => scrollBy("left")}
                    className="absolute start-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 hidden sm:flex"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {/* Right arrow */}
                <button
                    onClick={() => scrollBy("right")}
                    className="absolute end-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 hidden sm:flex"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-1.5 overflow-x-auto scrollbar-none py-2 px-2 sm:px-8"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => open(i)}
                            style={{ scrollSnapAlign: "start" }}
                            className="relative shrink-0 h-20 w-28 sm:h-24 sm:w-36 rounded-lg overflow-hidden bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                            aria-label={item.caption || `${title} ${i + 1}`}
                        >
                            {item.type === "video" ? (
                                <>
                                    {item.thumbnail_url ? (
                                        <Image
                                            src={item.thumbnail_url}
                                            alt={item.caption || `Video ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="144px"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-700" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                            <Play className="w-4 h-4 text-slate-900 fill-slate-900 ms-0.5" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={item.url}
                                    alt={item.caption || `${title} ${i + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    sizes="144px"
                                />
                            )}
                            {/* Index badge */}
                            <div className="absolute bottom-1 end-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white font-medium">
                                {i + 1}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Inline lightbox */}
            {lightboxIndex !== null && current && (
                <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 text-white/80 shrink-0">
                        <span className="text-sm font-medium">{lightboxIndex + 1} / {items.length}</span>
                        <button onClick={close} className="p-2 rounded-full hover:bg-white/10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 relative flex items-center justify-center px-4 min-h-0">
                        <div className="relative w-full h-full max-w-5xl">
                            {current.type === "video" ? (
                                <video
                                    key={current.url}
                                    src={current.url}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                    style={{ maxHeight: "calc(100vh - 140px)" }}
                                />
                            ) : (
                                <Image
                                    src={current.url}
                                    alt={current.caption || `${title} ${lightboxIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            )}
                        </div>
                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={goPrev}
                                    className="absolute start-2 sm:start-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="absolute end-2 sm:end-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
