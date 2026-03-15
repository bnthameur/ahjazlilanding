import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { MapPin, Users } from 'lucide-react';
import { VenueCard } from '@/components/VenueCard';

type FeaturedVenue = {
  id: string;
  slug?: string | null;
  title: string;
  description: string;
  location: string;
  wilaya?: string | null;
  city?: string | null;
  price?: number | null;
  capacity?: number | null;
  images?: string[] | null;
};

export default async function FeaturedVenues({ locale }: { locale: string }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const t = await getTranslations({ locale, namespace: 'FeaturedVenues' });

  // First try to get admin-selected featured venues
  const { data: featuredVenues } = await supabase
    .from('venues')
    .select('id, slug, title, description, location, wilaya, city, price, capacity, images')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fallback to latest published venues if no featured ones
  const venues = (featuredVenues && featuredVenues.length > 0)
    ? featuredVenues
    : (await supabase
        .from('venues')
        .select('id, slug, title, description, location, wilaya, city, price, capacity, images')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3)
      ).data;

  if (!venues || venues.length === 0) {
    return null;
  }

  const [primaryVenue, ...secondaryVenues] = venues as FeaturedVenue[];
  const formattedPrice = primaryVenue.price
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(primaryVenue.price))
    : null;
  const formattedCapacity = primaryVenue.capacity
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(primaryVenue.capacity))
    : null;
  const locationLabel = [primaryVenue.city, primaryVenue.wilaya || primaryVenue.location].filter(Boolean).join(', ');

  return (
    <section className="relative z-10 -mt-8 sm:-mt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 sm:p-5 md:p-7 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-primary-600 font-semibold">{t('eyebrow')}</p>
              <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">{t('title')}</h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-slate-600">{t('subtitle')}</p>
            </div>
            <Link
              href="/salles"
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-100"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Primary venue spotlight */}
            <Link
              href={`/salles/${primaryVenue.slug || primaryVenue.id}`}
              className="group relative overflow-hidden rounded-xl sm:rounded-[1.75rem] bg-slate-950 p-5 sm:p-6 md:p-8 text-white"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fb718522,transparent_35%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#172554_100%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-100">
                  {t('spotlight')}
                </div>

                <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-200">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-200" />
                    {locationLabel || primaryVenue.location}
                  </span>
                  {formattedCapacity && (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-200" />
                      {formattedCapacity}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary-100 transition-colors">{primaryVenue.title}</h3>
                <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base text-slate-300 line-clamp-2 sm:line-clamp-3">{primaryVenue.description}</p>

                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                  <div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">{t('starting_price')}</div>
                    <div className="mt-0.5 sm:mt-1 text-lg sm:text-xl md:text-2xl font-bold text-white">{formattedPrice ? `${formattedPrice} DZD` : t('price_on_request')}</div>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 transition group-hover:bg-rose-50">
                    {t('view_featured')}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Secondary venues */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {secondaryVenues.map((venue: FeaturedVenue) => (
                <VenueCard key={venue.id} venue={venue} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
