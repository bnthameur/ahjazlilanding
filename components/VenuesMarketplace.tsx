"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, MapPin, ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import { VenueCard } from "@/components/VenueCard";
import { WILAYAS, getWilayas } from "@/lib/wilayas";

type Venue = {
    id: string;
    slug?: string | null;
    title: string;
    description: string;
    location: string;
    category?: string | null;
    wilaya?: string | null;
    city?: string | null;
    price?: number | null;
    capacity?: number | null;
    images?: string[] | null;
};

type CityOption = {
    id: number;
    commune_name: string;
    wilaya_code: number;
    wilaya_name: string;
};

interface VenuesMarketplaceProps {
    venues: Venue[];
}

type BottomSheetType = "category" | "location" | "city" | null;

export default function VenuesMarketplace({ venues }: VenuesMarketplaceProps) {
    const t = useTranslations("VenuesList");
    const tCommon = useTranslations();
    const locale = useLocale();
    const searchParams = useSearchParams();
    const wilayas = useMemo(() => getWilayas(tCommon), [tCommon]);
    const categoryOptions = useMemo(() => ([
        { id: "wedding-hall", label: tCommon("Footer.links.wedding_halls") },
        { id: "event-salon", label: tCommon("Footer.links.event_salons") },
        { id: "conference-room", label: tCommon("Footer.links.conference_rooms") },
        { id: "garden-outdoor", label: tCommon("Footer.links.outdoor_venues") },
    ]), [tCommon]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [cities, setCities] = useState<CityOption[]>([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    // Bottom sheet state (mobile)
    const [activeSheet, setActiveSheet] = useState<BottomSheetType>(null);
    // Desktop: always expanded filter panel
    const [showDesktopFilters, setShowDesktopFilters] = useState(false);
    const citiesCacheRef = useRef(new Map<string, CityOption[]>());

    const normalizeWilayaValue = (value?: string | null) => {
        if (!value) return "";
        const normalized = value.toLowerCase();
        const match = WILAYAS.find((item) => {
            const itemId = item.id.toLowerCase();
            return itemId === normalized || itemId.replace(/\s+/g, "-") === normalized || item.code === value;
        });
        return match?.id || value;
    };

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "");
        setSelectedCategory(searchParams.get("category") || "");
        setSelectedWilaya(normalizeWilayaValue(searchParams.get("location")));
        setSelectedCity(searchParams.get("city") || "");
    }, [searchParams]);

    useEffect(() => {
        if (!selectedWilaya) {
            setCities([]);
            setSelectedCity("");
            return;
        }
        const wilaya = WILAYAS.find((item) => item.id === selectedWilaya);
        if (!wilaya) { setCities([]); return; }
        const cached = citiesCacheRef.current.get(wilaya.code);
        if (cached) { setCities(cached); return; }
        setCitiesLoading(true);
        fetch(`/api/cities?wilaya_code=${wilaya.code}`)
            .then((res) => res.json())
            .then((payload) => {
                const list = payload?.data || [];
                citiesCacheRef.current.set(wilaya.code, list);
                setCities(list);
            })
            .catch(() => setCities([]))
            .finally(() => setCitiesLoading(false));
    }, [selectedWilaya]);

    const filteredVenues = useMemo(() => {
        return venues.filter((venue) => {
            const haystack = `${venue.title} ${venue.description} ${venue.city || ""} ${venue.wilaya || venue.location || ""}`.toLowerCase();
            const matchesSearch = searchQuery ? haystack.includes(searchQuery.toLowerCase()) : true;
            const matchesCategory = selectedCategory ? venue.category === selectedCategory : true;
            const matchesWilaya = selectedWilaya ? normalizeWilayaValue(venue.wilaya || venue.location) === selectedWilaya : true;
            const matchesCity = selectedCity ? venue.city === selectedCity : true;
            return matchesSearch && matchesCategory && matchesWilaya && matchesCity;
        });
    }, [venues, searchQuery, selectedCategory, selectedWilaya, selectedCity]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedWilaya("");
        setSelectedCity("");
    };

    const hasActiveFilters = !!(searchQuery || selectedWilaya || selectedCity || selectedCategory);
    const resultCount = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(filteredVenues.length);

    const selectedWilayaLabel = wilayas.find((w) => w.id === selectedWilaya)?.name;
    const selectedCategoryLabel = categoryOptions.find((o) => o.id === selectedCategory)?.label;

    const closeSheet = () => setActiveSheet(null);

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* ===== Compact Header ===== */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4">
                    {/* Title row - very compact on mobile */}
                    <div className="flex items-center justify-between gap-3 py-3">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{t("title")}</h1>
                        <span className="text-xs text-slate-500 shrink-0 font-medium">
                            {t("results_count", { count: resultCount })}
                        </span>
                    </div>

                    {/* Search bar */}
                    <div className="pb-3">
                        <div className="relative">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t("search_placeholder")}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 ps-10 pe-9 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:bg-white"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200"
                                >
                                    <X className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ===== Horizontal filter chip strip (mobile) / full row (desktop) ===== */}
                    <div className="pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                        {/* Category chips */}
                        {categoryOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedCategory((c) => c === option.id ? "" : option.id)}
                                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                                    selectedCategory === option.id
                                        ? "border-primary-400 bg-primary-500 text-white shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}

                        {/* Divider line */}
                        <div className="shrink-0 h-5 w-px bg-slate-200 mx-1" />

                        {/* Location chip - opens bottom sheet on mobile, inline select on desktop */}
                        <button
                            onClick={() => setActiveSheet("location")}
                            className={`sm:hidden shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                                selectedWilaya
                                    ? "border-slate-700 bg-slate-800 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                        >
                            <MapPin className="h-3 w-3" />
                            {selectedWilayaLabel || t("wilaya_label")}
                            {selectedWilaya && (
                                <span
                                    className="ms-0.5 p-0.5 rounded-full hover:bg-white/20"
                                    onClick={(e) => { e.stopPropagation(); setSelectedWilaya(""); setSelectedCity(""); }}
                                >
                                    <X className="h-2.5 w-2.5" />
                                </span>
                            )}
                        </button>

                        {/* Desktop location selects - inline */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="relative">
                                <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                <ChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                <select
                                    value={selectedWilaya}
                                    onChange={(e) => { setSelectedWilaya(e.target.value); setSelectedCity(""); }}
                                    className="appearance-none rounded-full border border-slate-200 bg-white ps-8 pe-7 py-1.5 text-xs font-medium shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                >
                                    <option value="">{t("select_wilaya")}</option>
                                    {wilayas.map((w) => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedWilaya && (
                                <div className="relative">
                                    <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                    <ChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        disabled={citiesLoading}
                                        className="appearance-none rounded-full border border-slate-200 bg-white ps-8 pe-7 py-1.5 text-xs font-medium shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60"
                                    >
                                        <option value="">{citiesLoading ? "..." : t("select_city")}</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.commune_name}>{city.commune_name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* City chip on mobile (only when wilaya is selected) */}
                        {selectedWilaya && (
                            <button
                                onClick={() => setActiveSheet("city")}
                                className={`sm:hidden shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                                    selectedCity
                                        ? "border-slate-700 bg-slate-800 text-white"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                            >
                                <MapPin className="h-3 w-3" />
                                {selectedCity || t("city_label")}
                                {selectedCity && (
                                    <span
                                        className="ms-0.5 p-0.5 rounded-full hover:bg-white/20"
                                        onClick={(e) => { e.stopPropagation(); setSelectedCity(""); }}
                                    >
                                        <X className="h-2.5 w-2.5" />
                                    </span>
                                )}
                            </button>
                        )}

                        {/* Clear all */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="shrink-0 flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition whitespace-nowrap"
                            >
                                <X className="h-3 w-3" />
                                {t("clear_filters")}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== Results Grid ===== */}
            <div className="container mx-auto px-4 py-5 sm:py-6 pb-12 sm:pb-16">
                {filteredVenues.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 sm:py-16 text-center text-slate-500 shadow-sm">
                        {t("no_results")}
                    </div>
                ) : (
                    <>
                        {/* Mobile: horizontal card layout */}
                        <div className="flex flex-col gap-3 sm:hidden">
                            {filteredVenues.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} horizontal />
                            ))}
                        </div>
                        {/* Tablet+: grid layout */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredVenues.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ===== Mobile Bottom Sheets ===== */}
            {activeSheet !== null && (
                <div className="sm:hidden fixed inset-0 z-50 flex items-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={closeSheet}
                    />
                    {/* Sheet */}
                    <div className="relative w-full bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-slate-300" />
                        </div>

                        {/* Location sheet */}
                        {activeSheet === "location" && (
                            <>
                                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-900">{t("wilaya_label")}</h3>
                                    <button onClick={closeSheet} className="p-1.5 rounded-full hover:bg-slate-100">
                                        <X className="h-4 w-4 text-slate-500" />
                                    </button>
                                </div>
                                <div className="overflow-y-auto flex-1 p-4 space-y-1">
                                    <button
                                        onClick={() => { setSelectedWilaya(""); setSelectedCity(""); closeSheet(); }}
                                        className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                            !selectedWilaya ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                        }`}
                                    >
                                        {t("select_wilaya")}
                                    </button>
                                    {wilayas.map((w) => (
                                        <button
                                            key={w.id}
                                            onClick={() => { setSelectedWilaya(w.id); setSelectedCity(""); closeSheet(); }}
                                            className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                                selectedWilaya === w.id ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                            }`}
                                        >
                                            {w.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* City sheet */}
                        {activeSheet === "city" && (
                            <>
                                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-900">{t("city_label")}</h3>
                                    <button onClick={closeSheet} className="p-1.5 rounded-full hover:bg-slate-100">
                                        <X className="h-4 w-4 text-slate-500" />
                                    </button>
                                </div>
                                <div className="overflow-y-auto flex-1 p-4 space-y-1">
                                    {citiesLoading ? (
                                        <div className="text-center py-8 text-slate-500 text-sm">...</div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setSelectedCity(""); closeSheet(); }}
                                                className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                                    !selectedCity ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                            >
                                                {t("select_city")}
                                            </button>
                                            {cities.map((city) => (
                                                <button
                                                    key={city.id}
                                                    onClick={() => { setSelectedCity(city.commune_name); closeSheet(); }}
                                                    className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                                        selectedCity === city.commune_name ? "bg-primary-50 text-primary-700" : "hover:bg-slate-50 text-slate-700"
                                                    }`}
                                                >
                                                    {city.commune_name}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
