"use client";

import Image from "next/image";
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Users } from "lucide-react";
import { getWilayaLabel } from "@/lib/wilayas";

interface Venue {
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
}

interface VenueCardProps {
    venue: Venue;
    compact?: boolean;
    /** When true, renders a horizontal layout: image on left, info on right */
    horizontal?: boolean;
}

export function VenueCard({ venue, compact = false, horizontal = false }: VenueCardProps) {
    const t = useTranslations('VenuesList');
    const tCommon = useTranslations();
    const locale = useLocale();

    const price = venue.price !== null && venue.price !== undefined ? Number(venue.price) : null;
    const capacity = venue.capacity !== null && venue.capacity !== undefined ? Number(venue.capacity) : null;
    const wilayaLabel = getWilayaLabel(tCommon, venue.wilaya || venue.location);
    const locationLabel = [venue.city, wilayaLabel || venue.location].filter(Boolean).join(", ");
    const priceLabel = tCommon("VenueDetails.price_label");
    const formattedPrice = price !== null && !Number.isNaN(price)
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(price)
        : null;
    const formattedCapacity = capacity !== null && !Number.isNaN(capacity)
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(capacity)
        : null;

    const venueSlug = venue.slug || venue.id;

    // Horizontal layout (mobile list view)
    if (horizontal) {
        return (
            <div className="group flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
                {/* Image - fixed width on left */}
                <Link
                    href={`/salles/${venueSlug}`}
                    className="relative shrink-0 w-28 sm:w-36 bg-slate-100 overflow-hidden"
                    aria-label={venue.title}
                    tabIndex={-1}
                >
                    {venue.images && venue.images.length > 0 ? (
                        <Image
                            src={venue.images[0]}
                            alt={venue.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="144px"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                            <span className="text-3xl">🏛️</span>
                        </div>
                    )}
                    {formattedPrice && (
                        <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
                            {formattedPrice} DZD
                        </div>
                    )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 min-w-0 flex-col justify-between p-3 sm:p-4">
                    <div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{locationLabel || venue.location}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                            {venue.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {venue.description}
                        </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        {formattedCapacity && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Users className="h-3 w-3 text-primary-400" />
                                <span>{formattedCapacity}</span>
                            </div>
                        )}
                        <Link
                            href={`/salles/${venueSlug}`}
                            className="ms-auto text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
                        >
                            {t('view_details')} →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Default vertical layout (existing behaviour)
    return (
        <div className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)] ${compact ? 'min-h-[22rem]' : ''}`}>
            <div className={`relative w-full overflow-hidden bg-slate-100 ${compact ? 'h-44' : 'h-60'}`}>
                {venue.images && venue.images.length > 0 ? (
                    <Image
                        src={venue.images[0]}
                        alt={venue.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                        <span className="text-4xl">🏛️</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
                    {formattedPrice ? `${formattedPrice} DZD` : priceLabel}
                </div>
                {venue.images && venue.images.length > 1 ? (
                    <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs text-white backdrop-blur">
                        +{venue.images.length - 1}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="line-clamp-1">{locationLabel || venue.location}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {venue.title}
                    </h3>
                </div>

                <p className={`text-sm text-slate-600 flex-1 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
                    {venue.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Users className="h-4 w-4 text-primary-500" />
                        <span>{formattedCapacity || '-'}</span>
                    </div>
                    <Link
                        href={`/salles/${venueSlug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
                    >
                        {t('view_details')} <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
