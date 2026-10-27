import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import VenuesMarketplace from "@/components/VenuesMarketplace";
import Header from "@/components/Header";
import { Link } from "@/i18n/navigation";
import {
    LISTING_CATEGORIES,
    LISTING_GROUPS,
    getGroupDescription,
    getGroupLabel,
    type ListingGroupId,
} from "@/lib/listing-types";

// Rendered per request: the ?type= tab decides which listings to load
export const dynamic = "force-dynamic";

const SITE_URL = "https://ahjazliqaati.com";

// Every group except halls, which keep their own page at /salles
const SERVICE_GROUPS = LISTING_GROUPS.filter((g) => g.id !== "venue");

const resolveGroup = (type?: string | string[]): ListingGroupId => {
    const value = Array.isArray(type) ? type[0] : type;
    return SERVICE_GROUPS.find((g) => g.id === value)?.id ?? SERVICE_GROUPS[0].id;
};

const TITLES: Record<string, string> = {
    ar: "خدمات وكراء للأعراس — طالبو العمل، دي جي، زرنة، كراء الملابس والسيارات في الجزائر",
    fr: "Services & locations pour mariages — emploi, DJ, zorna, location de vêtements et voitures en Algérie",
    en: "Wedding services & rentals — job seekers, DJs, zorna, clothing and car rentals in Algeria",
};

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
    const { locale } = await props.params;
    const group = resolveGroup((await props.searchParams).type);
    const path = `/services?type=${group}`;
    const canonical = locale === "ar" ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
    const title = `${getGroupLabel(group, locale)} — ${TITLES[locale] || TITLES.ar}`;

    return {
        title,
        description: getGroupDescription(group, locale),
        alternates: {
            canonical,
            languages: {
                ar: `${SITE_URL}${path}`,
                fr: `${SITE_URL}/fr${path}`,
                en: `${SITE_URL}/en${path}`,
            },
        },
        openGraph: { title, description: getGroupDescription(group, locale), url: canonical, type: "website" },
    };
}

export default async function ServicesPage(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { locale } = await props.params;
    const group = resolveGroup((await props.searchParams).type);
    const categoryIds = LISTING_CATEGORIES.filter((c) => c.group === group).map((c) => c.id);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: listings, error } = await supabase
        .from("venues")
        .select("id, slug, title, description, location, category, wilaya, city, price, capacity, images")
        .eq("status", "published")
        .in("category", categoryIds)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching service listings:", error);
    }

    return (
        <>
            <Header />
            <div className="pt-16 sm:pt-20">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex gap-2 overflow-x-auto" aria-label="Services">
                    {SERVICE_GROUPS.map((g) => {
                        const Icon = g.icon;
                        const active = g.id === group;
                        return (
                            <Link
                                key={g.id}
                                href={`/services?type=${g.id}`}
                                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                    active
                                        ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-700"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {getGroupLabel(g.id, locale)}
                            </Link>
                        );
                    })}
                </nav>
                <VenuesMarketplace key={group} venues={listings || []} group={group} title={getGroupLabel(group, locale)} />
            </div>
        </>
    );
}
