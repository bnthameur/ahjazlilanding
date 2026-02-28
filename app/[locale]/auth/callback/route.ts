import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
) {
  const locale = params.locale ?? 'en';
  // Auth is handled by the venue app now, redirect there
  return NextResponse.redirect(`https://app.ahjazliqaati.com/${locale}/login`);
}
