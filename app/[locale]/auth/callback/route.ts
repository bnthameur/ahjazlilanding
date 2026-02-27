import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSupabasePublicKey, getSupabaseUrl } from '@/lib/supabase/config';

export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const locale = params.locale ?? 'en';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ahjazlilanding-production.up.railway.app').replace(/\/$/, '');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabasePublicKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to salles page after successful login
  return NextResponse.redirect(new URL(`/${locale}/salles`, siteUrl));
}
