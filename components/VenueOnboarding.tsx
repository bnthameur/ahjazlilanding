"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { Search, ChevronRight, X } from "lucide-react";
import { getWilayas } from "@/lib/wilayas";

interface VenueOnboardingProps {
  onComplete: (category: string, location: string) => void;
  onSkip: () => void;
}

const POPULAR_WILAYAS = ["Algiers", "Oran", "Constantine", "Setif", "Annaba", "Blida", "Tizi_Ouzou", "Bejaia"];

const CATEGORIES: { id: string; icon: string; color: string; labelKey: string }[] = [
  { id: "wedding-hall", icon: "💍", color: "from-rose-50 to-pink-50 border-rose-200 hover:border-rose-400", labelKey: "category_wedding" },
  { id: "event-salon", icon: "✨", color: "from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400", labelKey: "category_salon" },
  { id: "conference-room", icon: "🎤", color: "from-blue-50 to-sky-50 border-blue-200 hover:border-blue-400", labelKey: "category_conference" },
  { id: "garden-outdoor", icon: "🌿", color: "from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-400", labelKey: "category_outdoor" },
];

export default function VenueOnboarding({ onComplete, onSkip }: VenueOnboardingProps) {
  const t = useTranslations("VenueOnboarding");
  const tCommon = useTranslations();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wilayaSearch, setWilayaSearch] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const wilayas = useMemo(() => getWilayas(tCommon), [tCommon]);

  // Focus search input when step 2 appears
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [step]);

  const popularWilayas = useMemo(
    () => wilayas.filter((w) => POPULAR_WILAYAS.includes(w.id)),
    [wilayas]
  );

  const filteredWilayas = useMemo(() => {
    if (!wilayaSearch.trim()) return wilayas;
    const q = wilayaSearch.toLowerCase();
    return wilayas.filter((w) => w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q));
  }, [wilayas, wilayaSearch]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Short delay for visual feedback before advancing
    setTimeout(() => setStep(2), 220);
  };

  const handleAllTypes = () => {
    setSelectedCategory("");
    setTimeout(() => setStep(2), 100);
  };

  const handleWilayaSelect = (wilayaId: string) => {
    completeOnboarding(selectedCategory, wilayaId);
  };

  const handleAllLocations = () => {
    completeOnboarding(selectedCategory, "");
  };

  const completeOnboarding = (category: string, location: string) => {
    setIsExiting(true);
    setTimeout(() => onComplete(category, location), 300);
  };

  return (
    <div
      className={`transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"}`}
    >
      {step === 1 && (
        <div className="animate-fadeIn">
          {/* Step 1 header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              1 / 2
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              {t("step1_title")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">{t("step1_subtitle")}</p>
          </div>

          {/* Category cards - 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto mb-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`group flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-2xl border-2 bg-gradient-to-br p-5 sm:p-6 transition-all duration-200 active:scale-95 ${cat.color} ${
                  selectedCategory === cat.id ? "scale-95 ring-2 ring-primary-400 ring-offset-2" : ""
                }`}
              >
                <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
                  {cat.icon}
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-800 text-center leading-tight">
                  {t(cat.labelKey as "category_wedding" | "category_salon" | "category_conference" | "category_outdoor")}
                </span>
              </button>
            ))}
          </div>

          {/* Skip / all types button */}
          <div className="flex justify-center">
            <button
              onClick={handleAllTypes}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              {t("all_types")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fadeIn">
          {/* Step 2 header */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              2 / 2
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              {t("step2_title")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">{t("step2_subtitle")}</p>
          </div>

          {/* Search input */}
          <div className="relative max-w-md mx-auto mb-4">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              value={wilayaSearch}
              onChange={(e) => setWilayaSearch(e.target.value)}
              placeholder={t("search_wilaya")}
              className="w-full rounded-xl border border-slate-200 bg-white ps-10 pe-9 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 shadow-sm"
            />
            {wilayaSearch && (
              <button
                onClick={() => setWilayaSearch("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100"
              >
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Popular wilayas (shown when not searching) */}
          {!wilayaSearch && (
            <div className="max-w-md mx-auto mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t("popular_wilayas")}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularWilayas.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleWilayaSelect(w.id)}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition"
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wilaya list (scrollable) */}
          <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden max-h-[260px] overflow-y-auto mb-4">
            {filteredWilayas.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">...</div>
            ) : (
              filteredWilayas.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleWilayaSelect(w.id)}
                  className="w-full text-start px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition border-b border-slate-100 last:border-0"
                >
                  {w.name}
                </button>
              ))
            )}
          </div>

          {/* All locations + back */}
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
            >
              ←
            </button>
            <button
              onClick={handleAllLocations}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              {t("all_locations")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
