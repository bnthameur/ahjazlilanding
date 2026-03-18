import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['ar', 'fr', 'en'],
    defaultLocale: 'ar',
    localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
