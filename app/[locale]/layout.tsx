import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { arabicFont } from '@/lib/fonts';
import EmojiProvider from '@/components/EmojiProvider';
import TopProgressBar from '@/components/TopProgressBar';
import { routing } from '@/i18n/navigation';
import './globals.css';

const SITE_URL = 'https://ahjazliqaati.com';

const seoByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: 'احجز لقاعتي — أكبر منصة لحجز قاعات الأفراح والمناسبات في الجزائر',
    description: 'اكتشف واحجز أفضل قاعات الأفراح، صالونات المناسبات، وقاعات المؤتمرات في جميع ولايات الجزائر. تواصل مباشرة مع أصحاب القاعات، شاهد الصور والفيديوهات، وقارن الأسعار.',
  },
  fr: {
    title: 'Ahjaz Liqaati — La plus grande plateforme de réservation de salles en Algérie',
    description: 'Découvrez et réservez les meilleures salles des fêtes, salons événementiels et salles de conférence dans toutes les wilayas d\'Algérie. Contactez directement les propriétaires, consultez les photos et vidéos, comparez les prix.',
  },
  en: {
    title: 'Ahjaz Liqaati — Algeria\'s #1 Venue Booking Platform',
    description: 'Discover and book the best wedding halls, event salons, and conference rooms across all 58 wilayas of Algeria. Contact venue owners directly, browse photos & videos, compare prices.',
  },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale || 'ar';
  const seo = seoByLocale[locale] || seoByLocale.ar;
  const canonicalUrl = locale === 'ar' ? SITE_URL : `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: `%s | ${locale === 'ar' ? 'احجز لقاعتي' : 'Ahjaz Liqaati'}`,
    },
    description: seo.description,
    keywords: [
      'قاعات أفراح', 'حجز قاعات', 'قاعات مناسبات الجزائر', 'صالونات أفراح',
      'salles des fêtes Algérie', 'réservation salle', 'wedding halls Algeria',
      'venue booking Algeria', 'event venues', 'قاعات الجزائر',
      'salles de conférence', 'conference rooms Algeria',
    ],
    authors: [{ name: 'Ahjaz Liqaati' }],
    creator: 'Ahjaz Liqaati',
    publisher: 'Ahjaz Liqaati',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: SITE_URL,
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_DZ' : locale === 'fr' ? 'fr_DZ' : 'en_US',
      url: canonicalUrl,
      siteName: locale === 'ar' ? 'احجز لقاعتي' : 'Ahjaz Liqaati',
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: locale === 'ar' ? 'احجز لقاعتي — منصة حجز القاعات' : 'Ahjaz Liqaati — Venue Booking Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {},
    category: 'business',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? arabicFont.className : 'font-parkinsans';
  const seo = seoByLocale[locale] || seoByLocale.ar;

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ar' ? 'احجز لقاعتي' : 'Ahjaz Liqaati',
    url: SITE_URL,
    description: seo.description,
    inLanguage: locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-DZ' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/salles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ahjaz Liqaati',
    alternateName: 'احجز لقاعتي',
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'French', 'English'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Algeria',
    },
  };

  return (
    <html lang={locale} dir={direction}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={`${fontClass} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <EmojiProvider>
            <TopProgressBar />
            {children}
          </EmojiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
