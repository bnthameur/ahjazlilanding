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

  const venueBaseUrl = (process.env.NEXT_PUBLIC_VENUE_APP_URL || 'https://ahjazlivenue.railway.internal').replace(/\/$/, '');
  redirect(`${venueBaseUrl}/${locale}/salles`);
}
