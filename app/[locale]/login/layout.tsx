import type { Metadata } from 'next';

const SITE_URL = 'https://ahjazliqaati.com';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const titles: Record<string, string> = {
        ar: 'تسجيل الدخول — احجز لقاعتي',
        fr: 'Connexion — Ahjaz Liqaati',
        en: 'Sign In — Ahjaz Liqaati',
    };
    return {
        title: titles[locale] || titles.ar,
        alternates: {
            canonical: locale === 'ar' ? `${SITE_URL}/login` : `${SITE_URL}/${locale}/login`,
        },
        robots: { index: false, follow: true },
    };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
