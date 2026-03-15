"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import VenueBookingCard from "@/components/VenueBookingCard";
import { X } from "lucide-react";

interface MobileStickyBarProps {
    venueId: string;
    venueTitle: string;
    price?: number | null;
    city?: string | null;
    wilaya?: string | null;
    location?: string | null;
    capacity?: number | null;
    phone?: string | null;
    whatsapp?: string | null;
    contactEmail?: string | null;
    bookNowLabel: string;
    priceLabel: string;
}

export default function MobileStickyBar({
    venueId,
    venueTitle,
    price,
    city,
    wilaya,
    location,
    capacity,
    phone,
    whatsapp,
    contactEmail,
    bookNowLabel,
    priceLabel,
}: MobileStickyBarProps) {
    const [showCard, setShowCard] = useState(false);

    return (
        <>
            {/* Sticky bar - only on mobile (lg:hidden) */}
            <div className="lg:hidden fixed bottom-0 start-0 end-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_32px_-8px_rgba(15,23,42,0.2)] px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500">{priceLabel}</div>
                    <div className="text-base font-bold text-slate-900 truncate">
                        {price ? `${price} DZD` : "—"}
                    </div>
                </div>
                <button
                    onClick={() => setShowCard(true)}
                    className="shrink-0 rounded-xl bg-slate-950 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 transition active:scale-95"
                >
                    {bookNowLabel}
                </button>
            </div>

            {/* Bottom sheet with full booking card */}
            {showCard && (
                <div className="lg:hidden fixed inset-0 z-50 flex items-end">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowCard(false)}
                    />
                    <div className="relative w-full bg-slate-50 rounded-t-2xl shadow-2xl pb-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white rounded-t-2xl">
                            <h3 className="text-base font-bold text-slate-900">{venueTitle}</h3>
                            <button
                                onClick={() => setShowCard(false)}
                                className="p-1.5 rounded-full hover:bg-slate-100"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-4">
                            <VenueBookingCard
                                venueId={venueId}
                                venueTitle={venueTitle}
                                city={city}
                                wilaya={wilaya}
                                location={location}
                                capacity={capacity}
                                price={price}
                                phone={phone}
                                whatsapp={whatsapp}
                                contactEmail={contactEmail}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
