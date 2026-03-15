import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
    MapPin,
    Users,
    Coins,
    ArrowLeft,
    Sparkles,
    Phone,
    MessageCircle,
    Mail,
    Star,
    Tag,
} from "lucide-react";
import VenueBookingCard from "@/components/VenueBookingCard";
import ImageGallery, { MediaItem } from "@/components/ImageGallery";
import MobileStickyBar from "@/components/MobileStickyBar";
import VenueHeroCarousel from "@/components/VenueHeroCarousel";
import ShareButton from "@/components/ShareButton";
import { getWilayaLabel } from "@/lib/wilayas";
import Header from "@/components/Header";

interface VenueMedia {
    id: string;
    venue_id: string;
    media_type: "image" | "video";
    url: string;
    thumbnail_url?: string | null;
    caption?: string | null;
    display_order?: number | null;
    is_cover?: boolean | null;
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    "wedding-hall": { ar: "قاعة أفراح", fr: "Salle des Fêtes", en: "Wedding Hall" },
    "event-salon": { ar: "صالون مناسبات", fr: "Salon Événementiel", en: "Event Salon" },
    "conference-room": { ar: "قاعة مؤتمرات", fr: "Salle de Conférence", en: "Conference Room" },
    "garden-outdoor": { ar: "حديقة / فضاء مفتوح", fr: "Jardin / Extérieur", en: "Garden / Outdoor" },
};

function getCategoryLabel(category: string | null | undefined, locale: string): string | null {
    if (!category) return null;
    return CATEGORY_LABELS[category]?.[locale] ?? CATEGORY_LABELS[category]?.["en"] ?? null;
}

export default async function VenueDetailsPage(props: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const params = await props.params;
    const { id, locale } = params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const t = await getTranslations("VenueDetails");
    const tCommon = await getTranslations();

    // Fetch venue - try by slug first, then ID
    const { data: slugVenue } = await supabase
        .from("venues")
        .select("*, profiles(full_name, phone, email), venue_media(*)")
        .eq("slug", id)
        .maybeSingle();

    const venue = slugVenue ?? (await supabase
        .from("venues")
        .select("*, profiles(full_name, phone, email), venue_media(*)")
        .eq("id", id)
        .maybeSingle()).data;

    if (!venue) {
        notFound();
    }

    const wilayaLabel = getWilayaLabel(tCommon, venue.wilaya || venue.location);
    const locationLabel = [venue.city, wilayaLabel || venue.location].filter(Boolean).join(", ");
    const contactPhone = venue.phone || venue.profiles?.phone || null;
    const contactEmail = venue.contact_email || venue.profiles?.email || null;
    const contactWhatsapp = venue.whatsapp || null;
    const categoryLabel = getCategoryLabel(venue.category, locale);

    // Build rich media array
    const venueMediaRows: VenueMedia[] = (venue.venue_media as VenueMedia[]) || [];
    const hasVenueMedia = venueMediaRows.length > 0;

    const allMedia: MediaItem[] = hasVenueMedia
        ? venueMediaRows
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
            .map((m) => ({
                url: m.url,
                type: m.media_type,
                thumbnail_url: m.thumbnail_url,
                caption: m.caption,
            }))
        : (venue.images || []).map((url: string) => ({
            url,
            type: "image" as const,
        }));

    // Hero carousel images (images only, up to 6)
    const heroImages = allMedia
        .filter((m) => m.type === "image")
        .slice(0, 6)
        .map((m) => ({ url: m.url, caption: m.caption ?? null }));

    // If no media images, use venue.images array
    if (heroImages.length === 0 && venue.images?.length) {
        heroImages.push(...(venue.images as string[]).slice(0, 6).map((url: string) => ({ url, caption: null })));
    }

    const formattedPrice = venue.price
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(venue.price))
        : null;

    return (
        <div className="bg-slate-50 min-h-screen pb-24 lg:pb-0">
            <Header />

            {/* ===== Hero Carousel ===== */}
            <div className="relative pt-16 sm:pt-20">
                <VenueHeroCarousel images={heroImages} title={venue.title} />

                {/* Floating top bar: back + share */}
                <div className="absolute top-16 sm:top-20 start-0 end-0 z-10 pointer-events-none">
                    <div className="container mx-auto px-4 pt-3 flex items-center justify-between">
                        <Link
                            href="/salles"
                            className="pointer-events-auto inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 px-3 py-2 rounded-full transition-colors backdrop-blur-sm text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("back_to_list")}
                        </Link>
                        <div className="pointer-events-auto">
                            <ShareButton title={venue.title} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Venue Header (below hero) ===== */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 py-5 sm:py-6">
                    <div className="grid lg:grid-cols-[2fr_1fr] gap-4 lg:gap-8 items-start">
                        <div>
                            {/* Location line */}
                            <div className="flex items-center gap-1.5 text-sm text-primary-600 font-medium mb-2">
                                <MapPin className="w-4 h-4 shrink-0" />
                                {locationLabel || venue.location}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                                {venue.title}
                            </h1>

                            {/* Rating placeholder + category */}
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-4 h-4 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                                        />
                                    ))}
                                    <span className="text-sm text-slate-500 ms-1">4.0</span>
                                </div>
                                {categoryLabel && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                                        <Tag className="w-3 h-3" />
                                        {categoryLabel}
                                    </span>
                                )}
                            </div>

                            {/* Quick stats */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                {venue.capacity && (
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        <Users className="w-4 h-4 text-primary-500" />
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">{t("capacity_label")}</div>
                                            <div className="text-sm font-bold text-slate-900 leading-tight">{venue.capacity}</div>
                                        </div>
                                    </div>
                                )}
                                {formattedPrice && (
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        <Coins className="w-4 h-4 text-primary-500" />
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">{t("price_label")}</div>
                                            <div className="text-sm font-bold text-slate-900 leading-tight">{formattedPrice} DZD</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA buttons (mobile only - desktop is in sidebar) */}
                            <div className="lg:hidden mt-5 flex gap-3">
                                <a
                                    href={contactPhone ? `tel:${contactPhone}` : "#"}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-primary-600 text-primary-600 font-semibold py-3 text-sm transition hover:bg-primary-50 ${!contactPhone ? "opacity-40 pointer-events-none" : ""}`}
                                >
                                    <Phone className="w-4 h-4" />
                                    {t("call_now")}
                                </a>
                                {contactWhatsapp && (
                                    <a
                                        href={`https://wa.me/${contactWhatsapp}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-sm transition"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        {t("whatsapp")}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Desktop: sticky sidebar anchor - rendered later in the grid below */}
                        <div className="hidden lg:block" />
                    </div>
                </div>
            </div>

            {/* ===== Main content + sidebar ===== */}
            <div className="container mx-auto px-4 mt-5 sm:mt-6 relative z-10">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8">
                    {/* Left column */}
                    <div className="space-y-5 sm:space-y-6">
                        {/* About */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h2 className="text-lg font-bold text-slate-900">{t("description_label")}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{venue.description}</p>
                        </div>

                        {/* Photo & Video Gallery */}
                        {allMedia.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">{t("gallery_label")}</h3>
                                    <span className="text-xs text-slate-500">{allMedia.length} وسائط</span>
                                </div>
                                <ImageGallery media={allMedia} title={venue.title} />
                            </div>
                        )}

                        {/* Amenities */}
                        {venue.amenities && venue.amenities.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">{t("features_label")}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {(venue.amenities as string[]).map((amenity: string) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 text-sm text-slate-700"
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{t("location_label")}</h3>
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 text-sm">{locationLabel || venue.location}</div>
                                    {venue.wilaya && (
                                        <div className="text-xs text-slate-500 mt-0.5">{wilayaLabel || venue.wilaya}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact info - non-desktop */}
                        {(contactPhone || contactWhatsapp || contactEmail) && (
                            <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-base font-bold text-slate-900 mb-4">{t("contact_info")}</h4>
                                <div className="space-y-3">
                                    {contactPhone && (
                                        <a
                                            href={`tel:${contactPhone}`}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-primary-300 hover:shadow-sm transition"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                                                <Phone className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">{t("call_now")}</div>
                                                <div className="font-semibold text-slate-900 text-sm">{contactPhone}</div>
                                            </div>
                                        </a>
                                    )}
                                    {contactWhatsapp && (
                                        <a
                                            href={`https://wa.me/${contactWhatsapp}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-300 hover:shadow-sm transition"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                <MessageCircle className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">{t("whatsapp")}</div>
                                                <div className="font-semibold text-slate-900 text-sm">{contactWhatsapp}</div>
                                            </div>
                                        </a>
                                    )}
                                    {contactEmail && (
                                        <a
                                            href={`mailto:${contactEmail}`}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-slate-300 hover:shadow-sm transition"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-slate-700" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">{t("email_owner")}</div>
                                                <div className="font-semibold text-slate-900 text-sm truncate max-w-[200px]">{contactEmail}</div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right sidebar - desktop only */}
                    <div className="hidden lg:block">
                        <div className="sticky top-6 space-y-4">
                            <VenueBookingCard
                                venueId={venue.id}
                                venueTitle={venue.title}
                                city={venue.city}
                                wilaya={venue.wilaya}
                                location={venue.location}
                                capacity={venue.capacity}
                                price={venue.price}
                                phone={contactPhone}
                                whatsapp={contactWhatsapp}
                                contactEmail={contactEmail}
                            />

                            {/* Contact card */}
                            {(contactPhone || contactWhatsapp || contactEmail) && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-900 mb-4">{t("contact_info")}</h4>
                                    <div className="space-y-2.5">
                                        {contactPhone && (
                                            <a
                                                href={`tel:${contactPhone}`}
                                                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-primary-200 hover:bg-primary-50 transition"
                                            >
                                                <Phone className="w-4 h-4 text-primary-600 shrink-0" />
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t("call_now")}</div>
                                                    <div className="text-sm font-semibold text-slate-900">{contactPhone}</div>
                                                </div>
                                            </a>
                                        )}
                                        {contactWhatsapp && (
                                            <a
                                                href={`https://wa.me/${contactWhatsapp}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-emerald-200 hover:bg-emerald-50 transition"
                                            >
                                                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t("whatsapp")}</div>
                                                    <div className="text-sm font-semibold text-slate-900">{contactWhatsapp}</div>
                                                </div>
                                            </a>
                                        )}
                                        {contactEmail && (
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-slate-200 hover:bg-slate-50 transition"
                                            >
                                                <Mail className="w-4 h-4 text-slate-600 shrink-0" />
                                                <div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t("email_owner")}</div>
                                                    <div className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{contactEmail}</div>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Mobile Sticky Booking Bar ===== */}
            <MobileStickyBar
                venueId={venue.id}
                venueTitle={venue.title}
                price={venue.price}
                city={venue.city}
                wilaya={venue.wilaya}
                location={venue.location}
                capacity={venue.capacity}
                phone={contactPhone}
                whatsapp={contactWhatsapp}
                contactEmail={contactEmail}
                bookNowLabel={t("book_now")}
                priceLabel={t("price_label")}
            />
        </div>
    );
}
