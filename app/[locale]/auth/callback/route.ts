import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSupabasePublicKey, getSupabaseUrl } from '@/lib/supabase/config';

export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
) {
  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const code = requestUrl.searchParams.get('code');
  const locale = params.locale ?? 'en';
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const originFromForwarded = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null;
  const origin = configuredSiteUrl || originFromForwarded || requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/login?error=missing_code`, origin));
  }

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/${locale}/login?error=oauth_exchange_failed`, origin));
  }

  return NextResponse.redirect(new URL(`/${locale}/salles`, origin));
}
