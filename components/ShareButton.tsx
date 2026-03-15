"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <button
      onClick={handleShare}
      className="h-9 w-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm"
      aria-label="Share"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
