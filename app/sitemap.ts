import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering — sitemap needs live venue data
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const SITE_URL = 'https://ahjazliqaati.com';
const locales = ['ar', 'fr', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let venues: any[] = [];
    if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
            .from('venues')
            .select('id, slug, updated_at')
            .eq('status', 'published')
            .order('updated_at', { ascending: false });
        venues = data || [];
    }

    const now = new Date().toISOString();
    const staticPages: MetadataRoute.Sitemap = [];

    // Homepage
    for (const locale of locales) {
        staticPages.push({
            url: locale === 'ar' ? SITE_URL : `${SITE_URL}/${locale}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
            alternates: {
                languages: { ar: SITE_URL, fr: `${SITE_URL}/fr`, en: `${SITE_URL}/en` },
            },
        });
    }

    // Venues listing
    for (const locale of locales) {
        staticPages.push({
            url: locale === 'ar' ? `${SITE_URL}/salles` : `${SITE_URL}/${locale}/salles`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
            alternates: {
                languages: { ar: `${SITE_URL}/salles`, fr: `${SITE_URL}/fr/salles`, en: `${SITE_URL}/en/salles` },
            },
        });
    }

    // Link tree
    for (const locale of locales) {
        staticPages.push({
            url: locale === 'ar' ? `${SITE_URL}/links` : `${SITE_URL}/${locale}/links`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.5,
        });
    }

    // Login
    for (const locale of locales) {
        staticPages.push({
            url: locale === 'ar' ? `${SITE_URL}/login` : `${SITE_URL}/${locale}/login`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.3,
        });
    }

    // Legal pages
    for (const page of ['privacy', 'terms']) {
        for (const locale of locales) {
            staticPages.push({
                url: locale === 'ar' ? `${SITE_URL}/${page}` : `${SITE_URL}/${locale}/${page}`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.2,
            });
        }
    }

    // Dynamic venue pages
    const venuePages: MetadataRoute.Sitemap = [];
    for (const venue of venues) {
        const slug = venue.slug || venue.id;
        for (const locale of locales) {
            venuePages.push({
                url: locale === 'ar' ? `${SITE_URL}/salles/${slug}` : `${SITE_URL}/${locale}/salles/${slug}`,
                lastModified: venue.updated_at || now,
                changeFrequency: 'weekly',
                priority: 0.8,
                alternates: {
                    languages: {
                        ar: `${SITE_URL}/salles/${slug}`,
                        fr: `${SITE_URL}/fr/salles/${slug}`,
                        en: `${SITE_URL}/en/salles/${slug}`,
                    },
                },
            });
        }
    }

    return [...staticPages, ...venuePages];
}
