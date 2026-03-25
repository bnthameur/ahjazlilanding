import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import VenuesMarketplace from "@/components/VenuesMarketplace";
import Header from "@/components/Header";

export const revalidate = 60;

const SITE_URL = "https://ahjazliqaati.com";

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await props.params;

    const titles: Record<string, string> = {
        ar: "تصفح القاعات — قاعات أفراح، صالونات مناسبات، قاعات مؤتمرات في الجزائر",
        fr: "Explorer les Salles — Salles des fêtes, salons, conférences en Algérie",
        en: "Browse Venues — Wedding Halls, Event Salons, Conference Rooms in Algeria",
    };
    const descriptions: Record<string, string> = {
        ar: "اكتشف مئات القاعات في جميع ولايات الجزائر الـ 58. فلتر حسب الولاية، المدينة، الفئة والسعر. قاعات أفراح، صالونات، قاعات مؤتمرات، حدائق ومزيد.",
        fr: "Découvrez des centaines de salles dans les 58 wilayas d'Algérie. Filtrez par wilaya, ville, catégorie et prix. Salles des fêtes, salons, conférences, jardins et plus.",
        en: "Discover hundreds of venues across all 58 wilayas of Algeria. Filter by wilaya, city, category and price. Wedding halls, salons, conference rooms, gardens and more.",
    };

    const canonical = locale === "ar" ? `${SITE_URL}/salles` : `${SITE_URL}/${locale}/salles`;

    return {
        title: titles[locale] || titles.ar,
        description: descriptions[locale] || descriptions.ar,
        alternates: {
            canonical,
            languages: {
                ar: `${SITE_URL}/salles`,
                fr: `${SITE_URL}/fr/salles`,
                en: `${SITE_URL}/en/salles`,
            },
        },
        openGraph: {
            title: titles[locale] || titles.ar,
            description: descriptions[locale] || descriptions.ar,
            url: canonical,
            type: "website",
        },
    };
}

export default async function VenuesPage(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: venues, error } = await supabase
        .from("venues")
        .select("id, slug, title, description, location, category, wilaya, city, price, capacity, images")
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching venues:", error);
    }

    return (
        <>
            <Header />
            <div className="pt-16 sm:pt-20">
                <VenuesMarketplace venues={venues || []} />
            </div>
        </>
    );
}
