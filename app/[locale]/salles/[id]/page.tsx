import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { MapPin, Users, Coins, ArrowLeft, CalendarCheck, Sparkles } from "lucide-react";
import VenueBookingCard from "@/components/VenueBookingCard";
import { getWilayaLabel } from "@/lib/wilayas";

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
    const { data: slugVenue } = await supabase
        .from("venues")
        .select("*, profiles (full_name, phone, email)")
        .eq("slug", slugOrId)
        .maybeSingle();

    const venue = slugVenue ?? (await supabase
        .from("venues")
        .select("*, profiles (full_name, phone, email)")
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
    const gallery = venue.images || [];

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero */}
            <div className="relative h-[45vh] sm:h-[55vh] w-full overflow-hidden bg-slate-900">
                {gallery.length > 0 ? (
                    <Image
                        src={gallery[0]}
                        alt={venue.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40 text-4xl">
                        🏛️
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

                <div className="absolute top-6 left-0 w-full z-10">
                    <div className="container mx-auto px-4">
                        <Link
                            href={"/salles"}
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("back_to_list")}
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full pb-8 sm:pb-12 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 text-primary-200 font-medium mb-3">
                                <MapPin className="w-5 h-5" />
                                {locationLabel || venue.location}
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                {venue.title}
                            </h1>
                            <div className="mt-4 flex flex-wrap gap-3 text-sm sm:text-base">
                                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                                    <Users className="w-4 h-4 text-primary-200" />
                                    {venue.capacity} {t("capacity_label")}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                                    <Coins className="w-4 h-4 text-primary-200" />
                                    {venue.price} DZD
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                                    <CalendarCheck className="w-4 h-4 text-primary-200" />
                                    {t("book_now")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10 pb-16">
                <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Main */}
                    <div className="space-y-6">
                        {/* Highlights */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-primary-600" />
                                <h2 className="text-xl font-bold text-slate-900">{t("description_label")}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{venue.description}</p>
                        </div>

                        {/* Gallery */}
                        {gallery.length > 1 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Gallery</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {gallery.slice(0, 6).map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                                            <Image src={img} alt={`${venue.title} ${i + 1}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Amenities */}
                        {venue.amenities && venue.amenities.length > 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">{t("features_label")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {venue.amenities.map((amenity: string) => (
                                        <span
                                            key={amenity}
                                            className="px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:sticky lg:top-8 h-fit space-y-4">
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

                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                            <h4 className="text-sm font-semibold text-slate-900">{t("contact_info")}</h4>
                            {contactPhone ? (
                                <a
                                    href={`tel:${contactPhone}`}
                                    className="block text-sm text-slate-600 hover:text-primary-600"
                                >
                                    {contactPhone}
                                </a>
                            ) : null}
                            {contactWhatsapp ? (
                                <a
                                    href={`https://wa.me/${contactWhatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-sm text-slate-600 hover:text-primary-600"
                                >
                                    WhatsApp
                                </a>
                            ) : null}
                            {contactEmail ? (
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="block text-sm text-slate-600 hover:text-primary-600"
                                >
                                    {contactEmail}
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
