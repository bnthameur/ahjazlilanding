import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedVenues from '@/components/FeaturedVenues';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export const revalidate = 60; // Revalidate every 60 seconds so deleted/new venues show up quickly

const SITE_URL = 'https://ahjazliqaati.com';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale || 'ar';

  const titles: Record<string, string> = {
    ar: 'احجز لقاعتي — اكتشف واحجز أفضل قاعات الأفراح والمناسبات في الجزائر',
    fr: 'Ahjaz Liqaati — Trouvez et réservez les meilleures salles en Algérie',
    en: 'Ahjaz Liqaati — Find & Book the Best Event Venues in Algeria',
  };
  const descriptions: Record<string, string> = {
    ar: 'منصة احجز لقاعتي: أكبر دليل لقاعات الأفراح، صالونات المناسبات وقاعات المؤتمرات في جميع ولايات الجزائر. شاهد الصور، قارن الأسعار، واحجز مباشرة.',
    fr: 'Plateforme Ahjaz Liqaati : le plus grand annuaire de salles des fêtes, salons événementiels et salles de conférence dans toutes les wilayas d\'Algérie.',
    en: 'Ahjaz Liqaati: Algeria\'s largest directory of wedding halls, event salons and conference rooms across all 58 wilayas. Browse photos, compare prices, book directly.',
  };

  return {
    title: titles[locale] || titles.ar,
    description: descriptions[locale] || descriptions.ar,
    alternates: {
      canonical: locale === 'ar' ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: {
        ar: SITE_URL,
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: titles[locale] || titles.ar,
      description: descriptions[locale] || descriptions.ar,
      url: locale === 'ar' ? SITE_URL : `${SITE_URL}/${locale}`,
      type: 'website',
    },
  };
}

export default function Home({ params }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedVenues locale={params.locale} />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
