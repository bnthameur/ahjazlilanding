import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { arabicFont } from '@/lib/fonts';
import EmojiProvider from '@/components/EmojiProvider';
import { routing } from '@/i18n/navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'LandingPro - AI Landing Page Generator',
  description: 'Create stunning landing pages in minutes with AI-powered design',
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
