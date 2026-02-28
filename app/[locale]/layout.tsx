import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { arabicFont } from '@/lib/fonts';
import EmojiProvider from '@/components/EmojiProvider';
import { routing } from '@/i18n/navigation';
// Auth is handled by the venue app (app.ahjazliqaati.com)
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahjazliqaati.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ahjazli Qaati - Find & Book Event Venues in Algeria',
    template: '%s | Ahjazli Qaati',
  },
  description:
    'Discover wedding halls, salons, conference rooms and event spaces across all 58 wilayas of Algeria. Connect directly with venue owners — free for owners.',
  keywords: [
    'event venues Algeria',
    'wedding halls Algeria',
    'salles des fêtes Algérie',
    'قاعات الأفراح الجزائر',
    'book venue Algeria',
    'salles de mariage',
    'venue rental Algiers',
    'venue rental Oran',
    'venue rental Constantine',
  ],
  authors: [{ name: 'Ahjazli Qaati' }],
  creator: 'Ahjazli Qaati',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ahjazli Qaati',
    title: 'Ahjazli Qaati - Find & Book Event Venues in Algeria',
    description:
      'Discover wedding halls, salons, conference rooms and event spaces across all 58 wilayas of Algeria.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ahjazli Qaati - Event Venues in Algeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahjazli Qaati - Find & Book Event Venues in Algeria',
    description:
      'Discover wedding halls, salons, conference rooms and event spaces across all 58 wilayas of Algeria.',
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
  alternates: {
    canonical: siteUrl,
    languages: {
      en: `${siteUrl}/en`,
      fr: `${siteUrl}/fr`,
      ar: `${siteUrl}/ar`,
    },
  },
};

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
  // Use the CSS class for Parkinsans (defined in tailwind) and the custom local font for Arabic
  const fontClass = locale === 'ar' ? arabicFont.className : 'font-parkinsans';

  return (
    <html lang={locale} dir={direction}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="canonical" href={`${siteUrl}/${locale}`} />
        {routing.locales.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${siteUrl}/${l}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Ahjazli Qaati',
              url: siteUrl,
              description:
                'Discover wedding halls, salons, conference rooms and event spaces across all 58 wilayas of Algeria.',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/{locale}/salles?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${fontClass} antialiased`}>

        <NextIntlClientProvider messages={messages}>
          <EmojiProvider>
            {children}
          </EmojiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
