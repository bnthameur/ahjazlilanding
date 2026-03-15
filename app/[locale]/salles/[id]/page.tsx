import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { MapPin, Users, Coins, ArrowLeft, Sparkles, ImageIcon } from "lucide-react";
import VenueBookingCard from "@/components/VenueBookingCard";
import ImageGallery, { MediaItem } from "@/components/ImageGallery";
import MediaStrip from "@/components/MediaStrip";
import MobileStickyBar from "@/components/MobileStickyBar";
import { getWilayaLabel } from "@/lib/wilayas";

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

export default async function VenueDetailsPage(props: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const params = await props.params;
    const { id } = params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const t = await getTranslations("VenueDetails");
    const tCommon = await getTranslations();

    const slugOrId = id;

    // Fetch venue with profile and all venue_media
    const { data: slugVenue } = await supabase
        .from("venues")
        .select("*, profiles(full_name, phone, email), venue_media(*)")
        .eq("slug", slugOrId)
        .maybeSingle();

    const venue = slugVenue ?? (await supabase
        .from("venues")
        .select("*, profiles(full_name, phone, email), venue_media(*)")
        .eq("id", slugOrId)
        .maybeSingle()).data;

    if (!venue) {
        notFound();
    }

    const wilayaLabel = getWilayaLabel(tCommon, venue.wilaya || venue.location);
    const locationLabel = [venue.city, wilayaLabel || venue.location].filter(Boolean).join(", ");
    const contactPhone = venue.phone || venue.profiles?.phone || null;
    const contactEmail = venue.contact_email || venue.profiles?.email || null;
    const contactWhatsapp = venue.whatsapp || null;

    // Build rich media array: prefer venue_media table, fallback to images array
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

    // Hero image: first cover from venue_media, or first image otherwise
    const coverMedia = hasVenueMedia
        ? venueMediaRows.find((m) => m.is_cover) || venueMediaRows[0]
        : null;
    const heroImageUrl = coverMedia?.url || (venue.images?.[0] ?? null);

    // Strip items for horizontal scroll (all images/thumbnails)
    const stripItems = allMedia;

    const totalMediaCount = allMedia.length;

    return (
        // Add pb-24 on mobile to ensure content is not hidden behind the sticky booking bar
        <div className="bg-slate-50 min-h-screen pb-24 lg:pb-0">
            {/* ===== Hero ===== */}
            <div className="relative h-[42vh] sm:h-[50vh] md:h-[55vh] w-full overflow-hidden bg-slate-900">
                {heroImageUrl ? (
                    <Image
                        src={heroImageUrl}
                        alt={venue.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/20" />

                {/* Back link */}
                <div className="absolute top-4 sm:top-6 start-0 w-full z-10">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/salles"
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-full transition-colors backdrop-blur-sm text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("back_to_list")}
                        </Link>
                    </div>
                </div>

                {/* Venue name + meta */}
                <div className="absolute bottom-0 start-0 w-full pb-5 sm:pb-10 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 text-primary-200 font-medium mb-2 text-sm">
                                <MapPin className="w-4 h-4" />
                                {locationLabel || venue.location}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                                {venue.title}
                            </h1>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
                                {venue.capacity && (
                                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur">
                                        <Users className="w-3.5 h-3.5 text-primary-200" />
                                        {venue.capacity} {t("capacity_label")}
                                    </span>
                                )}
                                {venue.price && (
                                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur">
                                        <Coins className="w-3.5 h-3.5 text-primary-200" />
                                        {venue.price} DZD
                                    </span>
                                )}
                                {totalMediaCount > 0 && (
                                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur">
                                        <ImageIcon className="w-3.5 h-3.5 text-primary-200" />
                                        {totalMediaCount} {t("gallery_label")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Horizontal Media Strip ===== */}
            {stripItems.length > 0 && (
                <MediaStrip items={stripItems} title={venue.title} />
            )}

            {/* ===== Main content ===== */}
            <div className="container mx-auto px-4 mt-4 sm:mt-6 relative z-10">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8">
                    {/* Left column */}
                    <div className="space-y-5 sm:space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h2 className="text-lg font-bold text-slate-900">{t("description_label")}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{venue.description}</p>
                        </div>

                        {/* Full media gallery */}
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
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{t("features_label")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {venue.amenities.map((amenity: string) => (
                                        <span
                                            key={amenity}
                                            className="px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-700"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact info block - desktop sidebar copy is below; this shows in main col on tablet */}
                        <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                            <h4 className="text-sm font-semibold text-slate-900 mb-1">{t("contact_info")}</h4>
                            {contactPhone && (
                                <a href={`tel:${contactPhone}`} className="block text-sm text-slate-600 hover:text-primary-600">
                                    {contactPhone}
                                </a>
                            )}
                            {contactWhatsapp && (
                                <a href={`https://wa.me/${contactWhatsapp}`} target="_blank" rel="noreferrer" className="block text-sm text-slate-600 hover:text-primary-600">
                                    {t("whatsapp")}
                                </a>
                            )}
                            {contactEmail && (
                                <a href={`mailto:${contactEmail}`} className="block text-sm text-slate-600 hover:text-primary-600">
                                    {contactEmail}
                                </a>
                            )}
                        </div>
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
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                                <h4 className="text-sm font-semibold text-slate-900">{t("contact_info")}</h4>
                                {contactPhone && (
                                    <a href={`tel:${contactPhone}`} className="block text-sm text-slate-600 hover:text-primary-600">
                                        {contactPhone}
                                    </a>
                                )}
                                {contactWhatsapp && (
                                    <a href={`https://wa.me/${contactWhatsapp}`} target="_blank" rel="noreferrer" className="block text-sm text-slate-600 hover:text-primary-600">
                                        {t("whatsapp")}
                                    </a>
                                )}
                                {contactEmail && (
                                    <a href={`mailto:${contactEmail}`} className="block text-sm text-slate-600 hover:text-primary-600">
                                        {contactEmail}
                                    </a>
                                )}
                            </div>
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
