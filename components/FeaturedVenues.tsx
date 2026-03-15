import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { MapPin, Users, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

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

function VenueImageCard({
  venue,
  locale,
  size = 'normal',
  t,
}: {
  venue: FeaturedVenue;
  locale: string;
  size?: 'large' | 'normal';
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const venueSlug = venue.slug || venue.id;
  const imageUrl = venue.images?.[0] ?? null;
  const locationLabel = [venue.city, venue.wilaya || venue.location].filter(Boolean).join(', ');
  const formattedPrice = venue.price
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(venue.price))
    : null;
  const formattedCapacity = venue.capacity
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(venue.capacity))
    : null;

  return (
    <Link
      href={`/salles/${venueSlug}`}
      className={`group relative flex overflow-hidden rounded-2xl bg-slate-900 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 ${
        size === 'large' ? 'min-h-[320px] sm:min-h-[380px]' : 'min-h-[200px] sm:min-h-[220px]'
      }`}
    >
      {/* Background image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={venue.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={size === 'large' ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 30vw'}
          priority={size === 'large'}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
      )}

      {/* Gradient overlay - heavier at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

      {/* Top: price badge */}
      {formattedPrice && (
        <div className="absolute top-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
          {formattedPrice} DZD
        </div>
      )}

      {/* Top right: arrow indicator */}
      <div className="absolute top-3 end-3 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
        <ArrowUpRight className="h-4 w-4 text-white" />
      </div>

      {/* Bottom: venue info */}
      <div className="relative mt-auto w-full p-4 sm:p-5">
        {locationLabel && (
          <div className="flex items-center gap-1.5 text-xs text-primary-200 mb-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{locationLabel}</span>
          </div>
        )}
        <h3 className={`font-bold text-white line-clamp-2 leading-snug group-hover:text-primary-100 transition-colors ${
          size === 'large' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
        }`}>
          {venue.title}
        </h3>
        {size === 'large' && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {venue.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {formattedCapacity && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Users className="h-3.5 w-3.5 text-primary-300" />
              <span>{formattedCapacity}</span>
            </div>
          )}
          <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            {t('view_featured')}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function FeaturedVenues({ locale }: { locale: string }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const t = await getTranslations({ locale, namespace: 'FeaturedVenues' });

  // First try admin-selected featured venues
  const { data: featuredVenues } = await supabase
    .from('venues')
    .select('id, slug, title, description, location, wilaya, city, price, capacity, images')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fallback to latest published venues
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

  return (
    <section className="relative z-10 -mt-8 sm:-mt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-200/70 bg-white/90 p-3 sm:p-5 md:p-7 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          {/* Section header */}
          <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-5">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-primary-600 font-semibold">
                {t('eyebrow')}
              </p>
              <h2 className="mt-1 sm:mt-2 text-lg sm:text-2xl md:text-3xl font-bold text-slate-900">
                {t('title')}
              </h2>
              <p className="mt-0.5 sm:mt-1.5 text-xs sm:text-sm text-slate-600 hidden sm:block">
                {t('subtitle')}
              </p>
            </div>
            <Link
              href="/salles"
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-100"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Venue grid: on mobile all cards are equal height stacked; on lg: 2-col with large primary */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.55fr]">
            {/* Primary venue - large card */}
            <VenueImageCard
              venue={primaryVenue}
              locale={locale}
              size="large"
              t={t}
            />

            {/* Secondary venues */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-1">
              {secondaryVenues.map((venue: FeaturedVenue) => (
                <VenueImageCard
                  key={venue.id}
                  venue={venue}
                  locale={locale}
                  size="normal"
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
