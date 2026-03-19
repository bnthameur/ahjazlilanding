import type { Metadata } from "next";
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
    Car,
    Snowflake,
    Volume2,
    Lightbulb,
    UtensilsCrossed,
    Wifi,
    Accessibility,
    Music,
    Trees,
    Waves,
    Sun,
    Theater,
    type LucideIcon,
} from "lucide-react";
import VenueBookingCard from "@/components/VenueBookingCard";
import ImageGallery, { MediaItem } from "@/components/ImageGallery";
import MobileStickyBar from "@/components/MobileStickyBar";
import VenueHeroGallery, { HeroMediaItem } from "@/components/VenueHeroGallery";
import ShareButton from "@/components/ShareButton";
import { getWilayaLabel } from "@/lib/wilayas";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const SITE_URL = "https://ahjazliqaati.com";

export async function generateMetadata(props: {
    params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const { id, locale } = params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: slugVenue } = await supabase
        .from("venues")
        .select("id, slug, title, description, location, wilaya, city, category, price, capacity, images, venue_media(url, media_type, is_cover)")
        .eq("slug", id)
        .maybeSingle();

    const venue = slugVenue ?? (await supabase
        .from("venues")
        .select("id, slug, title, description, location, wilaya, city, category, price, capacity, images, venue_media(url, media_type, is_cover)")
        .eq("id", id)
        .maybeSingle()).data;

    if (!venue) return { title: "Venue Not Found" };

    const coverMedia = (venue.venue_media as any[])?.find((m: any) => m.is_cover && m.media_type === "image");
    const firstImage = coverMedia?.url || (venue.venue_media as any[])?.[0]?.url || (venue.images as string[])?.[0] || null;

    const locationText = [venue.city, venue.wilaya, locale === "ar" ? "الجزائر" : "Algeria"].filter(Boolean).join(", ");
    const categoryLabels: Record<string, Record<string, string>> = {
        "wedding-hall": { ar: "قاعة أفراح", fr: "Salle des Fêtes", en: "Wedding Hall" },
        "event-salon": { ar: "صالون مناسبات", fr: "Salon Événementiel", en: "Event Salon" },
        "conference-room": { ar: "قاعة مؤتمرات", fr: "Salle de Conférence", en: "Conference Room" },
        "garden-outdoor": { ar: "حديقة / فضاء مفتوح", fr: "Jardin / Extérieur", en: "Garden / Outdoor" },
    };
    const catLabel = venue.category ? categoryLabels[venue.category]?.[locale] || "" : "";

    const titleSeo = locale === "ar"
        ? `${venue.title} — ${catLabel} في ${locationText}`
        : locale === "fr"
            ? `${venue.title} — ${catLabel} à ${locationText}`
            : `${venue.title} — ${catLabel} in ${locationText}`;

    const descSeo = venue.description
        ? venue.description.slice(0, 160)
        : locale === "ar"
            ? `احجز ${venue.title} في ${locationText}. شاهد الصور، الأسعار، والتفاصيل.`
            : locale === "fr"
                ? `Réservez ${venue.title} à ${locationText}. Photos, prix et détails.`
                : `Book ${venue.title} in ${locationText}. Photos, prices and details.`;

    const slug = venue.slug || venue.id;
    const canonical = locale === "ar"
        ? `${SITE_URL}/salles/${slug}`
        : `${SITE_URL}/${locale}/salles/${slug}`;

    return {
        title: titleSeo,
        description: descSeo,
        alternates: {
            canonical,
            languages: {
                ar: `${SITE_URL}/salles/${slug}`,
                fr: `${SITE_URL}/fr/salles/${slug}`,
                en: `${SITE_URL}/en/salles/${slug}`,
            },
        },
        openGraph: {
            type: "article",
            title: titleSeo,
            description: descSeo,
            url: canonical,
            siteName: locale === "ar" ? "احجز لقاعتي" : "Ahjaz Liqaati",
            locale: locale === "ar" ? "ar_DZ" : locale === "fr" ? "fr_DZ" : "en_US",
            images: firstImage ? [{ url: firstImage, width: 1200, height: 630, alt: venue.title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: titleSeo,
            description: descSeo,
            images: firstImage ? [firstImage] : [],
        },
    };
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

    if (!venue) notFound();

    const wilayaLabel = getWilayaLabel(tCommon, venue.wilaya || venue.location);
    const locationLabel = [venue.city, wilayaLabel || venue.location].filter(Boolean).join(", ");
    const contactPhone = venue.phone || venue.profiles?.phone || null;
    const contactEmail = venue.contact_email || venue.profiles?.email || null;
    const contactWhatsapp = venue.whatsapp || null;
    const categoryLabel = getCategoryLabel(venue.category, locale);

    const venueMediaRows: VenueMedia[] = (venue.venue_media as VenueMedia[]) || [];
    const allMedia: MediaItem[] = venueMediaRows.length > 0
        ? venueMediaRows
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
            .map((m) => ({ url: m.url, type: m.media_type, thumbnail_url: m.thumbnail_url, caption: m.caption }))
        : (venue.images || []).map((url: string) => ({ url, type: "image" as const }));

    const heroMedia: HeroMediaItem[] = allMedia.map((m) => ({
        url: m.url, type: m.type, thumbnail_url: m.thumbnail_url, caption: m.caption,
    }));

    const formattedPrice = venue.price
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(venue.price))
        : null;

    const breadcrumbHome = locale === "ar" ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home";
    const breadcrumbVenues = locale === "ar" ? "القاعات" : locale === "fr" ? "Salles" : "Venues";
    const mediaCountLabel = locale === "ar" ? "وسائط" : locale === "fr" ? "médias" : "media";

    const AMENITY_ICONS: Record<string, LucideIcon> = {
        "Parking": Car, "Air Conditioning": Snowflake, "Sound System": Volume2, "Lighting": Lightbulb,
        "Catering": UtensilsCrossed, "Wi-Fi": Wifi, "Wheelchair Access": Accessibility, "Dance Floor": Music,
        "Garden": Trees, "Pool": Waves, "Terrace": Sun, "Stage": Theater,
    };
    const AMENITY_TRANSLATIONS: Record<string, Record<string, string>> = {
        "Parking": { ar: "موقف سيارات", fr: "Parking", en: "Parking" },
        "Air Conditioning": { ar: "تكييف", fr: "Climatisation", en: "Air Conditioning" },
        "Sound System": { ar: "نظام صوت", fr: "Sonorisation", en: "Sound System" },
        "Lighting": { ar: "إضاءة", fr: "Éclairage", en: "Lighting" },
        "Catering": { ar: "خدمة طعام", fr: "Traiteur", en: "Catering" },
        "Wi-Fi": { ar: "واي فاي", fr: "Wi-Fi", en: "Wi-Fi" },
        "Wheelchair Access": { ar: "وصول ذوي الاحتياجات", fr: "Accès PMR", en: "Wheelchair Access" },
        "Dance Floor": { ar: "حلبة رقص", fr: "Piste de danse", en: "Dance Floor" },
        "Garden": { ar: "حديقة", fr: "Jardin", en: "Garden" },
        "Pool": { ar: "مسبح", fr: "Piscine", en: "Pool" },
        "Terrace": { ar: "شرفة", fr: "Terrasse", en: "Terrace" },
        "Stage": { ar: "منصة", fr: "Scène", en: "Stage" },
    };

    return (
        <div className="bg-white min-h-screen pb-24 lg:pb-0">
            <Header />

            {/* ===== Hero Gallery Grid (Airbnb-style) ===== */}
            <div className="pt-16 sm:pt-20">
                <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
                    <VenueHeroGallery
                        media={heroMedia}
                        title={venue.title}
                        allPhotosLabel={t("gallery_label")}
                    />
                </div>
            </div>

            {/* ===== Breadcrumb + Back ===== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
                <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary-600 transition-colors whitespace-nowrap">{breadcrumbHome}</Link>
                    <span className="text-slate-300">/</span>
                    <Link href="/salles" className="hover:text-primary-600 transition-colors whitespace-nowrap">{breadcrumbVenues}</Link>
                    {categoryLabel && (
                        <>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400 whitespace-nowrap">{categoryLabel}</span>
                        </>
                    )}
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-700 font-medium truncate">{venue.title}</span>
                </nav>
            </div>

            {/* ===== Main Layout ===== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
                <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">

                    {/* ===== Left Column ===== */}
                    <div>
                        {/* Title & Meta */}
                        <div className="pb-6 border-b border-slate-100">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                                        {venue.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                                            <span>{locationLabel || venue.location}</span>
                                        </div>
                                        {categoryLabel && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 border border-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                                                <Tag className="w-3 h-3" />
                                                {categoryLabel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0 hidden sm:block">
                                    <ShareButton title={venue.title} />
                                </div>
                            </div>

                            {/* Quick stats row */}
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                {venue.capacity && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-400 leading-none">{t("capacity_label")}</div>
                                            <div className="font-bold text-slate-900">{venue.capacity}</div>
                                        </div>
                                    </div>
                                )}
                                {formattedPrice && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <Coins className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-400 leading-none">{t("price_label")}</div>
                                            <div className="font-bold text-slate-900">{formattedPrice} DZD</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                                    ))}
                                    <span className="text-xs text-slate-500 ms-1">4.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile CTA row */}
                        <div className="lg:hidden flex gap-3 py-4 border-b border-slate-100">
                            {contactPhone && (
                                <a href={`tel:${contactPhone}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-500 text-primary-600 font-semibold py-3 text-sm hover:bg-primary-50 transition">
                                    <Phone className="w-4 h-4" /> {t("call_now")}
                                </a>
                            )}
                            {contactWhatsapp && (
                                <a href={`https://wa.me/${contactWhatsapp}`} target="_blank" rel="noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-sm transition">
                                    <MessageCircle className="w-4 h-4" /> {t("whatsapp")}
                                </a>
                            )}
                        </div>

                        {/* Description */}
                        <section className="py-6 border-b border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-primary-500" />
                                <h2 className="text-lg font-bold text-slate-900">{t("description_label")}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                                {venue.description}
                            </p>
                        </section>

                        {/* Amenities */}
                        {venue.amenities && (venue.amenities as string[]).length > 0 && (
                            <section className="py-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">{t("features_label")}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {(venue.amenities as string[]).map((amenity: string) => {
                                        const IconComp = AMENITY_ICONS[amenity];
                                        const label = AMENITY_TRANSLATIONS[amenity]?.[locale] || amenity;
                                        return (
                                            <div key={amenity}
                                                className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-3 text-sm text-slate-700 hover:border-primary-200 hover:bg-primary-50/50 transition-colors">
                                                {IconComp ? (
                                                    <IconComp className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                                                )}
                                                <span className="font-medium">{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Full Gallery */}
                        {allMedia.length > 0 && (
                            <section className="py-6 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-900">{t("gallery_label")}</h2>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{allMedia.length} {mediaCountLabel}</span>
                                </div>
                                <ImageGallery media={allMedia} title={venue.title} />
                            </section>
                        )}

                        {/* Location */}
                        <section className="py-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-3">{t("location_label")}</h2>
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                <div className="h-11 w-11 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">{locationLabel || venue.location}</div>
                                    {venue.wilaya && (
                                        <div className="text-xs text-slate-500 mt-0.5">{wilayaLabel || venue.wilaya}</div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Contact (mobile) */}
                        {(contactPhone || contactWhatsapp || contactEmail) && (
                            <section className="lg:hidden py-6">
                                <h3 className="text-base font-bold text-slate-900 mb-4">{t("contact_info")}</h3>
                                <div className="space-y-2.5">
                                    {contactPhone && (
                                        <a href={`tel:${contactPhone}`}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-primary-300 hover:shadow-sm transition">
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
                                        <a href={`https://wa.me/${contactWhatsapp}`} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-emerald-300 hover:shadow-sm transition">
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
                                        <a href={`mailto:${contactEmail}`}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 hover:border-slate-300 hover:shadow-sm transition">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">{t("email_owner")}</div>
                                                <div className="font-semibold text-slate-900 text-sm truncate max-w-[200px]">{contactEmail}</div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ===== Right Sidebar (Desktop) ===== */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            {/* Price + Booking Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                                {/* Price header */}
                                {formattedPrice && (
                                    <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 px-6 py-4 border-b border-primary-100">
                                        <div className="text-2xl font-bold text-slate-900">
                                            {formattedPrice} <span className="text-base font-medium text-slate-500">DZD</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">{t("price_label")}</div>
                                    </div>
                                )}
                                <div className="p-5 space-y-3">
                                    {contactPhone && (
                                        <a href={`tel:${contactPhone}`}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 text-sm transition-colors shadow-sm">
                                            <Phone className="w-4 h-4" /> {t("call_now")}
                                        </a>
                                    )}
                                    {contactWhatsapp && (
                                        <a href={`https://wa.me/${contactWhatsapp}`} target="_blank" rel="noreferrer"
                                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-sm transition-colors shadow-sm">
                                            <MessageCircle className="w-4 h-4" /> {t("whatsapp")}
                                        </a>
                                    )}
                                    {contactEmail && (
                                        <a href={`mailto:${contactEmail}`}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3 text-sm transition-colors">
                                            <Mail className="w-4 h-4" /> {t("email_owner")}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Quick info sidebar card */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">{t("contact_info")}</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">{t("capacity_label")}</span>
                                        <span className="font-semibold text-slate-900">{venue.capacity || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">{t("location_label")}</span>
                                        <span className="font-semibold text-slate-900 truncate ms-4">{locationLabel || "—"}</span>
                                    </div>
                                    {categoryLabel && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">Type</span>
                                            <span className="font-semibold text-slate-900">{categoryLabel}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bar */}
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

            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org", "@type": "EventVenue",
                    name: venue.title, description: venue.description || "",
                    url: `${SITE_URL}/${locale}/salles/${venue.slug || venue.id}`,
                    image: allMedia.filter(m => m.type === "image").map(m => m.url),
                    address: { "@type": "PostalAddress", addressLocality: venue.city || "", addressRegion: venue.wilaya || venue.location || "", addressCountry: "DZ" },
                    maximumAttendeeCapacity: venue.capacity || undefined,
                    ...(venue.price ? { priceRange: `${venue.price} DZD`, offers: { "@type": "Offer", price: venue.price, priceCurrency: "DZD", availability: "https://schema.org/InStock" } } : {}),
                    telephone: contactPhone || undefined, email: contactEmail || undefined,
                    ...(venue.amenities?.length ? { amenityFeature: (venue.amenities as string[]).map((a: string) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })) } : {}),
                }),
            }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org", "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: breadcrumbHome, item: locale === "ar" ? SITE_URL : `${SITE_URL}/${locale}` },
                        { "@type": "ListItem", position: 2, name: breadcrumbVenues, item: locale === "ar" ? `${SITE_URL}/salles` : `${SITE_URL}/${locale}/salles` },
                        { "@type": "ListItem", position: 3, name: venue.title, item: `${SITE_URL}/${locale}/salles/${venue.slug || venue.id}` },
                    ],
                }),
            }} />

            {/* Footer */}
            <Footer />
        </div>
    );
}
