'use client';

import { useState, useEffect } from 'react';
// import Link from 'next/link'; // Replaced by custom Link
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('browse_venues'), href: '/salles' },
    { name: t('how_it_works'), href: '/#how-it-works' }, // Internal anchor, handled by Link
    { name: t('for_owners'), href: '/#pricing' },
    { name: t('faq'), href: '/#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? 'bg-white/95 backdrop-blur-md shadow-sm'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏛️</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{t('title')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              item.href.startsWith('http') ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA Buttons & Lang Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 uppercase"
              >
                {locale}
                <svg className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-slate-100 rounded-lg shadow-lg py-1 flex flex-col">
                  {['en', 'fr', 'ar'].map((l) => (
                    <Link
                      key={l}
                      href={pathname}
                      locale={l}
                      className={`px-4 py-2 text-sm text-left hover:bg-slate-50 ${locale === l ? 'font-bold text-primary-600' : 'text-slate-600'}`}
                      onClick={() => setIsLangMenuOpen(false)}
                    >
                      {l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'العربية'}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href={`/${locale}/login`}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t('sign_in')}
            </a>
            <a
              href={`/${locale}/register`}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              {t('list_venue')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                item.href.startsWith('http') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              {/* Mobile Language Switcher */}
              <div className="px-4 py-3 border-t border-slate-100 mt-2">
                <div className="text-sm font-medium text-slate-500 mb-2">Language</div>
                <div className="flex gap-3">
                  {['en', 'fr', 'ar'].map((l) => (
                    <Link
                      key={l}
                      href={pathname}
                      locale={l}
                      className={`text-sm ${locale === l ? 'font-bold text-primary-600' : 'text-slate-600'}`}
                    >
                      {l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'العربية'}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-2 border-t border-slate-100 mt-4">
                <a
                  href={`/${locale}/login`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-base font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
                >
                  {t('sign_in')}
                </a>
                <a
                  href={`/${locale}/register`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  {t('list_venue')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
