'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Emoji } from 'react-apple-emojis';

export default function Footer() {
    const t = useTranslations('Footer');
    const locale = useLocale();

    const footerLinks = {
        platform: [
            { name: t('links.browse_venues'), href: `/${locale}/salles` },
            { name: t('links.list_venue'), href: `/${locale}/register` },
            { name: t('links.how_it_works'), href: '/#how-it-works' },
            { name: t('links.for_owners'), href: '/#pricing' },
        ],
        categories: [
            { name: t('links.wedding_halls'), href: `/${locale}/salles?category=wedding-hall` },
            { name: t('links.event_salons'), href: `/${locale}/salles?category=event-salon` },
            { name: t('links.conference_rooms'), href: `/${locale}/salles?category=conference-room` },
            { name: t('links.outdoor_venues'), href: `/${locale}/salles?category=garden-outdoor` },
        ],
        locations: [
            { name: t('links.algiers'), href: `/${locale}/salles?location=algiers` },
            { name: t('links.oran'), href: `/${locale}/salles?location=oran` },
            { name: t('links.constantine'), href: `/${locale}/salles?location=constantine` },
            { name: t('links.all_wilayas'), href: `/${locale}/salles` },
        ],
        support: [
            { name: t('links.faq'), href: '/#faq' },
            { name: t('links.contact_us'), href: 'mailto:support@ahjazliqaati.dz' },
            { name: t('links.privacy_policy'), href: '/privacy' },
            { name: t('links.terms_of_service'), href: '/terms' },
        ],
    };

    const socialLinks = [
        {
            name: 'Facebook',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            name: 'TikTok',
            href: '#',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <Emoji name="classical-building" width={24} />
                            </div>
                            <span className="text-xl font-bold text-white">Ahjazli Qaati</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            {t('description')}
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('platform')}</h4>
                        <ul className="space-y-2">
                            {footerLinks.platform.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('categories')}</h4>
                        <ul className="space-y-2">
                            {footerLinks.categories.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Locations */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('locations')}</h4>
                        <ul className="space-y-2">
                            {footerLinks.locations.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} {t('copyright')}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                        {t('made_with')} <Emoji name="red-heart" width={16} /> {t('in_algeria')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
