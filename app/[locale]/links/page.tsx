import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import {
    Globe,
    Search,
    Building2,
    Phone,
    Shield,
    FileText,
    HelpCircle,
    UserPlus,
    MapPin,
    Sparkles,
} from "lucide-react";

const SITE_URL = "https://ahjazliqaati.com";

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await props.params;

    const titles: Record<string, string> = {
        ar: "روابط احجز لقاعتي — جميع الروابط في مكان واحد",
        fr: "Liens Ahjaz Liqaati — Tous les liens en un seul endroit",
        en: "Ahjaz Liqaati Links — All Links in One Place",
    };
    const descriptions: Record<string, string> = {
        ar: "جميع روابط منصة احجز لقاعتي: تصفح القاعات، أضف قاعتك، تواصل معنا، والمزيد.",
        fr: "Tous les liens d'Ahjaz Liqaati : parcourir les salles, ajouter votre salle, nous contacter et plus.",
        en: "All Ahjaz Liqaati links: browse venues, list your venue, contact us, and more.",
    };

    return {
        title: titles[locale] || titles.ar,
        description: descriptions[locale] || descriptions.ar,
        alternates: {
            canonical: locale === "ar" ? `${SITE_URL}/links` : `${SITE_URL}/${locale}/links`,
            languages: {
                ar: `${SITE_URL}/links`,
                fr: `${SITE_URL}/fr/links`,
                en: `${SITE_URL}/en/links`,
            },
        },
    };
}

interface LinkItem {
    href: string;
    icon: React.ReactNode;
    labelKey: string;
    descKey: string;
    external?: boolean;
    highlight?: boolean;
}

export default async function LinksPage(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations("Links");

    const links: LinkItem[] = [
        {
            href: "/",
            icon: <Globe className="w-5 h-5" />,
            labelKey: "home",
            descKey: "home_desc",
        },
        {
            href: "/salles",
            icon: <Search className="w-5 h-5" />,
            labelKey: "browse",
            descKey: "browse_desc",
            highlight: true,
        },
        {
            href: "https://app.ahjazliqaati.com",
            icon: <Building2 className="w-5 h-5" />,
            labelKey: "list_venue",
            descKey: "list_venue_desc",
            external: true,
            highlight: true,
        },
        {
            href: "https://app.ahjazliqaati.com/login",
            icon: <UserPlus className="w-5 h-5" />,
            labelKey: "owner_login",
            descKey: "owner_login_desc",
            external: true,
        },
        {
            href: "/#how-it-works",
            icon: <HelpCircle className="w-5 h-5" />,
            labelKey: "how_it_works",
            descKey: "how_it_works_desc",
        },
        {
            href: "/#pricing",
            icon: <Sparkles className="w-5 h-5" />,
            labelKey: "pricing",
            descKey: "pricing_desc",
        },
        {
            href: "/privacy",
            icon: <Shield className="w-5 h-5" />,
            labelKey: "privacy",
            descKey: "privacy_desc",
        },
        {
            href: "/terms",
            icon: <FileText className="w-5 h-5" />,
            labelKey: "terms",
            descKey: "terms_desc",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white">
            <Header />
            <div className="pt-24 pb-16 px-4">
                <div className="max-w-md mx-auto text-center">
                    {/* Avatar / Brand */}
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-200">
                        <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        {locale === "ar" ? "احجز لقاعتي" : "Ahjaz Liqaati"}
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">{t("tagline")}</p>

                    {/* Links */}
                    <div className="space-y-3">
                        {links.map((link, i) => {
                            const isExternal = link.external;
                            const Wrapper = isExternal ? "a" : Link;
                            const wrapperProps = isExternal
                                ? { href: link.href, target: "_blank", rel: "noreferrer" }
                                : { href: link.href as any };

                            return (
                                <Wrapper
                                    key={i}
                                    {...(wrapperProps as any)}
                                    className={`group flex items-center gap-4 w-full rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
                                        link.highlight
                                            ? "border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300"
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        link.highlight
                                            ? "bg-primary-100 text-primary-600 group-hover:bg-primary-200"
                                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                    }`}>
                                        {link.icon}
                                    </div>
                                    <div className="text-start flex-1 min-w-0">
                                        <div className="font-semibold text-slate-900 text-sm">{t(link.labelKey)}</div>
                                        <div className="text-xs text-slate-500 truncate">{t(link.descKey)}</div>
                                    </div>
                                    <svg className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-600 transition-colors rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Wrapper>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} {locale === "ar" ? "احجز لقاعتي" : "Ahjaz Liqaati"}
                    </div>
                </div>
            </div>
        </div>
    );
}
