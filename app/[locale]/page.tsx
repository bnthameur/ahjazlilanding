import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedVenues from '@/components/FeaturedVenues';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

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
