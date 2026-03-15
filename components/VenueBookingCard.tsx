"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, X, MapPin, Users, Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import InquiryForm from "@/components/InquiryForm";

interface VenueBookingCardProps {
    venueId: string;
    venueTitle: string;
    city?: string | null;
    wilaya?: string | null;
    location?: string | null;
    capacity?: number | null;
    price?: number | null;
    phone?: string | null;
    whatsapp?: string | null;
    contactEmail?: string | null;
}

export default function VenueBookingCard({
    venueId,
    venueTitle,
    city,
    wilaya,
    location,
    capacity,
    price,
    phone,
    whatsapp,
    contactEmail
}: VenueBookingCardProps) {
    const t = useTranslations("VenueDetails");
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const locationLabel = [city, wilaya || location].filter(Boolean).join(", ");
    const showPhone = phone || whatsapp;

    return (
        <>
            <div className="overflow-hidden rounded-2xl sm:rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_50px_-32px_rgba(15,23,42,0.35)]">
                <div className="bg-[radial-gradient(circle_at_top,#fef2f2,transparent_55%),linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)] p-5 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                        {locationLabel && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-4 h-4" />
                                <span>{locationLabel}</span>
                            </div>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">{venueTitle}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-sm">
                            <div className="text-xs text-slate-500">{t("capacity_label")}</div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-900 font-semibold text-sm sm:text-base">
                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
                                <span>{capacity ? capacity : "-"}</span>
                            </div>
                        </div>
                        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-sm">
                            <div className="text-xs text-slate-500">{t("price_label")}</div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-900 font-semibold text-sm sm:text-base">
                                <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
                                <span>{price ? `${price} DZD` : "-"}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="w-full rounded-xl sm:rounded-2xl bg-slate-950 py-2.5 sm:py-3 text-white font-semibold transition hover:bg-slate-800 text-sm sm:text-base"
                    >
                        {t("book_now")}
                    </button>

                    {showPhone && (
                        <p className="text-xs text-slate-500 text-center">
                            {t("contact_owner")}
                        </p>
                    )}
                </div>
            </div>

            {/* Contact Modal - optimized for mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="relative w-full sm:max-w-lg md:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 z-10">
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-slate-900">{t("contact_info")}</h4>
                                <p className="text-sm text-slate-500">{venueTitle}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-5 sm:px-6 py-5 sm:py-6">
                            {/* Contact options */}
                            <div className="space-y-3">
                                {phone && (
                                    <a
                                        href={`tel:${phone}`}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:border-primary-300 hover:shadow-sm transition active:bg-slate-50"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm text-slate-500">{t("call_now")}</div>
                                            <div className="font-semibold text-slate-900 truncate">{phone}</div>
                                        </div>
                                    </a>
                                )}

                                {whatsapp && (
                                    <a
                                        href={`https://wa.me/${whatsapp}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:border-emerald-300 hover:shadow-sm transition active:bg-slate-50"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                            <MessageCircle className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm text-slate-500">{t("whatsapp")}</div>
                                            <div className="font-semibold text-slate-900 truncate">{whatsapp}</div>
                                        </div>
                                    </a>
                                )}

                                {contactEmail && (
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:border-slate-300 hover:shadow-sm transition active:bg-slate-50"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-slate-700" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm text-slate-500">{t("email_owner")}</div>
                                            <div className="font-semibold text-slate-900 truncate">{contactEmail}</div>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="my-5 sm:my-6 border-t border-slate-100" />

                            {/* Inquiry section */}
                            <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4 text-sm text-slate-600 mb-4">
                                {t("request_intro")}
                            </div>

                            {showForm ? (
                                <InquiryForm venueId={venueId} venueTitle={venueTitle} compact />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="w-full border border-primary-600 text-primary-600 font-semibold py-2.5 rounded-xl hover:bg-primary-50 transition text-sm sm:text-base"
                                >
                                    {t("send_request")}
                                </button>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 sm:px-6 py-3 sm:py-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm"
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
