import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import VenueCard from '@/components/VenueCard';

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

  const { data: venues } = await supabase
    .from('venues')
    .select('id, slug, title, description, location, wilaya, city, price, capacity, images')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!venues || venues.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 -mt-10 sm:-mt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-5 sm:p-7 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.65)]">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Featured</p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Featured venues</h2>
            </div>
            <Link
              href={`/${locale}/salles`}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-2"
            >
              See more
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {venues.map((venue: FeaturedVenue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
