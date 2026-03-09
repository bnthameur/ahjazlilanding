"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, SlidersHorizontal, X, Sparkles, MapPin, Compass } from "lucide-react";
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
    const citiesCacheRef = useRef(new Map<string, CityOption[]>());

    const normalizeWilayaValue = (value?: string | null) => {
        if (!value) {
            return "";
        }

        const normalized = value.toLowerCase();
        const match = WILAYAS.find((item) => {
            const itemId = item.id.toLowerCase();
            return (
                itemId === normalized ||
                itemId.replace(/\s+/g, "-") === normalized ||
                item.code === value
            );
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
        if (!wilaya) {
            setCities([]);
            return;
        }

        const cached = citiesCacheRef.current.get(wilaya.code);
        if (cached) {
            setCities(cached);
            return;
        }

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
            const matchesWilaya = selectedWilaya
                ? normalizeWilayaValue(venue.wilaya || venue.location) === selectedWilaya
                : true;
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

    const resultCount = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(filteredVenues.length);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#fecdd3,transparent_26%),linear-gradient(180deg,#fff7ed_0%,#ffffff_42%,#f8fafc_100%)]" />
                <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
                <div className="absolute top-40 -left-16 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />

                <div className="relative container mx-auto px-4 pt-12 pb-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/80 px-3 py-1 text-xs text-rose-700 shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t("filters_title")}
                        </div>
                        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">{t("title")}</h1>
                        <p className="mt-2 text-slate-600">{t("subtitle")}</p>
                    </div>

                    <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-5 sm:p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-primary-100">
                                    <Compass className="h-3.5 w-3.5" />
                                    {t("results_count", { count: resultCount })}
                                </div>
                                <h2 className="mt-5 text-2xl font-bold">{t("filters_title")}</h2>
                                <p className="mt-2 text-sm text-slate-300">{t("search_placeholder")}</p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {categoryOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSelectedCategory((current) => current === option.id ? "" : option.id);
                                            }}
                                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedCategory === option.id
                                                ? 'border-primary-400 bg-primary-500 text-white shadow-sm'
                                                : 'border-white/15 bg-white/5 text-slate-200 hover:border-primary-300/50'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-300">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{tCommon("VenueDetails.location_label")}</div>
                                        <div className="mt-2 text-lg font-semibold text-white">58</div>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{tCommon("Hero.stats_venues")}</div>
                                        <div className="mt-2 text-lg font-semibold text-white">{resultCount}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={t("search_placeholder")}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                        />
                                    </div>

                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <select
                                            value={selectedWilaya}
                                            onChange={(e) => {
                                                setSelectedWilaya(e.target.value);
                                                setSelectedCity("");
                                            }}
                                            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                        >
                                            <option value="">{t("select_wilaya")}</option>
                                            {wilayas.map((wilaya) => (
                                                <option key={wilaya.id} value={wilaya.id}>
                                                    {wilaya.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            disabled={!selectedWilaya || citiesLoading}
                                            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <option value="">{citiesLoading ? `${t("city_label")}...` : t("select_city")}</option>
                                            {cities.map((city) => (
                                                <option key={city.id} value={city.commune_name}>
                                                    {city.commune_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("results_count", { count: resultCount })}</div>
                                        <div className="mt-2 text-lg font-bold text-slate-900">{resultCount}</div>
                                        <div className="mt-1 text-sm text-slate-500">{t("filters_title")}</div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                    {selectedCategory ? (
                                        <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                                            {categoryOptions.find((option) => option.id === selectedCategory)?.label}
                                        </span>
                                    ) : null}
                                    {(searchQuery || selectedWilaya || selectedCity || selectedCategory) && (
                                        <button
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-slate-300"
                                        >
                                            <X className="h-3 w-3" />
                                            {t("clear_filters")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                {filteredVenues.length === 0 ? (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">{t("no_results")}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVenues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
