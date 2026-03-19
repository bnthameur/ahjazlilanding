'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Play, Grid3X3, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroMediaItem {
    url: string;
    type: 'image' | 'video';
    thumbnail_url?: string | null;
    caption?: string | null;
}

interface Props {
    media: HeroMediaItem[];
    title: string;
    allPhotosLabel?: string;
}

export default function VenueHeroGallery({ media, title, allPhotosLabel = 'View all photos' }: Props) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scale, setScale] = useState(1);

    const images = media.filter(m => m.type === 'image');
    const heroItems = images.slice(0, 5);
    const totalCount = media.length;

    const openLightbox = (index: number) => {
        setActiveIndex(index);
        setScale(1);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setScale(1);
        document.body.style.overflow = '';
    };

    const goTo = (idx: number) => {
        setActiveIndex((idx + media.length) % media.length);
        setScale(1);
    };

    // Keyboard navigation
    if (typeof window !== 'undefined') {
        if (lightboxOpen) {
            const handler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') goTo(activeIndex + 1);
                if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
            };
            // Using effect-less approach for SSR safety
        }
    }

    const hasMultiple = heroItems.length > 1;

    return (
        <>
            {/* ===== Hero Grid ===== */}
            <div className="relative group">
                {heroItems.length === 0 ? (
                    /* No images placeholder */
                    <div className="w-full aspect-[16/7] bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-primary-300" />
                    </div>
                ) : heroItems.length === 1 ? (
                    /* Single image - full width */
                    <button onClick={() => openLightbox(0)} className="w-full aspect-[16/7] relative overflow-hidden cursor-pointer">
                        <Image src={heroItems[0].url} alt={title} fill className="object-cover" sizes="100vw" priority />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                    </button>
                ) : heroItems.length <= 3 ? (
                    /* 2-3 images: 1 large left + stack right */
                    <div className="grid grid-cols-2 gap-1 sm:gap-1.5 aspect-[16/7]">
                        <button onClick={() => openLightbox(0)} className="relative overflow-hidden cursor-pointer">
                            <Image src={heroItems[0].url} alt={title} fill className="object-cover" sizes="50vw" priority />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                        <div className={`grid ${heroItems.length === 2 ? 'grid-rows-1' : 'grid-rows-2'} gap-1 sm:gap-1.5`}>
                            {heroItems.slice(1).map((item, i) => (
                                <button key={i} onClick={() => openLightbox(i + 1)} className="relative overflow-hidden cursor-pointer">
                                    <Image src={item.url} alt={`${title} ${i + 2}`} fill className="object-cover" sizes="50vw" />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* 4-5 images: Airbnb-style grid */
                    <div className="grid grid-cols-4 grid-rows-2 gap-1 sm:gap-1.5 aspect-[16/7]">
                        {/* Main large image */}
                        <button
                            onClick={() => openLightbox(0)}
                            className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer rounded-s-xl sm:rounded-s-2xl"
                        >
                            <Image src={heroItems[0].url} alt={title} fill className="object-cover" sizes="50vw" priority />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                        {/* Top right */}
                        <button onClick={() => openLightbox(1)} className="relative overflow-hidden cursor-pointer">
                            <Image src={heroItems[1].url} alt={`${title} 2`} fill className="object-cover" sizes="25vw" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                        {/* Top far right */}
                        <button onClick={() => openLightbox(2)} className="relative overflow-hidden cursor-pointer rounded-e-xl sm:rounded-e-2xl rounded-ee-none">
                            <Image src={heroItems[2].url} alt={`${title} 3`} fill className="object-cover" sizes="25vw" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                        {/* Bottom right */}
                        <button onClick={() => openLightbox(3)} className="relative overflow-hidden cursor-pointer">
                            <Image src={heroItems[3].url} alt={`${title} 4`} fill className="object-cover" sizes="25vw" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                        </button>
                        {/* Bottom far right */}
                        {heroItems[4] ? (
                            <button onClick={() => openLightbox(4)} className="relative overflow-hidden cursor-pointer rounded-ee-xl sm:rounded-ee-2xl">
                                <Image src={heroItems[4].url} alt={`${title} 5`} fill className="object-cover" sizes="25vw" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                                {totalCount > 5 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">+{totalCount - 5}</span>
                                    </div>
                                )}
                            </button>
                        ) : (
                            <div className="bg-slate-100 rounded-ee-xl sm:rounded-ee-2xl" />
                        )}
                    </div>
                )}

                {/* "View all photos" button */}
                {totalCount > 1 && (
                    <button
                        onClick={() => openLightbox(0)}
                        className="absolute bottom-3 end-3 sm:bottom-4 sm:end-4 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/95 hover:bg-white text-slate-900 text-xs sm:text-sm font-semibold rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-xl"
                    >
                        <Grid3X3 className="w-4 h-4" />
                        {allPhotosLabel} ({totalCount})
                    </button>
                )}
            </div>

            {/* ===== Fullscreen Lightbox ===== */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col" onClick={closeLightbox}>
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-3 text-white/80" onClick={e => e.stopPropagation()}>
                        <span className="text-sm font-medium">{activeIndex + 1} / {media.length}</span>
                        <button onClick={closeLightbox} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 relative flex items-center justify-center px-2 sm:px-16" onClick={e => e.stopPropagation()}>
                        {/* Nav arrows */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={() => goTo(activeIndex - 1)}
                                    className="absolute start-2 sm:start-4 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={() => goTo(activeIndex + 1)}
                                    className="absolute end-2 sm:end-4 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}

                        {/* Media display */}
                        <div className="max-w-5xl w-full max-h-[calc(100vh-140px)] relative flex items-center justify-center">
                            {media[activeIndex].type === 'video' ? (
                                <video
                                    key={activeIndex}
                                    src={media[activeIndex].url}
                                    controls
                                    playsInline
                                    className="max-w-full max-h-[calc(100vh-140px)] rounded-lg"
                                    poster={media[activeIndex].thumbnail_url || undefined}
                                />
                            ) : (
                                <div className="relative w-full" style={{ height: 'calc(100vh - 140px)' }}>
                                    <Image
                                        src={media[activeIndex].url}
                                        alt={media[activeIndex].caption || `${title} - ${activeIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        style={{ transform: `scale(${scale})` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Caption */}
                    {media[activeIndex].caption && (
                        <p className="text-white/70 text-sm text-center py-2 px-4">{media[activeIndex].caption}</p>
                    )}

                    {/* Thumbnail strip */}
                    {media.length > 1 && (
                        <div className="px-4 pb-3 overflow-x-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex gap-1.5 justify-center">
                                {media.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                                            i === activeIndex ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'
                                        }`}
                                    >
                                        {item.type === 'video' ? (
                                            <>
                                                {item.thumbnail_url ? (
                                                    <Image src={item.thumbnail_url} alt="" fill className="object-cover" sizes="64px" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                        <Play className="w-3 h-3 text-white" fill="white" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="w-3 h-3 text-white drop-shadow-lg" fill="white" />
                                                </div>
                                            </>
                                        ) : (
                                            <Image src={item.url} alt="" fill className="object-cover" sizes="64px" />
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
