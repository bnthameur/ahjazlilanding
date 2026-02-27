import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';

export default function Home({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { code?: string };
}) {
  if (searchParams?.code) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://ahjazlilanding-production.up.railway.app';
    const callbackUrl = `${siteUrl}/${locale}/auth/callback?code=${encodeURIComponent(searchParams.code)}`;
    redirect(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
