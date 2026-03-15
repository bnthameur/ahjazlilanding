"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

interface CarouselImage {
  url: string;
  caption?: string | null;
}

interface VenueHeroCarouselProps {
  images: CarouselImage[];
  title: string;
}

export default function VenueHeroCarousel({ images, title }: VenueHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const dragStartX = useRef<number>(0);
  const isTouchSwipe = useRef(false);

  const total = images.length;

  const goTo = useCallback((index: number) => {
    setCurrentIndex(((index % total) + total) % total);
  }, [total]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isTouchSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (diffX > diffY && diffX > 8) isTouchSwipe.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchSwipe.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      diff < 0 ? goNext() : goPrev();
    }
    isTouchSwipe.current = false;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      diff < 0 ? goNext() : goPrev();
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => setIsDragging(false);

  if (images.length === 0) {
    return (
      <div className="h-[42vh] sm:h-[50vh] md:h-[58vh] w-full bg-slate-900 flex items-center justify-center">
        <ImageIcon className="w-16 h-16 text-white/20" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative h-[42vh] sm:h-[50vh] md:h-[58vh] w-full overflow-hidden bg-slate-900">
        <Image
          src={images[0].url}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-[42vh] sm:h-[50vh] md:h-[58vh] w-full overflow-hidden bg-slate-900 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Images - fade transition */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={img.url}
            alt={img.caption || `${title} ${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
            draggable={false}
          />
        </div>
      ))}

      {/* Navigation arrows - desktop */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute start-3 sm:start-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 active:scale-90"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute end-3 sm:end-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 active:scale-90"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Bottom: dots + counter */}
      <div className="absolute bottom-4 start-0 end-0 z-20 flex flex-col items-center gap-2">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        {/* Counter */}
        <span className="text-white/70 text-xs font-medium bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {total}
        </span>
      </div>
    </div>
  );
}
