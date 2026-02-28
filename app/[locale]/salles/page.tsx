import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function SallesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const publicVenueFallbackUrl = 'https://ahjazlivenue-production.up.railway.app';
  const configuredVenueUrl = process.env.NEXT_PUBLIC_VENUE_APP_URL?.replace(/\/$/, '');
  const isInvalidExternalUrl =
    !configuredVenueUrl ||
    configuredVenueUrl.includes('localhost') ||
    configuredVenueUrl.includes('127.0.0.1') ||
    configuredVenueUrl.includes('.railway.internal');

  const venueBaseUrl = isInvalidExternalUrl ? publicVenueFallbackUrl : configuredVenueUrl;
  redirect(`${venueBaseUrl}/${locale}/salles`);
}
