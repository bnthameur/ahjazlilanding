"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, Sparkles, MapPin, Compass, ChevronDown, Filter } from "lucide-react";
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
    const [showMobileFilters, setShowMobileFilters] = useState(false);
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

    const hasActiveFilters = searchQuery || selectedWilaya || selectedCity || selectedCategory;
    const resultCount = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(filteredVenues.length);

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#fecdd3,transparent_26%),linear-gradient(180deg,#fff7ed_0%,#ffffff_42%,#f8fafc_100%)]" />
                <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
                <div className="absolute top-40 -left-16 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />

                <div className="relative container mx-auto px-4 pt-8 sm:pt-12 pb-6 sm:pb-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/80 px-3 py-1 text-xs text-rose-700 shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t("filters_title")}
                        </div>
                        <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">{t("title")}</h1>
                        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600">{t("subtitle")}</p>
                    </div>

                    {/* Search + Filters */}
                    <div className="mt-6 sm:mt-8 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/80 bg-white/90 p-4 sm:p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                        {/* Search bar - always visible */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t("search_placeholder")}
                                    className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-10 py-2.5 sm:py-3 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100">
                                        <X className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                )}
                            </div>

                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="xl:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">{t("filters_title")}</span>
                                {hasActiveFilters && (
                                    <span className="h-2 w-2 rounded-full bg-primary-500" />
                                )}
                            </button>
                        </div>

                        {/* Filters - desktop always visible, mobile toggle */}
                        <div className={`${showMobileFilters ? 'block' : 'hidden'} xl:block mt-4`}>
                            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                                {/* Category */}
                                <div className="sm:col-span-2 xl:col-span-4">
                                    <div className="flex flex-wrap gap-2">
                                        {categoryOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setSelectedCategory((c) => c === option.id ? "" : option.id)}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                                    selectedCategory === option.id
                                                        ? 'border-primary-400 bg-primary-500 text-white shadow-sm'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Wilaya */}
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <select
                                        value={selectedWilaya}
                                        onChange={(e) => { setSelectedWilaya(e.target.value); setSelectedCity(""); }}
                                        className="w-full appearance-none rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-10 py-2.5 sm:py-3 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    >
                                        <option value="">{t("select_wilaya")}</option>
                                        {wilayas.map((w) => (
                                            <option key={w.id} value={w.id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        disabled={!selectedWilaya || citiesLoading}
                                        className="w-full appearance-none rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-10 py-2.5 sm:py-3 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <option value="">{citiesLoading ? `${t("city_label")}...` : t("select_city")}</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.commune_name}>{city.commune_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Active filters + clear */}
                            {hasActiveFilters && (
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {selectedCategory && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                                            {categoryOptions.find((o) => o.id === selectedCategory)?.label}
                                            <button onClick={() => setSelectedCategory("")} className="ml-0.5 hover:text-primary-900"><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {selectedWilaya && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {wilayas.find((w) => w.id === selectedWilaya)?.name}
                                            <button onClick={() => { setSelectedWilaya(""); setSelectedCity(""); }} className="ml-0.5 hover:text-slate-900"><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    {selectedCity && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {selectedCity}
                                            <button onClick={() => setSelectedCity("")} className="ml-0.5 hover:text-slate-900"><X className="h-3 w-3" /></button>
                                        </span>
                                    )}
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-slate-300"
                                    >
                                        <X className="h-3 w-3" />
                                        {t("clear_filters")}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Results count bar */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Compass className="h-4 w-4 text-primary-500" />
                                <span className="font-medium">{t("results_count", { count: resultCount })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="container mx-auto px-4 pb-12 sm:pb-16">
                {filteredVenues.length === 0 ? (
                    <div className="rounded-2xl sm:rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-12 sm:py-16 text-center text-slate-500 shadow-sm">
                        {t("no_results")}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredVenues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
